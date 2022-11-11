import {TourGuideType} from "../Tour";

function handleClose(tgInstance : TourGuideType){
    tgInstance.dialog.style.display = "none"
    tgInstance.backdrop.style.display = "none"
    tgInstance.activeStep = 0
}

function initCloseBtnListener(){
    // Close btn
    let closeBtn = document.getElementById("tg-dialog-close-btn");
    if(closeBtn && !this.closeBtnClickEvent){
        closeBtn.addEventListener("click", () => handleClose(this))
        this.closeBtnClickEvent = true;
    }
}
export default handleClose
export {initCloseBtnListener}