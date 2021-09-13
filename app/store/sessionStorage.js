/* State */
export const state = () => ({
    ACCOUNT_ID: '',
    PRIVATE_KEY: '',
    ACTIVE_PANEL: 'loadingPanel',
    LOCK_BUTTON: false,
    MATCHES: {},
});

/* MUTATIONS */
export const mutations = {
    SET_ACCOUNT_ID(state, accountId) {
        state.ACCOUNT_ID = accountId;
    },
    SET_PRIVATE_KEY(state, privateKey) {
        state.PRIVATE_KEY = privateKey;
    },
    TOGGLE_LOCK_BUTTON(state, bool) {
        state.LOCK_BUTTON = bool;
    },
    SET_ACTIVE_PANEL(state, newPanel) {
        state.ACTIVE_PANEL = newPanel;
    },
    CREATE_MATCH_OBJECT(state, messageData) {
        this._vm.$set(state.MATCHES, messageData.topicId, {
            created: true,
            player1: messageData.player1,
            player2: messageData.player2,
            messages: [{
                'account': 'Server',
                'message': "Started a new match between " + messageData.player1 + " and " + messageData.player2 + "..."
            }],
            moves: []
        });
    },
    CLEAR_MATCH_OBJECT(state, topicId) {
        this._vm.$set(state.MATCHES, topicId, {});
    },
    PROCESS_CHAT_MESSAGE(state, messageData) {
        console.log(messageData);
        // check if it's one of the players and reject if not
        // otherwise use PUSH_MESSAGE
    },
    PUSH_MESSAGE(state, context) {
        state.MATCHES[context.topicId].messages.append(context.message);
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
            commit('SET_PRIVATE_KEY', context.privateKey);
            commit('TOGGLE_LOCK_BUTTON', true);
        }
        
        return response;
    },

    async UNSET_CLIENT({ commit }) {
        // dispatch a method to clear the client server-side
        const response = await this.dispatch('ASYNC_EMIT', {
            'eventName': 'unsetClient'
        });

        if (response.result == 'SUCCESS') {
            commit('SET_ACCOUNT_ID', '');
            commit('SET_PRIVATE_KEY', '');
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
        let messageData = JSON.parse(data.contents);

        switch(messageData.messageType) {
        case 'matchCreation':
            commit('CREATE_MATCH_OBJECT', messageData);
            break;
        case 'chatMessage':
            commit('PROCESS_CHAT_MESSAGE', messageData);
            break;
        default:
            console.log('Got unknown message type: ' + messageData.messageType);
        }
    },
};

/* GETTERS */
export const getters = {
    MATCH_DATA: (state) => {
        return topicId => {
            return state.MATCHES[topicId];
        };
    },
    MATCH_MESSAGES: (state) => {
        return topicId => {
            return state.MATCHES[topicId].messages;
        };
    },
    MATCH_MOVES: (state) => {
        return topicId => {
            return state.MATCHES[topicId].moves;
        };
    },
};
