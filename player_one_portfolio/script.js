/* PLAYER.ONE — Vanilla JavaScript interactions.
   Search for "CUSTOMIZE" to replace the sample data with your own. */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const boot = $("#boot-screen");
  const app = $("#app");
  const bootFill = $("#boot-progress-fill");
  const bootStatus = $("#boot-status");
  const skipBoot = $("#skip-boot");
  let bootTimer = null;
  let bootFinished = false;
  let toastTimer = null;

  function enterPortfolio() {
    if (bootFinished) return;
    bootFinished = true;
    if (bootTimer) clearInterval(bootTimer);
    bootFill.style.width = "100%";
    bootStatus.textContent = "SYSTEM BOOT: 100% // READY";
    app.classList.remove("is-hidden");
    window.setTimeout(() => {
      boot.classList.add("leaving");
      window.setTimeout(() => boot.remove(), reducedMotion ? 0 : 700);
    }, reducedMotion ? 0 : 180);
  }

  if (reducedMotion) {
    enterPortfolio();
  } else {
    let progress = 0;
    bootTimer = window.setInterval(() => {
      progress = Math.min(100, progress + Math.ceil(Math.random() * 9));
      bootFill.style.width = `${progress}%`;
      bootStatus.textContent = `SYSTEM BOOT: ${String(progress).padStart(2, "0")}%`;
      if (progress >= 100) {
        clearInterval(bootTimer);
        bootTimer = null;
        window.setTimeout(enterPortfolio, 320);
      }
    }, 150);
  }
  skipBoot.addEventListener("click", enterPortfolio);

  // Navigation: full-screen panel switching with URL hash support.
  const screens = $$(".screen");
  const navButtons = $$("[data-nav]");
  const sectionIndex = $("#section-index");
  const sidebar = $("#sidebar");
  const menuToggle = $("#menu-toggle");
  // Full-screen arcade warp overlay used between sectors.
  const warpOverlay = document.createElement("div");
  warpOverlay.className = "warp-transition";
  warpOverlay.setAttribute("aria-hidden", "true");
  document.body.appendChild(warpOverlay);
  let warpTimer = null;

  const sectionTitles = {
    home: "SECTOR 01 / OVERVIEW",
    profile: "SECTOR 02 / CHARACTER PROFILE",
    skills: "SECTOR 03 / SKILL TREE",
    projects: "SECTOR 04 / MISSION ARCHIVE",
    achievements: "SECTOR 05 / ACHIEVEMENT VAULT",
    gallery: "SECTOR 06 / MEMORY BANK",
    contact: "SECTOR 07 / COMMUNICATION HUB"
  };

  function navigate(id, updateHash = true) {
    const target = document.getElementById(id);
    if (!target || !target.classList.contains("screen")) return;
    const current = $(".screen.active");
    if (current === target) {
      sidebar.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      return;
    }
    if (current) {
      if (!reducedMotion) {
        document.body.classList.remove("warp-active", ...screens.map(screen => `warp-to-${screen.id}`));
        document.body.classList.add(`warp-to-${id}`);
        void document.body.offsetWidth;
        document.body.classList.add("warp-active");
        if (warpTimer) window.clearTimeout(warpTimer);
        warpTimer = window.setTimeout(() => {
          document.body.classList.remove("warp-active", ...screens.map(screen => `warp-to-${screen.id}`));
        }, 820);
      }
      current.classList.remove("active");
      current.classList.add("leaving");
      window.setTimeout(() => current.classList.remove("leaving"), reducedMotion ? 0 : 200);
      current.hidden = true;
    }
    target.hidden = false;
    target.classList.remove("leaving");
    // Restart the CSS entrance animation.
    target.classList.remove("active");
    void target.offsetWidth;
    target.classList.add("active");
    navButtons.forEach(button => {
      if (!button.matches("[data-nav]")) return;
      const active = button.dataset.nav === id;
      if (button.classList.contains("nav-item")) {
        button.classList.toggle("active", active);
        if (active) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");
      }
    });
    sectionIndex.textContent = sectionTitles[id] || "PORTFOLIO";
    sidebar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    if (updateHash && location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
    if (window.innerWidth < 680) window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  navButtons.forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      navigate(button.dataset.nav);
    });
  });
  // The three featured repositories open when the card itself is clicked.
  $$(".project-card-direct[data-project-url]").forEach(card => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", `Open ${$("h3", card)?.textContent || "project"} on GitHub`);
    card.addEventListener("click", event => {
      if (event.target.closest("a, button, input, select, textarea")) return;
      window.open(card.dataset.projectUrl, "_blank", "noopener,noreferrer");
    });
    card.addEventListener("keydown", event => {
      if ((event.key === "Enter" || event.key === " ") && event.target === card) {
        event.preventDefault();
        window.open(card.dataset.projectUrl, "_blank", "noopener,noreferrer");
      }
    });
  });

  menuToggle.addEventListener("click", () => {
    const open = sidebar.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", event => {
    if (window.innerWidth <= 960 && sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
      sidebar.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
  window.addEventListener("hashchange", () => navigate(location.hash.slice(1) || "home", false));
  const initialSection = location.hash.slice(1);
  if (initialSection && document.getElementById(initialSection)?.classList.contains("screen")) {
    navigate(initialSection, false);
  }
  $("#year").textContent = new Date().getFullYear();

  // Small toast feedback.
  function toast(message) {
    const element = $("#toast");
    element.textContent = message;
    element.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove("visible"), 3000);
  }

  // Skill tree inspector.
  const skillData = {
    web: { id: "NODE_001", icon: "⌘", title: "Web Development", description: "Frontend development using HTML, CSS, and JavaScript, including a personal portfolio hosted on GitHub Pages.", tags: ["HTML", "CSS", "JavaScript", "GitHub Pages"] },
    frontend: { id: "NODE_002", icon: "◇", title: "Frontend", description: "Building web interfaces with HTML and CSS, with JavaScript for interaction.", tags: ["HTML", "CSS", "JavaScript"] },
    javascript: { id: "NODE_003", icon: "JS", title: "Programming Languages", description: "The source portfolio lists Python, Java, C, C++, and JavaScript among Anushka’s skills.", tags: ["Python", "Java", "C", "C++", "JavaScript"] },
    tools: { id: "NODE_004", icon: "⚙", title: "Developer Tools", description: "Version control and a Linux-based development environment are part of the listed workflow.", tags: ["Git", "GitHub", "Ubuntu", "Linux", "Shell Scripting"] },
    backend: { id: "NODE_005", icon: "⌁", title: "AI / Systems", description: "Project work includes an AI-powered Student FAQ Chatbot, a supply-chain digital twin, and operating-systems coursework.", tags: ["Python", "AI / NLP", "Simulation", "C", "Linux"] },
    soft: { id: "NODE_006", icon: "✧", title: "Low-level & Coursework", description: "Coursework spans algorithms, operating systems, and microprocessors / embedded systems using Assembly.", tags: ["DAA", "Operating Systems", "Assembly", "Embedded Systems"] }
  };
  $$(".skill-node").forEach(node => {
    node.addEventListener("click", () => {
      const data = skillData[node.dataset.skill];
      if (!data) return;
      $$(".skill-node").forEach(n => n.classList.toggle("selected", n === node));
      $("#skill-node-id").textContent = data.id;
      $("#inspector-icon").textContent = data.icon;
      $("#inspector-title").textContent = data.title;
      $("#inspector-description").textContent = data.description;
      $("#inspector-tags").replaceChildren(...data.tags.map(tag => {
        const span = document.createElement("span");
        span.textContent = tag;
        return span;
      }));
    });
  });

  // Project filters.
  $$(".filter-chip[data-filter]").forEach(chip => {
    chip.addEventListener("click", () => {
      $$(".filter-chip[data-filter]").forEach(other => other.classList.toggle("active", other === chip));
      const filter = chip.dataset.filter;
      $$(".project-card").forEach(card => {
        const categories = card.dataset.category.split(/\s+/);
        card.classList.toggle("filtered-out", filter !== "all" && !categories.includes(filter));
      });
    });
  });

  // Project detail modal. CUSTOMIZE project data and repository links here.
  const projectData = {
    chatbot: { title: "Student FAQ Chatbot", kicker: "MISSION_001 / AI & NLP", description: "An AI-powered chatbot that answers frequently asked student questions, reducing repetitive queries and improving on-campus information access through NLP.", tags: ["Python", "NLP", "AI/ML"], url: "https://github.com/AnushkaPatil1107" },
    "digital-twin": { title: "Digital Twin — Supply Chain", kicker: "MISSION_002 / SIMULATION", description: "A digital twin that mirrors real-world supply chain behaviour, helping identify bottlenecks and predict disruptions before they occur.", tags: ["Python", "Simulation", "Digital Twin"], url: "https://github.com/AnushkaPatil1107" },
    "portfolio-site": { title: "Portfolio Website", kicker: "MISSION_003 / WEB DEVELOPMENT", description: "Personal portfolio hosted on GitHub Pages, built as part of the Maincrafts web development internship.", tags: ["HTML", "CSS", "JavaScript"], url: "https://github.com/AnushkaPatil1107/anushkapatil1107.github.io" },
    "flexi-credit": { title: "Flexi Credit System", kicker: "MISSION_004 / JAVA & OOP", description: "A Java-based flexible credit management system demonstrating object-oriented programming and real-world financial logic.", tags: ["Java", "OOP"], url: "https://github.com/AnushkaPatil1107/Flexi-credit-Java" },
    "os-lab": { title: "Operating Systems Lab", kicker: "MISSION_005 / SYSTEMS", description: "OS lab assignments in C covering process scheduling, memory management, and system-level programming on Linux.", tags: ["C", "Linux", "OS"], url: "https://github.com/AnushkaPatil1107/Operating-Systems-Lab" },
    "ai-ml-lab": { title: "AI / ML Lab", kicker: "MISSION_006 / MACHINE LEARNING", description: "Hands-on ML lab exercises covering algorithms, data preprocessing, and model evaluation from coursework.", tags: ["Python", "ML", "Data"], url: "https://github.com/AnushkaPatil1107/AI-ML-Lab" },
    "daa-lab": { title: "DAA Lab", kicker: "MISSION_007 / ALGORITHMS", description: "Design & Analysis of Algorithms coursework covering sorting, graph traversal, and dynamic programming with complexity analysis.", tags: ["C", "Algorithms", "DSA"], url: "https://github.com/AnushkaPatil1107/DAA-Lab" },
    "mes-ca1": { title: "MES CA1 — Assembly", kicker: "MISSION_008 / EMBEDDED SYSTEMS", description: "Microprocessors & Embedded Systems assignment in Assembly language covering registers, instruction sets, and low-level operations.", tags: ["Assembly", "Embedded", "MES"], url: "https://github.com/AnushkaPatil1107/MES-CA1" },
    "maincrafts-task": { title: "Maincrafts Internship — Task 1", kicker: "MISSION_009 / INTERNSHIP", description: "First deliverable from the Maincrafts web development internship: a foundational HTML project.", tags: ["HTML", "Web Dev"], url: "https://github.com/AnushkaPatil1107/Maincrafts-Internship-Task-1" }
  };
  const detailModal = $("#detail-modal");
  let lastFocusedElement = null;
  function openModal(modal) {
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    const closeButton = modal.querySelector("button");
    closeButton?.focus();
    document.body.style.overflow = "hidden";
  }
  function closeModal(modal) {
    modal.hidden = true;
    if ($("#detail-modal").hidden && $("#gallery-modal").hidden && $("#terminal-backdrop").hidden) {
      document.body.style.overflow = "";
    }
    lastFocusedElement?.focus?.();
  }
  $$(".inspect-project").forEach(button => {
    button.addEventListener("click", () => {
      const data = projectData[button.dataset.project];
      if (!data) return;
      $("#modal-kicker").textContent = data.kicker;
      $("#modal-title").textContent = data.title;
      $("#modal-description").textContent = data.description;
      $("#modal-tags").replaceChildren(...data.tags.map(tag => {
        const span = document.createElement("span"); span.textContent = tag; return span;
      }));
      $("#modal-github").href = data.url;
      openModal(detailModal);
    });
  });
  $("#modal-close").addEventListener("click", () => closeModal(detailModal));
  $("#modal-done").addEventListener("click", () => closeModal(detailModal));
  detailModal.addEventListener("click", event => { if (event.target === detailModal) closeModal(detailModal); });

  // Gallery category filters and preview modal.
  const galleryModal = $("#gallery-modal");
  $$(".gallery-filter").forEach(chip => {
    chip.addEventListener("click", () => {
      $$(".gallery-filter").forEach(other => other.classList.toggle("active", other === chip));
      const filter = chip.dataset.galleryFilter;
      $$(".gallery-tile").forEach(tile => tile.classList.toggle("filtered-out", filter !== "all" && tile.dataset.gallery !== filter));
    });
  });
  $$(".gallery-tile").forEach(tile => {
    tile.addEventListener("click", () => {
      $("#gallery-modal-title").textContent = tile.dataset.title || "Memory";
      const preview = $("#gallery-preview-art");
      preview.className = `gallery-preview-art ${[...tile.classList].filter(c => c.startsWith("tile-")).join(" ")}`;
      openModal(galleryModal);
    });
  });
  $("#gallery-close").addEventListener("click", () => closeModal(galleryModal));
  $("#gallery-done").addEventListener("click", () => closeModal(galleryModal));
  galleryModal.addEventListener("click", event => { if (event.target === galleryModal) closeModal(galleryModal); });

  // Contact form: validates locally and opens the visitor's mail client.
  $("#contact-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const name = $("#sender-name").value.trim();
    const email = $("#sender-email").value.trim();
    const message = $("#sender-message").value.trim();
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`);
    $("#form-feedback").textContent = "Preparing your email app…";
    // Replace this with your own email before publishing.
    const recipient = "your.email@example.com";
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    toast("Your email app should open with the message prepared.");
  });

  // Copy contact email feedback.
  $$(".copy-button").forEach(button => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        toast("Email copied. Remember to replace the placeholder address.");
      } catch {
        toast(`Placeholder email: ${value}`);
      }
    });
  });
  // Terminal: intentionally small, safe command allow-list (no eval).
  const terminalBackdrop = $("#terminal-backdrop");
  const terminalOutput = $("#terminal-output");
  const terminalInput = $("#terminal-input");
  const terminalForm = $("#terminal-form");
  const commands = {
    help: () => ["Available commands:", "help · home · profile · skills · projects · achievements · gallery · contact · clear · exit"],
    home: () => { navigate("home"); return ["Opening overview sector…"]; },
    profile: () => { navigate("profile"); return ["Opening character profile…"]; },
    skills: () => { navigate("skills"); return ["Opening skill tree…"]; },
    projects: () => { navigate("projects"); return ["Opening mission archive…"]; },
    achievements: () => { navigate("achievements"); return ["Opening achievement vault…"]; },
    gallery: () => { navigate("gallery"); return ["Opening memory bank…"]; },
    contact: () => { navigate("contact"); return ["Opening communication hub…"]; },
    clear: () => { terminalOutput.replaceChildren(); return []; },
    exit: () => { closeTerminal(); return ["Terminal session closed."]; }
  };
  function writeTerminal(text, className = "") {
    const p = document.createElement("p");
    p.textContent = text;
    if (className) p.className = className;
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
  function openTerminal() {
    lastFocusedElement = document.activeElement;
    terminalBackdrop.hidden = false;
    document.body.style.overflow = "hidden";
    terminalInput.focus();
  }
  function closeTerminal() {
    terminalBackdrop.hidden = true;
    if ($("#detail-modal").hidden && $("#gallery-modal").hidden) document.body.style.overflow = "";
    lastFocusedElement?.focus?.();
  }
  $("#terminal-launch").addEventListener("click", openTerminal);
  $("#terminal-close").addEventListener("click", closeTerminal);
  terminalBackdrop.addEventListener("click", event => { if (event.target === terminalBackdrop) closeTerminal(); });
  terminalForm.addEventListener("submit", event => {
    event.preventDefault();
    const raw = terminalInput.value.trim().toLowerCase();
    if (!raw) return;
    writeTerminal(`guest@player-one:~$ ${raw}`, "command-line");
    terminalInput.value = "";
    if (commands[raw]) {
      const output = commands[raw]();
      output.forEach(line => writeTerminal(line, "success"));
    } else {
      writeTerminal(`Command not found: ${raw}. Type "help" to list commands.`, "error");
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (!detailModal.hidden) closeModal(detailModal);
      else if (!galleryModal.hidden) closeModal(galleryModal);
      else if (!terminalBackdrop.hidden) closeTerminal();
      else {
        sidebar.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    }
    if (!event.ctrlKey && !event.metaKey && !event.altKey &&
        event.key.toLowerCase() === "t" &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) &&
        detailModal.hidden && galleryModal.hidden && terminalBackdrop.hidden) {
      openTerminal();
    }
  });

  // Optional UI sounds. Synthesized locally; no audio files are loaded.
  let soundEnabled = false;
  let audioContext = null;
  $("#sound-toggle").addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    $("#sound-toggle").setAttribute("aria-pressed", String(soundEnabled));
    toast(soundEnabled ? "Interface sounds enabled." : "Interface sounds muted.");
    if (soundEnabled) playTone(660, .06);
  });
  function playTone(frequency = 520, duration = .045) {
    if (!soundEnabled) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.035, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(); oscillator.stop(audioContext.currentTime + duration);
    } catch { /* Audio is optional; the portfolio works without it. */ }
  }
  $$(".nav-item, .button, .skill-node, .filter-chip").forEach(el => {
    el.addEventListener("mouseenter", () => playTone(720, .025));
  });

  // Keep app functional with hash routes and without external services.
  console.info("Anushka Patil portfolio loaded.");
})();
