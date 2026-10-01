import os
import sys
import time
import threading
import tkinter as tk
from tkinter import ttk, messagebox, simpledialog, filedialog

from contact_manager import ContactManager
from kakao_sender import send_kakao_message
from PIL import Image, ImageTk

class KakaoNotifierApp:
    def __init__(self, root):
        self.root = root
        self.root.title("카카오톡 순원 말씀/공지 자동 발송기")
        self.root.geometry("940x780")
        self.root.minsize(860, 680)
        
        # 색상 팔레트 (Toss Design System Tone)
        self.c_bg = "#F2F4F6"             # 토스 시그니처 배경 (부드러운 쿨그레이)
        self.c_card = "#FFFFFF"           # 카드 컨테이너 (순백색)
        self.c_border = "#E5E8EB"         # 은은한 보더 라인
        self.c_toss_blue = "#3182F6"      # 토스 시그니처 블루 (메인 포인트)
        self.c_toss_hover = "#1B64DA"     # 토스 블루 호버
        self.c_toss_light = "#E8F3FF"     # 소프트 블루 틴트 (보조 버튼/팁 배경)
        self.c_text_primary = "#191F28"   # 메인 타이틀 (토스 차콜 블랙)
        self.c_text_secondary = "#4E5968" # 서브 설명
        self.c_text_hint = "#8B95A1"      # 힌트/라벨
        self.c_danger = "#F04452"         # 토스 레드 (중단/삭제)
        self.c_danger_light = "#FEE2E2"   # 연한 레드
        self.c_success = "#00C473"        # 토스 에메랄드 (완료/성공)
        
        # 폰트 위계 (가독성 높은 모던 타이포그래피)
        self.f_app_title = ("Malgun Gothic", 13, "bold")
        self.f_head = ("Malgun Gothic", 12, "bold")
        self.f_subhead = ("Malgun Gothic", 9)
        self.f_main = ("Malgun Gothic", 10)
        self.f_bold = ("Malgun Gothic", 10, "bold")
        self.f_small = ("Malgun Gothic", 9)
        self.f_btn = ("Malgun Gothic", 10, "bold")
        self.f_cta = ("Malgun Gothic", 12, "bold")
        
        self.root.configure(bg=self.c_bg)
        
        # ttk 스타일 설정
        self.setup_styles()
        
        # 데이터 관리자
        self.cm = ContactManager()
        
        # 상태
        self.is_sending = False
        self.stop_requested = False
        self.selected_image_path = None
        self.member_vars = {}
        
        # UI 구성
        self.setup_ui()
        self.load_groups()

    def setup_styles(self):
        style = ttk.Style()
        style.theme_use("clam")
        
        # 기본 프레임 및 라벨
        style.configure("TFrame", background=self.c_bg)
        style.configure("Card.TFrame", background=self.c_card, relief="flat")
        style.configure("TLabel", background=self.c_bg, foreground=self.c_text_primary, font=self.f_main)
        style.configure("Card.TLabel", background=self.c_card, foreground=self.c_text_primary, font=self.f_main)
        
        # 콤보박스
        style.configure("TCombobox", fieldbackground=self.c_card, background=self.c_card)
        
        # 토스 블루 프로그레스바
        style.configure(
            "Toss.Horizontal.TProgressbar", 
            troughcolor="#E5E8EB", 
            background=self.c_toss_blue, 
            thickness=8, 
            borderwidth=0
        )

    def setup_ui(self):
        # -----------------------------
        # 상단 미니멀 헤더 바 (순백색 + 은은한 구분선)
        # -----------------------------
        header_frame = tk.Frame(self.root, bg=self.c_card, height=58, highlightbackground=self.c_border, highlightthickness=1)
        header_frame.pack(fill=tk.X)
        header_frame.pack_propagate(False)

        title_container = tk.Frame(header_frame, bg=self.c_card)
        title_container.pack(side=tk.LEFT, fill=tk.Y, padx=20)

        lbl_app_title = tk.Label(
            title_container, 
            text="순원 말씀 알림이", 
            font=self.f_app_title, 
            bg=self.c_card, 
            fg=self.c_text_primary
        )
        lbl_app_title.pack(side=tk.LEFT)

        lbl_app_subtitle = tk.Label(
            title_container, 
            text=" 카카오톡 1:1 개별 전송", 
            font=self.f_small, 
            bg=self.c_card, 
            fg=self.c_text_hint
        )
        lbl_app_subtitle.pack(side=tk.LEFT, padx=(4, 0))

        # 우측 토스 스타일 소프트 배지
        lbl_badge = tk.Label(
            header_frame, 
            text="⚡ 초고속 쾌속 모드 활성", 
            font=("Malgun Gothic", 9, "bold"), 
            bg=self.c_toss_light, 
            fg=self.c_toss_blue, 
            padx=12, 
            pady=4
        )
        lbl_badge.pack(side=tk.RIGHT, padx=20)

        # 메인 콘텐츠 컨테이너 (여유로운 여백)
        content_frame = tk.Frame(self.root, bg=self.c_bg)
        content_frame.pack(fill=tk.BOTH, expand=True, padx=16, pady=14)

        # 좌우 카드 분할
        left_card = tk.Frame(content_frame, bg=self.c_card, highlightbackground=self.c_border, highlightthickness=1)
        left_card.pack(side=tk.LEFT, fill=tk.BOTH, expand=False, padx=(0, 8))
        left_card.config(width=340)

        right_card = tk.Frame(content_frame, bg=self.c_card, highlightbackground=self.c_border, highlightthickness=1)
        right_card.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=(8, 0))

        # -----------------------------
        # [좌측 카드] 누구에게 보낼까요?
        # -----------------------------
        left_inner = tk.Frame(left_card, bg=self.c_card, padx=16, pady=16)
        left_inner.pack(fill=tk.BOTH, expand=True)

        lbl_sec1_title = tk.Label(left_inner, text="👥 누구에게 보낼까요?", font=self.f_head, bg=self.c_card, fg=self.c_text_primary)
        lbl_sec1_title.pack(anchor="w")

        lbl_sec1_sub = tk.Label(left_inner, text="메시지를 받을 순원을 선택하거나 추가하세요", font=self.f_subhead, bg=self.c_card, fg=self.c_text_hint)
        lbl_sec1_sub.pack(anchor="w", pady=(2, 12))

        # 그룹 선택 영역
        grp_frame = tk.Frame(left_inner, bg=self.c_card)
        grp_frame.pack(fill=tk.X, pady=(0, 10))

        tk.Label(grp_frame, text="그룹", font=self.f_bold, bg=self.c_card, fg=self.c_text_secondary).pack(side=tk.LEFT, padx=(0, 8))
        self.group_combo = ttk.Combobox(grp_frame, state="readonly", width=12, font=self.f_main)
        self.group_combo.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 6))
        self.group_combo.bind("<<ComboboxSelected>>", self.on_group_changed)

        btn_add_grp = tk.Button(grp_frame, text="+ 추가", font=self.f_small, bg=self.c_bg, fg=self.c_text_secondary, relief=tk.FLAT, padx=6, pady=2, command=self.add_group_dialog, cursor="hand2")
        btn_add_grp.pack(side=tk.LEFT, padx=2)
        btn_del_grp = tk.Button(grp_frame, text="삭제", font=self.f_small, bg=self.c_bg, fg=self.c_text_hint, relief=tk.FLAT, padx=6, pady=2, command=self.delete_current_group, cursor="hand2")
        btn_del_grp.pack(side=tk.LEFT, padx=2)

        # 엑셀 일괄 등록 버튼 (토스 시그니처 소프트 블루 버튼)
        btn_bulk = tk.Button(
            left_inner, 
            text="📋 명단 일괄 등록 (엑셀/카톡 복붙)", 
            font=self.f_btn, 
            bg=self.c_toss_light, 
            fg=self.c_toss_blue, 
            activebackground="#D8EAFF",
            activeforeground=self.c_toss_blue,
            relief=tk.FLAT, 
            pady=8,
            cursor="hand2",
            command=self.open_bulk_dialog
        )
        btn_bulk.pack(fill=tk.X, pady=(0, 10))

        # 전체 선택 바
        sel_bar = tk.Frame(left_inner, bg="#F9FAFB", highlightbackground=self.c_border, highlightthickness=1, padx=8, pady=4)
        sel_bar.pack(fill=tk.X, pady=(0, 6))

        self.var_select_all = tk.BooleanVar(value=True)
        chk_all = tk.Checkbutton(
            sel_bar, 
            text="전체 선택", 
            variable=self.var_select_all, 
            font=self.f_bold, 
            bg="#F9FAFB", 
            fg=self.c_text_primary,
            activebackground="#F9FAFB",
            relief=tk.FLAT,
            command=self.toggle_select_all
        )
        chk_all.pack(side=tk.LEFT)

        self.lbl_selected_count = tk.Label(sel_bar, text="(0명 선택됨)", font=self.f_bold, bg="#F9FAFB", fg=self.c_toss_blue)
        self.lbl_selected_count.pack(side=tk.RIGHT)

        # 순원 리스트 스크롤 영역
        list_container = tk.Frame(left_inner, bg=self.c_card, highlightbackground=self.c_border, highlightthickness=1)
        list_container.pack(fill=tk.BOTH, expand=True, pady=(0, 8))

        self.canvas = tk.Canvas(list_container, borderwidth=0, highlightthickness=0, bg="#FFFFFF")
        self.scrollbar = ttk.Scrollbar(list_container, orient=tk.VERTICAL, command=self.canvas.yview)
        self.scroll_frame = tk.Frame(self.canvas, bg="#FFFFFF")

        self.scroll_frame.bind("<Configure>", lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all")))
        self.canvas_window = self.canvas.create_window((0, 0), window=self.scroll_frame, anchor="nw")
        self.canvas.configure(yscrollcommand=self.scrollbar.set)

        self.canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        self.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.canvas.bind("<Configure>", lambda e: self.canvas.itemconfig(self.canvas_window, width=e.width))

        # 하단 즉석 추가
        instant_box = tk.Frame(left_inner, bg="#F9FAFB", highlightbackground=self.c_border, highlightthickness=1, padx=8, pady=6)
        instant_box.pack(fill=tk.X)

        self.txt_instant_name = tk.Entry(
            instant_box, 
            font=self.f_main, 
            bg="#FFFFFF", 
            fg=self.c_text_primary,
            highlightthickness=1, 
            highlightbackground=self.c_border, 
            relief=tk.FLAT
        )
        self.txt_instant_name.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 6), ipady=3)
        self.txt_instant_name.bind("<Return>", lambda e: self.add_instant_member())

        btn_instant = tk.Button(
            instant_box, 
            text="직접 추가", 
            font=self.f_small, 
            bg=self.c_toss_light, 
            fg=self.c_toss_blue, 
            relief=tk.FLAT, 
            padx=8,
            pady=3,
            command=self.add_instant_member, 
            cursor="hand2"
        )
        btn_instant.pack(side=tk.RIGHT)

        # -----------------------------
        # [우측 카드] 어떤 말씀을 전할까요?
        # -----------------------------
        right_inner = tk.Frame(right_card, bg=self.c_card, padx=18, pady=16)
        right_inner.pack(fill=tk.BOTH, expand=True)

        lbl_sec2_title = tk.Label(right_inner, text="✍️ 어떤 말씀을 전할까요?", font=self.f_head, bg=self.c_card, fg=self.c_text_primary)
        lbl_sec2_title.pack(anchor="w")

        lbl_sec2_sub = tk.Label(right_inner, text="정성 담긴 말씀과 공지, 사진을 함께 준비해보세요", font=self.f_subhead, bg=self.c_card, fg=self.c_text_hint)
        lbl_sec2_sub.pack(anchor="w", pady=(2, 10))

        # 사진 첨부 모던 카드 영역
        self.photo_box = tk.Frame(right_inner, bg="#F9FAFB", highlightbackground=self.c_border, highlightthickness=1, padx=12, pady=10)
        self.photo_box.pack(fill=tk.X, pady=(0, 8))

        top_photo_bar = tk.Frame(self.photo_box, bg="#F9FAFB")
        top_photo_bar.pack(fill=tk.X)

        btn_photo = tk.Button(
            top_photo_bar, 
            text="📷 사진 첨부하기", 
            font=self.f_bold, 
            bg="#FFFFFF", 
            fg=self.c_toss_blue, 
            activebackground=self.c_toss_light,
            relief=tk.FLAT, 
            highlightbackground=self.c_border,
            highlightthickness=1,
            padx=12, 
            pady=4,
            cursor="hand2",
            command=self.choose_image
        )
        btn_photo.pack(side=tk.LEFT, padx=(0, 10))

        self.lbl_photo = tk.Label(top_photo_bar, text="선택된 사진 없음 (글만 전송)", font=self.f_small, bg="#F9FAFB", fg=self.c_text_hint)
        self.lbl_photo.pack(side=tk.LEFT, fill=tk.X, expand=True)

        self.btn_del_photo = tk.Button(
            top_photo_bar, 
            text="✕ 취소", 
            font=self.f_small, 
            bg=self.c_danger_light, 
            fg=self.c_danger, 
            relief=tk.FLAT, 
            padx=8,
            pady=3,
            state=tk.DISABLED,
            command=self.clear_image,
            cursor="hand2"
        )
        self.btn_del_photo.pack(side=tk.RIGHT)

        # 썸네일 미리보기 영역
        self.preview_frame = tk.Frame(self.photo_box, bg="#F9FAFB", pady=6)
        self.lbl_thumbnail = tk.Label(self.preview_frame, bg="#F9FAFB")
        self.lbl_thumbnail.pack(side=tk.LEFT)
        self.lbl_thumb_info = tk.Label(self.preview_frame, font=self.f_small, bg="#F9FAFB", fg=self.c_text_secondary, justify=tk.LEFT)
        self.lbl_thumb_info.pack(side=tk.LEFT, padx=12)
        self.preview_photo = None

        # 스마트 치환 안내 (소프트 블루 팁 박스)
        tip_box = tk.Frame(right_inner, bg=self.c_toss_light, padx=10, pady=6)
        tip_box.pack(fill=tk.X, pady=(0, 8))
        tk.Label(
            tip_box, 
            text="💡 본문에 {이름} 이라고 적으면 각 순원의 이름으로 쏙 치환됩니다.\n    예: 안녕하세요 {이름} 순원님! ➔ 안녕하세요 김철수 순원님!", 
            font=self.f_small, 
            bg=self.c_toss_light, 
            fg=self.c_toss_blue, 
            justify=tk.LEFT
        ).pack(anchor="w")

        # -----------------------------
        # 하단 발송 컨트롤 및 프로그레스 영역 (바닥에 우선 고정하여 절대 잘리지 않음!)
        # -----------------------------
        control_card = tk.Frame(right_inner, bg="#F9FAFB", highlightbackground=self.c_border, highlightthickness=1, padx=12, pady=10)
        control_card.pack(side=tk.BOTTOM, fill=tk.X, pady=(8, 0))

        top_ctrl = tk.Frame(control_card, bg="#F9FAFB")
        top_ctrl.pack(fill=tk.X, pady=(0, 6))

        tk.Label(top_ctrl, text="전송 딜레이", font=self.f_bold, bg="#F9FAFB", fg=self.c_text_secondary).pack(side=tk.LEFT, padx=(0, 6))
        self.spin_delay = ttk.Spinbox(top_ctrl, from_=0.2, to=3.0, increment=0.1, width=4)
        self.spin_delay.set(0.5)
        self.spin_delay.pack(side=tk.LEFT, padx=(0, 4))
        tk.Label(top_ctrl, text="초", font=self.f_small, bg="#F9FAFB", fg=self.c_text_hint).pack(side=tk.LEFT, padx=(0, 14))

        # 메인 CTA 버튼 (토스 시그니처 블루!)
        self.btn_send = tk.Button(
            top_ctrl, 
            text="💙 순원들에게 메시지 보내기", 
            font=self.f_cta, 
            bg=self.c_toss_blue, 
            fg="#FFFFFF", 
            activebackground=self.c_toss_hover, 
            activeforeground="#FFFFFF",
            relief=tk.FLAT, 
            padx=16, 
            pady=8,
            cursor="hand2",
            command=self.start_sending
        )
        self.btn_send.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 8))

        self.btn_stop = tk.Button(
            top_ctrl, 
            text="중단", 
            font=self.f_bold, 
            bg="#E5E8EB", 
            fg="#9CA3AF", 
            relief=tk.FLAT, 
            state=tk.DISABLED,
            padx=12, 
            pady=8,
            cursor="hand2",
            command=self.stop_sending
        )
        self.btn_stop.pack(side=tk.RIGHT)

        # 토스 블루 프로그레스바
        self.progress_var = tk.DoubleVar(value=0.0)
        self.progress_bar = ttk.Progressbar(
            control_card, 
            variable=self.progress_var, 
            maximum=100, 
            style="Toss.Horizontal.TProgressbar"
        )
        self.progress_bar.pack(fill=tk.X, pady=(0, 6))

        # 실시간 상태 로그 박스
        self.txt_log = tk.Text(
            control_card, 
            height=3, 
            font=("Consolas", 9), 
            state=tk.DISABLED, 
            bg="#FFFFFF", 
            fg=self.c_text_secondary,
            relief=tk.FLAT,
            highlightbackground=self.c_border,
            highlightthickness=1,
            padx=8,
            pady=4
        )
        self.txt_log.pack(fill=tk.X)

        # 본문 텍스트 에디터 (남은 공간을 꽉 채움)
        txt_container = tk.Frame(right_inner, bg=self.c_card, highlightbackground=self.c_border, highlightthickness=1)
        txt_container.pack(fill=tk.BOTH, expand=True)

        self.txt_message = tk.Text(
            txt_container, 
            font=("Malgun Gothic", 10), 
            wrap=tk.WORD, 
            relief=tk.FLAT, 
            padx=12, 
            pady=10, 
            bg="#FFFFFF",
            fg=self.c_text_primary
        )
        msg_scroll = ttk.Scrollbar(txt_container, orient=tk.VERTICAL, command=self.txt_message.yview)
        self.txt_message.configure(yscrollcommand=msg_scroll.set)
        
        self.txt_message.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        msg_scroll.pack(side=tk.RIGHT, fill=tk.Y)

        sample_text = (
            "안녕하세요 {이름} 순원님! 😊\n"
            "이번 주 순모임 말씀 나눔 안내드립니다.\n\n"
            "[말씀 본문] 요한복음 3장 16절\n"
            "\"하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라\"\n\n"
            "한 주간도 주님 안에서 평안하시고, 주일에 기쁨으로 뵙겠습니다!"
        )
        self.txt_message.insert("1.0", sample_text)

    # -----------------------------
    # 기능 핸들러
    # -----------------------------
    def choose_image(self):
        filetypes = [
            ("이미지 파일", "*.png;*.jpg;*.jpeg;*.gif;*.bmp"),
            ("모든 파일", "*.*")
        ]
        filename = filedialog.askopenfilename(title="첨부할 사진 선택", filetypes=filetypes)
        if filename:
            try:
                self.selected_image_path = filename
                basename = os.path.basename(filename)
                
                # 이미지 열기 및 썸네일 생성 (슬림 썸네일 100x70)
                img = Image.open(filename)
                orig_w, orig_h = img.size
                
                img_thumb = img.copy()
                img_thumb.thumbnail((100, 70))
                self.preview_photo = ImageTk.PhotoImage(img_thumb)
                
                # 썸네일 라벨 설정 및 노출
                self.lbl_thumbnail.config(image=self.preview_photo)
                filesize_kb = os.path.getsize(filename) / 1024
                info_text = f"• 파일명: {basename}\n• 원본 해상도: {orig_w} × {orig_h} px ({filesize_kb:.1f} KB)"
                self.lbl_thumb_info.config(text=info_text)
                
                self.preview_frame.pack(fill=tk.X, pady=(6, 0))
                self.lbl_photo.config(text=f"✔ 첨부 완료", fg=self.c_success, font=self.f_bold)
                self.btn_del_photo.config(state=tk.NORMAL)
            except Exception as e:
                messagebox.showerror("오류", f"이미지를 불러오는 데 실패했습니다: {e}")

    def clear_image(self):
        self.selected_image_path = None
        self.preview_photo = None
        self.lbl_thumbnail.config(image="")
        self.preview_frame.pack_forget()
        self.lbl_photo.config(text="선택된 사진 없음 (글만 전송)", fg=self.c_text_hint, font=self.f_small)
        self.btn_del_photo.config(state=tk.DISABLED)

    def log(self, text):
        self.txt_log.config(state=tk.NORMAL)
        self.txt_log.insert(tk.END, text + "\n")
        self.txt_log.see(tk.END)
        self.txt_log.config(state=tk.DISABLED)

    def load_groups(self):
        groups = self.cm.get_groups()
        self.group_combo["values"] = groups
        last = self.cm.get_last_selected_group()
        if last in groups:
            self.group_combo.set(last)
        elif groups:
            self.group_combo.set(groups[0])
        self.refresh_member_list()

    def on_group_changed(self, event=None):
        selected = self.group_combo.get()
        self.cm.set_last_selected_group(selected)
        self.refresh_member_list()

    def refresh_member_list(self):
        for widget in self.scroll_frame.winfo_children():
            widget.destroy()
        self.member_vars.clear()

        group = self.group_combo.get()
        members = self.cm.get_members(group)

        if not members:
            lbl = tk.Label(self.scroll_frame, text="등록된 순원이 없습니다.\n[명단 일괄 등록] 버튼을 눌러 추가하세요.", bg="#FFFFFF", fg=self.c_text_hint, pady=25)
            lbl.pack()
            self.lbl_selected_count.config(text="(0명 선택됨)")
            return

        for name in members:
            row = tk.Frame(self.scroll_frame, bg="#FFFFFF")
            row.pack(fill=tk.X, pady=1, padx=4)

            var = tk.BooleanVar(value=True)
            self.member_vars[name] = var

            chk = tk.Checkbutton(
                row, 
                text=f" 👤 {name}", 
                variable=var, 
                font=self.f_main, 
                bg="#FFFFFF", 
                fg=self.c_text_primary,
                activebackground="#FFFFFF",
                relief=tk.FLAT,
                anchor="w",
                command=self.update_selected_count
            )
            chk.pack(side=tk.LEFT, fill=tk.X, expand=True)

            btn_del = tk.Button(
                row, 
                text="✕", 
                font=("Arial", 8), 
                relief=tk.FLAT, 
                bg="#FFFFFF", 
                fg="#D1D5DB",
                activeforeground=self.c_danger,
                activebackground="#FFFFFF",
                cursor="hand2",
                command=lambda n=name: self.delete_member_action(n)
            )
            btn_del.pack(side=tk.RIGHT, padx=4)

        self.update_selected_count()

    def update_selected_count(self):
        selected = [n for n, v in self.member_vars.items() if v.get()]
        total = len(self.member_vars)
        self.lbl_selected_count.config(text=f"({len(selected)}/{total}명 선택됨)")
        self.btn_send.config(text=f"💙 {len(selected)}명에게 메시지 보내기")

    def toggle_select_all(self):
        val = self.var_select_all.get()
        for var in self.member_vars.values():
            var.set(val)
        self.update_selected_count()

    def add_instant_member(self):
        name = self.txt_instant_name.get().strip()
        if not name:
            return
        
        group = self.group_combo.get()
        success, msg = self.cm.add_member(group, name)
        if success:
            self.txt_instant_name.delete(0, tk.END)
            self.refresh_member_list()
        else:
            messagebox.showinfo("알림", msg)

    def delete_member_action(self, name):
        group = self.group_combo.get()
        if messagebox.askyesno("순원 삭제", f"'{name}' 순원님을 {group} 그룹에서 삭제하시겠습니까?"):
            self.cm.delete_member(group, name)
            self.refresh_member_list()

    def add_group_dialog(self):
        new_group = simpledialog.askstring("그룹 추가", "새로운 그룹 이름을 입력하세요 (예: 2순, 청년부):")
        if new_group:
            success, msg = self.cm.add_group(new_group)
            if success:
                self.load_groups()
                self.group_combo.set(new_group.strip())
                self.refresh_member_list()
            else:
                messagebox.showwarning("주의", msg)

    def delete_current_group(self):
        current = self.group_combo.get()
        if messagebox.askyesno("그룹 삭제", f"정말로 '{current}' 그룹을 삭제하시겠습니까?\n(그룹 내 모든 순원 명단도 함께 삭제됩니다)"):
            self.cm.delete_group(current)
            self.load_groups()

    def open_bulk_dialog(self):
        group = self.group_combo.get()
        dialog = tk.Toplevel(self.root)
        dialog.title(f"[{group}] 순원 명단 일괄 등록")
        dialog.geometry("460x400")
        dialog.configure(bg=self.c_bg)
        dialog.transient(self.root)
        dialog.grab_set()

        lbl = tk.Label(
            dialog, 
            text="📋 엑셀이나 카톡, 메모장의 순원 명단을 복사해서 아래에 붙여넣으세요.\n(줄바꿈이나 쉼표로 자동 분리되어 한 번에 쏙 들어갑니다)",
            font=self.f_main,
            bg=self.c_bg,
            fg=self.c_text_primary,
            justify=tk.LEFT
        )
        lbl.pack(padx=16, pady=(16, 6), anchor="w")

        txt_bulk = tk.Text(dialog, font=self.f_main, height=12, highlightthickness=1, highlightbackground=self.c_border, relief=tk.FLAT)
        txt_bulk.pack(fill=tk.BOTH, expand=True, padx=16, pady=6)
        txt_bulk.insert("1.0", "홍길동\n김철수\n이영희")

        def do_register():
            raw = txt_bulk.get("1.0", tk.END).strip()
            if not raw:
                messagebox.showwarning("주의", "등록할 이름을 입력해주세요.", parent=dialog)
                return
            count, msg = self.cm.add_members_bulk(group, raw)
            messagebox.showinfo("완료", msg, parent=dialog)
            dialog.destroy()
            self.refresh_member_list()

        btn_frame = tk.Frame(dialog, bg=self.c_bg)
        btn_frame.pack(fill=tk.X, padx=16, pady=(0, 16))
        
        btn_ok = tk.Button(
            btn_frame, 
            text="명단 등록하기", 
            font=self.f_bold, 
            bg=self.c_toss_blue, 
            fg="#FFFFFF", 
            activebackground=self.c_toss_hover,
            activeforeground="#FFFFFF",
            relief=tk.FLAT, 
            padx=14, 
            pady=6, 
            cursor="hand2", 
            command=do_register
        )
        btn_ok.pack(side=tk.RIGHT, padx=4)
        btn_cancel = tk.Button(
            btn_frame, 
            text="취소", 
            font=self.f_main, 
            bg="#E5E8EB", 
            fg=self.c_text_secondary, 
            relief=tk.FLAT, 
            padx=10, 
            pady=6, 
            cursor="hand2", 
            command=dialog.destroy
        )
        btn_cancel.pack(side=tk.RIGHT)

    # -----------------------------
    # 발송 실행 쓰레드 제어
    # -----------------------------
    def start_sending(self):
        selected_members = [name for name, var in self.member_vars.items() if var.get()]
        if not selected_members:
            messagebox.showwarning("주의", "메시지를 보낼 순원을 1명 이상 선택해주세요.")
            return

        raw_message = self.txt_message.get("1.0", tk.END).strip()
        img_path = self.selected_image_path

        if not raw_message and not img_path:
            messagebox.showwarning("주의", "보낼 말씀(글)이나 사진 중 하나 이상을 입력/첨부해주세요.")
            return

        confirm_msg = (
            f"총 {len(selected_members)}명의 순원에게 개별 카톡 발송을 시작합니다.\n"
            f"• 첨부 사진: {'있음' if img_path else '없음'}\n\n"
            "※ 주의: 전송 중에는 키보드나 마우스를 건드리지 마세요.\n"
            "계속 진행하시겠습니까?"
        )
        if not messagebox.askyesno("전송 확인", confirm_msg):
            return

        self.is_sending = True
        self.stop_requested = False
        self.btn_send.config(state=tk.DISABLED, bg="#D1D5DB", fg="#FFFFFF", text="전송 진행 중...")
        self.btn_stop.config(state=tk.NORMAL, bg=self.c_danger, fg="#FFFFFF")
        self.progress_var.set(0.0)

        try:
            delay = float(self.spin_delay.get())
        except ValueError:
            delay = 0.5

        t = threading.Thread(target=self._send_worker, args=(selected_members, raw_message, img_path, delay), daemon=True)
        t.start()

    def stop_sending(self):
        if self.is_sending:
            self.stop_requested = True
            self.log("[!] 사용자가 발송 중단을 요청했습니다. 현재 순원 완료 후 멈춥니다...")

    def _send_worker(self, members, raw_template, image_path, delay):
        total = len(members)
        success_count = 0
        fail_list = []

        self.log(f"==================================================")
        self.log(f"▶ 카카오톡 쾌속 발송 시작 (총 {total}명)")
        if image_path:
            self.log(f"※ 첨부 사진: {os.path.basename(image_path)}")
        self.log(f"==================================================")

        for idx, name in enumerate(members, start=1):
            if self.stop_requested:
                self.log("[-] 전송이 중단되었습니다.")
                break

            personal_msg = raw_template.replace("{이름}", name) if raw_template else ""
            self.log(f"\n({idx}/{total}) '{name}'님에게 전송 중...")
            
            try:
                ok = send_kakao_message(name, personal_msg, image_path=image_path, log_cb=self.log)
            except Exception as e:
                self.log(f"[-] '{name}' 발송 중 시스템 오류: {e}")
                ok = False
            if ok:
                success_count += 1
            else:
                fail_list.append(name)

            pct = (idx / total) * 100
            self.root.after(0, lambda p=pct: self.progress_var.set(p))

            if idx < total and not self.stop_requested:
                time.sleep(delay)

        self.log(f"\n==================================================")
        self.log(f"★ 발송 완료 보고: 성공 {success_count}명 / 실패 {len(fail_list)}명")
        if fail_list:
            self.log(f"※ 실패 순원 (카톡 친구 이름 일치 확인 필요): {', '.join(fail_list)}")
        self.log(f"==================================================")

        self.root.after(0, self._finish_sending, success_count, fail_list)

    def _finish_sending(self, success_count, fail_list):
        self.is_sending = False
        selected_count = len([n for n, v in self.member_vars.items() if v.get()])
        self.btn_send.config(state=tk.NORMAL, bg=self.c_toss_blue, fg="#FFFFFF", text=f"💙 {selected_count}명에게 메시지 보내기")
        self.btn_stop.config(state=tk.DISABLED, bg="#E5E8EB", fg="#9CA3AF")

        result_text = f"발송이 완료되었습니다!\n\n• 성공: {success_count}명"
        if fail_list:
            result_text += f"\n• 실패: {len(fail_list)}명 ({', '.join(fail_list)})\n(카카오톡 친구 이름이 맞는지 확인해주세요)"
        messagebox.showinfo("발송 완료", result_text)

if __name__ == "__main__":
    root = tk.Tk()
    app = KakaoNotifierApp(root)
    root.mainloop()
