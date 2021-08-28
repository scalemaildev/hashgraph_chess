/* State */
export const state = () => ({
    consensusMessages: [],
    topicId: "",
    topicQuerying: false,
    topicSet: false,
    mirrorSubbed: false
});

/* Mutations */
export const mutations = {
    pushMessage(state, message) {
	state.consensusMessages.push(message);
    },
    toggleStateFlag(state, flag, bool) {
	state[flag.flagName] = flag.bool;
    },
};

/* Actions */
export const actions = {
    asyncEmit({ commit }, context) {
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
