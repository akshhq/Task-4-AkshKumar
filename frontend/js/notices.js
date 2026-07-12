// js/notices.js

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

  loadNotices();

  document.getElementById("noticeForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    await addNotice();
  });
});

// =====================
// Load All Notices
// =====================
async function loadNotices() {
  const container = document.getElementById("noticesContainer");
  container.innerHTML = `<p class="state-msg">⏳ Loading notices...</p>`;

  try {
    const response = await fetch(`${API}/notices`);

    if (!response.ok) throw new Error("Failed to fetch notices");

    const notices = await response.json();

    if (notices.length === 0) {
      container.innerHTML = `<p class="state-msg">No notices yet. Post one above.</p>`;
      return;
    }

    container.innerHTML = "";

    notices.forEach((n) => {
      const date = n.date ? new Date(n.date).toLocaleDateString() : "";
      const card = document.createElement("div");
      card.classList.add("card", "notice-card");
      card.innerHTML = `
        <div class="notice-icon">🔔</div>
        <div class="notice-body">
          <h3>${n.title}</h3>
          <p>${n.description}</p>
          <span class="date">📅 ${date}</span>
          <br/><br/>
          <button class="btn btn-danger" onclick="deleteNotice('${n._id}')">🗑 Delete</button>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    container.innerHTML = `<p class="state-msg" style="color:var(--danger);">❌ ${error.message}</p>`;
  }
}

// =====================
// Add Notice
// =====================
async function addNotice() {
  const title       = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const msg         = document.getElementById("formMsg");

  try {
    const response = await fetch(`${API}/notices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    const data = await response.json();

    if (!response.ok) {
      msg.style.color = "var(--danger)";
      msg.textContent = `❌ ${data.error}`;
      return;
    }

    msg.style.color = "var(--success)";
    msg.textContent = "✅ Notice posted!";
    document.getElementById("noticeForm").reset();
    setTimeout(() => (msg.textContent = ""), 3000);
    loadNotices();

  } catch (error) {
    msg.style.color = "var(--danger)";
    msg.textContent = `❌ ${error.message}`;
  }
}

// =====================
// Delete Notice
// =====================
async function deleteNotice(id) {
  if (!confirm("Delete this notice?")) return;

  try {
    const response = await fetch(`${API}/notices/${id}`, { method: "DELETE" });

    if (!response.ok) {
      const data = await response.json();
      alert(`❌ ${data.error}`);
      return;
    }

    loadNotices();

  } catch (error) {
    alert(`❌ ${error.message}`);
  }
}