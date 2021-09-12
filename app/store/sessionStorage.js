const hashgraph = require('../serverMiddleware/hashgraph');

/* State */
export const state = () => ({
    ACTIVE_PANEL: 'loadingPanel',
    LOCK_BUTTON: false,
    ACCOUNT_ID: "",
    MATCHES: {},
});

/* MUTATIONS */
export const mutations = {
    TOGGLE_LOCK_BUTTON(state, bool) {
        state.LOCK_BUTTON = bool;
    },
    SET_ACTIVE_PANEL(state, newPanel) {
        state.ACTIVE_PANEL = newPanel;
    },
    SET_ACCOUNT_ID(state, accountId) {
        state.ACCOUNT_ID = accountId;
    },
    TOGGLE_CLIENT_EXISTS(state, bool) {
        state.CLIENT_EXISTS = bool;
    },
    CREATE_MATCH_OBJECT(state, newMatchData) {
        state.MATCHES[newMatchData.topicId] = {
            player1: newMatchData.player1,
            player2: newMatchData.player2,
            messages: [],
            moves: []
        };

        console.log(state.MATCHES[newMatchData.topicId]);
    },
    CLEAR_MATCH_OBJECT(state, topicId) {
        state.MATCHES[topicId] = {};
    },
    PUSH_MESSAGE(state, topicId, message) {
        state.MATCHES.topicId.messages.append(message);
    },    
};

/* Actions */
export const actions = {
    async INIT_HASHGRAPH_CLIENT({ commit }, context) {
        const response = await this.dispatch(
            'ASYNC_EMIT', {
                eventName: 'initHashgraphClient',
                accountId: context.accountId,
                privateKey: context.privateKey
            });

        if (response.result == 'SUCCESS') {
            commit('SET_ACCOUNT_ID', context.accountId);
            commit('TOGGLE_CLIENT_EXISTS', true);
        }
        
        return response;
    },

    async UNSET_CLIENT({ commit }) {
        // dispatch a method to clear the client server-side
        const response = await this.dispatch('ASYNC_EMIT', {
            'eventName': 'unsetClient'
        });

        if (response.result == 'SUCCESS') {
            commit('SET_ACCOUNT_ID', "");
            commit('TOGGLE_CLIENT_EXISTS', false);
            commit('TOGGLE_LOCK_BUTTON', false);
            commit('SET_ACTIVE_PANEL', 'startPanel');
        } else {
            console.error(response.responseMessage);
        }
    },

    async CREATE_NEW_TOPIC() {
        let response = await this.dispatch('ASYNC_EMIT', {
            eventName: 'createNewTopic'
        });
        return response;
    },

    async CREATE_MATCH({ commit }, context) {
        const response = await this.dispatch('sessionStorage/CREATE_NEW_TOPIC');

        if (response.result == 'SUCCESS') {
            let newMatchData = {
                messageType: 'matchCreation',
                topicId: response.newTopicId,
                player1: context.player1,
                player2: context.player2,
            };
            
            this.dispatch('ASYNC_EMIT', {
                eventName: 'sendHCSMessage',
                context: newMatchData
            });
        }

        // always return the response
        return response;
    },

    async SUBSCRIBE_TO_TOPIC({ commit }, topicId) {
        commit('CLEAR_MATCH_OBJECT', topicId);
        window.$nuxt.$root.mainSocket.emit('subscribeToTopic', {
            topicId: topicId
        });
    },

    PROCESS_MESSAGE({ commit }, data) {
        let message = JSON.parse(data.contents);

        switch(message.messageType) {
        case 'matchCreation':
            commit('CREATE_MATCH_OBJECT', message);
            break;
        default:
            console.log('Got unknown message type: ' + message.messageType);
        }
    },
};

/* GETTERS */
export const getters = {
    GET_MATCHES: (state) => {
        return state.MATCHES;
    },
    
    CLIENT_EXISTS: (state) => {
        return hashgraph.HederaClient != '';
    },
};
