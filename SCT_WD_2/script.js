let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let lapCount = 1;

const display = document.getElementById("display");
const startPauseBtn = document.getElementById("startPause");
const lapBtn = document.getElementById("lap");
const resetBtn = document.getElementById("reset");
const lapList = document.getElementById("lapList");

function formatTime(time) {
    const milliseconds = Math.floor((time % 1000) / 10);
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
}

function startPause() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            display.textContent = formatTime(elapsedTime);
        }, 10);

        startPauseBtn.textContent = "Pause";
        isRunning = true;
    } else {
        clearInterval(timerInterval);
        startPauseBtn.textContent = "Start";
        isRunning = false;
    }
}

function reset() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    display.textContent = "00:00:00";
    lapList.innerHTML = "";
    lapCount = 1;
    startPauseBtn.textContent = "Start";
    isRunning = false;
}

function lap() {
    if (!isRunning) return;

    const li = document.createElement("li");
    li.textContent = `Lap ${lapCount++} - ${formatTime(elapsedTime)}`;
    lapList.appendChild(li);
}

startPauseBtn.addEventListener("click", startPause);
resetBtn.addEventListener("click", reset);
lapBtn.addEventListener("click", lap);
