/**
 *
 * ████████╗ ██████╗ ██╗   ██╗██████╗  ██████╗ ██╗   ██╗██╗██████╗ ███████╗         ██╗███████╗
 * ╚══██╔══╝██╔═══██╗██║   ██║██╔══██╗██╔════╝ ██║   ██║██║██╔══██╗██╔════╝         ██║██╔════╝
 *    ██║   ██║   ██║██║   ██║██████╔╝██║  ███╗██║   ██║██║██║  ██║█████╗           ██║███████╗
 *    ██║   ██║   ██║██║   ██║██╔══██╗██║   ██║██║   ██║██║██║  ██║██╔══╝      ██   ██║╚════██║
 *    ██║   ╚██████╔╝╚██████╔╝██║  ██║╚██████╔╝╚██████╔╝██║██████╔╝███████╗    ╚█████╔╝███████║
 *    ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝╚═════╝ ╚══════╝     ╚════╝ ╚══════╝
 *
 */

import handleVisitStep, {handleVisitNextStep, handleVisitPrevStep} from "./handlers/handleVisitStep";
import handleAddStep from "./handlers/handleAddStep";
import handleTourStart from "./handlers/handleTourStart";
import handleSetOptions from "./handlers/handleSetOptions";
import handleClose from "./handlers/handleClose";
import handleRefreshTour, {handleRefreshDialog} from "./handlers/handleRefresh";
import handleFinishTour, {delFinishedTour, getIsFinished} from "./handlers/handleFinishTour";
import {createTourGuideDialog} from "./core/dialog";
import {computeBackdropAttributes, createTourGuideBackdrop} from "./core/backdrop";
import {handleOnAfterExit, handleOnAfterStepChange, handleOnBeforeExit, handleOnBeforeStepChange, handleOnFinish} from "./core/callbacks";
import {clickOutsideHandler, handleDestroyListeners, handleInitListeners, keyPressHandler} from "./core/listeners";
import TourGuideOptionsType from "./core/options";
import defaultOptions from "./util/util_default_options";
import computeTourPositions from "./core/positioning";


class TourGuideStepType {
    title?: string
    content!: string | HTMLElement | Element
    target?: HTMLElement | Element | HTMLInputElement | string | null = null
    fixed?: boolean = false
    order?: number = 999
    group?: string = "tour"
    // Enter events
    beforeEnter?: (currentStep: TourGuideStepType, nextStep: TourGuideStepType)=>(void | Promise<unknown>)
    afterEnter?: (currentStep: TourGuideStepType, nextStep: TourGuideStepType)=>(void | Promise<unknown>)
    // Leave events
    beforeLeave?: (currentStep: TourGuideStepType, nextStep: TourGuideStepType)=>(void | Promise<unknown>)
    afterLeave?: (currentStep: TourGuideStepType, nextStep: TourGuideStepType)=>(void | Promise<unknown>)
}


class TourGuideClient implements TourGuideClient{
    /**
     * Primary elements
     */
    backdrop : HTMLElement
    dialog : HTMLElement

    /**
     * Default Attributes
     */
    group: string = ""
    isVisible: boolean = false
    activeStep: number = 0
    tourSteps: TourGuideStepType[] = []
    options: TourGuideOptionsType = defaultOptions
    isFinished = getIsFinished

    /**
     * Constructor
     * @param options
     */
    constructor(options?: TourGuideOptionsType) {
        this.dialog = document.createElement('div')
        this.backdrop = document.createElement('div')
        this.options = defaultOptions
        if(options) Object.assign(this.options, options) // overwrite default options
        // if(steps) this.options.steps = steps // defined steps array
        this.createTourGuideDialog().catch((e)=>{
            if(this.options.debug) console.warn(e)
        })
        this.createTourGuideBackdrop()
    }

    /**
     * Backdrop / Target highlighter
     */
    private createTourGuideBackdrop = createTourGuideBackdrop
    computeBackdropAttributes = computeBackdropAttributes

    /**
     * Dialog
     */
    private createTourGuideDialog = createTourGuideDialog


    /**
     * Methods
      */
    start = handleTourStart // Start the tour - compute steps -> goToStep (checks -> update dialog html, dialog & backdrop) -> initListeners()
    visitStep = handleVisitStep // visit step by stepIndex or `next` | `prev`
    addSteps = handleAddStep // Push new steps to the tour
    nextStep = handleVisitNextStep // navigate to next step - also handles calling finishTour() on final step
    prevStep = handleVisitPrevStep // navigate to previous step
    exit = handleClose // exit the tour
    refresh = handleRefreshTour // Recompute everything including tour guide steps
    refreshDialog = handleRefreshDialog // Recompute the dialog content & backdrop only
    finishTour = handleFinishTour // Set tour as complete in localStorage & exit - pass group key
    updatePositions = computeTourPositions // Set tour as complete in localStorage & exit - pass group key
    deleteFinishedTour = delFinishedTour // Remove a completed tour from localStorage. Pass group key or `all` to clear.
    setOptions = handleSetOptions // Update tour options & refresh dialog + backdrop


    /**
     * Listeners
     */
        // Init
    initListeners = handleInitListeners
    // Destroy
    destroyListeners = handleDestroyListeners
    // Track initialised eventListeners
    _trackedEvents = {
        nextBtnClickEvent: {
            initialized: false,
            fn: this.nextStep.bind(this)
        },
        prevBtnClickEvent: {
            initialized: false,
            fn: this.prevStep.bind(this)
        },
        closeBtnClickEvent: {
            initialized: false,
            fn: this.exit.bind(this)
        },
        keyPressEvent: {
            initialized: false,
            fn: keyPressHandler.bind(this)
        },
        outsideClickEvent: {
            initialized: false,
            fn: clickOutsideHandler.bind(this)
        },
    }


    /**
     * Callbacks
     */
    _globalFinishCallback! : ()=>(void | Promise<unknown>)
    _globalBeforeExitCallback! : ()=>(void | Promise<unknown>)
    _globalAfterExitCallback! : Function
    _globalBeforeChangeCallback! : ()=>(void | Promise<unknown>)
    _globalAfterChangeCallback! : ()=>(void | Promise<unknown>)

    // FINISH
    onFinish = handleOnFinish
    // EXIT
    onBeforeExit = handleOnBeforeExit
    onAfterExit = handleOnAfterExit
    // STEP CHANGE
    onBeforeStepChange = handleOnBeforeStepChange
    onAfterStepChange = handleOnAfterStepChange
}

const TourGuide = (options? : TourGuideOptionsType)=>{
    return new TourGuideClient(options)
}

export default TourGuide
export {
    // Client
    TourGuideClient,
    // Types
    TourGuideStepType,
}