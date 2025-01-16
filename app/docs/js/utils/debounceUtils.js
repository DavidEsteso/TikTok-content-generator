export const createDebounce = (fn, options = {}) => {
    const {
        delay = 300,
        leading = false,
        trailing = true
    } = options;

    let timeoutId = null;
    let lastArgs = null;
    let lastThis = null;
    let lastCallTime = 0;
    let lastInvokeTime = 0;

    const invokeFunc = () => {
        const args = lastArgs;
        const thisArg = lastThis;
        lastArgs = lastThis = null;
        lastInvokeTime = Date.now();
        return fn.apply(thisArg, args);
    };

    const trailingEdge = () => {
        timeoutId = null;
        if (trailing && lastArgs) {
            return invokeFunc();
        }
        lastArgs = lastThis = null;
        return undefined;
    };

    const shouldInvoke = (time) => {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        return (lastCallTime === 0) || 
               (timeSinceLastCall >= delay) || 
               (timeSinceLastCall < 0);
    };

    const debounced = function(...args) {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);

        lastArgs = args;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking && leading && !timeoutId) {
            return invokeFunc();
        }

        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(trailingEdge, delay);
    };

    debounced.cancel = () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        lastInvokeTime = 0;
        timeoutId = lastArgs = lastThis = null;
    };

    debounced.flush = () => {
        if (timeoutId !== null) {
            const result = invokeFunc();
            debounced.cancel();
            return result;
        }
        return undefined;
    };

    return debounced;
};