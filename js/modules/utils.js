import { TweenMax, TimelineMax, Linear, Power1 } from "gsap";

// Constant for all stagger animation
const START_STATE_ANIMATION = {
  y: 30,
  autoAlpha: 0,
};
const END_STATE_ANIMATION = {
  y: 0,
  autoAlpha: 1,
};
const ANIMATION_DURATION = 0.6;
const ANIMTION_STAGGER_TIME = 0.15;

// Custom Event Listener
function pageListener() {
  this.events = {};
}

pageListener.prototype.on = function (eventType, listener) {
  // If the eventType Property not exist yet, create an empty aray of that property
  this.events[eventType] = this.events[eventType] || [];
  this.events[eventType].push(listener);
};

pageListener.prototype.emit = function (eventType, param) {
  if (this.events[eventType] && this.events[eventType].length > 0) {
    // Loop through the events[eventType] array of function and invoke each of them
    this.events[eventType].forEach(function (item) {
      item(param);
    });
  }
};

// Uniform animation of all intro block
const SectionIntroAnimationInit = ($introBlock) => {
  if ($introBlock.length > 0) {
    // Variables
    let $label = $introBlock.find(".section-label");
    let $title = $introBlock.find(".section-title");
    let $decor = $introBlock.find(".section-intro-decor");
    let $descContent = $introBlock.find(".desc-content");
    let $desc = $descContent.find(".desc-link, .section-desc");
    let $cta = $descContent.find(".cta-holder");

    // Condition Check
    let arrayToProcess = [];
    if ($label.length > 0) {
      arrayToProcess.push($label);
    }

    if ($title.length > 0) {
      arrayToProcess.push($title);
    }

    if ($desc.length > 0) {
      arrayToProcess.push($desc);
    }

    if ($cta.length > 0) {
      arrayToProcess.push($cta);
    }

    // if ($decor.length > 0) {
    //   arrayToProcess.push($decor);
    // }

    // Init State

    TweenMax.set(arrayToProcess, { autoAlpha: 0 });

    // Timeline Build
    let AnimationTimeline = new TimelineMax({ paused: true });

    // Start
    AnimationTimeline.add("anim-start");
    AnimationTimeline.staggerFromTo(
      arrayToProcess,
      ANIMATION_DURATION,
      { ...START_STATE_ANIMATION },
      { ...END_STATE_ANIMATION },
      ANIMTION_STAGGER_TIME,
      "anim-start+=0.35"
    );
    AnimationTimeline.add("intro-end");
    AnimationTimeline.fromTo(
      $decor,
      ANIMATION_DURATION * 1.8,
      { ...START_STATE_ANIMATION, x: 30, scale: 0.9 },
      { ...END_STATE_ANIMATION, x: 0, scale: 1, ease: Power1.easeInOut },
      "intro-end-=0.5"
    );

    return AnimationTimeline;
  }
};

const CreateInfiniteAnimation = (
  $el,
  data = {
    TIME_MIN: 18,
    TIME_MAX: 22,
    X_RANGE: 240,
    Y_RANGE: 240,
    MIN_RANGE: 150,
    // DEG_RANGE: 90,
  }
) => {
  // Duration Random
  let dur = data.TIME_MIN + Math.random() * (data.TIME_MAX - data.TIME_MIN);

  // Animation Random X & Y on the element using above duration
  TweenMax.to($el, dur, {
    x:
      (data.MIN_RANGE + (data.X_RANGE - data.MIN_RANGE) * Math.random()) *
      (Math.random() < 0.5 ? -1 : 1),
    y:
      (data.MIN_RANGE + (data.Y_RANGE - data.MIN_RANGE) * Math.random()) *
      (Math.random() < 0.5 ? -1 : 1),
    // rotation: data.DEG_RANGE * Math.random() * (Math.random() < 0.5 ? -1 : 1),
    ease: Linear.easeNone,
    onComplete: () => CreateInfiniteAnimation($el),
  });
};

export {
  pageListener,
  SectionIntroAnimationInit,
  CreateInfiniteAnimation,
  START_STATE_ANIMATION,
  END_STATE_ANIMATION,
  ANIMATION_DURATION,
  ANIMTION_STAGGER_TIME,
};
