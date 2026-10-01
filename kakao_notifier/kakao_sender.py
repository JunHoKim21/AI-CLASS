import time
import ctypes
import os
import io
import win32gui
import win32con
import pyperclip
import sys
import win32process
from PIL import Image
import win32clipboard

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

try:
    ctypes.windll.shcore.SetProcessDpiAwareness(2)
except Exception:
    pass

u32 = ctypes.windll.user32

def attach_to_default_desktop():
    h_default = u32.OpenDesktopW("Default", 0, False, 0x01FF)
    if h_default:
        u32.SetThreadDesktop(h_default)

def click_pos(x, y):
    u32.SetCursorPos(int(x), int(y))
    time.sleep(0.04)
    u32.mouse_event(2, 0, 0, 0, 0)
    time.sleep(0.02)
    u32.mouse_event(4, 0, 0, 0, 0)
    time.sleep(0.06)

def force_foreground(hwnd):
    """지정 창을 화면 최상위로 100% 강제 활성화 (브라우저 포커스 강제 탈취)"""
    if not hwnd or not win32gui.IsWindow(hwnd):
        return False

    # 1. 창 복원
    if win32gui.IsIconic(hwnd):
        win32gui.ShowWindow(hwnd, win32con.SW_RESTORE)
    else:
        win32gui.ShowWindow(hwnd, win32con.SW_SHOW)

    # 2. HWND_TOPMOST 트릭으로 강제 돌출 (Windows 포커스 잠금 완전 해제)
    u32.keybd_event(0x12, 0, 0, 0)
    win32gui.SetWindowPos(hwnd, win32con.HWND_TOPMOST, 0, 0, 0, 0, win32con.SWP_NOMOVE | win32con.SWP_NOSIZE | win32con.SWP_SHOWWINDOW)
    win32gui.BringWindowToTop(hwnd)
    win32gui.SetForegroundWindow(hwnd)
    win32gui.SetWindowPos(hwnd, win32con.HWND_NOTOPMOST, 0, 0, 0, 0, win32con.SWP_NOMOVE | win32con.SWP_NOSIZE | win32con.SWP_SHOWWINDOW)
    u32.keybd_event(0x12, 0, 2, 0)

    # 3. 결정타: 좌측 사이드바 빈 공간(r[0] + 30, r[1] + 350) 물리 클릭으로 100% 포커스 확정
    try:
        r = win32gui.GetWindowRect(hwnd)
        click_pos(r[0] + 30, r[1] + 350)
    except Exception:
        pass
    time.sleep(0.15)
    return True



def click_control_direct(hwnd, rel_x=15, rel_y=10):
    lparam = (rel_y << 16) | rel_x
    win32gui.SendMessage(hwnd, win32con.WM_LBUTTONDOWN, win32con.MK_LBUTTON, lparam)
    time.sleep(0.02)
    win32gui.SendMessage(hwnd, win32con.WM_LBUTTONUP, 0, lparam)
    time.sleep(0.04)

def press_key(vk_code):
    u32.keybd_event(vk_code, 0, 0, 0)
    time.sleep(0.02)
    u32.keybd_event(vk_code, 0, 2, 0)
    time.sleep(0.02)

def press_hotkey(mod_vk, key_vk):
    u32.keybd_event(mod_vk, 0, 0, 0)
    time.sleep(0.02)
    u32.keybd_event(key_vk, 0, 0, 0)
    time.sleep(0.02)
    u32.keybd_event(key_vk, 0, 2, 0)
    time.sleep(0.02)
    u32.keybd_event(mod_vk, 0, 2, 0)
    time.sleep(0.04)

def paste_clipboard(text):
    pyperclip.copy(text)
    time.sleep(0.04)
    press_hotkey(0x11, ord('V'))
    time.sleep(0.06)

def copy_image_to_clipboard(image_path):
    try:
        image = Image.open(image_path)
        output = io.BytesIO()
        image.convert("RGB").save(output, "BMP")
        data = output.getvalue()[14:]
        output.close()
        win32clipboard.OpenClipboard()
        win32clipboard.EmptyClipboard()
        win32clipboard.SetClipboardData(win32clipboard.CF_DIB, data)
        win32clipboard.CloseClipboard()
        return True
    except Exception as e:
        print(f"[!] 이미지 복사 실패: {e}")
        return False

