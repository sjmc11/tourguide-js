/**
 * DARK MODE SUPPORT
 */

class DarkModeClient {
    initToggleListener(selectorClass : string){

        document.body.addEventListener('click', (e:MouseEvent)=>{
            if (!(e.target instanceof Element)) return // abort if did not click an element

            // If the clicked element doesn't have the class name, bail
            if(!e.target.classList.contains(selectorClass)) return;

            localStorage.theme = (localStorage.theme === 'light' ? 'dark' : 'light')
            this.toggle().finally(()=>{
                this.syncToggleInputs(selectorClass)
            })

        }, false);

    }
    toggle(){
        return new Promise((resolve)=>{
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
            resolve(true)
        })
    }
    syncToggleInputs(selectorClass : string){
        if(!localStorage.theme) return
        const toggles = document.querySelectorAll('.' + selectorClass)
        toggles.forEach((t: Element)=>{
            if (!t) return
            const toggleInput = t.firstElementChild as HTMLInputElement
            if(toggleInput && toggleInput.tagName === "INPUT") toggleInput.checked = localStorage.theme === 'dark'
        })
    }
}

export default DarkModeClient