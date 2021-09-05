export const state = () => ({
    accountId: "",
    privateKey: ""
});

export const mutations = {    
    setAccountId(state, accountId) {
	state.accountId = accountId;
    },
    setPrivateKey(state, privateKey) {
	state.privateKey = privateKey;
    },
};
