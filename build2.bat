@echo off
chcp 65001
"C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe" /target:winexe PomodoroTimer.cs
echo ビルドが完了しました！
pause
