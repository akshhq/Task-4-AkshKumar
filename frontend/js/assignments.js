// js/assignments.js

const API = "https://task-4-akshkumar.onrender.com";

// =====================
// Dark Mode & Nav (shared)
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

  loadAssignments();

  document.getElementById("assignmentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    await addAssignment();
  });
});

// =====================
// Badge helper
// =====================
function badgeClass(status) {
  if (status === "Submitted") return "badge-submitted";
  if (status === "Overdue")   return "badge-overdue";
  return "badge-pending";
}

// =====================
// Load All Assignments
// =====================
async function loadAssignments() {
  const container = document.getElementById("assignmentsContainer");
  container.innerHTML = `<p class="state-msg">⏳ Loading assignments...</p>`;

  try {
    const response = await fetch(`${API}/assignments`);

    if (!response.ok) throw new Error("Failed to fetch assignments");

    const assignments = await response.json();

    if (assignments.length === 0) {
      container.innerHTML = `<p class="state-msg">No assignments yet. Add one above.</p>`;
      return;
    }

    container.innerHTML = "";

    assignments.forEach((a) => {
      const due = a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "No due date";
      const card = document.createElement("div");
      card.classList.add("card", "assignment-card");
      card.innerHTML = `
        <h3>📝 ${a.title}</h3>
        <p class="due">📅 Due: ${due}</p>
        <span class="badge ${badgeClass(a.status)}">${a.status}</span>
        <br/><br/>
        <button class="btn btn-danger" onclick="deleteAssignment('${a._id}')">🗑 Delete</button>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    container.innerHTML = `<p class="state-msg" style="color:var(--danger);">❌ ${error.message}</p>`;
  }
}

// =====================
// Add Assignment
// =====================
async function addAssignment() {
  const title   = document.getElementById("title").value.trim();
  const dueDate = document.getElementById("dueDate").value;
  const status  = document.getElementById("status").value;
  const msg     = document.getElementById("formMsg");

  try {
    const response = await fetch(`${API}/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, dueDate, status }),
    });

    const data = await response.json();

    if (!response.ok) {
      msg.style.color = "var(--danger)";
      msg.textContent = `❌ ${data.error}`;
      return;
    }

    msg.style.color = "var(--success)";
    msg.textContent = "✅ Assignment added!";
    document.getElementById("assignmentForm").reset();
    setTimeout(() => (msg.textContent = ""), 3000);
    loadAssignments();

  } catch (error) {
    msg.style.color = "var(--danger)";
    msg.textContent = `❌ ${error.message}`;
  }
}

// =====================
// Delete Assignment
// =====================
async function deleteAssignment(id) {
  if (!confirm("Delete this assignment?")) return;

  try {
    const response = await fetch(`${API}/assignments/${id}`, { method: "DELETE" });

    if (!response.ok) {
      const data = await response.json();
      alert(`❌ ${data.error}`);
      return;
    }

    loadAssignments();

  } catch (error) {
    alert(`❌ ${error.message}`);
  }
}