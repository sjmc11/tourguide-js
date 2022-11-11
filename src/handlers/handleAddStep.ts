import {TourGuideClient, TourGuideStepType} from "../Tour";
import computeTourSteps from "../core/steps";
import {updateDialogHtml} from "../core/dialog";
import waitForElm from "../util/util_wait_for_element";

/**
 * handleAddStep
 * @param newSteps
 */
async function handleAddStep(this: TourGuideClient, newSteps: TourGuideStepType[]) {

    // TS build strict check
    if(!this.options.steps) return

    // Add step
    this.options.steps.push(...newSteps)

    // recompute tour steps
    await computeTourSteps(this)

    // update dialog HTML (reflect new steps in dots)
    if(this.isVisible) await updateDialogHtml(this).catch((e)=>{
        if(this.options.debug) console.warn(e)
    })

    // recompute dialog & backdrop positioning
    if(this.isVisible) this.updatePositions().catch((e)=>{
        if(this.options.debug) console.warn(e)
    })

    /**
     * If dialog is rendered in DOM
     */
    if(this.isVisible) await waitForElm('.tg-dialog').then(async () => {
        /**
         * Init listeners
         * Double initialization is handled inside of handler
         */
        await this.destroyListeners()
        await this.initListeners()

        // Add transition class to dialog after additional delay to prevent flying in from random position
        // if (this.options.dialogAnimate) setTimeout(() => {
        //     this.dialog.classList.add('animate-position')
        // }, 600)

        return true
    })

}

export default handleAddStep