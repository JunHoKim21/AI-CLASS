"""
api_server.py — Flask API Bridge
React UI ↔ kakao_sender.py 연결 서버
"""
import sys
import os
import queue
import threading
import uuid
import time
import re
from datetime import datetime
from flask import Flask, request, jsonify, Response, send_from_directory
from flask_cors import CORS

# PyInstaller 환경 지원 (sys._MEIPASS)
BASE_DIR = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
EXE_DIR = os.path.dirname(os.path.abspath(sys.executable if getattr(sys, 'frozen', False) else __file__))

# kakao_sender 임포트
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, EXE_DIR)
from kakao_sender import send_kakao_message

app = Flask(__name__, static_folder=os.path.join(BASE_DIR, "frontend", "dist"), static_url_path="")
CORS(app)

# ──────────────────────────────────────────────────────────────
# 전역 상태
# ──────────────────────────────────────────────────────────────
_send_queue: queue.Queue = queue.Queue()   # SSE 로그 큐
_stop_flag = threading.Event()             # 발송 중단 플래그
_is_sending = False                        # 현재 발송 중 여부
UPLOAD_DIR = os.path.join(EXE_DIR, "_uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ──────────────────────────────────────────────────────────────
# 개인화 치환 (messageHelper.ts 동일 로직)
# ──────────────────────────────────────────────────────────────
def format_personalized_message(template: str, member: dict, group_name: str) -> str:
    now = datetime.now()
    days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"]
    date_str = f"{now.year}년 {now.month}월 {now.day}일"
    day_name = days[now.weekday() + 1 if now.weekday() < 6 else 0]  # Python weekday: Mon=0
    role = member.get("role") or "순원"

    result = template
    result = result.replace("{이름}", member.get("name", ""))
    result = result.replace("{순명}", group_name)
    result = result.replace("{직분}", role)
    result = result.replace("{오늘날짜}", date_str)
    result = result.replace("{요일}", days[now.weekday() + 1 % 7])
    return result

# ──────────────────────────────────────────────────────────────
# API: 헬스체크
# ──────────────────────────────────────────────────────────────
@app.route("/api/status")
def status():
    return jsonify({"ok": True, "sending": _is_sending})

# ──────────────────────────────────────────────────────────────
# API: 사진 업로드
# ──────────────────────────────────────────────────────────────
@app.route("/api/upload-photo", methods=["POST"])
def upload_photo():
    if "file" not in request.files:
        return jsonify({"error": "파일이 없습니다"}), 400
    f = request.files["file"]
    ext = os.path.splitext(f.filename)[1] or ".jpg"
    fname = f"photo_{uuid.uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_DIR, fname)
    f.save(path)
    return jsonify({"ok": True, "path": path, "name": f.filename})

# ──────────────────────────────────────────────────────────────
# API: 발송 중단
# ──────────────────────────────────────────────────────────────
@app.route("/api/stop", methods=["POST"])
def stop_send():
    global _is_sending
    _stop_flag.set()
    _is_sending = False
    _send_queue.put({"type": "stopped", "message": "전송이 중단되었습니다."})
    return jsonify({"ok": True})

# ──────────────────────────────────────────────────────────────
# API: 발송 시작 (백그라운드 스레드)
# ──────────────────────────────────────────────────────────────
@app.route("/api/send", methods=["POST"])
def start_send():
    global _is_sending
    if _is_sending:
        return jsonify({"error": "이미 발송 중입니다"}), 409

    data = request.json or {}
    members = data.get("members", [])
    message_template = data.get("message", "")
    image_path = data.get("imagePath")          # 업로드된 경로
    group_name = data.get("groupName", "")
    search_mode = data.get("searchMode", "friend")

    if not members:
        return jsonify({"error": "발송 대상이 없습니다"}), 400
    if not message_template.strip():
        return jsonify({"error": "메시지가 비어 있습니다"}), 400

    # 이미지 경로 검증
    if image_path and not os.path.exists(image_path):
        image_path = None

    _stop_flag.clear()
    _is_sending = True

    def run():
        global _is_sending
        total = len(members)
        success_count = 0
        fail_count = 0

        for i, member in enumerate(members):
            if _stop_flag.is_set():
                _send_queue.put({"type": "stopped", "message": "전송이 중단되었습니다."})
                break

            name = member.get("name", "")
            personalized = format_personalized_message(message_template, member, group_name)

            # 진행 중 로그
            _send_queue.put({
                "type": "progress",
                "index": i,
                "total": total,
                "memberName": name,
                "status": "sending",
            })

            def log_cb(msg):
                _send_queue.put({"type": "log", "message": msg, "memberName": name})

            ok = send_kakao_message(
                target_name=name,
                message=personalized,
                image_path=image_path,
                log_cb=log_cb,
                search_mode=search_mode,
            )


            if ok:
                success_count += 1
                _send_queue.put({
                    "type": "progress",
                    "index": i,
                    "total": total,
                    "memberName": name,
                    "status": "success",
                    "percent": round((i + 1) / total * 100),
                })
            else:
                fail_count += 1
                _send_queue.put({
                    "type": "progress",
                    "index": i,
                    "total": total,
                    "memberName": name,
                    "status": "failed",
                    "percent": round((i + 1) / total * 100),
                })

        _is_sending = False
        _send_queue.put({
            "type": "done",
            "successCount": success_count,
            "failCount": fail_count,
            "total": total,
        })



    threading.Thread(target=run, daemon=True).start()
    return jsonify({"ok": True, "total": len(members)})

# ──────────────────────────────────────────────────────────────
# API: SSE 실시간 로그 스트리밍
# ──────────────────────────────────────────────────────────────
@app.route("/api/send-stream")
def send_stream():
    import json

    def event_stream():
        while True:
            try:
                item = _send_queue.get(timeout=30)
                yield f"data: {json.dumps(item, ensure_ascii=False)}\n\n"
                if item.get("type") in ("done", "stopped"):
                    break
            except queue.Empty:
                yield "data: {\"type\":\"ping\"}\n\n"

    return Response(
        event_stream(),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )

# ──────────────────────────────────────────────────────────────
# React 빌드 정적 파일 서빙 (빌드 후)
# ──────────────────────────────────────────────────────────────
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    dist_dir = os.path.join(BASE_DIR, "frontend", "dist")
    full_path = os.path.join(dist_dir, path)
    if path and os.path.exists(full_path):
        return send_from_directory(dist_dir, path)
    # SPA fallback
    index = os.path.join(dist_dir, "index.html")
    if os.path.exists(index):
        return send_from_directory(dist_dir, "index.html")
    return "React 빌드 파일이 없습니다. frontend/dist 폴더를 확인하세요.", 404

if __name__ == "__main__":
    print("===================================================")
    print("   순원 말씀 알림이 데스크톱 앱을 실행합니다.")
    print("===================================================")

    # 1. Flask 서버를 백그라운드 스레드로 기동
    flask_thread = threading.Thread(
        target=lambda: app.run(host="127.0.0.1", port=5000, debug=False, threaded=True),
        daemon=True,
    )
    flask_thread.start()

    # 2. 서버 시작 대기
    time.sleep(0.8)

    # 3. pywebview 전용 윈도우 창 실행
    try:
        import webview
        window = webview.create_window(
            title="순원 말씀 알림이",
            url="http://127.0.0.1:5000",
            width=1340,
            height=860,
            min_size=(1050, 680),
            text_select=True,
        )
        # 창이 닫히면 전체 프로세스 자동 종료
        webview.start()
    except Exception as e:
        import webbrowser
        print(f"전용 창 실행 실패({e}), 기본 브라우저로 엽니다.")
        webbrowser.open("http://127.0.0.1:5000")
        flask_thread.join()


