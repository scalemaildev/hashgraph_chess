export const state = () => ({
    accountId: "",
    clientExists: false,
    topicSubs: {},
});

export const mutations = {    
    setAccountId(state, accountId) {
	state.accountId = accountId;
    },
    toggleClientExists(state, bool) {
	state.clientExists = bool;
    },
};

export const actions = {
    async initHashgraphClient({ commit }, context) {
	const response = await this.dispatch(
	    'asyncEmit', {
		'eventName': 'initHashgraphClient',
		'accountId': context.accountId,
		'privateKey': context.privateKey
	    });

	if (response.result == 'SUCCESS') {
	    commit('setAccountId', context.accountId);
	    commit('toggleClientExists', true);
	}
	
	return response;
    },

    unsetClient({ commit }, context) {
	commit('setAccountId', "");
	commit('toggleClientExists', false);
	commit('toggleLockButton', false, { root: true });
	commit('setActivePanel', 'startPanel', { root: true });

	// dispatch a method to clear the client server-side
	this.dispatch('asyncEmit', {
	    'eventName': 'unsetClient'
	});
    },

    async subscribeToTopic() {
	this.$root.mainSocket.emit('subscribeToTopic', {
	    'topicId': this.topicId
	});
    },

    parseMessage(message) {
	switch(message.messageType) {
	case 'matchCreation':
	    console.log(message);
	default:
	    console.log('Got unknown message');
	}
    },

    processMessage({ commit }, data) {
	let message = JSON.parse(data.contents);
	message = parseMessage(message);
    },
};
