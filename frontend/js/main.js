/* ===========================
   BASE API
=========================== */
const base_api = "http://localhost:5000";

/* ===========================
   PARTICLES
=========================== */
function spawnParticles() {
  const container = document.getElementById("particles");
  if (!container) return;
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = 6 + Math.random() * 10 + "s";
    p.style.animationDelay = Math.random() * 5 + "s";
    container.appendChild(p);
  }
}
spawnParticles();

/* ===========================
   LAYOUT SETTINGS
=========================== */
async function loadLayout() {
  try {
    const layout = await fetch(`${base_api}/api/layout`).then(r => r.json());

    if (!layout.showCars) hideEl("section-cars");
    if (!layout.showComments) hideEl("section-comments");
    if (!layout.showDownloads) hideEl("download-buttons");
    if (!layout.showSocialLinks) hideEl("section-social");
  } catch (err) {
    console.error("Layout load error:", err);
  }
}
loadLayout();

function hideEl(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

/* ===========================
   HERO CONTENT
=========================== */
async function loadHero() {
  try {
    const data = await fetch(`${base_api}/api/content/home`).then(r => r.json());

    document.getElementById("hero-title").innerText =
      data.title || "CYBER DRIFT X";
    document.getElementById("hero-subtitle").innerText =
      data.subtitle || "Official Game Portal";
    document.getElementById("hero-description").innerText =
      data.description || "A cyberpunk drift universe forged in Unity.";
  } catch (err) {
    console.error("Hero load error:", err);
  }
}
loadHero();

/* ===========================
   DEVLOG (TABLE STYLE)
=========================== */
async function loadDevlog() {
  const container = document.getElementById("devlogList");
  if (!container) return;

  container.innerHTML = "<p class='meta'>Loading updates...</p>";

  try {
    const logs = await fetch(`${base_api}/api/devlog`).then(r => r.json());

    if (!logs || logs.length === 0) {
      container.innerHTML = "<p class='meta'>No updates yet.</p>";
      return;
    }

    container.innerHTML = "";

    logs.forEach(log => {
      const entry = document.createElement("div");
      entry.className = "devlog-entry";

      /* TAG */
      const tag = document.createElement("div");
      tag.className = `devlog-tag ${log.tag}`;
      tag.textContent = formatTag(log.tag);

      /* TEXT */
      const text = document.createElement("div");
      text.className = "devlog-entry-text";
      text.textContent = log.text || "";

      /* DATE */
      const date = document.createElement("div");
      date.className = "devlog-entry-date";
      date.textContent = log.date || "";

      entry.appendChild(tag);
      entry.appendChild(date);
      entry.appendChild(text);

      /* IMAGE */
      if (log.image) {
        const img = document.createElement("img");
        img.src = `${base_api}/uploads/devlog/${log.image}`;
        entry.appendChild(img);
      }

      container.appendChild(entry);
    });

  } catch (err) {
    console.error("Devlog load error:", err);
    container.innerHTML = "<p class='meta'>Error loading updates.</p>";
  }
}

function formatTag(tag) {
  switch (tag) {
    case "important": return "🔥 Important";
    case "new": return "🆕 New Feature";
    case "fix": return "🛠 Fix";
    case "improved": return "⚙️ Improved";
    default: return tag;
  }
}

loadDevlog();




/* ===========================
   DOWNLOAD BUTTONS
=========================== */
async function loadDownloads() {
  const container = document.getElementById("download-buttons");
  if (!container) return;

  container.innerHTML = "<p class='meta'>Loading downloads...</p>";

  try {
    const downloads = await fetch(`${base_api}/api/downloads`).then(r => r.json());

    if (!downloads || downloads.length === 0) {
      container.innerHTML = "<p class='meta'>No downloads available yet.</p>";
      return;
    }

    container.innerHTML = "";
    downloads.forEach(btn => {
      const el = document.createElement("a");
      el.className = "pill validate";
      el.href = btn.url || "#";
      el.target = "_blank";
      el.innerText = btn.label || "Download";
      container.appendChild(el);
    });
  } catch (err) {
    console.error("Downloads load error:", err);
    container.innerHTML = "<p class='meta'>Error loading downloads.</p>";
  }
}
loadDownloads();

/* ===========================
   CAR GALLERY
=========================== */
async function loadCars() {
  const gallery = document.getElementById("carGallery");
  if (!gallery) return;

  gallery.innerHTML = "<p class='meta'>Loading cars...</p>";

  try {
    const cars = await fetch(`${base_api}/api/cars`).then(r => r.json());

    if (!cars || cars.length === 0) {
      gallery.innerHTML = "<p class='meta'>No cars available yet.</p>";
      return;
    }

    gallery.innerHTML = "";
    cars.forEach(car => {
      const card = document.createElement("div");
      card.className = "card";

      const glow = document.createElement("div");
      glow.className = "glow-edge";

      const img = document.createElement("img");
      img.style.width = "100%";
      img.style.borderRadius = "12px";
      img.style.marginBottom = "12px";
      img.style.objectFit = "cover";
      img.style.maxHeight = "220px";

      let src = car.image || "";
      if (src && !src.startsWith("http")) {
        src = `${base_api}/uploads/cars/${src.replace(/^\/+/, "")}`;
      }

      img.src =
        src ||
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='220'%3E%3Crect width='100%25' height='100%25' fill='%230b0b0b'/%3E%3Ctext x='50%25' y='50%25' fill='%2399a' font-size='14' dominant-baseline='middle' text-anchor='middle'%3ENo image%3C/text%3E%3C/svg%3E";

      const name = document.createElement("div");
      name.className = "key-id";
      name.textContent = car.name || "Unnamed Car";

      card.appendChild(glow);
      card.appendChild(img);
      card.appendChild(name);
      gallery.appendChild(card);
    });
  } catch (err) {
    console.error("Cars load error:", err);
    gallery.innerHTML = "<p class='meta'>Error loading cars.</p>";
  }
}
loadCars();

/* ===========================
   COMMENTS
=========================== */
async function loadComments() {
  const list = document.getElementById("commentsList");
  if (!list) return;

  list.innerHTML = "<p class='meta'>Loading comments...</p>";

  try {
    const comments = await fetch(`${base_api}/api/comments`).then(r => r.json());

    if (!comments || comments.length === 0) {
      list.innerHTML = "<p class='meta'>No comments yet. Be the first!</p>";
      return;
    }

    list.innerHTML = "";
    comments.forEach(c => {
      const card = document.createElement("div");
      card.className = "card";

      const glow = document.createElement("div");
      glow.className = "glow-edge";

      const user = document.createElement("div");
      user.className = "key-id";
      user.textContent = c.username || "Anonymous";

      const date = document.createElement("div");
      date.className = "meta";
      date.textContent = c.date || "";

      const text = document.createElement("p");
      text.style.marginTop = "10px";
      text.textContent = c.comment || "";

      card.appendChild(glow);
      card.appendChild(user);
      card.appendChild(date);
      card.appendChild(text);
      list.appendChild(card);
    });
  } catch (err) {
    console.error("Comments load error:", err);
    list.innerHTML = "<p class='meta'>Error loading comments.</p>";
  }
}
loadComments();

/* ===========================
   SUBMIT COMMENT
=========================== */
async function submitComment() {
  const usernameEl = document.getElementById("username");
  const emailEl = document.getElementById("email");
  const commentEl = document.getElementById("comment");

  const username = usernameEl.value.trim();
  const email = emailEl.value.trim();
  const comment = commentEl.value.trim();

  if (!username || !email || !comment) {
    alert("Please fill all fields");
    return;
  }

  try {
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);

    await fetch(`${base_api}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, comment })
    });

    commentEl.value = "";
    loadComments();
  } catch (err) {
    console.error("Submit comment error:", err);
    alert("Error submitting comment. Please try again.");
  }
}

/* ===========================
   AUTO-FILL USER DATA
=========================== */
(function restoreUserData() {
  const username = localStorage.getItem("username") || "";
  const email = localStorage.getItem("email") || "";

  const usernameEl = document.getElementById("username");
  const emailEl = document.getElementById("email");

  if (usernameEl) usernameEl.value = username;
  if (emailEl) emailEl.value = email;
})();