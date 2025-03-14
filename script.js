function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    document.getElementById('clock').innerText = `${hours}:${minutes}:${seconds}`;
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock(); // Initialize clock immediately

let alarmTime = null;
let alarmTimeout = null;
const alarmSound = new Audio('alarm.mp3'); // Replace with your own alarm sound file
alarmSound.loop = true; // Make alarm sound play continuously

const setAlarmSection = document.getElementById("set-alarm");
const setAlarmButton = document.querySelector("button");

// Create a "Stop Alarm" button (Initially hidden)
const stopButton = document.createElement("button");
stopButton.innerText = "Stop Alarm";
stopButton.classList.add("hidden"); // Initially hidden using CSS class
stopButton.addEventListener("click", stopAlarm);
document.getElementById("sub-container").appendChild(stopButton);

// Function to show a notification
function showNotification(message) {
    if (Notification.permission === "granted") {
        new Notification("Alarm Clock", { body: message });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Alarm Clock", { body: message });
            }
        });
    }
}

// Function to set the alarm
function setAlarm() {
    let hour = document.querySelector("#set-alarm input:nth-child(1)").value;
    let minutes = document.querySelector("#set-alarm input:nth-child(2)").value;
    let seconds = document.querySelector("#set-alarm input:nth-child(3)").value;
    const period = document.querySelector("#set-alarm select").value;

    if (hour === "") {
        alert("Please enter a valid hour!");
        return;
    }

    // Set default values if minutes or seconds are empty
    minutes = minutes === "" ? "00" : minutes.padStart(2, '0');
    seconds = seconds === "" ? "00" : seconds.padStart(2, '0');

    let alarmHour = parseInt(hour);
    if (period.toLowerCase() === "pm" && alarmHour !== 12) {
        alarmHour += 12;
    } else if (period.toLowerCase() === "am" && alarmHour === 12) {
        alarmHour = 0;
    }

    alarmTime = `${alarmHour.toString().padStart(2, '0')}:${minutes}:${seconds}`;
    
    // Show notification when alarm is set
    showNotification(`Alarm set for ${hour}:${minutes}:${seconds} ${period.toUpperCase()}`);
    alert(`Alarm set for ${hour}:${minutes}:${seconds} ${period.toUpperCase()}`);

    setAlarmButton.innerText = "Alarm Set!"; // Change button text

    // Check alarm every second
    clearInterval(alarmTimeout);
    alarmTimeout = setInterval(checkAlarm, 1000);
}

// Function to check if the current time matches the alarm time
function checkAlarm() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    if (alarmTime === currentTime) {
        alarmSound.play();
        clearInterval(alarmTimeout); // Stop checking once the alarm rings

        // Hide alarm setting section and show stop button using class toggle
        setAlarmSection.classList.add("hidden");
        setAlarmButton.classList.add("hidden");
        stopButton.classList.remove("hidden"); // Show stop button
    }
}

// Function to stop the alarm manually
function stopAlarm() {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    setAlarmButton.innerText = "Set Alarm!"; // Reset button text

    // Restore alarm setting UI using class toggle
    setAlarmSection.classList.remove("hidden");
    setAlarmButton.classList.remove("hidden");
    stopButton.classList.add("hidden"); // Hide stop button
}

// Event listener for the Set Alarm button
setAlarmButton.addEventListener("click", setAlarm);



