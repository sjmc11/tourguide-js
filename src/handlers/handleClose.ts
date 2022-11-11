import {TourGuideClient} from "../Tour";

async function handleClose(this: TourGuideClient) {

    // After change callback - global
    if(this._globalBeforeExitCallback) try{
        await this._globalBeforeExitCallback()
    } catch (e) {
        return
    }
    this.dialog.style.display = "none"
    this.backdrop.style.display = "none"
    this.isVisible = false
    if (!this.options.rememberStep) this.activeStep = 0

    if (this.options.debug) console.info("Tour exited")

    await this.destroyListeners()

    setTimeout(()=> {
        if (this._globalAfterExitCallback) this._globalAfterExitCallback()
    }, 0)

    return
}

export default handleClose