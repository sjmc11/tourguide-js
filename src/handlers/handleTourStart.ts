import {TourGuideClient} from "../Tour";
import waitForElm from "../util/util_wait_for_element";
import computeTourSteps from "../core/steps";

/**
 * handleTourStart
 * @param group : string
 */
async function handleTourStart(this: TourGuideClient, group?: string) {
    return new Promise(async (resolve, reject)=>{
        if(this.isVisible){
            if (this.options.debug) console.warn('Tour already active')
            return reject("Tour already active")
        }
        if (group) this.group = group
        if (this.options.debug) console.info('Start tour')

        const tgInstance = this

        /**
         * Tour steps
         */
        try {
            // Compute steps
            await computeTourSteps(tgInstance)
        } catch (e){
            if(this.options.debug) console.warn(e)
            return reject(e)
        }

        /**
         * Go to step
         */
        await tgInstance.visitStep(this.activeStep).catch((e)=>{
            if (this.options.debug) console.warn(e)
            return reject(e)
        })

        /**
         * Ensure dialog is rendered in DOM
         */
        await waitForElm('.tg-dialog').then(async ()=>{
            /**
             * Init listeners
             * Double initialization is handled inside of handler
             */
            await this.initListeners()

            // Add transition class to dialog after additional delay to prevent flying in from random position
            if(this.options.dialogAnimate) this.dialog.classList.add('animate-position')
                // setTimeout(()=>{
            // }, 100)
        })


        return resolve(true)
    })
}

export default handleTourStart