def find_main_kakaotalk():
    attach_to_default_desktop()
    found = None

    def enum_cb(h, _):
        nonlocal found
        cls = win32gui.GetClassName(h)
        if cls == "EVA_Window_Dblclk":
            is_main = False
            def ch_cb(ch, _):
                nonlocal is_main
                if "OnlineMainView" in win32gui.GetWindowText(ch):
                    is_main = True
                return True
            win32gui.EnumChildWindows(h, ch_cb, None)
            if is_main:
                found = h
        return True

    win32gui.EnumWindows(enum_cb, None)
    if not found:
        found = win32gui.FindWindow("EVA_Window_Dblclk", "카카오톡")
    if found:
        force_foreground(found)
    return found

# ──────────────────────────────────────────────────────────────
# 카카오톡 친구/채팅 목록의 Edit 컨트롤(검색창) 찾기
# ──────────────────────────────────────────────────────────────
def find_search_edit(main_hwnd):
    """가장 넓은 Edit 컨트롤(검색창)을 반환"""
    best = None
    best_w = 0
    def cb(c, _):
        nonlocal best, best_w
        if win32gui.GetClassName(c) == "Edit":
            r = win32gui.GetWindowRect(c)
            w = r[2] - r[0]
            if w > best_w:
                best_w = w
                best = c
        return True
    win32gui.EnumChildWindows(main_hwnd, cb, None)
    return best

def prepare_search(main_hwnd, search_mode="friend"):
    """
    카카오톡 검색창을 100% 빈 상태로 깨끗하게 준비
    - search_mode == 'friend': 좌측 1번째 아이콘 (친구 탭) 클릭
    - search_mode == 'chat': 좌측 2번째 아이콘 (채팅 탭) 클릭
    """
    force_foreground(main_hwnd)
    r = win32gui.GetWindowRect(main_hwnd)

    if search_mode == "chat":
        # 2번째 아이콘: 채팅 탭 클릭 (y = r[1] + 115)
        click_pos(r[0] + 30, r[1] + 115)
    else:
        # 1번째 아이콘: 친구 탭 클릭 (y = r[1] + 55)
        click_pos(r[0] + 30, r[1] + 55)
    time.sleep(0.2)

    # 기존 검색창 X 버튼 클릭 (초기화)
    click_pos(r[2] - 30, r[1] + 105)
    time.sleep(0.15)

    # Ctrl + F 로 새 검색창 활성화
    press_hotkey(0x11, ord('F'))
    time.sleep(0.2)




# ──────────────────────────────────────────────────────────────
# 열려 있는 카카오톡 1:1 대화방 창 목록 반환
# ──────────────────────────────────────────────────────────────
def get_open_chat_hwnds(main_hwnd):
    """main_hwnd 제외, RICHEDIT 자식을 가진 EVA_Window_Dblclk 집합"""
    chats = set()
    def cb(h, _):
        if h == main_hwnd or not win32gui.IsWindowVisible(h):
            return True
        if win32gui.GetClassName(h) != "EVA_Window_Dblclk":
            return True
        has_rich = False
        def cc(ch, _):
            nonlocal has_rich
            if "RICHEDIT" in win32gui.GetClassName(ch).upper():
                has_rich = True
            return True
        win32gui.EnumChildWindows(h, cc, None)
        if has_rich:
            chats.add(h)
        return True
    win32gui.EnumWindows(cb, None)
    return chats

def close_all_chats(main_hwnd):
    """열려 있는 모든 대화방 창 강제 닫기"""
    for h in get_open_chat_hwnds(main_hwnd):
        try:
            win32gui.SendMessage(h, win32con.WM_SYSCOMMAND, win32con.SC_CLOSE, 0)
        except Exception:
            pass
    time.sleep(0.2)

# ──────────────────────────────────────────────────────────────
# 카카오톡 RICHEDIT (채팅 입력창) 검색: 대화방 창 + 메인 창 내부 모두 탐색
# ──────────────────────────────────────────────────────────────
def find_richedit_in(hwnd):
    """hwnd 하위의 RICHEDIT 컨트롤 목록 반환"""
    results = []
    def cb(ch, _):
        if "RICHEDIT" in win32gui.GetClassName(ch).upper() and win32gui.IsWindowVisible(ch):
            results.append(ch)
        return True
    win32gui.EnumChildWindows(hwnd, cb, None)
    return results

def find_photo_popup(exclude_hwnds):
    popup = None
    def cb(h, _):
        nonlocal popup
        if not win32gui.IsWindowVisible(h) or h in exclude_hwnds:
            return True
        if win32gui.GetClassName(h) != "EVA_Window_Dblclk":
            return True
        r = win32gui.GetWindowRect(h)
        w, hh = r[2] - r[0], r[3] - r[1]
        if 200 < w < 520 and 200 < hh < 620:
            t = win32gui.GetWindowText(h)
            if "오픈채팅" not in t:
                popup = h
        return True
    win32gui.EnumWindows(cb, None)
    return popup

