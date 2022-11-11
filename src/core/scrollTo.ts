import {TourGuideClient} from "../Tour";

/**
 * scrollToTarget
 * @param tgInstance
 * @param targetElem
 */
const scrollToTarget = (tgInstance : TourGuideClient, targetElem : HTMLElement)=>{
    //TODO: detect when scroll complete instead of relying on timeout
    targetElem.scrollIntoView({behavior: tgInstance.options.autoScrollSmooth ? "smooth" : "auto", block: "end", inline: "nearest"});
}

export default scrollToTarget
