export const state = () => ({    
    hashgraphClient: null,
    topicMessages: [],
    accountId: "",
});

export const mutations = {    
    setAccountId(state, accountId) {
	state.accountId = accountId;
    },
    setClient(state, client) {
	state.hashgraphClient = client;
    },    
    pushMessage(state, message) {
	state.topicMessages.push(message);
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
	    commit('setClient', response.context);
	}
	
	return response;
    },

    unsetClient({ commit }, context) {
	commit('setAccountId', "");
	commit('setClient', null);
	commit('toggleLockButton', false, { root: true });
	commit('setActivePanel', 'startPanel', { root: true });
    }
};
