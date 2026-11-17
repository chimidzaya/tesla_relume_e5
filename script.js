document.documentElement.classList.add("js");

const navbar = document.getElementById("navbar");
const toggle = document.getElementById("navToggle");

// Navbar: hero-оос доош гүйлгэхэд цагаан дэвсгэртэй болно
function updateNavbar() {
  navbar.classList.toggle("is-scrolled", window.scrollY > 40);
}
updateNavbar();
window.addEventListener("scroll", updateNavbar, { passive: true });

// Гар утасны цэс
function setMenu(open) {
  navbar.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Цэс хаах" : "Цэс нээх");
}
toggle.addEventListener("click", () => setMenu(!navbar.classList.contains("is-open")));
navbar.querySelectorAll(".navbar__menu a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

// Таб (Model 3 хувилбарууд) — товшилт болон сум товчоор удирдана
document.querySelectorAll("[data-tabs]").forEach((tabs) => {
  const tabList = [...tabs.querySelectorAll('[role="tab"]')];

  function select(tab) {
    tabList.forEach((t) => {
      const active = t === tab;
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
    });
  }

  tabList.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      const next = tabList[(i + dir + tabList.length) % tabList.length];
      next.focus();
      select(next);
    });
  });
});

// Дотоод цэс: одоо харагдаж буй хэсгийг тодруулна
const subnavLinks = document.querySelectorAll(".subnav a");
if (subnavLinks.length && "IntersectionObserver" in window) {
  const byId = new Map([...subnavLinks].map((a) => [a.getAttribute("href").slice(1), a]));
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        subnavLinks.forEach((a) => a.classList.remove("is-current"));
        byId.get(entry.target.id)?.classList.add("is-current");
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  byId.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
}

// Гүйлгэх үед хэсгүүд зөөлөн гарч ирнэ
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}
