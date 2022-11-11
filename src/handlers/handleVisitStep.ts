import {TourGuideClient} from "../Tour";
import {arrow, autoPlacement, computePosition, offset, Placement} from "@floating-ui/dom";
import {computeDialogPosition, updateDialogHtml} from "../core/dialog";
import scrollToTarget from "../core/scrollTo";
import {computeBackdropPosition} from "../core/backdrop";

async function handleVisitStep(this : TourGuideClient, stepIndex: "next" | "prev" | number) {
    return new Promise(async (resolve, reject) => {
        /**
         * Convert next & prev string to stepIndex
         */
        if (typeof stepIndex === "string") {
            if (stepIndex === "next") stepIndex = this.activeStep + 1
            else stepIndex = this.activeStep - 1
        }

        /**
         * Do completion if end of tour
         */
        if(stepIndex >= this.tourSteps.length){
            await this.finishTour(true)
            return
        }

        await goToStep(this, stepIndex as number).catch((e)=>{
            return reject(e)
        })
        return resolve(true)
    })
}

async function handleVisitNextStep(this : TourGuideClient) {
    return new Promise(async (resolve, reject) => {
        const stepIndex = this.activeStep + 1
        try{
            await this.visitStep(stepIndex)
        } catch (e) {
            return reject(e)
        }
        return resolve(true)
    })
}

async function handleVisitPrevStep(this : TourGuideClient) {
    return new Promise(async (resolve, reject) => {
        const stepIndex = this.activeStep - 1
        try{
            await this.visitStep(stepIndex)
        } catch (e) {
            return reject(e)
        }
        return resolve(true)
    })
}

function goToStep(tgInstance: TourGuideClient, stepIndex : number, refresh : boolean = false){
    return new Promise(async (resolve, bail) => {

        /**
         * Min/Max checks
         */
        // Ensure index stays in range of toursteps
        if (stepIndex >= tgInstance.tourSteps.length) {
            return bail("End of tour steps")
        }
        if (stepIndex < 0){
            return bail("Start of tour steps")
        }

        /**
         * Check step data
         */
        const currentStepIndex = tgInstance.activeStep
        const currentStep = tgInstance.tourSteps[currentStepIndex]
        const nextStep = tgInstance.tourSteps[stepIndex]
        if (!nextStep || !currentStep) return bail("Step not found by index")



        /** Before callbacks **/

        // Before change callback - global
        if(tgInstance._globalBeforeChangeCallback && stepIndex !== currentStepIndex){
            try {
                await tgInstance._globalBeforeChangeCallback()
            } catch (e){
                return bail(e)
            }
        }

        // Before leave callback on current step
        if (currentStep.beforeLeave) {
            try {
                await currentStep.beforeLeave(currentStep, nextStep)
            } catch (e){
                return bail(e)
            }
        }

        // Before enter callback for next pending step
        if (nextStep.beforeEnter) {
            try {
                await nextStep.beforeEnter(currentStep, nextStep)
            } catch (e){
                return bail(e)
            }
        }

        /**
         * Sanitize step target to HTMLElement
         */
        // If target is string, query element by selector
        if(typeof nextStep.target === "string") tgInstance.tourSteps[stepIndex].target = document.querySelector(nextStep.target as string)
        // If target is empty or not found, set target to centered backdrop
        if(!nextStep.target) tgInstance.tourSteps[stepIndex].target = document.body


        /** Set active step **/
        tgInstance.activeStep = Number(stepIndex)

        /**
         * Update tour guide HTML
         */
        await updateDialogHtml(tgInstance).catch((e)=>{
            if(tgInstance.options.debug) console.warn(e)
            bail(e)
        })


        /**
         * Scroll to target
         */
        if (tgInstance.options.autoScroll && nextStep.target !== document.body) await scrollToTarget(tgInstance, nextStep.target as HTMLElement)


        /**
         * Update backdrop & dialog positions & display
         */
        await tgInstance.updatePositions()


        /** After callbacks **/
        // After leave callback for current step
        if (currentStep.afterLeave) await currentStep.afterLeave(currentStep, nextStep)

        // After enter callback for next pending step (now the active step)
        if (nextStep.afterEnter) await nextStep.afterEnter(currentStep, nextStep)

        // After change callback - global
        if(tgInstance._globalAfterChangeCallback && stepIndex !== currentStepIndex) await tgInstance._globalAfterChangeCallback()

        return resolve(true)

    })
}

function computeTourPositions(this : TourGuideClient){
    return new Promise(async (resolve, reject) => {
        /**
         * Update overlay position
         */
        this.backdrop.style.display = "block"
        await computeBackdropPosition(this)

        /**
         * Update dialog position
         */
        this.dialog.style.display = 'block'
        await computeDialogPosition(this)
        this.isVisible = true

        /**
         * Resize & Scroll
         */

        // Re-compute on resize
        if (!window.onresize) window.onresize = () => {
            computeBackdropPosition(this)
            computeDialogPosition(this)
        }

        // Re-compute on resize - dialog only
        if (!window.onscroll) window.onscroll = () => {
            computeDialogPosition(this)
        }

        // Match timeout with CSS transition & smooth scroll
        setTimeout(()=>{
            return resolve(true)
        }, 300)
    })
}

export default handleVisitStep

export {
    goToStep,
    handleVisitNextStep,
    handleVisitPrevStep,
    computeTourPositions
}