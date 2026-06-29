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
        scrub: 1.5, // Added 1.5s smoothing (shock absorber) so animations play smoothly on fast scroll
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
            { target: ".hero-bottle", vars: { rotate: 0, scale: 0.8, duration: 1 }, position: 0 },
            // Lift and bounce for Jungle Rock mapped to scroll timeline
            { target: ".hero-bottle", vars: { y: "-15%", duration: 0.2 }, position: 0.6 },
            { target: ".hero-bottle", vars: { y: "0%", duration: 0.15, ease: "power1.in" }, position: 0.8 },
            { target: ".hero-bottle", vars: { y: "-4%", duration: 0.1, ease: "power1.out" }, position: 0.95 },
            { target: ".hero-bottle", vars: { y: "0%", duration: 0.05, ease: "power1.in" }, position: 1.05 }
          ],
          headerOffset,
        });

        // 2. Bottle stays straight during the intro section and black image section
        pinAndAnimate({
          trigger: ".section-intro",
          endTrigger: ".timeline-section",
          pin: ".hero-bottle-wrapper",
          animations: [
            // Straighten and move to center over the first half of the section
            { target: ".hero-bottle", vars: { rotate: 0, scale: 0.8, duration: 0.5 }, position: 0 },
            { target: ".hero-bottle-wrapper", vars: { x: "0%", duration: 0.5 }, position: 0 },
            // Lift and bounce for Black Stone mapped to scroll timeline
            { target: ".hero-bottle", vars: { y: "-15%", duration: 0.2 }, position: 0.6 },
            { target: ".hero-bottle", vars: { y: "0%", duration: 0.15, ease: "power1.in" }, position: 0.8 },
            { target: ".hero-bottle", vars: { y: "-4%", duration: 0.1, ease: "power1.out" }, position: 0.95 },
            { target: ".hero-bottle", vars: { y: "0%", duration: 0.05, ease: "power1.in" }, position: 1.05 }
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
            { target: ".hero-bottle", vars: { rotate: 0, scale: 0.7, y: "20%", duration: 1 }, position: 0 },
            // Shift right extremely quickly at the very beginning on the bottle itself
            { target: ".hero-bottle", vars: { x: "8%", duration: 0.05 }, position: 0 },
          ],
          markers: false,
          headerOffset,
        });

        // Removed Block 4 to allow the bottle to land on the river image and scroll up with it.
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
            { target: ".hero-bottle", vars: { rotate: 0, scale: 1 } },
          ],
          headerOffset,
        });

        // 2. Bottle stays straight during the intro section and black image section
        pinAndAnimate({
          trigger: ".section-intro",
          endTrigger: ".timeline-section",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: 0, scale: 0.5, duration: 1 }, position: 1 },
            { target: ".hero-bottle-wrapper", vars: { x: "0%", duration: 1 }, position: 1 },
          ],
          markers: false,
          headerOffset,
        });

        // 3. Bottle stays straight during Section 3 and Section 4
        pinAndAnimate({
          trigger: ".timeline-section",
          endTrigger: ".timeline-section-2",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: 0, scale: 0.5, y: "25%", duration: 1 } },
            { target: ".hero-bottle-wrapper", vars: { x: "0%", duration: 1 } },
          ],
          markers: false,
          headerOffset,
        });

        // 4. Section 4 Text Cards move horizontally automatically when in view
        const s4Right = document.querySelector(".section4-right");
        if (s4Right) {
          if (!s4Right.classList.contains('marquee-cloned')) {
            const originalChildren = Array.from(s4Right.children);

            const wrapper1 = document.createElement('div');
            wrapper1.className = 'marquee-wrapper';

            originalChildren.forEach(child => wrapper1.appendChild(child));
            s4Right.appendChild(wrapper1);

            const wrapper2 = wrapper1.cloneNode(true);
            s4Right.appendChild(wrapper2);

            s4Right.classList.add('marquee-cloned');
          }

          gsap.fromTo(s4Right,
            { x: 0 },
            {
              xPercent: -50,
              ease: "none",
              duration: 10,
              repeat: -1,
              scrollTrigger: {
                trigger: ".timeline-section-3",
                start: "top bottom",
                end: "bottom top",
                toggleActions: "play pause resume pause"
              }
            }
          );
        }
      },
    });
  }

  // ==========================
  // Feature Points Animation
  // ==========================
  function setupFeatureAnimations() {
    gsap.from(".feature-item", {
      scrollTrigger: {
        trigger: ".section-intro",
        start: "top 60%", // Trigger when section-intro top reaches 60% down the viewport
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    });
  }

  // ==========================
  // Intro Text Animation (Left to Right)
  // ==========================
  function setupIntroTextAnimations() {
    gsap.from(".intro-left > *", {
      scrollTrigger: {
        trigger: ".section-intro",
        start: "top 60%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      x: -50,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    });
  }

  // ==========================
  // Section 4 Text Animation (Left to Right)
  // ==========================
  function setupSection4TextAnimations() {
    ScrollTrigger.matchMedia({
      "(min-width: 769px)": function () {
        gsap.from(".section4-left > *", {
          scrollTrigger: {
            trigger: ".timeline-section-3",
            start: "top 60%",
            toggleActions: "play none none none"
          },
          opacity: 0,
          x: -50,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out"
        });
      },
      "(max-width: 768px)": function () {
        gsap.set(".section4-left > *", { opacity: 0, y: -50 });

        ScrollTrigger.create({
          trigger: ".timeline-section-3",
          start: "top 60%",
          once: true,
          onEnter: () => {
            const section = document.querySelector(".timeline-section-3");
            const video = section ? section.querySelector("video") : null;

            if (video) {
              video.currentTime = 0;
              video.play().catch(() => { });

              let lastTime = -1;
              const onTimeUpdate = () => {
                if (lastTime !== -1 && (video.currentTime < lastTime || (video.duration && video.currentTime >= video.duration - 0.2))) {
                  video.removeEventListener("timeupdate", onTimeUpdate);
                  gsap.to(".section4-left > *", {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out"
                  });
                }
                lastTime = video.currentTime;
              };
              video.addEventListener("timeupdate", onTimeUpdate);
            } else {
              gsap.to(".section4-left > *", {
                opacity: 1,
                y: 0,
                delay: 2,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
              });
            }
          }
        });
      }
    });
  }

  // ==========================
  // Timeline Text Animation (Right to Left)
  // ==========================
  function setupTimelineTextAnimations() {
    gsap.from(".timeline-section-2 .feature-right", {
      scrollTrigger: {
        trigger: ".timeline-section-2",
        start: "top 100px", // Trigger exactly when the section hits the top (when bottle stops)
        toggleActions: "play none none none"
      },
      opacity: 0,
      x: 100, // From right to left
      duration: 1,
      ease: "power2.out"
    });
  }

  // ==========================
  // Init Everything on Load
  // ==========================

  runInitialAnimations(); // Load-in animations
  setupScrollAnimations(); // Scroll-based animations
  setupFeatureAnimations(); // Feature points staggered animation
  setupIntroTextAnimations(); // Left to right text animation (Intro)
  setupSection4TextAnimations(); // Left to right text animation (Section 4)
  setupTimelineTextAnimations(); // Right to left text animation (Section 2)

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
  const triggerFlipOnScroll = (galleryEl) => {
    const galleryCaption = galleryEl.querySelector('.s5-text-container');

    let itemsArray = [
      galleryEl.querySelector('.s5-item-1'),
      galleryEl.querySelector('.s5-item-2'),
      galleryEl.querySelector('.s5-item-3'),
      galleryEl.querySelector('.s5-item-4'),
      galleryEl.querySelector('.s5-item-5')
    ];

    const positions = [
      { left: "16%", width: "12%", height: "70%", top: "15%", zIndex: 3, rotationY: 45, z: 0 },
      { left: "32%", width: "15%", height: "85%", top: "7.5%", zIndex: 4, rotationY: 30, z: 0 },
      { left: "50%", width: "18%", height: "100%", top: "0%", zIndex: 5, rotationY: 0, z: 30 },
      { left: "68%", width: "15%", height: "85%", top: "7.5%", zIndex: 4, rotationY: -30, z: 0 },
      { left: "84%", width: "12%", height: "70%", top: "15%", zIndex: 3, rotationY: -45, z: 0 }
    ];

    const tl = gsap.timeline({ paused: true });

    // Initial spread animation
    itemsArray.forEach((item, index) => {
      tl.to(item, {
        left: positions[index].left,
        width: positions[index].width,
        height: positions[index].height,
        top: positions[index].top,
        zIndex: positions[index].zIndex,
        rotationY: positions[index].rotationY,
        z: positions[index].z,
        xPercent: -50,
        x: 0,
        ease: 'power1.inOut',
        duration: 1
      }, 0);
    });

    // Caption animation
    tl.to(galleryCaption, {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      duration: 1,
      ease: 'power1.inOut'
    }, 0);

    // Auto-carousel loop
    tl.eventCallback("onComplete", () => {
      setInterval(() => {
        // Shift items so they move in a carousel
        const firstItem = itemsArray.shift();
        itemsArray.push(firstItem);

        itemsArray.forEach((item, index) => {
          gsap.to(item, {
            left: positions[index].left,
            width: positions[index].width,
            height: positions[index].height,
            top: positions[index].top,
            zIndex: positions[index].zIndex,
            rotationY: positions[index].rotationY,
            z: positions[index].z,
            ease: "back.out(1.2)",
            duration: 0.6
          });
        });
      }, 2000);
    });

    ScrollTrigger.create({
      trigger: galleryEl,
      start: 'top 60%',
      once: true,
      onEnter: () => tl.play()
    });
  };

  const galleryElement = document.querySelector('.s5-gallery-container');
  if (galleryElement) {
    triggerFlipOnScroll(galleryElement);
  }

  // ==========================
  // Color Card Click Handler
  // ==========================
  const colorCards = document.querySelectorAll('.color-card');
  const heroBottle = document.querySelector('.hero-bottle');

  if (colorCards.length > 0 && heroBottle) {
    // 1. Preload all bottle images in the background so they swap instantly
    colorCards.forEach(card => {
      const src = card.getAttribute('data-bottle');
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });

    colorCards.forEach(card => {
      card.addEventListener('click', function () {
        // Remove active class and indicator from all cards
        colorCards.forEach(c => {
          c.classList.remove('active');
          const indicator = c.querySelector('.active-indicator');
          if (indicator) indicator.remove();
        });

        // Add active class and indicator to clicked card
        this.classList.add('active');
        const indicator = document.createElement('div');
        indicator.className = 'active-indicator';
        this.appendChild(indicator);

        // Update the bottle image
        const newBottleSrc = this.getAttribute('data-bottle');
        if (newBottleSrc) {
          // 2. Fade out incredibly fast, swap, then fade in fast for a snappy feel
          gsap.to(heroBottle, {
            opacity: 0,
            duration: 0.05,
            onComplete: () => {
              heroBottle.src = newBottleSrc;
              gsap.to(heroBottle, { opacity: 1, duration: 0.15 });
            }
          });
        }
      });
    });
  }
});
