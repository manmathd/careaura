/* ------- GLOBALS ------- */
const USER_KEY = "care_user";
const REM_KEY = "reminders";
const ALERT_KEY = "alerts";

const $ = (id) => document.getElementById(id);

/* ------- TIME UPDATE ------- */
setInterval(() => {
  $("timeNow").textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}, 1000);

/* ------- NAVIGATION ------- */
document.querySelectorAll(".bn-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const page = btn.dataset.page;
    showPage(page);
  });
});

function showPage(name) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  $("page-" + name).classList.add("active");

  document.querySelectorAll(".bn-btn").forEach((b) => b.classList.remove("active"));
  document.querySelector('.bn-btn[data-page="' + name + '"]').classList.add("active");
}

/* ------- TOAST ------- */
function showToast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

/* ------- LOGIN + OTP DEMO ------- */
let generatedOTP = null;

function sendOTP(e) {
  e.preventDefault();
  const name = $("name").value.trim();
  const mobile = $("mobile").value.trim();

  if (mobile.length !== 10) return showToast("Enter valid 10-digit mobile");

  generatedOTP = Math.floor(1000 + Math.random() * 9000);
  console.log("Demo OTP:", generatedOTP);

  $("otpSection").style.display = "block";
  $("otpInfo").textContent = "OTP sent (demo: check console)";
  showToast("OTP Sent");
}

function verifyOTP() {
  const entered = $("otp").value.trim();
  if (entered == generatedOTP) {
    localStorage.setItem(USER_KEY, $("name").value);
    showToast("Login successful");

    setTimeout(() => {
      $("welcomeUser").textContent = "Welcome, " + $("name").value + " 👋";
      showPage("home");
    }, 800);
  } else {
    showToast("Incorrect OTP");
  }
}

/* ------- REMINDERS ------- */
function loadReminders() {
  return JSON.parse(localStorage.getItem(REM_KEY) || "[]");
}

function saveReminders(list) {
  localStorage.setItem(REM_KEY, JSON.stringify(list));
}

document.getElementById("reminderForm").addEventListener("submit", addReminder);

function addReminder(e) {
  e.preventDefault();
  const text = $("remText").value.trim();
  const time = $("remTime").value;

  if (!text || !time) return showToast("Enter reminder details");

  const list = loadReminders();
  list.push({ id: Date.now(), text, time });
  saveReminders(list);

  showToast("Reminder added");

  renderReminders();
  renderUpcoming();
}

function renderReminders() {
  const list = loadReminders();
  const box = $("remList");
  box.innerHTML = "";

  if (!list.length) {
    box.innerHTML = "<p class='muted'>No reminders yet.</p>";
    return;
  }

  list.forEach((r) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<strong>${r.text}</strong> — ${r.time}
      <button class="btn small" onclick="deleteReminder(${r.id})">Delete</button>`;
    box.appendChild(div);
  });
}

function deleteReminder(id) {
  const list = loadReminders().filter((r) => r.id !== id);
  saveReminders(list);
  renderReminders();
  renderUpcoming();
  showToast("Deleted");
}

/* ------- UPCOMING REMINDERS ------- */
function renderUpcoming() {
  const list = loadReminders();
  const upcoming = $("upcomingList");
  const none = $("noReminders");

  upcoming.innerHTML = "";

  if (!list.length) {
    none.style.display = "block";
    return;
  }

  none.style.display = "none";

  list.slice(0, 3).forEach((r) => {
    const d = document.createElement("div");
    d.className = "muted";
    d.textContent = `${r.text} at ${r.time}`;
    upcoming.appendChild(d);
  });
}

/* ------- SOS ------- */
function triggerSOS() {
  const msg = "🚨 SOS Triggered at " + new Date().toLocaleTimeString();
  $("sosLog").textContent = msg;
  showToast("SOS Sent");

  const alerts = JSON.parse(localStorage.getItem(ALERT_KEY) || "[]");
  alerts.unshift({ text: msg, time: new Date().toLocaleString() });
  localStorage.setItem(ALERT_KEY, JSON.stringify(alerts));

  renderCaregiverAlerts();
}

/* ------- CAREGIVER ------- */
function renderCaregiverAlerts() {
  const list = JSON.parse(localStorage.getItem(ALERT_KEY) || "[]");
  const box = $("cgAlerts");
  box.innerHTML = "";

  if (!list.length) {
    box.innerHTML = "<p class='muted'>No alerts yet.</p>";
    return;
  }

  list.forEach((a) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<strong>Alert</strong>: ${a.text}<br><small>${a.time}</small>`;
    box.appendChild(div);
  });
}

function sendQuickMsg() {
  const msg = $("quickMsg").value.trim();
  if (!msg) return showToast("Enter a message");

  const alerts = JSON.parse(localStorage.getItem(ALERT_KEY) || "[]");
  alerts.unshift({ text: msg, time: new Date().toLocaleString() });
  localStorage.setItem(ALERT_KEY, JSON.stringify(alerts));

  $("quickMsg").value = "";
  renderCaregiverAlerts();
  showToast("Message Sent");
}

/* ------- HEALTH ------- */
function renderHealth() {
  $("hrVal").textContent = Math.floor(Math.random() * 40 + 60) + " bpm";
  $("stepsVal").textContent = Math.floor(Math.random() * 5000 + 1000);
  $("sleepVal").textContent = (Math.random() * 3 + 5).toFixed(1) + " hrs";
  $("fallVal").textContent = Math.random() > 0.1 ? "OK" : "⚠ Fall Detected";
}

setInterval(renderHealth, 4000);

/* ------- LOGOUT ------- */
function logout() {
  localStorage.removeItem(USER_KEY);
  showPage("login");
  showToast("Logged out");
}

/* INITIAL LOAD */
window.onload = () => {
  if (localStorage.getItem(USER_KEY)) {
    $("welcomeUser").textContent = "Welcome, " + localStorage.getItem(USER_KEY) + " 👋";
    showPage("home");
  } else {
    showPage("login");
  }

  renderReminders();
  renderUpcoming();
  renderCaregiverAlerts();
};
