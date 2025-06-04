import tkinter as tk
from tkinter import ttk
import time
from datetime import timedelta
import threading

class PomodoroTimer:
    def __init__(self, root):
        self.root = root
        self.root.title("ポモドーロタイマー")
        self.root.geometry("300x200")
        
        # タイマーの初期設定
        self.work_minutes = 25
        self.break_minutes = 5
        self.is_working = True
        self.is_running = False
        
        # タイマーラベル
        self.timer_label = ttk.Label(root, text="25:00", font=("Helvetica", 48))
        self.timer_label.pack(pady=20)
        
        # スタート/ストップボタン
        self.start_button = ttk.Button(root, text="開始", command=self.toggle_timer)
        self.start_button.pack(pady=5)
        
        # リセットボタン
        self.reset_button = ttk.Button(root, text="リセット", command=self.reset_timer)
        self.reset_button.pack(pady=5)
        
        # モードラベル
        self.mode_label = ttk.Label(root, text="作業時間", font=("Helvetica", 12))
        self.mode_label.pack(pady=5)
        
    def update_timer(self):
        if self.is_running:
            if self.is_working:
                minutes = self.work_minutes
            else:
                minutes = self.break_minutes
            
            current_time = timedelta(minutes=minutes)
            self.timer_label.config(text=str(current_time))
            
            if minutes > 0:
                minutes -= 1
                if self.is_working:
                    self.work_minutes = minutes
                else:
                    self.break_minutes = minutes
                
                self.root.after(60000, self.update_timer)  # 1分ごとに更新
            else:
                # モードを切り替え
                self.is_working = not self.is_working
                if self.is_working:
                    self.work_minutes = 25
                    self.mode_label.config(text="作業時間")
                else:
                    self.break_minutes = 5
                    self.mode_label.config(text="休憩時間")
                
                # アラーム音を鳴らす
                self.beep()
                self.update_timer()
    
    def toggle_timer(self):
        self.is_running = not self.is_running
        if self.is_running:
            self.start_button.config(text="停止")
            self.update_timer()
        else:
            self.start_button.config(text="開始")
    
    def reset_timer(self):
        self.is_running = False
        self.start_button.config(text="開始")
        self.work_minutes = 25
        self.break_minutes = 5
        self.is_working = True
        self.mode_label.config(text="作業時間")
        self.timer_label.config(text="25:00")
    
    def beep(self):
        # システムのビープ音を鳴らす
        print("\a")

if __name__ == "__main__":
    root = tk.Tk()
    app = PomodoroTimer(root)
    root.mainloop()
