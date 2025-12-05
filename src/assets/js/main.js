(function () {
  // JS Loaded
  document.body.classList.add("js-loaded");

 

  // =========================
  // Testimonials Swiper
  // =========================
  const testimonialEl = document.querySelector(".testimonials-swiper");

  if (testimonialEl && typeof Swiper !== "undefined") {
    const counterEl = document.getElementById("testimonials-counter");
    const progressEl = document.getElementById("testimonials-progress");

    const swiper = new Swiper(".testimonials-swiper", {
      loop: false,
      slidesPerView: 1,
      autoHeight: true,
      speed: 600,
      navigation: {
        nextEl: ".js-testimonial-next",
        prevEl: ".js-testimonial-prev",
      },
      on: {
        init(swiper) {
          updateCounter(swiper);
          updateProgress(swiper);
        },
        slideChange(swiper) {
          updateCounter(swiper);
          updateProgress(swiper);
        },
      },
    });

    function updateCounter(swiper) {
      if (!counterEl) return;
      const total = swiper.slides.length - (swiper.loop ? swiper.loopedSlides * 2 : 0);
      const current = swiper.realIndex + 1;
      const formatted = `${String(current).padStart(2, "0")}/${String(total).padStart(2, "0")}`;
      counterEl.textContent = formatted;
    }

    function updateProgress(swiper) {
      if (!progressEl) return;
      const total = swiper.slides.length - (swiper.loop ? swiper.loopedSlides * 2 : 0);
      const current = swiper.realIndex + 1;
      const percent = (current / total) * 100;
      progressEl.style.width = `${percent}%`;
    }
  }

  // =========================
  // Team Swiper
  // =========================
  const teamEl = document.querySelector(".team-swiper");

  if (teamEl && typeof Swiper !== "undefined") {
    const swiper = new Swiper(teamEl, {
      loop: false,
      speed: 600,
      spaceBetween: 32,
      autoHeight: true,
      navigation: {
        nextEl: ".js-team-next",
        prevEl: ".js-team-prev",
      },
      slidesPerView: 1,
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 32,
        },
      },
    });
  }



  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

  //  Smoother 
  const smoother = ScrollSmoother.create({
    smooth: 2,
    effects: true,
  });


  // =========================
  // Header Animation
  // =========================
  const initShowHideHeader = () => {
    const header = document.querySelector('#header');
    const showHeaderAnim = gsap.from(header, {
        yPercent: -100,
        paused: true,
        duration: 0.3
    }).progress(1);

    ScrollTrigger.create({
        trigger: "#header",
        start: `bottom top`,
        // markers: true,
        end: 99999,
        onUpdate: (self) => {
            self.direction === -1 ? showHeaderAnim.play() : showHeaderAnim.reverse();
        }
    });

}
initShowHideHeader();



  // -----------------------
  // Back To Top
  // ------------------------
  const backToTopBtn = document.querySelector("[data-backtotop]");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      smoother.scrollTo(0, true);
    });
  }
 

 // -----------------------
// SplitText: heading + paragraph per section
// -----------------------
document.fonts.ready.then(() => {
  gsap.utils.toArray("section").forEach((section) => {
    const heading = section.querySelectorAll(".animate-heading");
    const paragraph = section.querySelectorAll(".animate-paragraph");

    if (!heading.length && !paragraph.length) return;

    let splitHeading, splitParagraph;

    if (heading.length) {
      splitHeading = SplitText.create(heading, {
        type: "lines, words",
        linesClass: "line",
        mask: "words",
      });
    }

    if (paragraph.length) {
      splitParagraph = SplitText.create(paragraph, {
        type: "lines, words",
        linesClass: "line",
        mask: "words",
      });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        once: true,
      },
    });
 
    if (splitHeading) {
      tl.fromTo(
        splitHeading.lines,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          opacity: 0,
          yPercent: 200,
          scaleX: 0.95,
          rotateX: 60
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          yPercent: 0,
          scaleX: 1,
          duration: 1.2,
          stagger: 0.1,
          rotateX: 0,
          transformOrigin: "50% 100%",
          ease: "expo.out",
          delay: 0.2
        }
      );
    }
  
    if (splitParagraph) {
      tl.from(
        splitParagraph.lines,
        {
          duration: 1.0,
          yPercent: 100,
          opacity: 0,
          clipPath: "inset(0% 0% 100% 0%)",
          transformOrigin: "50% 100%",
          stagger: 0.08,
          ease: "expo.out",
        },
        "-=0.8"  
      );
    }
  });

   
  ScrollTrigger.refresh();
});

 
// -----------------------
// Fade-In per section
// -----------------------
gsap.utils.toArray("section").forEach((section) => {
  const fadeInEls = section.querySelectorAll(".animate-fade-in");
  if (!fadeInEls.length) return;

  gsap.from(fadeInEls, {
    scrollTrigger: {
      trigger: section,
      start: "top center",
      once: true,
    },
    opacity: 0,
    duration: 1.5,
    stagger: 0.15,
    ease: "power2.out",
  });
});

