export const state = () => ({
    hashgraphClient: null,
    accountId: "",
});

export const mutations = {    
    setAccountId(state, accountId) {
	state.accountId = accountId;
    },
    setClient(state, client) {
	state.hashgraphClient = client;
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
	    commit('setClient', response.context);
	}
	
	return response;
    }
};
