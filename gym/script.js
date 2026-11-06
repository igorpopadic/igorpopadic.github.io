// =====================================================
// 1. MENI DOBIJE LINIJU KAD SKROLUJEŠ
// =====================================================
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 10));

// Označi link u meniju za sekciju koja je trenutno na ekranu
const navLinks = document.querySelectorAll(".nav nav a");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("#gallery, #prices, #faq, #coaches, #visit").forEach((sec) => sectionObserver.observe(sec));

// =====================================================
// 2. "OPEN NOW / CLOSED" PREMA TRENUTNOM VREMENU
//    [otvara, zatvara] u satima, indeks 0 = nedjelja
// =====================================================
const hours = { 0: [9, 20], 1: [6, 23], 2: [6, 23], 3: [6, 23], 4: [6, 23], 5: [6, 23], 6: [8, 22] };
const now = new Date();
const [opens, closes] = hours[now.getDay()];
const isOpen = now.getHours() >= opens && now.getHours() < closes;
const pad = (h) => String(h).padStart(2, "0") + ":00";
document.getElementById("status-text").textContent = isOpen ? "Open now" : "Closed now";
document.getElementById("status-dot").classList.toggle("closed", !isOpen);
document.querySelector(".floating-card small").textContent = `Today ${pad(opens)} – ${pad(closes)}`;

// =====================================================
// 3. STUDENTSKE CIJENE (−20%)
// =====================================================
const studentToggle = document.getElementById("student");
studentToggle.addEventListener("change", () => {
  const factor = studentToggle.checked ? 0.8 : 1;

  document.querySelectorAll(".amount").forEach((el) => {
    el.textContent = "€" + Math.round(el.dataset.price * factor);
    el.classList.remove("changed");
    void el.offsetWidth; // ponovo pokreni animaciju
    el.classList.add("changed");
  });
  // cijena "po mjesecu" kod 3 mjeseca i godišnje
  document.querySelectorAll(".permonth").forEach((el) => {
    el.textContent = "€" + Math.round((el.dataset.price * factor) / el.dataset.months);
  });
});

// =====================================================
// 4. GALERIJA — klik otvara veliku sliku, strelice listaju
// =====================================================
const items = [...document.querySelectorAll(".g")];
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCaption = document.getElementById("lb-caption");
let current = 0;

function showImage(i) {
  current = (i + items.length) % items.length; // kruži: posle zadnje ide prva
  const img = items[current].querySelector("img");
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCaption.textContent = items[current].dataset.caption;
}
function openLightbox(i) {
  showImage(i);
  lightbox.classList.add("open");
  document.body.classList.add("locked");
}
function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.classList.remove("locked");
}

items.forEach((item, i) => item.addEventListener("click", () => openLightbox(i)));
document.getElementById("lb-next").addEventListener("click", () => showImage(current + 1));
document.getElementById("lb-prev").addEventListener("click", () => showImage(current - 1));
document.getElementById("lb-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

// =====================================================
// 5. TRENERI — podaci na jednom mjestu, kartice se prave automatski
// =====================================================
const coaches = [
  {
    initials: "MK", name: "Marko K.", role: "Strength & powerlifting",
    color: "#2b2724",
    bio: "Ten years of coaching strength athletes and complete beginners. Specialises in squat, bench and deadlift technique.",
    times: [["Monday", "07:00 – 13:00"], ["Wednesday", "07:00 – 13:00"], ["Friday", "15:00 – 21:00"]],
  },
  {
    initials: "AN", name: "Ana N.", role: "Weight loss & conditioning",
    color: "#2f2a25",
    bio: "Builds realistic plans that fit a busy life. Training and nutrition guidance for long-term results, not quick fixes.",
    times: [["Tuesday", "06:00 – 12:00"], ["Thursday", "06:00 – 12:00"], ["Saturday", "09:00 – 14:00"]],
  },
  {
    initials: "LS", name: "Luka S.", role: "Boxing & fitness",
    color: "#262320",
    bio: "Former amateur boxer. Teaches technique, footwork and the kind of fitness you only get from a heavy bag.",
    times: [["Monday", "16:00 – 22:00"], ["Thursday", "16:00 – 22:00"], ["Sunday", "10:00 – 15:00"]],
  },
];

const grid = document.getElementById("coach-grid");
grid.innerHTML = coaches
  .map((c, i) => `
    <button class="coach" data-i="${i}">
      <div class="coach-photo" style="background:${c.color}">
        <span class="initials">${c.initials}</span>
        <span class="view">View profile</span>
      </div>
      <h3>${c.name}</h3>
      <p>${c.role}</p>
    </button>`)
  .join("");

const modal = document.getElementById("modal");
function openCoach(i) {
  const c = coaches[i];
  document.getElementById("m-photo").style.background = c.color;
  document.getElementById("m-photo").innerHTML = `<span class="initials">${c.initials}</span>`;
  document.getElementById("m-role").textContent = c.role;
  document.getElementById("m-name").textContent = c.name;
  document.getElementById("m-bio").textContent = c.bio;
  document.getElementById("m-times").innerHTML = c.times
    .map(([day, time]) => `<li><span>${day}</span><span>${time}</span></li>`)
    .join("");
  document.getElementById("m-book").textContent = `Book a session with ${c.name.split(" ")[0]}`;
  modal.classList.add("open");
  document.body.classList.add("locked");
}
function closeCoach() {
  modal.classList.remove("open");
  document.body.classList.remove("locked");
}
grid.querySelectorAll(".coach").forEach((btn) => btn.addEventListener("click", () => openCoach(btn.dataset.i)));
document.getElementById("modal-close").addEventListener("click", closeCoach);
document.getElementById("m-book").addEventListener("click", closeCoach);
modal.addEventListener("click", (e) => { if (e.target === modal) closeCoach(); });

// Tastatura: Esc zatvara, strelice listaju galeriju
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeLightbox(); closeCoach(); }
  if (lightbox.classList.contains("open")) {
    if (e.key === "ArrowRight") showImage(current + 1);
    if (e.key === "ArrowLeft") showImage(current - 1);
  }
});

// =====================================================
// 6. FORMA (demo — ništa se ne šalje)
// =====================================================
const form = document.getElementById("visit-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  document.getElementById("form-msg").textContent = `Thanks, ${name}! We'll call you to arrange your visit.`;
  form.reset();
});

// =====================================================
// 7. ELEMENTI SE POJAVE KAD DOĐU NA EKRAN
// =====================================================
const toReveal = document.querySelectorAll(".head, .g, .price-card, .faq-list, .coach, .visit-info, .visit-form");
toReveal.forEach((el) => el.classList.add("reveal"));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
toReveal.forEach((el) => observer.observe(el));
