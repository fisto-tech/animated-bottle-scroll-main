// Wait until the full DOM is loaded before running scripts
window.addEventListener("DOMContentLoaded", () => {
  // Register ScrollTrigger plugin from GSAP
  gsap.registerPlugin(ScrollTrigger);

  const header = document.querySelector("header");

  // ==========================
  // Mobile Menu Toggle
  // ==========================

  // Toggles mobile nav visibility on hamburger click
  function toggleMobileNav() {
    document.getElementById("mobileMenu").classList.toggle("show");
  }

  // Expose function globally to use in inline HTML
  window.toggleMobileNav = toggleMobileNav;

  // ==========================
  // Initial Page Load Animations
  // ==========================

  function runInitialAnimations() {
    // Create a timeline with default easing
    const onLoadTl = gsap.timeline({ defaults: { ease: "power2.out" } });

    onLoadTl
      // Animate header border width expansion
      .to(
        "header",
        {
          "--border-width": "100%",
          duration: 3,
        },
        0
      )
      // Slide in desktop nav links animation removed to prevent disappearing links
      // Animate sidebar border height
      .to(
        ".social-sidebar",
        {
          "--border-height": "100%",
          duration: 10,
        },
        0
      )
      // Fade in hero heading
      .to(
        ".hero-content h1",
        {
          opacity: 1,
          duration: 1,
        },
        0
      )
      // Animate text color (if needed, though already primary)
      .to(
        ".hero-content h1",
        {
          delay: 0.5,
          duration: 1.2,
          color: "var(--primary)",
        },
        0
      )
      // Slide in each line of the heading from the right
      .from(
        ".hero-content .line",
        {
          x: 100,
          delay: 1,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        },
        0
      )
      // Reveal the bottle wrapper
      .to(
        ".hero-bottle-wrapper",
        {
          opacity: 1,
          scale: 1,
          delay: 1.5,
          duration: 1.3,
          ease: "power3.out",
        },
        0
      );
  }

  // ==========================
  // Reusable Scroll-Based Animation Setup
  // ==========================

  function pinAndAnimate({
    trigger,
    endTrigger,
    pin,
    animations,
    markers = false,
    headerOffset = 0,
  }) {
    // Define scroll end position with header offset
    const end = `top top+=${headerOffset}`;

    // Create a GSAP timeline connected to ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: `top top+=${headerOffset}`,
        endTrigger,
        end,
        scrub: true,
        pin,
        pinSpacing: false,
        markers: markers, // for debugging
        invalidateOnRefresh: true, // ensures recalculation on resize
      },
    });

    // Loop through each animation object
    animations.forEach(({ target, vars, position = 0 }) => {
      tl.to(target, vars, position);
    });
  }

  // ==========================
  // ScrollTrigger Configurations for Desktop & Mobile
  // ==========================

  function setupScrollAnimations() {
    const headerOffset = header.offsetHeight - 1;

    // Use matchMedia to handle responsive behaviors
    ScrollTrigger.matchMedia({
      // Desktop scroll animations
      "(min-width: 769px)": function () {
        // 1. Bottle animates on scroll from hero to intro
        pinAndAnimate({
          trigger: ".hero",
          endTrigger: ".section-intro",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: 0, scale: 0.8 } },
          ],
          headerOffset,
        });

        // 2. Bottle shifts right during the intro section
        pinAndAnimate({
          trigger: ".section-intro",
          endTrigger: ".black-spacer",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: 10, scale: 0.7 } },
            { target: ".hero-bottle-wrapper", vars: { x: "30%" } },
          ],
          markers: false,
          headerOffset,
        });

        // 3. Bottle shifts left during Section 3
        pinAndAnimate({
          trigger: ".timeline-section",
          endTrigger: ".timeline-section-2",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: -10, scale: 0.7 } },
            { target: ".hero-bottle-wrapper", vars: { x: "-25%" } },
          ],
          markers: false,
          headerOffset,
        });
      },

      // Mobile scroll animations (watermark effect so it doesn't affect text)
      "(max-width: 768px)": function () {
        gsap.to(".hero-bottle-wrapper", {
          opacity: 1,
          duration: 1,
          delay: 0.5,
        });

        // 1. Bottle animates on scroll from hero to intro
        pinAndAnimate({
          trigger: ".hero",
          endTrigger: ".section-intro",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: 20, scale: 1 } },
          ],
          headerOffset,
        });

        // 2. Bottle shifts slightly during the intro section
        pinAndAnimate({
          trigger: ".section-intro",
          endTrigger: ".black-spacer",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: 5, scale: 0.5 } },
            { target: ".hero-bottle-wrapper", vars: { x: "15%" } },
          ],
          markers: false,
          headerOffset,
        });

        // 3. Bottle shifts left slightly during Section 3
        pinAndAnimate({
          trigger: ".timeline-section",
          endTrigger: ".timeline-section-2",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: -5, scale: 0.5 } },
            { target: ".hero-bottle-wrapper", vars: { x: "-15%" } },
          ],
          markers: false,
          headerOffset,
        });
      },
    });
  }

  // ==========================
  // Text Animations
  // ==========================
  function setupTextAnimations() {
    // Select text elements in Section 2
    const introElements = gsap.utils.toArray(
      ".section-intro .intro-left > *, .section-intro .feature-item"
    );

    // Initial state: slightly down and invisible
    gsap.set(introElements, { y: 30, opacity: 0 });

    ScrollTrigger.create({
      trigger: ".section-intro",
      start: "top 65%",
      onEnter: () => {
        gsap.to(introElements, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        });
      },
      once: true,
    });
  }

  // ==========================
  // Init Everything on Load
  // ==========================

  runInitialAnimations(); // Load-in animations
  setupScrollAnimations(); // Scroll-based animations
  setupTextAnimations(); // Fade in text on scroll

  // Make header translucent when scrolling into the dark timeline sections
  ScrollTrigger.create({
    trigger: ".section-intro",
    start: "top 100px", // Trigger right when it goes under the header
    onEnter: () => header.classList.add("scrolled"),
    onLeaveBack: () => header.classList.remove("scrolled"),
  });

  // Final recalculation for all ScrollTriggers
  ScrollTrigger.refresh();

  // ==========================
  // Section 5 Flip Animation
  // ==========================
  const triggerFlipOnScroll = (galleryEl, options) => {
    let settings = {
      flip: {
        absoluteOnLeave: false,
        absolute: false,
        scale: true,
        simple: true,
      },
      scrollTrigger: {
        start: 'center center',
        end: '+=100%',
      },
      stagger: 0
    };

    settings = Object.assign({}, settings, options);

    // Select our specific text container and items
    const galleryCaption = galleryEl.querySelector('.s5-text-container');
    const galleryItems = galleryEl.querySelectorAll('.s5-item');

    // Temporarily add the class to capture the target state
    galleryEl.classList.add('s5-gallery--switch');
    const flipstate = Flip.getState([galleryItems, galleryCaption], { props: 'filter, opacity, transform' });

    // Remove the class to revert to initial state (stacked)
    galleryEl.classList.remove('s5-gallery--switch');

    // Create Flip animation linked to ScrollTrigger
    Flip.to(flipstate, {
      ease: 'power1.inOut',
      absoluteOnLeave: settings.flip.absoluteOnLeave,
      absolute: settings.flip.absolute,
      scale: settings.flip.scale,
      simple: settings.flip.simple,
      scrollTrigger: {
        trigger: galleryEl,
        start: settings.scrollTrigger.start,
        end: settings.scrollTrigger.end,
        pin: false, // Don't pin the whole section, let it scroll naturally or adjust if needed
        scrub: true,
      },
      stagger: settings.stagger
    });
  };

  const galleryElement = document.querySelector('.s5-gallery-container');
  if (galleryElement) {
    triggerFlipOnScroll(galleryElement, {
      flip: { absoluteOnLeave: true, scale: false },
      scrollTrigger: { start: 'top 80%', end: 'center center' } // Trigger while scrolling down into it
    });
  }

});
