import {TourGuideClient} from "../Tour";

/**
 * clickOutsideHandler
 * @param event : MouseEvent
 */
const clickOutsideHandler = async function (this : TourGuideClient, event: MouseEvent){
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()

    // abort if did not click an element
    if (!(event.target instanceof Element)) return

    // Ignore clicks inside backdrop focus area
    const backdropRect = this.backdrop.getBoundingClientRect()
    if (event.clientX >= backdropRect.x && event.clientX <= (backdropRect.x + backdropRect.width) && event.clientY >= backdropRect.y && event.clientY <= (backdropRect.y + backdropRect.height)) return;

    // Ignore clicks inside dialog area
    const dialogRect = this.dialog.getBoundingClientRect()
    if (event.clientX >= dialogRect.x && event.clientX <= (dialogRect.x + dialogRect.width) && event.clientY >= dialogRect.y && event.clientY <= (dialogRect.y + dialogRect.height)) return;

    // Ignore clicks on the dialog
    if (this.dialog.contains(event.target)) return

    await this.exit()
}

/**
 * keyPressHandler
 * @param event : KeyboardEvent
 */
const keyPressHandler = async function (this : TourGuideClient, event: KeyboardEvent){

    // Still handle options independently as keyPress handler is enabled when either options detected

    // Escape
    if (event.key === "Escape" && this.options.exitOnEscape) {
        event.preventDefault()
        await this.exit()
        return;
    }
    // Next
    if (event.key === "ArrowRight" && this.options.keyboardControls) {
        event.preventDefault()
        this.visitStep("next").catch((e) => {
            if (this.options.debug) console.warn(e)
        })
        return;
    }
    // Prev
    if (event.key === "ArrowLeft" && this.options.keyboardControls) {
        event.preventDefault()
        this.visitStep("prev").catch((e) => {
            if (this.options.debug) console.warn(e)
        })
        return;
    }
}

/**
 * handleInitListeners
 */
function handleInitListeners(this : TourGuideClient) {

    /** Next btn **/
    const initNextBtnListener = ()=>{
        let nextBtn = document.getElementById("tg-dialog-next-btn");
        if (!nextBtn || this._trackedEvents['nextBtnClickEvent'].initialized) return
        nextBtn.addEventListener("click", this._trackedEvents.nextBtnClickEvent.fn)
        this._trackedEvents['nextBtnClickEvent'].initialized = true
    }

    /** Prev btn **/
    const initPrevBtnListener = ()=>{
        let prevBtn = document.getElementById("tg-dialog-prev-btn");
        if (!prevBtn || this._trackedEvents['prevBtnClickEvent'].initialized) return
        prevBtn.addEventListener("click", this._trackedEvents.prevBtnClickEvent.fn)
        this._trackedEvents['prevBtnClickEvent'].initialized = true
    }

    /** Close btn **/
    const initCloseBtnListener = ()=>{
        let closeBtn = document.getElementById("tg-dialog-close-btn");
        if (!closeBtn || this._trackedEvents['closeBtnClickEvent'].initialized) return
        closeBtn.addEventListener("click", this._trackedEvents.closeBtnClickEvent.fn, false)
        this._trackedEvents['closeBtnClickEvent'].initialized = true
    }

    /** Click outside **/
    const initClickOutsideListener = ()=>{
        if (this._trackedEvents['outsideClickEvent'].initialized) return
        // setTimeout(() => {
            document.body.addEventListener('click', this._trackedEvents.outsideClickEvent.fn, false)
        this._trackedEvents['outsideClickEvent'].initialized = true
        // }, 300)
    }

    /** Key press **/
    const initKeysListener = ()=>{
        if (this._trackedEvents['keyPressEvent'].initialized) return
        window.addEventListener("keydown", this._trackedEvents.keyPressEvent.fn, false);
        this._trackedEvents['keyPressEvent'].initialized = true
    }


    /**
     * Primary method
     */
    return new Promise((resolve) => {
        /**
         * Setup click events for next, prev & close buttons
         */

        // Next btn
        if (this.options.showButtons) initNextBtnListener()
        // Prev btn
        if (this.options.showButtons) initPrevBtnListener()
        // Close btn
        if (this.options.closeButton) initCloseBtnListener()
        // Dialog click outside
        if (this.options.exitOnClickOutside) initClickOutsideListener()

        /**
         * Setup listeners for keyboard controls
         */
        if (this.options.keyboardControls || this.options.exitOnEscape) initKeysListener()

        return resolve(true)
    })
}

/**
 * handleDestroyListeners
 */
function handleDestroyListeners(this : TourGuideClient){
    // Destroy listener
    const destroyNextBtnListener = ()=>{
        let nextBtn = document.getElementById("tg-dialog-next-btn");
        if (nextBtn) {
            nextBtn.removeEventListener("click", this._trackedEvents.nextBtnClickEvent.fn);
            this._trackedEvents['nextBtnClickEvent'].initialized = false
        }
    }

    const destroyPrevBtnListener = ()=>{
        let prevBtn = document.getElementById("tg-dialog-prev-btn");
        if (prevBtn) {
            prevBtn.removeEventListener("click", this._trackedEvents.prevBtnClickEvent.fn);
            this._trackedEvents['prevBtnClickEvent'].initialized = false
        }
    }

    const destroyCloseBtnListener = ()=>{
        let closeBtn = document.getElementById("tg-dialog-close-btn");
        if (closeBtn) {
            closeBtn.removeEventListener("click", this._trackedEvents.closeBtnClickEvent.fn, false)
            this._trackedEvents['closeBtnClickEvent'].initialized = false
        }
    }

    const destroyClickOutsideListener = ()=>{
        document.body.removeEventListener('click', this._trackedEvents.outsideClickEvent.fn, false)
        this._trackedEvents['outsideClickEvent'].initialized = false
    }

    const destroyKeysListener = ()=>{
        window.removeEventListener("keydown", this._trackedEvents.keyPressEvent.fn, false);
        this._trackedEvents['keyPressEvent'].initialized = false
    }

    return new Promise((resolve) => {
        /**
         * Destroy click events for next, prev & close buttons
         */
        // Next btn
        if (this.options.showButtons) destroyNextBtnListener()
        // Prev btn
        if (this.options.showButtons) destroyPrevBtnListener()
        // // Close btn
        if (this.options.closeButton) destroyCloseBtnListener()
        // // Dialog click outside
        if (this.options.exitOnClickOutside) destroyClickOutsideListener()

        /**
         * Destroy listeners for keyboard controls
         */
        if (this.options.keyboardControls || this.options.exitOnEscape) destroyKeysListener()

        return resolve(true)
    })
}

export {
    // Init
    handleInitListeners,
    // Destroy
    handleDestroyListeners,
    // Handlers
    clickOutsideHandler,
    keyPressHandler,
}