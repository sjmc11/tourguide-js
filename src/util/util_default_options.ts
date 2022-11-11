import TourGuideOptionsType from "../core/options";

const defaultOptions = {
    nextLabel: "Next",
    prevLabel: "Back",
    finishLabel: "Finish",
    hidePrev: false,
    hideNext: false,
    dialogClass: "",
    dialogZ: 999,
    dialogWidth: 0,
    dialogMaxWidth: 340,
    dialogAnimate: true,
    dialogPlacement: undefined,
    backdropClass: "",
    backdropColor: "rgba(20,20,21,0.84)",
    backdropAnimate: true,
    targetPadding: 30,
    completeOnFinish: true,
    showStepDots: true,
    stepDotsPlacement: "footer",
    showButtons: true,
    showStepProgress: true,
    keyboardControls: false,
    exitOnEscape: true,
    exitOnClickOutside: true,
    autoScroll: true,
    autoScrollSmooth: true,
    autoScrollOffset: 20,
    closeButton: true,
    rememberStep: false,
    debug: true,
    steps: []
} as TourGuideOptionsType

export default defaultOptions