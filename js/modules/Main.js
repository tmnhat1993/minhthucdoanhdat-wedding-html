// Libraries
import ScrollOut from "scroll-out";
import { gsap } from "gsap";

// Ultils
import { pageListener } from "./utils";
import Common from "./_Common";
// + Services
// + Story Mission

export default class Main {
  /* ===================================
   *  CONSTRUCTOR
   * =================================== */
  constructor() {
    // Page Listener
    window.PageListener = new pageListener();

    // TweenMax
    window.gsap = gsap;

    // Ipad devices and below
    window.IS_MOBILE = window.innerWidth > 1080 ? false : true;
    $(window).on("resize", () => {
      window.IS_MOBILE = window.innerWidth > 1080 ? false : true;
    });

    // Common Behavior
    let common = new Common();

    // Bind Event
    this.bindEvents();
  }

  /* ===================================
   *  EVENTS
   * =================================== */
  bindEvents() {
    this.LoadingScreenSetup();

    if ($("#is-invite-page").length > 0) {
      this.OpeningScreenSetup();
    }

    // Scroll Out Detection
    this.ScrollOutSetup();

    // Invitation Submit Setup
    this.InvitationFormSetup();
  }

  /* ===================================
   *  METHODS
   * =================================== */
  ScrollOutSetup() {
    ScrollOut({
      onShown: (el) => {
        // use the web animation API
        // console.log("in: ",$(el).attr("id"));
        let elementID = $(el).attr("id");
        let elementOffset = $(el).offset().top;
        PageListener.emit(`${elementID}-anim`);

        let $el = $(el);
        if ($el.hasClass("appear-anim")) {
          PageListener.emit("show-anim", $el);
        } else {
          if ($el.hasClass("section-anchor")) {
            let $targetParent = $el.parents(".appear-anim");
            PageListener.emit("show-anim", $targetParent);
          }
        }
      },
      threshold: 0.275,
      onHidden: (el) => {
        let elementID = $(el).attr("id");
        PageListener.emit(`${elementID}-hide`);

        let $el = $(el);
        if ($el.hasClass("appear-anim")) {
          PageListener.emit("hide-anim", $el);
        }
      },
    });
  }

  LoadingScreenSetup() {
    // VARIABLES
    let $LoadingScreen = $("#loading-screen");
    let $ThucName = $("#loading-thuc-name");
    let $DatName = $("#loading-dat-name");
    let $BranchImg = $("#loading-branch-img");
    let $GodQuote = $("#loading-god-quote");

    // Animation Timeline
    this.LoadingAnimation = gsap.timeline({
      onComplete: () => {
        PageListener.emit("loading-screen-animation-complete");
      },
    });

    // Animation Setup
    gsap.set([$ThucName, $DatName, $BranchImg, $GodQuote], { alpha: 0 });

    // Animation Build
    this.LoadingAnimation.addLabel("anim-start");
    this.LoadingAnimation.to(
      $BranchImg,
      {
        duration: 1,
        alpha: 1,
      },
      "anim-start+=0.5"
    );
    this.LoadingAnimation.addLabel("branch-appear");
    this.LoadingAnimation.fromTo(
      $ThucName,
      { y: -20, alpha: 0 },
      { y: 0, alpha: 1, duration: 1.25 },
      "branch-appear"
    );
    this.LoadingAnimation.fromTo(
      $DatName,
      { y: 20, alpha: 0 },
      { y: 0, alpha: 1, duration: 1.25 },
      "branch-appear"
    );
    this.LoadingAnimation.addLabel("name-shown");
    this.LoadingAnimation.to($GodQuote, { alpha: 1, duration: 0.75 });

    // Hide On Invite Page
    if ($("#is-invite-page").length > 0) {
      this.LoadingAnimation.to(
        $LoadingScreen,
        { alpha: 0, duration: 1.5 },
        "+=1.25"
      );
    }
  }

  OpeningScreenSetup() {
    // VARIABLES
    let $leftDoor = $("#opening-left-door");
    let $rightDoor = $("#opening-right-door");
    let $MainContent = $("#primary-invitation-content");
    let $LoadingScreen = $("#loading-screen");
    let $OpenScreen = $("#opening-screen");
    let $InviteBanner = $("#invite-banner");
    let $BannerMainIllustration = $InviteBanner.find(".primary-illustration");
    let $BannerContent = $InviteBanner.find(".banner-content");

    console.log($BannerContent);

    // Init State
    gsap.set($MainContent, { autoAlpha: 0 });

    // Animation Timeline
    this.OpeningAnimation = gsap.timeline({
      paused: true,
      onComplete: () => {
        $LoadingScreen.remove();
        $OpenScreen.remove();
      },
    });

    this.OpeningAnimation.addLabel("anim-start");
    this.OpeningAnimation.to(
      $leftDoor,
      {
        duration: 1.5,
        rotateY: 120,
        autoAlpha: 0,
        // skewY: 20,
        scale: 1.3,
      },
      "anim-start+=0.25"
    );
    this.OpeningAnimation.to(
      $rightDoor,
      {
        duration: 1.5,
        rotateY: -120,
        autoAlpha: 0,
        // skewY: -20,
        scale: 1.3,
      },
      "anim-start+=0.25"
    );

    this.OpeningAnimation.fromTo(
      $MainContent,
      { autoAlpha: 0, scale: 1.2 },
      { autoAlpha: 1, scale: 1, duration: 1.5 },
      "anim-start+=0.5"
    );

    if (IS_MOBILE) {
      this.OpeningAnimation.fromTo(
        [$BannerMainIllustration, $BannerContent],
        {
          alpha: 0,
          y: 40,
        },
        {
          alpha: 1,
          y: 0,
          stagger: 0.3,
          duration: 0.75,
        },
        "-=0.3"
      );
    } else {
      gsap.set([$BannerMainIllustration, $BannerContent], { alpha: 0 });
      this.OpeningAnimation.to(
        $BannerMainIllustration,
        {
          alpha: 1,
          duration: 1,
        },
        "-=0.8"
      );
      this.OpeningAnimation.fromTo(
        $BannerContent,
        { alpha: 0, y: 40 },
        {
          alpha: 1,
          y: 0,
          duration: 1,
        },
        "-=0.25"
      );
    }

    PageListener.on("loading-screen-animation-complete", () => {
      this.OpeningAnimation.play();
    });
  }

  InvitationFormSetup() {
    // VARIABLES
    let now = new Date();
    let date =
      now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
    let time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

    let $primaryForm = $("#guest-form");
    let $createAt = $primaryForm
      .find("#created-at-input")
      .val(date + " " + time);

    let $loaderHolder = $("#form-loader-holder");
    let $submitButton = $("#form-submit-btn-holder");
    let $thankyouNote = $("#thankyou-note");

    // EVENTS
    $primaryForm.on("submit", (e) => {
      e.preventDefault();
      // Asign the time
      $loaderHolder.show();
      $submitButton.hide();
      $primaryForm.find("#created-at-input").val(date + " " + time);

      let data = $primaryForm.serialize();

      $.ajax({
        type: "POST",
        url: "https://script.google.com/macros/s/AKfycbzwSHr99nsC8Q_0RjeDnsIsgEIS9Lqqbgwht7zZV3E8ihN3_bytU-urz1l978yOlx8hNg/exec",
        dataType: "json",
        crossDomain: true,
        data: data,
        success: (data) => {
          $primaryForm.hide();
          $thankyouNote.addClass("active");
        },
      });
      // alert();
    });
  }
}
