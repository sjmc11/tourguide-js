import {TourGuideClient} from "../Tour";
import computeTourSteps from "../core/steps";
import {renderDialogHtml, updateDialogHtml} from "../core/dialog";
import waitForElm from "../util/util_wait_for_element";

/**
 * handleRefreshTour
 */
async function handleRefreshTour(this: TourGuideClient) {
    return new Promise(async (resolve, reject) => {
        /**
         * Tour steps
         */
        await computeTourSteps(this).catch((e)=>{
            return reject(e)
        })

        /**
         * Backdrop
         */
        this.computeBackdropAttributes()

        /**
         * Dialog
         */
        await this.refreshDialog().catch((e)=>{
            return reject(e)
        })


        return resolve(true)
    })
}

/**
 * handleRefreshDialog
 */
async function handleRefreshDialog(this: TourGuideClient) {
    return new Promise(async (resolve, reject) => {

        /**
         * Hard refresh dialog HTML - for option updates or hard refresh methods
         */
        await renderDialogHtml(this).then((htmlResp)=>{
            if(htmlResp) this.dialog.innerHTML = htmlResp
        }).catch((e)=>{
            if(this.options.debug) console.warn(e)
        })

        /**
         * Update tour guide HTML
         */
        await updateDialogHtml(this).catch((e)=>{
            if(this.options.debug) console.warn(e)
            reject(e)
        })

        /**
         * Update backdrop & dialog positions & display
         */
        await this.updatePositions()


        /**
         * Ensure dialog is visible & rendered in DOM
         */
        if(this.isVisible) await waitForElm('.tg-dialog').then(async () => {
            /**
             * Re-Init listeners
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
        return resolve(true)
    })
}

export default handleRefreshTour
export {handleRefreshDialog}