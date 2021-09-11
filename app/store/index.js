/* State */
export const state = () => ({
});

/* Actions */
export const actions = {
    ASYNC_EMIT({ commit }, context) {
        if (!context.eventName) {
            console.error('No eventName in asyncEmit invocation!');
            return -1;
        }
        let eventName = context.eventName;
        let socket = window.$nuxt.$root.mainSocket;
        return new Promise(function (resolve) {
            socket.emit(eventName, context);
            socket.on(eventName, result => {
                socket.off(eventName);
                resolve(result);
            });
        });
    },
};


