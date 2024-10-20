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
    if (!res.isRunning){
      chrome.storage.local.set(
        {
          isRunning: !res.isRunning,
        }
      );
    }
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

const incrementButton = document.getElementById("increment");
incrementButton.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], function (result) {
    if (result.isRunning === false) {
      chrome.storage.local.get(["timeOption"], (res) => {
        let newTimeOption = res.timeOption + 5;
        chrome.storage.local.set({ timeOption: newTimeOption }, () => {
          //document.getElementById("timeDisplay").textContent; 
        });
      });
    }
  });
});

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
        //document.getElementById("timeDisplay").textContent; 
      });
    }
  });
});

function displayBlacklistedUrls() {
  chrome.storage.local.get({ blacklistedUrls: [] }, (result) => {
    const urlList = result.blacklistedUrls;
    const listElement = document.getElementById("blacklistUrlsList");

    // Clear existing list
    listElement.innerHTML = '';

    // Add each URL as a list item
    urlList.forEach((url) => {
      const listItem = document.createElement("li");
      listItem.textContent = url;
      listElement.appendChild(listItem);
    });
  });
}

// Event listener for saving a URL
document.getElementById("saveUrl").addEventListener("click", () => {
  const url = document.getElementById("urlInput").value;

  if (url) {
    // Retrieve the existing list from storage
    chrome.storage.local.get({ blacklistedUrls: [] }, (result) => {
      const updatedUrls = result.blacklistedUrls;
      updatedUrls.push(url);

      // Save the updated list back to storage
      chrome.storage.local.set({ blacklistedUrls: updatedUrls }, () => {
        displayBlacklistedUrls(); // Update the displayed list
      });
    });
  }
});

document.getElementById("clearButton").addEventListener("click", () => {
  // Clear the blacklisted URLs from storage
  chrome.storage.local.remove("blacklistedUrls", () => {
      // Reload the list to reflect the cleared state
      displayBlacklistedUrls();
      console.log("All blacklisted URLs have been cleared.");
  });
});

 // Display the blacklisted URLs when the popup loads
 document.addEventListener("DOMContentLoaded", displayBlacklistedUrls);

