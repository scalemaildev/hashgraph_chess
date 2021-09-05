export const state = () => ({
    accountId: "",
});

export const mutations = {    
    setAccountId(state, accountId) {
	state.accountId = accountId;
    },
};
