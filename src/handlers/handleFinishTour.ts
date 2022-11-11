import {TourGuideClient} from "../Tour";

/**
 * handleFinishTour
 * @param exit
 * @param tourGroup
 */
async function handleFinishTour(this: TourGuideClient, exit : boolean = true, tourGroup: string = "tour") {
    if(this._globalFinishCallback) try{
        await this._globalFinishCallback()
    } catch (e) {
        return false
    }

    if(this.options.completeOnFinish) {
        if (!localStorage.tg_tours_complete) {
            localStorage.tg_tours_complete = [tourGroup]
            return
        }
        const storageTours = (localStorage.tg_tours_complete as string).split(',')
        storageTours.push(tourGroup)
        localStorage.tg_tours_complete = storageTours
    }
    if(exit) await this.exit()
    this.activeStep = 0
    return true
}

/**
 * getIsFinished
 * @param tourGroup
 */
function getIsFinished(this : TourGuideClient, tourGroup : string = 'tour') : boolean {
    const storageTours = (localStorage.tg_tours_complete as string).split(',')
    return storageTours.includes(tourGroup)
}

function delFinishedTour(this : TourGuideClient, tourGroup : string = 'tour') {
    if(tourGroup === "all"){
        localStorage.tg_tours_complete = null
        return
    }
    const storageTours = (localStorage.tg_tours_complete as string).split(',')
    localStorage.tg_tours_complete = storageTours.filter((x)=>{
        return x !== tourGroup
    })
}

export default handleFinishTour
export {getIsFinished, delFinishedTour}