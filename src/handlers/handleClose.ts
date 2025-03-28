import {TourGuideClient} from "../Tour";

async function handleClose(this: TourGuideClient) {
    return new Promise(async (resolve, reject) => {

        if (this._promiseWaiting) return reject("Promise waiting")
        this._promiseWaiting = true

        // After change callback - global
        if (this._globalBeforeExitCallback) try {
            await this._globalBeforeExitCallback()
        } catch (e) {
            return reject(e)
        }
        this.dialog.style.display = "none"
        this.backdrop.style.display = "none"
        this.isVisible = false
        if (!this.options.rememberStep) this.activeStep = 0

        if (this.options.debug) console.info("Tour exited")

        document.body.classList.remove('tg-no-interaction');

        await this.destroyListeners()

        setTimeout(() => {
            if (this._globalAfterExitCallback) this._globalAfterExitCallback()
        }, 0)

        this._promiseWaiting = false

        return resolve(true)
    })
}

export default handleClose