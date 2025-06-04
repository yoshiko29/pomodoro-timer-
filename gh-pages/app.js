// 家事カテゴリーと推奨時間
const categories = {
    '掃除': {
        emoji: '🧹',
        recommendedTime: 30,
        description: 'お掃除モード：30分で集中して掃除を完了！'
    },
    '料理': {
        emoji: '🍳',
        recommendedTime: 45,
        description: '料理モード：45分で美味しい料理を完成！'
    },
    '洗濯': {
        emoji: '👕',
        recommendedTime: 20,
        description: '洗濯モード：20分で効率的に洗濯！'
    },
    '片付け': {
        emoji: '🗑️',
        recommendedTime: 15,
        description: '片付けモード：15分で部屋を整理！'
    }
};

// タイマーデータ
let timer;
let isRunning = false;
let remainingTime = 0;
let mode = '作業中';
let currentCategory = null;
let customTime = 25;

// カテゴリー選択
function selectCategory(category) {
    currentCategory = category;
    const categoryInfo = categories[category];
    
    // カテゴリーボタンのアクティブ状態を更新
    document.querySelectorAll('.category-button').forEach(button => {
        button.classList.remove('active');
        if (button.textContent.includes(category)) {
            button.classList.add('active');
        }
    });

    // カテゴリー情報の表示
    document.getElementById('categoryDescription').textContent = categoryInfo.description;
    document.getElementById('categoryInfo').classList.add('active');

    // タイマーの設定
    remainingTime = categoryInfo.recommendedTime * 60;
    updateTimerDisplay();
}

// タイマーディスプレイの更新
function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const timerDisplay = document.getElementById('timer');
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// タイマーの更新
function updateTimer() {
    if (remainingTime > 0) {
        remainingTime--;
        updateTimerDisplay();
    } else {
        clearInterval(timer);
        isRunning = false;
        document.getElementById('mode').textContent = '完了！';
        playSound();
    }
}

// タイマーボタンの切り替え
function toggleTimer() {
    if (!isRunning) {
        if (remainingTime === 0) {
            if (currentCategory) {
                const categoryInfo = categories[currentCategory];
                remainingTime = categoryInfo.recommendedTime * 60;
            } else {
                remainingTime = customTime * 60;
            }
        }
        timer = setInterval(updateTimer, 1000);
        isRunning = true;
        document.getElementById('mode').textContent = '作業中';
        document.querySelector('.start').textContent = '一時停止';
        document.querySelector('.stop').style.display = 'none';
    } else {
        clearInterval(timer);
        isRunning = false;
        document.getElementById('mode').textContent = '一時停止中';
        document.querySelector('.start').textContent = '再開';
        document.querySelector('.stop').style.display = 'inline-block';
    }
}

// タイマーリセット
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    remainingTime = 0;
    document.getElementById('mode').textContent = '作業中';
    document.querySelector('.start').textContent = '開始';
    document.querySelector('.stop').style.display = 'inline-block';
    updateTimerDisplay();
}

// カスタム時間の設定
function setCustomTime() {
    customTime = parseInt(document.getElementById('customMinutes').value) || 25;
    remainingTime = customTime * 60;
    updateTimerDisplay();
}

// サウンドの再生
function playSound() {
    const audio = new Audio();
    audio.src = 'https://notificationsounds.com/soundfiles/267c3845f2688217927c2c8084214d2b/notification-1.mp3';
    audio.play();
}

// 初期化
resetTimer();
