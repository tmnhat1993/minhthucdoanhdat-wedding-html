export default class Common {
  /* ===================================
   *  CONSTRUCTOR
   * =================================== */
  constructor() {
    this.bindEvents();
  }

  /* ===================================
   *  EVENTS
   * =================================== */
  bindEvents() {
    // Smooth Scrolling Setup
    this.CommonAppearAnimationSetup();
  }

  /* ===================================
   *  METHODS
   * =================================== */

  CommonAppearAnimationSetup() {
    const STARTER_STATE = {
      y: 30,
      x: 0,
      scale: 1,
      autoAlpha: 0,
    };

    const END_STATE = {
      y: 0,
      x: 0,
      scale: 1,
      autoAlpha: 1,
    };

    // Set Initial State Of Animation Elements
    let $AppearAnimSection = $(".appear-anim").toArray();
    $AppearAnimSection.forEach((section) => {
      let $section = $(section);
      let $AnimTargets = $section.find(".anim-target").toArray();

      $AnimTargets.forEach(($animTarget) => {
        let $target = $($animTarget);
        let startState = {
          y: $target.data("start-y") == 0 ? 0 : STARTER_STATE.y,
          x: $target.data("start-x")
            ? $target.data("start-x")
            : STARTER_STATE.x,
          scale: $target.data("start-scale")
            ? $target.data("start-scale")
            : STARTER_STATE.scale,
          autoAlpha: 0,
        };

        gsap.set($target, startState);
      });
    });

    // Show Animation
    PageListener.on("show-anim", ($el) => {
      if (!$el.hasClass("showed")) {
        let $AnimTargets = $el.find(".anim-target").toArray();

        $AnimTargets.forEach(($animTarget) => {
          let $target = $($animTarget);
          let startState = {
            y: $target.data("start-y") == 0 ? 0 : STARTER_STATE.y,
            x: $target.data("start-x")
              ? $target.data("start-x")
              : STARTER_STATE.x,
            scale: $target.data("start-scale")
              ? $target.data("start-scale")
              : STARTER_STATE.scale,
            autoAlpha: 0,
          };

          gsap.set($target, startState);
        });

        gsap.to($AnimTargets, {
          ...END_STATE,
          duration: 0.75,
          stagger: 0.25,
          onComplete: () => {
            $el.addClass("showed");
          },
        });
      }
    });
  }
}
