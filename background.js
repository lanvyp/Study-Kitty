
chrome.alarms.create("kittyTimer", {
  periodInMinutes: 1 / 60,
});

chrome.action.onClicked.addListener(() => {
  console.log("Extension icon clicked. Setting popup to popup.html.");
  chrome.action.setPopup({ popup: "popup.html" }, () => {
    console.log("Popup set to popup.html.");
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "kittyTimer") {
    chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
      if (res.isRunning) {
        let timer = res.timer + 1;
        let isRunning = true;
        console.log(timer);
        //Timer = secs
        //timeOption = mins
        if (timer ===  60 * res.timeOption) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png', // Path to your notification icon
            title: 'Congrats',
            message: 'You completed your study time!',
            priority: 2
          });
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
  chrome.storage.local.set({
    timer: "timer" in res ? res.timer : 0,
    timeOption: "timeOption" in res ? res.timeOption : 25,
    isRunning: "isRunning" in res ? res.isRunning : false,
  });
});
