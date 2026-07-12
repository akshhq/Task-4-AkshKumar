// js/dashboard.js

const API = "https://task-4-akshkumar.onrender.com";

// =====================
// Timetable Data – B.Sc.(H) CS Sem IV Section A
// =====================
const TIMETABLE = [
  { time: "9:00 AM",  slots: ["GE-4",  "DSC-DAA (L)",     "GE-4",       "DSC-DAA (L)",    null          ] },
  { time: "10:00 AM", slots: [null,     "DSC-DBMS (L)",    "DSC-CN (L)", null,             null          ] },
  { time: "11:00 AM", slots: [null,     "AEC-2 (L)",       null,         null,             null          ] },
  { time: "1:30 PM",  slots: [null,     "AEC-2 (P)",       null,         "DSC-DBMS (P)",   "DSC-CN (P)"  ] },
  { time: "2:30 PM",  slots: ["SEC-4",  null,              "VAC-4",      null,             "VAC-4"       ] },
  { time: "3:30 PM",  slots: [null,     "DSE-2: DAVP (L)", null,         "DSE-2: DAVP (P)",null          ] },
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// =====================
// Dark Mode & Nav
// =====================
function toggleDark() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("sd-dark", isDark);
  const btn = document.getElementById("darkToggle");
  if (btn) btn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("sd-dark");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = saved !== null ? saved === "true" : prefersDark;
  document.body.classList.toggle("dark", isDark);
  const btn = document.getElementById("darkToggle");
  if (btn) btn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";

  const toggle = document.getElementById("navToggle");
  const links  = document.getElementById("navLinks");
  if (toggle && links) toggle.addEventListener("click", () => links.classList.toggle("open"));

  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a =>
    a.classList.toggle("active", a.getAttribute("href") === page)
  );

  loadTodayClasses();
  loadDashboard();
});

// =====================
// Today's Classes
// =====================
function loadTodayClasses() {
  const todayIndex = new Date().getDay(); // 0=Sun,1=Mon,...,6=Sat
  const todayName  = DAY_NAMES[todayIndex];
  const colIndex   = todayIndex - 1;     // Mon=0, Tue=1, ..., Fri=4

  const countEl = document.getElementById("classCount");
  const subEl   = document.getElementById("todayLabel");
  const titleEl = document.getElementById("todayClassesTitle");
  const listEl  = document.getElementById("todayClassesList");

  titleEl.textContent = `${todayName}'s Classes`;

  if (todayIndex === 0 || todayIndex === 6) {
    countEl.textContent = "0";
    subEl.textContent   = "It's the weekend!";
    listEl.innerHTML    = `<p class="state-msg">🎉 No classes today. Enjoy your weekend!</p>`;
    return;
  }

  const todayClasses = TIMETABLE
    .map(({ time, slots }) => ({ time, subject: slots[colIndex] }))
    .filter(({ subject }) => subject);

  countEl.textContent = todayClasses.length;
  subEl.textContent   = `on ${todayName}`;

  if (todayClasses.length === 0) {
    listEl.innerHTML = `<p class="state-msg">No classes scheduled today.</p>`;
    return;
  }

  listEl.innerHTML = "";
  todayClasses.forEach(({ time, subject }) => {
    const isPractical = subject.includes("(P)");
    const row = document.createElement("div");
    row.classList.add("class-item");
    row.innerHTML = `
      <span class="class-time">${time}</span>
      <span class="class-dot" style="${isPractical ? "background:var(--warning);" : ""}"></span>
      <span class="class-name">${subject}</span>
    `;
    listEl.appendChild(row);
  });
}

// =====================
// Load API Data
// =====================
async function loadDashboard() {
  try {
    const [assignmentsRes, noticeRes] = await Promise.all([
      fetch(`${API}/assignments`),
      fetch(`${API}/notices/latest`),
    ]);

    if (assignmentsRes.ok) {
      const assignments = await assignmentsRes.json();
      document.getElementById("assignmentCount").textContent = assignments.length;
    }

    if (noticeRes.ok) {
      const notice = await noticeRes.json();
      document.getElementById("latestNotice").textContent = notice.title || "No notices";
    }

  } catch (error) {
    console.error("Dashboard load error:", error);
    document.getElementById("assignmentCount").textContent = "—";
    document.getElementById("latestNotice").textContent    = "Could not load";
  }
}