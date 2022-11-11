import {TourGuideClient} from "../Tour";

/**
 * dotsWrapperHtmlString
 */
function dotsWrapperHtmlString() : string{
    const dotsWrapper = document.createElement('div')
    dotsWrapper.classList.add('tg-dialog-dots')
    dotsWrapper.id = 'tg-dialog-dots'
    return dotsWrapper.outerHTML as string
}

/**
 * computeDots
 * @param tgInstance
 */
const computeDots = (tgInstance : TourGuideClient) : string =>{
    let dotsHtml = ""
    if(tgInstance.tourSteps.length) tgInstance.tourSteps.forEach((_, i)=>{
        const dotSpan = document.createElement('span')
        dotSpan.classList.add('tg-dot')
        if(i === tgInstance.activeStep) dotSpan.classList.add('tg-dot-active')
        dotsHtml += dotSpan.outerHTML
    })
    return dotsHtml
}

export {dotsWrapperHtmlString, computeDots}