/**
 *
 * ████████╗ ██████╗ ██╗   ██╗██████╗  ██████╗ ██╗   ██╗██╗██████╗ ███████╗         ██╗███████╗
 * ╚══██╔══╝██╔═══██╗██║   ██║██╔══██╗██╔════╝ ██║   ██║██║██╔══██╗██╔════╝         ██║██╔════╝
 *    ██║   ██║   ██║██║   ██║██████╔╝██║  ███╗██║   ██║██║██║  ██║█████╗           ██║███████╗
 *    ██║   ██║   ██║██║   ██║██╔══██╗██║   ██║██║   ██║██║██║  ██║██╔══╝      ██   ██║╚════██║
 *    ██║   ╚██████╔╝╚██████╔╝██║  ██║╚██████╔╝╚██████╔╝██║██████╔╝███████╗    ╚█████╔╝███████║
 *    ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝╚═════╝ ╚══════╝     ╚════╝ ╚══════╝
 *
 */

import './scss/compiler.scss'
import DarkModeClient from "./darkMode";
import {TourGuideClient} from "../../src/Tour";
import {setupCounter} from "./counter";

function docReady(fn : Function) {
    // check DOM is available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn as any);
    }
}

docReady(()=>{

    /**
     * CREATE COUNTER
     */
    const counterButton = document.createElement('button')
    counterButton.id = "counter"
    counterButton.classList.add('p-3', 'rounded-lg', 'text-neutral-500', 'px-5', 'border', 'border-neutral-200')


    /**
     * DARK MODE
     */
    const darkModeClient = new DarkModeClient()
    // Listen for click event on specified element
    darkModeClient.initToggleListener('darkModeToggle')
    // Toggle dark mode on load if applicable
    darkModeClient.toggle().finally(()=>{
        darkModeClient.syncToggleInputs('darkModeToggle')
    })


    /**
     * Tour Guide
     */
    const tg = new TourGuideClient({
        backdropColor: 'rgba(18,18,21,0.8)', // RGBA support only
        backdropClass: 'fadeIn', // css transition classes
        backdropAnimate: false, // animate backdrop position & size
        targetPadding: 10, // Space around highlighted target
        dialogClass: '', // css transition classes
        dialogWidth: 380, // width style property for dialog
        dialogMaxWidth: 400, // max-width style property for dialog
        dialogAnimate: true, // Animate dialog position & size
        autoScroll: true, // auto scroll to elements
        autoScrollSmooth: true, // auto scroll to elements
        autoScrollOffset: 20, // css transition classes
        showButtons: true, // show next/prev buttons
        stepDotsPlacement: 'body', // show dots in body/footer
        showStepProgress: true, // show `1/5` human-readable step progress
        closeButton: true, // show/hide close button
        rememberStep: true, // maintain tour progress on close/open
        debug: true, // show console logging
        keyboardControls: true, // Enable next & prev arrows keys + esc key
        exitOnEscape: true, // Toggle escape key only
        exitOnClickOutside: true, // Close the tour on backdrop click
        finishLabel: "Finish tour 👍", // Close the tour on backdrop click
        completeOnFinish: true, // Set tour as finished in localStorage on finish
        steps: [{
            title: "Content from HTMLElement",
            target: undefined,
            order: 1,
            content: counterButton,
            group: "demo-tour",
            afterEnter: async () => {
                return new Promise(async (resolve) => {
                    await setupCounter(counterButton)
                    return resolve(true)
                })
            }
        }, {
            title: "Welcome to tour guide JS",
            target: undefined,
            order: 6,
            content: "<p>Lorem</p><img src='https://media2.giphy.com/media/axu6dFuca4HKM/giphy.gif?cid=790b76116cda53c45dac6381787fa420167338528a9a9abb&rid=giphy.gif&ct=g'/><div id='t_img_01'/>",
            group: "demo-tour",
            afterEnter: async () => {
                return new Promise(async (resolve) => {
                    await tg.updatePositions()
                    return resolve(true)
                })
            }
        }],
    })


    tg.nextStep().then(()=>{
        console.log('Step changed')
    })

    tg.onFinish(()=>{
        return new Promise((_, reject) => {
            console.log("Before tour exit global")
            reject(true)
        })
    })

    tg.finishTour(true)

    /**
     * Declare steps
     */

    // tg.addSteps([{
    //     title: "Dynamically generated content",
    //     order: 3,
    //     target: undefined,
    //     content: "JS should update this tour step..",
    //     fixed: false,
    //     group: "demo-tour",
        // Enter events
        // beforeEnter: async (_, nextStep)=>{
        //     return new Promise(async (resolve) => {
        //         /**
        //          * Before enter populate data from external source
        //          */
        //         await fetch('https://jsonplaceholder.typicode.com/posts').then(function (response) {
        //             if (response.ok) {
        //                 return response.json();
        //             } else {
        //                 return Promise.reject(response);
        //             }
        //         }).then(async function (data) {
        //             // Work with response data
        //             let stepHtml = "<p class='mb-4'>This data was fetched dynamically using fetch() in the beforeEnter() step method</p>"
        //             stepHtml += "<ul>"
        //             data.slice(0, 5).forEach((datum: { title: string, body: string }) => {
        //                 stepHtml += `<li>⊙ ${datum.title}</li>`
        //             })
        //             stepHtml += "</ul>"
        //             nextStep.content = stepHtml
        //             await tg.refreshDialog() // Refresh dialog content & positions in one
        //             resolve(true)
        //         }).catch(function (err) {
        //             // There was an error
        //             console.warn('Something went wrong.', err);
        //         });
        //     });
        // },
        // afterEnter: async ()=>{
        //     console.log("entered new slide")
        //     return new Promise((resolve) => {
        //         setInterval(resolve, 1500);
        //     });
        // },
        // Leave events
        // beforeLeave: async ()=>{
        //     console.log("%cBeforeLeave of custom tour step", "color:violet");
        //     return new Promise((resolve) => {
        //         if (confirm('Would you like to start the tour again?')) {
        //             return resolve(true)
        //         } else {
        //             tg.activeStep = 0
        //             tg.refreshDialog()
        //         }
        //     })
        //     // throw new Error("Rejected inside of step callback method")
        // },
        // afterLeave: ()=>{
        //     console.log("%cAfterLeave of custom tour step", "color:violet");
        // },
    // }])

    /**
     * If autoScrollSmooth = false, recommend disabling dialogAnimate & backdropAnimate and vice versa.
     */

    tg.onFinish(async ()=>{
        return new Promise((resolve) => {
            if (confirm('Would you like to start the tour again?')) {
                return resolve(true)
            } else {
// use refreshDialog() instead of visitStep() to avoid re-triggering events
                tg.activeStep = 0
                tg.refreshDialog()
            }
        })
    })

    tg.onBeforeExit(async ()=>{
        return new Promise((resolve, reject) => {
            if (confirm('Are you sure you want to exit the tour?')) {
                return resolve(true)
            } else {
                return reject()
            }
        })
    })

    tg.onBeforeStepChange(()=>{
        return new Promise((resolve, reject) => {
            if (confirm('Change tour step?')) {
                return resolve(true)
            } else {
                return reject()
            }
        })
    })

    tg.onAfterStepChange(()=>{
        console.info("step change complete.")
    })

    // tg.visitStep(2) // TODO: PREVENT THIS FIRING AUTOMATICALLY


    // tg.onBeforeExit(()=>{
    //     return new Promise((resolve) => {
    //         console.log("Before tour exit global")
    //         resolve(true)
    //     })
    // })

    const tourTrigger = document.getElementById('tourTrigger');

    if(tourTrigger) tourTrigger.addEventListener('click', async () => {
        tg.start().then(()=>{
            console.log("%cTour started", "color:lightgreen");
        }).catch((e)=>{
            console.log(e)
            return
        })

        // tg.onComplete(()=>{
        //     alert('Tour completed')
        // })
    })

    /**
     * Pulse animation if tour not completed
     */
    if(!tg.isFinished() && tourTrigger) tourTrigger.classList.add('pulse-animated')

    /**
     * TEST BUTTON CLICK
     */
    document.body.addEventListener('click', (e:MouseEvent)=>{
        if (!(e.target instanceof Element)) return // abort if did not click an element
        if(e.target.id === "testBtn") {
            // tg.nextStep()
            /**
             * Refresh Dialog example
             *
             * Manipulate tour steps & active step
             * A using .refresh() would recompute tour steps and override the customizations
             *
                if(tg.tourSteps[0]) tg.tourSteps[0].title = "Twat"
                if(tg.tourSteps[0]) tg.tourSteps[0].content = "Foobar"
                tg.activeStep = 0
                tg.refreshDialog()
             *
             **/

            /**
             * Set Options example
             */

            tg.setOptions({
                prevLabel: "Backwards bro",
                nextLabel: "Forwards",
                stepDotsPlacement: "footer",
            })

            /**
             * Refresh Tour example
             *
             * Add new element to HTML dyanmically and call .refresh() to re-compute tour guide steps
             *
             * tg.refresh()
             *
             **/



            /**
             * AutoStart example
             * Use isFinished() to autostart a tour
             *
                if(!tg.isFinished()){
                    tg.start()
                }
            */


            /**
             * IsFinished example
             * Use isFinished() to display an attention grabber element with animation on tour trigger
             *
                if(tg.isFinished()){
                    console.log("TOUR COMPLETE")
                }
             *
             */

            /**
             * Reflect active step to HTML tour trigger button
             * Use activeStep & onStepChange() to output progress in webpage
             */


            // tg.exit()
        };
    });



    // const g2 = new TourGuideClient()
    //
    // setTimeout(()=>{
    //     g2.start()
    // }, 900)

    // tg.onBeforeStepChange(()=>{
    //     return new Promise((resolve) => {
    //         setInterval(resolve, 1500);
    //     });
    // })
    // tg.onAfterStepChange(()=>{
    //     alert('AFTER CHANGE')
    // })
    // tg.onAfterExit(()=>{
    //     alert('You just closed the tour, nice one')
    // })

    // tg.visitStep(2)

    // tg.addSteps({})

    // console.log(tg.options)

})


