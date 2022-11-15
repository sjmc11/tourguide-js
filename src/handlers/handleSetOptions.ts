import {TourGuideClient} from "../Tour";
import TourGuideOptions from "../core/options";
import {renderDialogHtml, updateDialogHtml} from "../core/dialog";
import waitForElm from "../util/util_wait_for_element";

/**
 * handleSetOptions
 * @param options
 */
async function handleSetOptions(this: TourGuideClient, options: TourGuideOptions) {
    if (!options) return

    /**
     * Update options
     */
    Object.assign(this.options, options)

    /**
     * Backdrop
     */
    this.computeBackdropAttributes()

    /**
     * Dialog
     */
    // Re-render the dialog - this reflects any changes from options
    await renderDialogHtml(this).then((htmlResp)=>{
        if(htmlResp) this.dialog.innerHTML = htmlResp
    }).catch((e)=>{
        if(this.options.debug) console.warn(e)
    })

    // Re-populate the dialog content
    await updateDialogHtml(this).catch((e)=>{
        if(this.options.debug) console.warn(e)
    })

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

    return this as TourGuideClient
}

export default handleSetOptions