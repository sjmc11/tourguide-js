import {TourGuideClient} from "../Tour";

function scrollToTarget(tgInstance : TourGuideClient, targetElem : HTMLElement){
    //TODO: detect when scroll complete instead of relying on timeout
    targetElem.scrollIntoView({behavior: tgInstance.options.autoScrollSmooth ? "smooth" : "auto", block: "end", inline: "nearest"});
}
