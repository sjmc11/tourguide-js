import {TourGuideClient, TourGuideStepType} from "../Tour";
import waitForElm from "../util/util_wait_for_element";

/**
 * handleTourStart
 * @param group : string
 */
async function handleTourStart(this: TourGuideClient, group?: string) {
    return new Promise(async (resolve, reject)=>{
        console.log(this.isVisible)
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
            if(this.options.dialogAnimate) setTimeout(()=>{this.dialog.classList.add('animate-position')}, 600)
        })


        return resolve(true)
    })
}

/**
 * computeTourSteps
 * @param tgInstance
 */
async function computeTourSteps(tgInstance : TourGuideClient){
    return new Promise(async (resolve, reject) => {

        let computedSteps : TourGuideStepType[] = []

        /**
         * Process steps from tour options
         */
        // Compute targets to HTML element and Body if not set
        if(tgInstance.options.steps.length) {
            computedSteps = tgInstance.options.steps.map((t:TourGuideStepType)=>{
                // If target is string, query element by selector
                if(typeof t.target === "string") t.target = document.querySelector(t.target)
                // If target is empty, set target to body
                if(!t.target) t.target = document.body
                return t
            })
        }

        /**
         * Process elements with data attr tour method
         */
        const tourElements : NodeListOf<Element> = document.querySelectorAll('[data-tg-tour]')

        if(tourElements) tourElements.forEach((tourElem : HTMLElement) => {

            // Apply attributes
            const stepTitle = tourElem.getAttribute('data-tg-title')
            const stepContent = tourElem.getAttribute('data-tg-tour')
            const stepGroup = tourElem.getAttribute('data-tg-group')
            const stepOrder = tourElem.getAttribute('data-tg-order')
            const stepFixed = tourElem.getAttribute('data-tg-fixed')
            const scrollMargin = tourElem.getAttribute('data-tg-margin')

            // Apply scroll margin to element individually
            tourElem.style.scrollMargin = (scrollMargin ? (scrollMargin + tgInstance.options.targetPadding) : (tgInstance.options.autoScrollOffset + tgInstance.options.targetPadding)) + "px 0"

            // Push to result
            computedSteps.push({
                title: stepTitle ? stepTitle : undefined,
                order: stepOrder ? Number(stepOrder) : 999,
                target: tourElem,
                content: stepContent ? stepContent : undefined,
                fixed: stepFixed !== null && stepFixed !== "false",
                group: stepGroup ? stepGroup : undefined,
                // TODO: Support events from data attributes
                // beforeEnter: ()=>{
                //     console.log("ENTERING TOUR STEP")
                // },
            } as TourGuideStepType)
        })


        /**
         * Filter by group
         */
        if(tgInstance.group) computedSteps = computedSteps.filter((step : TourGuideStepType)=>{
            return step.group === tgInstance.group
        })

        /**
         * Apply ordering
         */
        computedSteps.sort(function(a, b) {
            const keyA = new Date(a.order), keyB = new Date(b.order);
            // if (keyA === keyB) return 0
            return (keyA < keyB) ? -1 : 1;
        });


        /**
         * Apply result to tourSteps
         */
        tgInstance.tourSteps = computedSteps


        if(!tgInstance.tourSteps.length) return reject("No tour steps detected" + (tgInstance.group ? (' in group: ' + tgInstance.group) : ''))

        return resolve(true)

    })
}

export default handleTourStart

export {computeTourSteps}