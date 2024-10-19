let tasks = [];


function updateTimer() {
  chrome.storage.local.get(["timer", "timeOption"], (res) => {
    const time = document.getElementById("time");
    const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(
      2,
      "0"
    );
    let seconds = "00";
    if (res.timer % 60 != 0) {
      seconds = `${60 - (res.timer % 60)}`.padStart(2, "0");
    }

    time.textContent = `${minutes}:${seconds}`;
  });
}

updateTimer();
setInterval(updateTimer, 1000);

const startTimerButton = document.getElementById("start-timer-button");
startTimerButton.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    chrome.storage.local.set(
      {
        isRunning: !res.isRunning,
      },
      () => {
        startTimerButton.textContent = !res.isRunning
          ? "Pause Timer"
          : "Start Timer";
      }
    );
  });
});

const resetTimerButton = document.getElementById("reset-timer-button");
resetTimerButton.addEventListener("click", () => {
  chrome.storage.local.set(
    {
      timer: 0,
      isRunning: false,
    },
    () => {
      startTimerButton.textContent = "Start Timer";
    }
  );
});

chrome.storage.local.get(["isRunning"], function (result) {
  if (result.isRunning === false) {
const incrementButton = document.getElementById("increment");
incrementButton.addEventListener("click", () => {
  chrome.storage.local.get(["timeOption"], (res) => {
    let newTimeOption = res.timeOption + 5;
    chrome.storage.local.set({ timeOption: newTimeOption });
    document.getElementById("timeDisplay").textContent = `${newTimeOption} minutes`;
  });
});
}});

const decrementButton = document.getElementById("decrement");
decrementButton.addEventListener("click", () => {
  chrome.storage.local.get(["timeOption", "isRunning"], (res) => {
    if (res.isRunning === false) {  // Corrected res instead of result
      let newTimeOption = res.timeOption - 5;
      if (newTimeOption < 5) {
        alert("Time cannot be less than 5 minutes!");
        return;
      }
      chrome.storage.local.set({ timeOption: newTimeOption }, () => {
        document.getElementById("timeDisplay").textContent = `${newTimeOption} minutes`;
      });
    }
  });
});