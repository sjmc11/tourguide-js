/**
 * isPromise
 * @param p
 */
function isPromise(p) : boolean {
    return (typeof p === 'object' && typeof p.then === 'function')
}

/**
 * returnsPromise
 * @param f
 */
function returnsPromise(f) {
    if (
        f.constructor.name === 'AsyncFunction' ||
        (typeof f === 'function' && isPromise(f()))
    ) {
        console.log('✅ Function returns promise');
        return true;
    }

    console.log('⛔️ Function does NOT return promise');
    return false;
}

export {isPromise, returnsPromise}