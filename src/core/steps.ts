import {TourGuideClient} from "../Tour";
import {TourGuideStep} from "../types/TourGuideStep";
/**
 * computeTourSteps
 * @param tgInstance
 */
async function computeTourSteps(tgInstance : TourGuideClient){
    return new Promise(async (resolve, reject) => {
        let computedSteps : TourGuideStep[] = []

        /**
         * Process steps from tour options
         */
        // Compute targets to HTML element and Body if not set
        if(tgInstance.options.steps && tgInstance.options.steps.length) {
            computedSteps = tgInstance.options.steps.map((t:TourGuideStep)=>{
                // If target is string, query element by selector
                if(typeof t.target === "string"){
                    const targetElement = document.querySelector(t.target) as HTMLElement
                    if (targetElement) {
                        t.target = targetElement
                        if (tgInstance.options.targetPadding && tgInstance.options.autoScrollOffset) {
                            targetElement.style.scrollMargin = (tgInstance.options.autoScrollOffset + tgInstance.options.targetPadding) + "px 0"
                        } else {
                            targetElement.style.scrollMargin = "30px 0"
                        }
                    }
                }
                // If target is empty, set target to body
                if(!t.target) t.target = document.body

                // If dialogTarget is string, query element by selector
                if(typeof t.dialogTarget === "string") {
                    const dialogTarget = document.querySelector(t.dialogTarget) as HTMLElement
                    if (dialogTarget) {
                        t.dialogTarget = dialogTarget
                    } else {
                        t.dialogTarget = undefined
                    }
                }

                return t
            })
        }

        /**
         * Process elements with data attr tour method
         */
        const tourElements : NodeListOf<HTMLElement> = document.querySelectorAll('[data-tg-tour]')

        if(tourElements) tourElements.forEach((tourElem: HTMLElement) => {

            // Apply attributes
            const stepTitle = tourElem.getAttribute('data-tg-title')
            const stepContent = tourElem.getAttribute('data-tg-tour')
            const stepGroup = tourElem.getAttribute('data-tg-group')
            const stepOrder = tourElem.getAttribute('data-tg-order')
            const stepFixed = tourElem.getAttribute('data-tg-fixed')
            const scrollMargin = tourElem.getAttribute('data-tg-margin')
            const dialogTarget = tourElem.getAttribute('data-tg-dialog-target')
            const propagateEvents = tourElem.getAttribute('data-tg-propagate-events')

            // Apply scroll margin to element individually
            // TODO: Re-merge to one-liner with type-def fix for optional params
            if(tgInstance.options.targetPadding && tgInstance.options.autoScrollOffset){
                tourElem.style.scrollMargin = (scrollMargin ? (scrollMargin + tgInstance.options.targetPadding) : (tgInstance.options.autoScrollOffset + tgInstance.options.targetPadding)) + "px 0"
            } else {
                tourElem.style.scrollMargin = (scrollMargin ? scrollMargin : '30') + "px 0"
            }

            // Push to result
            computedSteps.push({
                title: stepTitle ? stepTitle : undefined,
                order: stepOrder ? Number(stepOrder) : 999,
                target: tourElem,
                dialogTarget: dialogTarget ? document.querySelector(dialogTarget) : undefined,
                content: stepContent ? stepContent : undefined,
                fixed: stepFixed !== null && stepFixed !== "false",
                group: stepGroup ? stepGroup : undefined,
                propagateEvents: propagateEvents !== null && propagateEvents !== "false",
                // TODO: Support events from data attributes
            } as TourGuideStep)
        })


        /**
         * Filter by group
         */
        if(tgInstance.group) computedSteps = computedSteps.filter((step : TourGuideStep)=>{
            return step.group === tgInstance.group
        })

        /**
         * Apply ordering
         */
        computedSteps.forEach((v, i) => v._index = i);
        computedSteps.sort(function(a, b) {
            if (a.order == b.order) {
                return (a._index ?? 0 ) - (b._index ?? 0);
            } else {
                return (a.order ?? 0) - (b.order ?? 0);
            }
        });


        /**
         * Apply result to tourSteps
         */
        tgInstance.tourSteps = computedSteps


        if(!tgInstance.tourSteps.length) return reject("No tour steps detected" + (tgInstance.group ? (' in group: ' + tgInstance.group) : ''))

        return resolve(true)

    })
}

export default computeTourSteps
