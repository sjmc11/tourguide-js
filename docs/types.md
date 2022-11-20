##### Docs

Types
=====

Definitions for TourGuide JS.

### TourGuide

TourGuide JS works by initializing a class, it contains all the relevant events, methods & properties.


```ts
{
    // Primary elements
    backdrop : HTMLElement // The backdrop & element highlighter element
    dialog : HTMLElement // The main tour guide dialog
    // Attributes
    group: string = "" // The internal binding value for the active tour group
    isVisible: boolean = false // If the tour guide is visible/active
    activeStep: number = 0 //// The internal binding value for the active tour step (index from 0)
    tourSteps: TourGuideStepType[] = [] // The internal binding value for the tours steps
    options: TourGuideOptionsType = defaultOptions // The internal binding value for tour options
    isFinished = getIsFinished // A getter for if the tour group is completed (fetches from a record in localStorage)
    // Methods
    start: (group?: string) => Promise<unknown> // start method handler
    visitStep: (stepIndex: "next" | "prev" | number) => Promise<unknown> // visitStep method handler
    nextStep: () => Promise<unknown> // nextStep method handler
    prevStep: () => Promise<unknown> // prevStep method handler
    addSteps: (newSteps : TourGuideStep) => Promise<unknown> // addSteps method handler
    exit: () => Promise<void> // exit method handler
    refresh: () => Promise<unknown> // refresh method handler
    refreshDialog: () => Promise<unknown> // refreshDialog method handler
    finishTour: (exit : boolean, tourGroup : string) => Promise<unknown> // finishTour method handler
    updatePositions: () => Promise<unknown> // updatePositions method handler
    setOptions: (options : TourGuideOptions) => Promise<unknown> // setOptions method handler
    // Listeners💡 Only call or modify these for advanced usage
    initListeners: () => Promise<unknown> // Initialise event listeners for click events, keyboard controls etc.
    destroyListeners: () => Promise<unknown> // Destroy event listeners for click events, keyboard controls etc.
    // Callbacks
    _globalFinishCallback! : ()=>(void | Promise<unknown>) // start method handler
    _globalBeforeExitCallback! : ()=>(void | Promise<unknown>) // start method handler
    _globalAfterExitCallback! : Function // start method handler _globalBeforeChangeCallback! : ()=>(void | Promise<unknown>) // start method handler
    _globalAfterChangeCallback! : ()=>(void | Promise<unknown>) // start method handler
}
```

### TourGuideStep

``` ts
{
    title?: string // Tour step title
    content!: string | HTMLElement | Element // Tour step content
    target?: HTMLElement | Element | HTMLInputElement | string | null = null // Element to highlight
    fixed?: boolean = false // Is target element fixed position | default = false
    order?: number = 999 // Order of step in the tour | default = 999
    group?: string = "tour" // Group specific tour steps together | default = 'tour'
    // Enter events
    beforeEnter?: (currentStep: TourGuideStep, nextStep: TourGuideStep)=>(void | Promise<unknown>)
    afterEnter?: (currentStep: TourGuideStep, nextStep: TourGuideStep)=>(void | Promise<unknown>)
    // Leave events
    beforeLeave?: (currentStep: TourGuideStep, nextStep: TourGuideStep)=>(void | Promise<unknown>)
    afterLeave?: (currentStep: TourGuideStep, nextStep: TourGuideStep)=>(void | Promise<unknown>)
}
```

### TourGuideOptions

```ts
{
    autoScroll: boolean// auto scroll to elements | default = true
    autoScrollSmooth: boolean // auto scroll smooth | default = true
    autoScrollOffset: number // Offset from edge for smooth scroll | default = 20
    backdropClass: string // additional css class for tour backdrop | default = ""
    backdropColor: string // RGBA support only | default = "rgba(20,20,21,0.84)"
    targetPadding: number // space around highlighted target in px | default = 30
    backdropAnimate: boolean // animate backdrop position & size | default = true
    dialogClass: string // additional css class for tour dialog | default = ""
    dialogZ: number // z-index of dialog | default = 999
    dialogWidth: number // width style property for dialog - recommended if loading images into content | default = 0
    dialogMaxWidth: number // max-width style property for dialog | default = 340
    dialogAnimate: boolean // Animate dialog position & size | default = true
    closeButton: boolean // show close button | default = true
    nextLabel: string // text for next button | default = "Next"
    prevLabel: string // text for prev button | default = "Back"
    finishLabel: string // text for finish button | default = "Finish"
    hidePrev: boolean // hide prev button | default = false
    hideNext: boolean // hide next button | default = false
    completeOnFinish: boolean // Set tour as finished in localStorage on finish | default = true
    showStepDots: boolean // show the dots tour progress | default = true
    stepDotsPlacement: 'footer' | 'body' // show dots in dialog body/footer | default = "footer"
    showButtons: boolean // show next/prev buttons | default = true
    showStepProgress: boolean // show `1/5` human-readable step progress | default = true
    progressBar: string // show progress bar under dialog header - pass a colour string to enable
    keyboardControls: boolean // show next & prev arrows keys + esc key | default =false
    exitOnEscape: boolean // Close the tour on escape key | default = true
    exitOnClickOutside: boolean // Close the tour on backdrop click | default = true
    rememberStep: boolean // open tour on last active step | default = true
    debug: boolean // show console logging | default = false
    steps: TourGuideStep[] // pre-define the tour steps
}
```