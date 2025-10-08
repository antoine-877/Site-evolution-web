document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav ul");
  const header = document.querySelector("header");

  // ---------------- Hamburger Menu ----------------
  const menuBtn = document.createElement("div");
  menuBtn.classList.add("hamburger");
  menuBtn.setAttribute("aria-label", "Ouvrir le menu");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.innerHTML = `<span></span><span></span><span></span>`;
  header.appendChild(menuBtn);

  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuBtn.classList.toggle("active");
    menuBtn.setAttribute("aria-expanded", nav.classList.contains("active"));
  });

  // ---------------- Dropdown Mobile ----------------
  const dropdowns = document.querySelectorAll("nav ul li.dropdown");
  dropdowns.forEach((drop) => {
    const link = drop.querySelector("a"); // on cible le lien principal
    if (link) {
      link.addEventListener("click", (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault(); // empêche la redirection immédiate

          // Fermer tous les autres dropdowns
          dropdowns.forEach((otherDrop) => {
            if (otherDrop !== drop) {
              otherDrop.classList.remove("active");
            }
          });

          // Toggle le dropdown actuel
          drop.classList.toggle("active");
        }
      });
    }
  });

  // ---------------- Timeline interactive ----------------
  const timelineItems = document.querySelectorAll(".timeline-item");
  let currentTimelineIndex = 0;

  function showTimelineItem(index) {
    timelineItems.forEach((item, i) => {
      item.classList.remove("active");

      // Désactiver tous les liens
      const links = item.querySelectorAll("a");
      links.forEach((link) => (link.style.pointerEvents = "none"));

      if (i === index) {
        item.classList.add("active");

        // Activer les liens uniquement si la carte est active
        links.forEach((link) => (link.style.pointerEvents = "auto"));
      }
    });

    // Mettre à jour les dots
    const dots = document.querySelectorAll(".timeline-dot");
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  if (timelineItems.length > 0) showTimelineItem(currentTimelineIndex);

  timelineItems.forEach((item, idx) => {
    item.addEventListener("click", () => {
      if (window.innerWidth > 1024) {
        currentTimelineIndex = idx;
        showTimelineItem(currentTimelineIndex);
      }
    });
  });

  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      currentTimelineIndex =
        (currentTimelineIndex - 1 + timelineItems.length) %
        timelineItems.length;
      showTimelineItem(currentTimelineIndex);
    });
    nextBtn.addEventListener("click", () => {
      currentTimelineIndex = (currentTimelineIndex + 1) % timelineItems.length;
      showTimelineItem(currentTimelineIndex);
    });
  }

  // Créer les dots pour le carousel mobile
  const timelineControls = document.querySelector(".timeline-controls");
  if (timelineControls && timelineItems.length > 0) {
    console.log("Création des dots, nombre d'items:", timelineItems.length);

    const dotsContainer = document.createElement("div");
    dotsContainer.classList.add("timeline-dots");

    timelineItems.forEach((item, index) => {
      const dot = document.createElement("div");
      dot.classList.add("timeline-dot");
      if (index === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        currentTimelineIndex = index;
        showTimelineItem(currentTimelineIndex);
      });

      dotsContainer.appendChild(dot);
    });

    console.log("Dots créés:", dotsContainer.children.length);

    // Créer un conteneur pour les boutons
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("controls-buttons");
    buttonsContainer.appendChild(prevBtn);
    buttonsContainer.appendChild(nextBtn);

    // Réorganiser: dots en haut, boutons en bas
    timelineControls.innerHTML = "";
    timelineControls.appendChild(dotsContainer);
    timelineControls.appendChild(buttonsContainer);

    console.log("Timeline controls structure:", timelineControls);
  } else {
    console.log("Erreur: timelineControls ou timelineItems non trouvés");
  }

  // ---------------- Canvas Waves ----------------
  const canvas = document.getElementById("waves");
  if (canvas) {
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      const hero = document.querySelector(".hero");
      if (hero) {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
      }
    }

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        initLayers();
        showTimelineItem(currentTimelineIndex);
      }, 200);
    });

    resizeCanvas();

    const layersConfig = [
      {
        points: 60,
        amplitude: 80,
        speed: 0.002,
        frequency: 0.8,
        color: "rgba(0,255,255,1)",
        offsetY: -80,
      },
      {
        points: 60,
        amplitude: 70,
        speed: 0.0018,
        frequency: 1.2,
        color: "rgba(0,150,255,1)",
        offsetY: -40,
      },
      {
        points: 60,
        amplitude: 60,
        speed: 0.0015,
        frequency: 0.6,
        color: "rgba(75,0,200,1)",
        offsetY: 0,
      },
      {
        points: 60,
        amplitude: 50,
        speed: 0.0012,
        frequency: 1.8,
        color: "rgba(150,0,255,1)",
        offsetY: 50,
      },
    ];

    let layers = [];

    function initLayers() {
      layers = [];
      const centerY = canvas.height / 2;
      layersConfig.forEach((config) => {
        const points = [];
        const spacing = canvas.width / (config.points - 1);
        for (let i = 0; i < config.points; i++) {
          points.push({
            x: i * spacing,
            y: centerY + config.offsetY,
            originalY: centerY + config.offsetY,
            amplitude: config.amplitude,
            speed: config.speed,
            frequency: config.frequency,
            phase: Math.random() * Math.PI * 2,
          });
        }
        layers.push({ points, color: config.color });
      });
    }
    initLayers();

    function drawSmoothCurve(points) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    }

    function drawNeonWave(points, baseColor) {
      const steps = [
        { blur: 20, width: 6, alpha: 0.5 },
        { blur: 10, width: 3, alpha: 0.9 },
      ];
      steps.forEach((step) => {
        ctx.strokeStyle = baseColor.replace("1)", step.alpha + ")");
        ctx.lineWidth = step.width;
        ctx.shadowBlur = step.blur;
        ctx.shadowColor = baseColor;
        drawSmoothCurve(points);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      layers.forEach((layer) => {
        layer.points.forEach((p, i) => {
          p.y =
            p.originalY +
            Math.sin(
              Date.now() * p.speed * p.frequency +
                i * p.frequency * 0.3 +
                p.phase
            ) *
              p.amplitude;
        });
        drawNeonWave(layer.points, layer.color);
      });
      requestAnimationFrame(animate);
    }

    animate();
  }

  // ---------------- HTTP Status Cards ----------------
  const statusCards = document.querySelectorAll(".status-code");

  statusCards.forEach((card) => {
    card.addEventListener("click", () => {
      const parent = card.closest(".status-container");
      const resultImg = parent.querySelector(".status-img");
      const msgContainer = parent.querySelector(".status-msg-container");
      const explanation = msgContainer.querySelector(".status-explanation");

      document.querySelectorAll(".status-msg-container").forEach((mc) => {
        if (mc !== msgContainer) mc.classList.remove("show");
      });

      resultImg.src = card.dataset.img;
      explanation.textContent = card.dataset.msg;

      msgContainer.classList.toggle("show");
    });
  });

  // ---------------- Domain Cards Interactive ----------------
  const domainCards = document.querySelectorAll(".domain-card");

  domainCards.forEach((card) => {
    card.addEventListener("click", () => {
      domainCards.forEach((c) => {
        if (c !== card) c.classList.remove("active");
      });
      card.classList.toggle("active");
    });
  });
});
