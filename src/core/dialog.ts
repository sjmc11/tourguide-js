import {computeDots, dotsWrapperHtmlString} from "./dots";
import {TourGuideClient} from "../Tour";
import {arrow, autoPlacement, computePosition as fui_computePosition, offset, Placement, shift} from "@floating-ui/dom";

/**
 * createTourGuideDialog
 */
async function createTourGuideDialog(this : TourGuideClient){
    // Create base tour dialog element
    this.dialog = document.createElement('div')
    this.dialog.classList.add('tg-dialog')

    // Render HTML content
    await renderDialogHtml(this).then((html) => {
        this.dialog.innerHTML = html
    })

    document.body.append(this.dialog)

    return true
};

/**
 * renderDialogHtml
 * @param tgInstance
 */
async function renderDialogHtml(tgInstance : TourGuideClient){


    /** Update dialog options **/
    if(tgInstance.options.dialogClass) tgInstance.dialog.classList.add(tgInstance.options.dialogClass)
    if(tgInstance.options.dialogZ) tgInstance.dialog.style.zIndex = String(tgInstance.options.dialogZ)
    tgInstance.dialog.style.width = tgInstance.options.dialogWidth ? (tgInstance.options.dialogWidth + 'px') : 'auto'
    if(tgInstance.options.dialogMaxWidth) tgInstance.dialog.style.maxWidth = tgInstance.options.dialogMaxWidth + 'px'


    /** Create dialog HTML **/
    let htmlRes = ""
    htmlRes += `<div class='tg-dialog-header'>` // Open header
        htmlRes += `<div class="tg-dialog-title" id="tg-dialog-title"><!-- JS rendered --></div>` // Title
    if(tgInstance.options.closeButton){
        htmlRes += `<div class="tg-dialog-close-btn" id="tg-dialog-close-btn">`
        htmlRes += ` <svg width="12px" height="12px" id="Layer_1" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/></svg>`
        htmlRes += `</div>` // Close button
    } // end close button
    htmlRes += `</div>` // Close header
    htmlRes += `<div class="tg-dialog-body" id="tg-dialog-body"><!-- JS rendered --></div>` // Body
    htmlRes += `<div class="p-3 border-t text-indigo-400 hover:text-pink-500" id="testBtn">Test btn</div>` // Test button
    // Append dots if enabled for body as separate element
    if(tgInstance.options.showStepDots && tgInstance.options.stepDotsPlacement === 'body') {
        const dotsWrapperHtml = dotsWrapperHtmlString()
        if(dotsWrapperHtml) htmlRes += dotsWrapperHtml
    }

    htmlRes += `<div class="tg-dialog-footer">` // Start footer

        // Append prev button if enabled
        if(tgInstance.options.showButtons && !tgInstance.options.hidePrev) htmlRes += `<button type="button" class="tg-dialog-btn" id="tg-dialog-prev-btn">${tgInstance.options.prevLabel}</button>`

        htmlRes += '<div class="tg-dialog-footer-sup">'

            // Append dots if enabled for FOOTER
            if(tgInstance.options.showStepDots && tgInstance.options.stepDotsPlacement === 'footer') {
                const dotsWrapperHtml = dotsWrapperHtmlString()
                if(dotsWrapperHtml) htmlRes += dotsWrapperHtml
            }

            // Show step progress if enabled
            if(tgInstance.options.showStepProgress) htmlRes += `<span class="tg-step-progress" id="tg-step-progress"><!-- JS rendered --></span>`

        htmlRes += '</div>'

        // Append next button if enabled
        if(tgInstance.options.showButtons && !tgInstance.options.hideNext) htmlRes += `<button type="button" class="tg-dialog-btn" id="tg-dialog-next-btn">${tgInstance.options.nextLabel}</button>`

    htmlRes += `</div>` // End footer

    htmlRes += `<div id="tg-arrow" class="tg-arrow"></div><!-- end tour arrow -->`

    return htmlRes
}

/**
 * updateDialogHtml
 * @param tgInstance
 */