# ──────────────────────────────────────────────────────────────
# 메인 발송 함수
# ──────────────────────────────────────────────────────────────
def send_kakao_message(target_name, message, image_path=None, log_cb=None, search_mode="friend"):
    """
    안전 발송 v3:
    search_mode: 'friend' (친구 탭 검색) | 'chat' (채팅방 탭 검색)
    1. 기존 대화방 모두 닫기
    2. 검색창 열고 이름 입력 → 결과 목록에서 선택(↓+Enter)
    3. 새로 열린 대화방 창 감지 (최대 2초)
    4. 감지 성공 시에만 메시지 발송 (감지 실패 = 전송 중단, 오발송 절대 없음)
    """
    def log(msg):
        if log_cb:
            log_cb(msg)
        print(msg)

    attach_to_default_desktop()

    # ① 카카오톡 메인 창 확인
    main_hwnd = find_main_kakaotalk()
    if not main_hwnd:
        log("[-] 오류: 카카오톡 창을 찾을 수 없습니다.")
        return False

    # ② 이전 대화방 완전 정리
    close_all_chats(main_hwnd)
    force_foreground(main_hwnd)

    # ③ 발송 전 현재 대화방 창 목록 스냅샷 (delta 감지용)
    before_hwnds = get_open_chat_hwnds(main_hwnd)

    # ④ 검색창 클린 준비 (모드에 따라 친구 탭 또는 채팅 탭으로 이동)
    prepare_search(main_hwnd, search_mode=search_mode)


    # ⑤ 이름 붙여넣기 → 검색 결과 대기 → Down(선택) → Enter로 대화방 열기
    paste_clipboard(target_name)
    time.sleep(0.5)          # 검색 결과 렌더링 대기
    press_key(0x28)          # ↓ (Down 화살표) - 첫 번째 친구 항목 하이라이트
    time.sleep(0.15)
    press_key(0x0D)          # Enter (대화방 창 오픈!)



    # ⑥ 새 대화방 창 감지 (최대 2.0초)
    chat_hwnd = None
    for _ in range(20):
        time.sleep(0.1)
        after = get_open_chat_hwnds(main_hwnd)
        new_chats = after - before_hwnds
        if new_chats:
            chat_hwnd = list(new_chats)[0]
            log(f"  → 대화방 창 감지 (HWND:{chat_hwnd})")
            break

    # ⑦ 감지 실패 → 오발송 없이 즉시 중단
    if not chat_hwnd:
        log(f"[-] '{target_name}' 대화방 감지 실패. 발송을 건너뜁니다.")
        # ESC로 검색창 닫기
        press_key(0x1B)
        force_foreground(main_hwnd)
        return False

    force_foreground(chat_hwnd)
    time.sleep(0.1)

    # ⑧ 채팅 입력창 포커스 함수
    def focus_input():
        rics = find_richedit_in(chat_hwnd)
        if rics:
            click_control_direct(rics[0], 20, 15)
        cr = win32gui.GetWindowRect(chat_hwnd)
        click_pos(cr[0] + 150, cr[3] - 90)
        time.sleep(0.1)

    focus_input()

    # ⑨ 사진 전송
    if image_path and os.path.exists(image_path):
        if copy_image_to_clipboard(image_path):
            press_hotkey(0x11, ord('V'))
            time.sleep(0.35)
            popup = find_photo_popup(exclude_hwnds=[main_hwnd, chat_hwnd])
            if popup:
                force_foreground(popup)
                time.sleep(0.1)
                press_key(0x0D)
            else:
                press_key(0x0D)
            time.sleep(0.5)
            force_foreground(chat_hwnd)
            focus_input()

    # ⑩ 본문 발송
    if message and message.strip():
        paste_clipboard(message)
        time.sleep(0.15)
        press_key(0x0D)
        time.sleep(0.2)

    # ⑪ 대화방 닫기 (SC_CLOSE 직접 전송)
    try:
        force_foreground(chat_hwnd)
        time.sleep(0.05)
        win32gui.SendMessage(chat_hwnd, win32con.WM_SYSCOMMAND, win32con.SC_CLOSE, 0)
    except Exception:
        pass
    time.sleep(0.2)

    # ⑫ 검색창 정리
    force_foreground(main_hwnd)
    press_key(0x1B)

    log(f"[★] '{target_name}' 전송 완료!")
    return True
