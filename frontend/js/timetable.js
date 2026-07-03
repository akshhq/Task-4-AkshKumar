// js/timetable.js

// =====================
// Timetable Data – B.Sc.(H) CS Sem IV Section A
// Keshav Mahavidyalaya, Session 2025-26 (Even Sem)
// null = no class
// =====================
const TIMETABLE = [
  { time: "9:00 AM",  slots: ["GE-4",             "DSC-DAA (L)",      "GE-4",       "DSC-DAA (L)", null         ] },
  { time: "10:00 AM", slots: [null,                "DSC-DBMS (L)",     "DSC-CN (L)", null,          null         ] },
  { time: "11:00 AM", slots: [null,                "AEC-2 (L)",        null,         null,          null         ] },
  { time: "12:00 PM", slots: ["LUNCH",             "LUNCH",            "LUNCH",      "LUNCH",       "LUNCH"      ] },
  { time: "1:30 PM",  slots: [null,                "AEC-2 (P)",        null,         "DSC-DBMS (P)","DSC-CN (P)" ] },
  { time: "2:30 PM",  slots: ["SEC-4",             null,               "VAC-4",      null,          "VAC-4"      ] },
  { time: "3:30 PM",  slots: [null,                "DSE-2: DAVP (L)",  null,         "DSE-2: DAVP (P)", null     ] },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_NAMES_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
  document.body.classList.toggle("dark", saved !== null ? saved === "true" : prefersDark);
  const btn = document.getElementById("darkToggle");
  if (btn) btn.textContent = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";

  const toggle = document.getElementById("navToggle");
  const links  = document.getElementById("navLinks");
  if (toggle && links) toggle.addEventListener("click", () => links.classList.toggle("open"));

  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a =>
    a.classList.toggle("active", a.getAttribute("href") === page)
  );

  renderTimetable();
  highlightToday();
});

// =====================
// Render Timetable
// =====================
function renderTimetable() {
  const tbody = document.getElementById("timetableBody");
  tbody.innerHTML = "";

  TIMETABLE.forEach(({ time, slots }) => {
    const isLunch = slots[0] === "LUNCH";
    const tr = document.createElement("tr");

    if (isLunch) {
      tr.innerHTML = `
        <td>${time}</td>
        <td colspan="5" style="text-align:center; color:var(--text-muted); font-style:italic;">
          🍽️ Lunch Break
        </td>`;
      tbody.appendChild(tr);
      return;
    }

    let html = `<td>${time}</td>`;
    slots.forEach((subject, i) => {
      if (!subject) {
        html += `<td class="cell-empty">—</td>`;
      } else {
        const isPractical = subject.includes("(P)");
        html += `<td class="cell-subject${isPractical ? " cell-practical" : ""}">${subject}</td>`;
      }
    });
    tr.innerHTML = html;
    tbody.appendChild(tr);
  });
}

// =====================
// Highlight Today's Column
// =====================
function highlightToday() {
  const todayIndex = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const banner = document.getElementById("todayBanner");

  if (todayIndex === 0 || todayIndex === 6) {
    banner.textContent = "🎉 It's the weekend! No classes today.";
    banner.style.display = "block";
    return;
  }

  // Highlight header (Mon=col1, Tue=col2, ...)
  document.querySelectorAll("thead th[data-day]").forEach(th => {
    if (parseInt(th.getAttribute("data-day")) === todayIndex) {
      th.classList.add("today-col");
    }
  });

  // Highlight body cells (skip lunch rows which use colspan)
  document.querySelectorAll("#timetableBody tr").forEach(tr => {
    if (tr.children.length > 2) { // not a lunch row
      const td = tr.children[todayIndex]; // 1=Mon,2=Tue,...
      if (td) td.classList.add("today-col");
    }
  });

  const dayName = DAY_NAMES_FULL[todayIndex];
  banner.textContent = `📅 Today is ${dayName}`;
  banner.style.display = "block";
}