// Mobile navigation toggle
const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

toggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  toggle.classList.toggle("open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

// Light / dark theme toggle (initial theme is set by the inline script in <head>)
const themeToggle = document.getElementById("theme-toggle");

function updateThemeLabel(theme) {
  const next = theme === "light" ? "dark" : "light";
  themeToggle.setAttribute("aria-label", `Switch to ${next} mode`);
  themeToggle.title = `Switch to ${next} mode`;
}

updateThemeLabel(document.documentElement.getAttribute("data-theme"));

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  updateThemeLabel(next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {
    // Storage unavailable (e.g. private mode) — the theme still applies for this visit.
  }
});

// Reveal sections on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Contact form: validate, then open the visitor's email client.
// To receive submissions without email clients, point the form at a
// service like Formspree and remove the mailto logic below.
const CONTACT_EMAIL = "rafsanalam09@gmail.com";
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  form.querySelectorAll("input, textarea").forEach((field) => {
    const wrapper = field.closest(".field");
    const ok = field.value.trim() !== "" && field.checkValidity();
    wrapper.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    status.textContent = "Please fill out all fields with valid information.";
    status.className = "form-status error";
    return;
  }

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

  status.textContent = "Thanks! Your email client should open to send the message.";
  status.className = "form-status success";
  form.reset();
});
