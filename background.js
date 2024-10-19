
chrome.alarms.create("pomodoroTimer", {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoroTimer") {
    chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
      if (res.isRunning) {
        let timer = res.timer + 1;
        let isRunning = true;
        console.log(timer);
        if (timer === 60 * res.timeOption) {
          // this.registration.showNotification("Pomodoro Timer is Up", {
          //    body: `${res.timeOption} min has passed!`,
          //    icon: "icon.png",
          // });

          timer = 0;
          isRunning = false;
        }
        chrome.storage.local.set({
          timer,
          isRunning,
        });
      }
    });
  }
});

chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png', // Path to your notification icon
    title: 'Study Reminder',
    message: 'Get back to studying!',
    priority: 2
  });
  chrome.storage.local.set({
    timer: "timer" in res ? res.timer : 0,
    timeOption: "timeOption" in res ? res.timeOption : 25,
    isRunning: "isRunning" in res ? res.isRunning : false,
  });
});


let shouldRemindToStudy = true;

// Function to show notification
function showStudyNotification() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png', // Path to your notification icon
    title: 'Study Reminder',
    message: 'Get back to studying!',
    priority: 2
  });
}
showStudyNotification();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SHOW_NOTIFICATION") {
    showStudyNotification();
  }
});
