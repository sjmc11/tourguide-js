import {TourGuideClient} from "../Tour";

/**
 * handleOnFinish
 * @param providedCallback
 */
function handleOnFinish (this: TourGuideClient, providedCallback : ()=>(void | Promise<unknown>)){
    if (typeof providedCallback === "function") {
        this._globalFinishCallback = providedCallback;
    } else {
        throw new Error(
            "Provided callback for onFinish was not a function"
        );
    }
    // return this;
}

/**
 * handleOnBeforeExit
 * @param providedCallback
 */
function handleOnBeforeExit(this : TourGuideClient, providedCallback : ()=>(void | Promise<unknown>)) {
    if (typeof providedCallback === "function") {
        this._globalBeforeExitCallback = providedCallback
    } else {
        throw new Error("Provided callback for onBeforeExit was not a function");
    }
    // return this;
}

/**
 * handleOnAfterExit
 * @param providedCallback
 */
function handleOnAfterExit(this : TourGuideClient, providedCallback : ()=>(void | Promise<unknown>)) {
    if (typeof providedCallback === "function") {
        this._globalAfterExitCallback = providedCallback
    } else {
        throw new Error("Provided callback for onAfterExit was not a function");
    }
    // return this;
}

/**
 * handleOnBeforeStepChange
 * @param providedCallback
 */
function handleOnBeforeStepChange(this : TourGuideClient, providedCallback : ()=>(void | Promise<unknown>)) {
    if (typeof providedCallback === "function") {
        this._globalBeforeChangeCallback = providedCallback
    } else {
        throw new Error("Provided callback for onBeforeStepChange was not a function");
    }
    // return this;
}

/**
 * handleOnAfterStepChange
 * @param providedCallback
 */
function handleOnAfterStepChange(this : TourGuideClient, providedCallback : ()=>(void | Promise<unknown>)) {
    if (typeof providedCallback === "function") {
        this._globalAfterChangeCallback = providedCallback
    } else {
        throw new Error("Provided callback for onAfterStepChange was not a function");
    }
    // return this;
}

export {
    handleOnFinish,
    handleOnBeforeExit,
    handleOnAfterExit,
    handleOnBeforeStepChange,
    handleOnAfterStepChange
}