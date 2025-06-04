# ポモドーロタイマー PowerShell スクリプト

function Start-PomodoroTimer {
    param(
        [int]$WorkMinutes = 25,
        [int]$BreakMinutes = 5
    )

    $isWorking = $true
    $continue = $true

    while ($continue) {
        if ($isWorking) {
            Write-Host "`n作業時間開始！ ($WorkMinutes分)"
            Start-Sleep -Seconds ($WorkMinutes * 60)
            [System.Media.SystemSounds]::Beep.Play()
            Write-Host "`n作業時間終了！休憩時間に切り替えます。"
            $isWorking = $false
        } else {
            Write-Host "`n休憩時間開始！ ($BreakMinutes分)"
            Start-Sleep -Seconds ($BreakMinutes * 60)
            [System.Media.SystemSounds]::Beep.Play()
            Write-Host "`n休憩時間終了！作業時間に切り替えます。"
            $isWorking = $true
        }

        # 継続確認
        $answer = Read-Host "`n次のセッションを開始しますか？ (y/n)"
        if ($answer -ne "y") {
            $continue = $false
            Write-Host "`nポモドーロタイマーを終了します。"
        }
    }
}

# スクリプトの実行
Write-Host "`nポモドーロタイマーを開始します！"
Write-Host "作業時間: 25分、休憩時間: 5分で実行されます。"
Write-Host "`n開始するには Enter キーを押してください。"
Read-Host

Start-PomodoroTimer
