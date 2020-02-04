/**
 * @author Tom Wendland
 */


/**
 * Adds 'keydown' Event to window
 * but it seems to be quite expensive
 */
export var callMeToEnableKeyDownEvent = (function() {
    const intervals = {};
    document.addEventListener('keydown', function (e) {
        if(intervals[e.keyCode]) return;
        const keyholdEvent = new KeyboardEvent('keyhold', {
            bubbles : e.bubbles,
            cancelable : e.cancelable,
            char : e.char,
            key : e.key,
            shiftKey : e.shiftKey,
            keyCode : e.keyCode
        })
        intervals[e.keyCode] = setInterval(() => document.dispatchEvent(keyholdEvent), 34) // 33,3ms ^= 30 fps
    });
    document.addEventListener('keyup', function (e) {
        clearInterval(intervals[e.keyCode])
        delete intervals[e.keyCode]
    });
});



/**
 * For game loops
 * Retuns weather given key is being held down 
 * The method does not detect if key is released if the window or browser context has changed
 */

const keysHold = []

document.addEventListener('keydown', function (e) {
    if(keysHold.indexOf(e.keyCode) == -1) 
        keysHold.push(e.keyCode); 
})
document.addEventListener('keyup', function (e) {
    const i = keysHold.indexOf(e.keyCode);
    keysHold.splice(i, 1);
})

export function isKeyHold(keyCode) { 
    return keysHold.indexOf(keyCode) != -1 
}

