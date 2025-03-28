import {TourGuideClient} from "../Tour";
import {computeBackdropPosition} from "./backdrop";
import {computeDialogPosition} from "./dialog";

/**
 * computeTourPositions
 */
function computeTourPositions(this : TourGuideClient){
    return new Promise(async (resolve) => {
        /**
         * Update overlay position
         */
        this.backdrop.style.display = "block"
        await computeBackdropPosition(this)

        /**
         * Update dialog position
         */
        this.dialog.style.display = 'block'
        if(this.options.dialogAnimate && this.isVisible) this.dialog.classList.add('animate-position') // add transition class
        await computeDialogPosition(this)
        if(this.options.dialogAnimate) setTimeout(()=>{this.dialog.classList.remove('animate-position')}, 300) // cancel after 300ms css transition complete
        this.isVisible = true

        // Match timeout with CSS transition & smooth scroll
        setTimeout(() => {
            return resolve(true)
        }, 300)

    })
}

export default computeTourPositions