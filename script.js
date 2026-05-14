/* ============================================================
   IA TechLabs — script.js  v7
============================================================ */

/* ---- 1. Scroll reveal ------------------------------------ */
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.08 }
);
revealElements.forEach((el) => revealObserver.observe(el));

/* ---- 2. Sticky header ------------------------------------ */
const siteHeader = document.getElementById("siteHeader");
if (siteHeader) {
  window.addEventListener("scroll", () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 24);
  }, { passive: true });
}

/* ---- 3. Hamburger menu ----------------------------------- */
const hamburger  = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
    mobileMenu.setAttribute("aria-hidden", !isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      hamburger.focus();
    }
  });
}

/* ---- 4. Active nav link on scroll ------------------------ */
const sections = document.querySelectorAll("section[id]");
const navLinks  = document.querySelectorAll(".nav a");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.35 }
);
sections.forEach((section) => sectionObserver.observe(section));

/* ---- 5. Contact form (Formspree) ------------------------- */
const contactForm  = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre   = contactForm.querySelector('[name="nombre"]').value.trim();
    const contacto = contactForm.querySelector('[name="contacto"]').value.trim();
    const mensaje  = contactForm.querySelector('[name="mensaje"]').value.trim();

    if (!nombre) {
      showFeedback("error", "Por favor ingresa tu nombre.");
      contactForm.querySelector('[name="nombre"]').focus();
      return;
    }
    if (!contacto || !isValidEmail(contacto)) {
      showFeedback("error", "Por favor ingresa un correo electrónico válido.");
      contactForm.querySelector('[name="contacto"]').focus();
      return;
    }
    if (!mensaje) {
      showFeedback("error", "Por favor describe tu idea o desafío.");
      contactForm.querySelector('[name="mensaje"]').focus();
      return;
    }

    const submitBtn    = contactForm.querySelector(".premium-submit");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Enviando...";
    submitBtn.disabled    = true;
    hideFeedback();

    try {
      const response = await fetch(contactForm.action, {
        method:  "POST",
        body:    new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        showFeedback("success", "¡Mensaje enviado! Te contactaremos pronto.");
        contactForm.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        const msg  = data?.errors?.[0]?.message || "Error al enviar el formulario.";
        throw new Error(msg);
      }
    } catch {
      showFeedback("error", "Hubo un problema al enviar. Escríbenos directamente a descubre@iatechlabs.cl");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled    = false;
    }
  });
}

function showFeedback(type, message) {
  formFeedback.textContent = message;
  formFeedback.className   = `form-feedback ${type}`;
  formFeedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
function hideFeedback() {
  formFeedback.className   = "form-feedback";
  formFeedback.textContent = "";
}
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
