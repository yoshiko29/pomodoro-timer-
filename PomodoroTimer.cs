using System;
using System.Windows.Forms;
using System.Drawing;

namespace PomodoroTimer
{
    public class PomodoroTimerForm : Form
    {
        private Timer timer;
        private Label timerLabel;
        private Button startButton;
        private Button resetButton;
        private Label modeLabel;
        private int workMinutes = 25;
        private int breakMinutes = 5;
        private bool isWorking = true;
        private bool isRunning = false;

        public PomodoroTimerForm()
        {
            // フォームの設定
            this.Text = "ポモドーロタイマー";
            this.Size = new Size(300, 200);
            this.StartPosition = FormStartPosition.CenterScreen;

            // タイマーラベル
            timerLabel = new Label
            {
                Text = "25:00",
                Font = new Font("Arial", 48),
                TextAlign = ContentAlignment.MiddleCenter,
                Size = new Size(200, 80),
                Location = new Point(50, 20)
            };
            this.Controls.Add(timerLabel);

            // スタート/ストップボタン
            startButton = new Button
            {
                Text = "開始",
                Size = new Size(100, 30),
                Location = new Point(50, 120)
            };
            startButton.Click += StartButton_Click;
            this.Controls.Add(startButton);

            // リセットボタン
            resetButton = new Button
            {
                Text = "リセット",
                Size = new Size(100, 30),
                Location = new Point(150, 120)
            };
            resetButton.Click += ResetButton_Click;
            this.Controls.Add(resetButton);

            // モードラベル
            modeLabel = new Label
            {
                Text = "作業時間",
                Font = new Font("Arial", 12),
                TextAlign = ContentAlignment.MiddleCenter,
                Size = new Size(200, 30),
                Location = new Point(50, 100)
            };
            this.Controls.Add(modeLabel);

            // タイマーオブジェクト
            timer = new Timer
            {
                Interval = 1000  // 1秒ごとに更新
            };
            timer.Tick += Timer_Tick;
        }

        private void Timer_Tick(object sender, EventArgs e)
        {
            if (isWorking)
            {
                workMinutes--;
                if (workMinutes < 0)
                {
                    workMinutes = 25;
                    isWorking = false;
                    modeLabel.Text = "休憩時間";
                    System.Media.SystemSounds.Beep.Play();
                }
            }
            else
            {
                breakMinutes--;
                if (breakMinutes < 0)
                {
                    breakMinutes = 5;
                    isWorking = true;
                    modeLabel.Text = "作業時間";
                    System.Media.SystemSounds.Beep.Play();
                }
            }

            timerLabel.Text = $"{Math.Max(workMinutes, breakMinutes):D2}:00";
        }

        private void StartButton_Click(object sender, EventArgs e)
        {
            isRunning = !isRunning;
            startButton.Text = isRunning ? "停止" : "開始";
            if (isRunning)
            {
                timer.Start();
            }
            else
            {
                timer.Stop();
            }
        }

        private void ResetButton_Click(object sender, EventArgs e)
        {
            isRunning = false;
            startButton.Text = "開始";
            timer.Stop();
            workMinutes = 25;
            breakMinutes = 5;
            isWorking = true;
            modeLabel.Text = "作業時間";
            timerLabel.Text = "25:00";
        }

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new PomodoroTimerForm());
        }
    }
}
