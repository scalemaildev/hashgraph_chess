export const state = () => ({
    accountId: "",
    clientExists: false,
    topicSubs: {
	'exampleTopicId': {
	    player1: "",
	    player2: "",
	    messages: [],
	    moves: []
	}
    },
});

export const mutations = {    
    setAccountId(state, accountId) {
	state.accountId = accountId;
    },
    toggleClientExists(state, bool) {
	state.clientExists = bool;
    },
    pushMessage(state, topicId, message) {
	topicSubs.topicId.messages.append(message);
    }
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

    processMessage({ commit }, data) {
	let message = JSON.parse(data.contents);
	switch(message.messageType) {
	case 'matchCreation':
	    console.log(message);
	case 'chatMessage':
	    console.log(message);
	case 'chessMove':
	    console.log(message);
	default:
	    console.log('Got unknown message type');
	}
    },
};
