// ===== 1. MENI DOBIJE POZADINU KAD SKROLUJEŠ =====
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 60);
});

// ===== 2. TABOVI U MENIJU (All / Brunch / Coffee / Sweet) =====
const tabs = document.querySelectorAll(".tab");
const dishes = document.querySelectorAll(".dish");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // ukloni "active" sa svih dugmadi pa ga stavi na kliknuto
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const cat = tab.dataset.cat;
    dishes.forEach((dish) => {
      const dishCats = dish.dataset.cat.split(" ");
      const show = cat === "all" || dishCats.includes(cat);
      dish.classList.toggle("hidden", !show);
    });
  });
});

// ===== 3. "OPEN NOW / CLOSED" PREMA TRENUTNOM VREMENU =====
// Radno vrijeme: [otvara, zatvara] u satima. Indeks 0 = nedjelja.
const hours = {
  0: [9, 15],
  1: [7.5, 16], 2: [7.5, 16], 3: [7.5, 16], 4: [7.5, 16], 5: [7.5, 16],
  6: [8, 17],
};
const now = new Date();
const h = now.getHours() + now.getMinutes() / 60;
const [open, close] = hours[now.getDay()];
const status = document.getElementById("open-status");
if (h >= open && h < close) {
  status.textContent = "● Open now — come by!";
  status.classList.add("open");
} else {
  status.textContent = "● Closed right now — see you soon";
  status.classList.add("closed");
}

// ===== 4. FORMA ZA REZERVACIJU =====
// Ovo je demo: podaci se nigdje ne šalju, samo prikažemo poruku.
const form = document.getElementById("book-form");
const msg = document.getElementById("book-msg");
form.addEventListener("submit", (e) => {
  e.preventDefault(); // spriječi da se stranica osvježi
  const name = form.name.value.trim();
  msg.textContent = `Thanks, ${name}! Your table request is in — we'll confirm by phone.`;
  form.reset();
});

// ===== 5. ELEMENTI "ISPLIVAJU" KAD DOĐU NA EKRAN =====
const revealItems = document.querySelectorAll(
  ".about-img, .about-text, .section-head, .dish, .g-item, .visit-card, .book-box"
);
revealItems.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealItems.forEach((el) => observer.observe(el));
