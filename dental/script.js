// =====================================================
// 1. USLUGE I CIJENE — svi podaci na jednom mjestu
//    from: true znači da cijena piše "from €..."
//    book: true znači da se ta usluga može zakazati online
// =====================================================
const services = [
  { cat: "general",  name: "First visit & X-ray",     desc: "Full check-up, panoramic X-ray and treatment plan.", time: "40 min", price: 30, book: true },
  { cat: "general",  name: "Check-up & cleaning",     desc: "Professional cleaning, polishing and advice.",        time: "45 min", price: 45, book: true },
  { cat: "general",  name: "White filling",           desc: "Tooth-coloured composite filling.",                   time: "45 min", price: 40, from: true, book: true },
  { cat: "general",  name: "Root canal",              desc: "Under microscope, usually in one visit.",             time: "90 min", price: 120, from: true },
  { cat: "cosmetic", name: "Teeth whitening",         desc: "In-clinic whitening, up to 8 shades brighter.",       time: "60 min", price: 180, book: true },
  { cat: "cosmetic", name: "Porcelain veneer",        desc: "Per tooth, made in our partner lab.",                 time: "2 visits", price: 320, from: true },
  { cat: "implants", name: "Dental implant",          desc: "Swiss implant with lifetime warranty.",               time: "2–3 visits", price: 650, from: true },
  { cat: "implants", name: "Implant consultation",    desc: "3D scan and a written plan with prices.",             time: "30 min", price: 0, book: true },
  { cat: "ortho",    name: "Clear aligners",          desc: "Invisible braces, full treatment.",                   time: "6–18 months", price: 1900, from: true },
  { cat: "ortho",    name: "Braces consultation",     desc: "For kids and adults. Includes digital scan.",         time: "30 min", price: 25, book: true },
];

const listEl = document.getElementById("price-list");
const priceText = (s) => (s.price === 0 ? "Free" : `${s.from ? "<small>from</small>" : ""}€${s.price.toLocaleString("en-US")}`);

function renderPrices(cat) {
  listEl.innerHTML = services
    .filter((s) => cat === "all" || s.cat === cat)
    .map((s, i) => `
      <div class="price-row" style="animation-delay:${i * 0.04}s">
        <div><h3>${s.name}</h3><p>${s.desc}</p></div>
        <span class="time">${s.time}</span>
        <span class="price">${priceText(s)}</span>
      </div>`)
    .join("");
}
document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderPrices(btn.dataset.cat);
  });
});
renderPrices("all");

// =====================================================
// 2. ZAKAZIVANJE U 3 KORAKA
// =====================================================
const booking = { service: null, date: null, time: null }; // ovdje pamtimo izbor

const panels = document.querySelectorAll(".step-panel");
const stepLabels = document.querySelectorAll(".steps-mini li");

function goTo(step) {
  panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === String(step)));
  stepLabels.forEach((li) => {
    const n = Number(li.dataset.step);
    const current = step === "done" ? 4 : Number(step);
    li.classList.toggle("on", n === current);
    li.classList.toggle("done", n < current);
  });
}
document.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => goTo(b.dataset.back)));

// KORAK 1 — usluge koje se mogu zakazati online
const choicesEl = document.getElementById("treatment-choices");
choicesEl.innerHTML = services
  .filter((s) => s.book)
  .map((s) => `<button class="choice" data-name="${s.name}"><strong>${s.name}</strong><span>${s.time} · ${s.price === 0 ? "Free" : "€" + s.price}</span></button>`)
  .join("");
choicesEl.querySelectorAll(".choice").forEach((btn) => {
  btn.addEventListener("click", () => {
    booking.service = btn.dataset.name;
    goTo(2);
  });
});

// KORAK 2 — narednih 6 radnih dana (nedjelja je zatvoreno)
const daysEl = document.getElementById("days");
const slotsEl = document.getElementById("slots");
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const workDays = [];
const d = new Date();
while (workDays.length < 6) {
  d.setDate(d.getDate() + 1);
  if (d.getDay() !== 0) workDays.push(new Date(d));
}

daysEl.innerHTML = workDays
  .map((day, i) => `<button class="day" data-i="${i}"><small>${dayNames[day.getDay()]}</small><strong>${day.getDate()}</strong></button>`)
  .join("");

// Termini: subota kraće radi. "Zauzeti" termini su izmišljeni,
// ali uvijek isti za isti datum (da ne skaču pri svakom kliku).
function slotsFor(day) {
  const last = day.getDay() === 6 ? 13 : 19;
  const times = [];
  for (let h = day.getDay() === 6 ? 9 : 8; h <= last; h++) {
    times.push(`${String(h).padStart(2, "0")}:00`);
    if (h < last) times.push(`${String(h).padStart(2, "0")}:30`);
  }
  return times.map((t, i) => ({ t, taken: (day.getDate() * 7 + i * 3) % 5 === 0 }));
}

daysEl.querySelectorAll(".day").forEach((btn) => {
  btn.addEventListener("click", () => {
    daysEl.querySelectorAll(".day").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const day = workDays[btn.dataset.i];
    booking.date = day;
    slotsEl.innerHTML = slotsFor(day)
      .map((s) => `<button class="slot" ${s.taken ? "disabled" : ""}>${s.t}</button>`)
      .join("");
    slotsEl.querySelectorAll(".slot:not(:disabled)").forEach((slot) => {
      slot.addEventListener("click", () => {
        booking.time = slot.textContent;
        showSummary();
        goTo(3);
      });
    });
  });
});

// KORAK 3 — pregled i podaci
const niceDate = (day) => day.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
function showSummary() {
  document.getElementById("summary").innerHTML =
    `<strong>${booking.service}</strong><br>${niceDate(booking.date)} at <strong>${booking.time}</strong>`;
}

const form = document.getElementById("book-form");
form.addEventListener("submit", (e) => {
  e.preventDefault(); // demo — ništa se ne šalje
  const name = form.name.value.trim().split(" ")[0];
  document.getElementById("done-text").textContent =
    `Thanks, ${name}! ${booking.service} on ${niceDate(booking.date)} at ${booking.time}. We'll call you today to confirm.`;
  form.reset();
  goTo("done");
});
document.getElementById("book-again").addEventListener("click", () => {
  slotsEl.innerHTML = '<p class="muted">Pick a day first.</p>';
  daysEl.querySelectorAll(".day").forEach((b) => b.classList.remove("active"));
  goTo(1);
});

// =====================================================
// 3. MENI: označi sekciju na kojoj se nalaziš
// =====================================================
const navLinks = document.querySelectorAll(".nav nav a");
const secObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("#services, #book, #team, #clinic, #faq").forEach((s) => secObserver.observe(s));

// =====================================================
// 4. ELEMENTI SE POJAVE PRI SKROLOVANJU
// =====================================================
const toReveal = document.querySelectorAll(".head, .price-list, .booking-box, .doc, .cimg, .faq-list, .contact-card");
toReveal.forEach((el) => el.classList.add("reveal"));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
toReveal.forEach((el) => observer.observe(el));