function updateDialogHtml(tgInstance : TourGuideClient){
    return new Promise((resolve, reject) => {

        // Check step data
        const stepData = tgInstance.tourSteps[tgInstance.activeStep]
        if (!stepData) reject('No active step data')

        // Title
        const tgTitle = document.getElementById('tg-dialog-title');
        if (tgTitle) tgTitle.innerHTML = stepData.title ? stepData.title : ''

        // Body
        const tgBody = document.getElementById('tg-dialog-body');
        if (tgBody && stepData) {
            if (typeof stepData.content === "string"){
                tgBody.innerHTML = stepData.content ? stepData.content : ''
            } else {
                tgBody.innerHTML = ""
                tgBody.append(stepData.content)
            }
        }

        // Dots - use computeDots()
        const tgDots = document.getElementById('tg-dialog-dots')
        if(tgDots && tgInstance.options.showStepDots && computeDots(tgInstance)) tgDots.innerHTML = computeDots(tgInstance)

        // Next/Finish button
        const nextBtn = document.getElementById('tg-dialog-next-btn')
        if(nextBtn) nextBtn.innerHTML = ((tgInstance.activeStep + 1) >= tgInstance.tourSteps.length ? tgInstance.options.finishLabel : tgInstance.options.nextLabel) as string

        // Step progress
        const tgProgress = document.getElementById('tg-step-progress')
        if(tgProgress) tgProgress.innerHTML = ((tgInstance.activeStep + 1) + '/' + (tgInstance.tourSteps).length)

        resolve(true)
    })
}

/**
 * computeDialogPosition
 * @param tgInstance
 */
function computeDialogPosition(tgInstance : TourGuideClient) {
    return new Promise(async (resolve) => {
        const arrowElement: HTMLElement | null = document.querySelector('#tg-arrow');

        let targetElem = tgInstance.tourSteps[tgInstance.activeStep].target as HTMLElement

        // Center position if body
        if (targetElem === document.body) {

            // apply positioning
            Object.assign(tgInstance.dialog.style, {
                top: `${(((window.innerHeight / 2.25)) - (tgInstance.dialog.clientHeight / 2))}px`,
                left: `${((window.innerWidth / 2) - (tgInstance.dialog.clientWidth / 2))}px`,
                position: 'fixed',
            });
            // Add fixed class
            tgInstance.dialog.classList.add('tg-dialog-fixed')
            // hide arrow
            if(arrowElement) arrowElement.style.display = 'none'
            return resolve(true)
        }

        // Affirm positioning method and arrow visibility
        tgInstance.dialog.style.position = 'absolute'
        // Remove fixed class
        tgInstance.dialog.classList.remove('tg-dialog-fixed')
        // Display arrow
        if(arrowElement) arrowElement.style.display = 'inline-block'

        // Apply floating-ui positioning
        fui_computePosition(targetElem, tgInstance.dialog, {
            placement: tgInstance.options.dialogPlacement as Placement,
            middleware: [
                autoPlacement({
                    autoAlignment: true,
                    padding: 5
                }),
                shift({padding: 15}),
                arrow({element: arrowElement as HTMLElement}),
                offset(20)
            ],
        }).then(({x, y, placement, middlewareData}) => {

            // apply positioning
            Object.assign(tgInstance.dialog.style, {
                left: `${x}px`,
                top: `${y}px`,
            });

            // Arrow data
            if(middlewareData.arrow) {
                const arrowX = middlewareData.arrow.x
                const arrowY = middlewareData.arrow.y

                const staticSide = {
                    top: "bottom",
                    right: "left",
                    bottom: "top",
                    left: "right",
                }[placement.split('-')[0]];

                // Position arrow
                if (arrowElement) Object.assign(arrowElement.style, {
                    left: arrowX != null ? `${arrowX}px` : '',
                    top: arrowY != null ? `${arrowY}px` : '',
                    [staticSide as string]: "-4px",
                });
            }
            return resolve(true)
        })
    })
}


export {createTourGuideDialog, renderDialogHtml, updateDialogHtml, computeDialogPosition}