// -----------------------
// Fade-In-Up per section
// -----------------------
gsap.utils.toArray("section").forEach((section) => {
  const fadeInUpEls = section.querySelectorAll(".animate-fade-in-up");
  if (!fadeInUpEls.length) return;

  gsap.from(fadeInUpEls, {
    scrollTrigger: {
      trigger: section,
      start: "top center",
      once: true,
    },
    opacity: 0,
    y: 40,
    duration: 1.5,
    stagger: 0.15,
    ease: "power3.out",
  });
});


// -----------------------
// Timeline section
// -----------------------
const initTimeline = () => {
  const section = document.querySelector('[data-timeline-section]');
  if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const timeline = section.querySelector('[data-timeline]');
  const dot = section.querySelector('[data-timeline-dot]');
  const yearEls = Array.from(section.querySelectorAll('[data-timeline-year]'));
  const entries = Array.from(section.querySelectorAll('[data-timeline-entry]'));
  const entriesWrapper = section.querySelector('[data-timeline-entries]');

  // need same number + wrapper
  if (!timeline || !dot || !entriesWrapper || yearEls.length === 0 || yearEls.length !== entries.length) return;

  // ----------------------
  // dot positions
  // ----------------------
  const getPositions = () => {
    const barRect = timeline.getBoundingClientRect();
    return yearEls.map((year) => {
      const r = year.getBoundingClientRect();
      return r.left + r.width / 2 - barRect.left;
    });
  };

  let positions = getPositions();

  const moveDot = gsap.quickTo(dot, 'x', {
    duration: 0.6,
    ease: 'power2.out',
  });

  // ----------------------
  // active state
  // ----------------------
  let currentIndex = 0;

  const setActive = (index) => {
    if (index === currentIndex) return;
    currentIndex = index;

    // labels
    yearEls.forEach((el, i) => el.classList.toggle('is-active', i === index));

    // fade entries
    entries.forEach((entry, i) => {
      gsap.to(entry, {
        autoAlpha: i === index ? 1 : 0,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    // move dot
    moveDot(positions[index]);
  };

  // initial visibility
  entries.forEach((entry, i) => {
    gsap.set(entry, { autoAlpha: i === 0 ? 1 : 0 });
  });

  // ----------------------
  // auto height for wrapper
  // ----------------------
  const resizeWrapper = () => {
    let maxH = 0;

    entries.forEach((entry) => {
      const prevPos = entry.style.position;
      const prevTop = entry.style.top;
      const prevLeft = entry.style.left;
      const prevRight = entry.style.right;
      const prevBottom = entry.style.bottom;

      // temporarily make it part of normal flow
      entry.style.position = 'static';
      entry.style.top = entry.style.left = entry.style.right = entry.style.bottom = '';

      const h = entry.offsetHeight;
      if (h > maxH) maxH = h;

      // restore absolute positioning
      entry.style.position = prevPos || 'absolute';
      entry.style.top = prevTop || '0';
      entry.style.left = prevLeft || '0';
      entry.style.right = prevRight || '0';
      entry.style.bottom = prevBottom || '0';
    });

    entriesWrapper.style.height = maxH + 'px';
  };

  // first height calculation (after layout)
  resizeWrapper();

  // ----------------------
  // ONE ScrollTrigger controlling all steps
  // ----------------------
  ScrollTrigger.create({
    trigger: section,
    start: '+=10% top',
    end: () => '+=' + (window.innerHeight * 0.5 * (entries.length - 1)),
    pin: true,
    scrub: true,
    // markers: true,
    onUpdate: (self) => {
      const step = Math.round(self.progress * (entries.length - 1));
      const clamped = Math.min(entries.length - 1, Math.max(0, step));
      setActive(clamped);
    },
  });

  // Recalculate dot positions + wrapper height on resize / refresh
  const recalc = () => {
    positions = getPositions();
    moveDot(positions[currentIndex]);
    resizeWrapper();
  };

  window.addEventListener('resize', recalc);
  ScrollTrigger.addEventListener('refreshInit', recalc);

  // also re-run after full load (images)
  window.addEventListener('load', () => {
    recalc();
    ScrollTrigger.refresh();
  });

  // initial dot + label state
  yearEls.forEach((el, i) => el.classList.toggle('is-active', i === 0));
  moveDot(positions[0]);
};

initTimeline();

})();