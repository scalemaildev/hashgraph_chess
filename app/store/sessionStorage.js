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
        let topicId = messageData.topicId;
        let playerWhite = messageData.playerWhite;
        let playerBlack = messageData.playerBlack;
        
        this._vm.$set(state.MATCHES, topicId, {
            created: true,
            playerWhite: playerWhite,
            playerBlack: playerBlack,
            messages: [{
                account: 'Server',
                message: "Started a new match between " + playerWhite + " and " + playerBlack + "..."
            }],
            pgns: [''],
            boardState: []
        });
    },
    CLEAR_MATCH_OBJECT(state, topicId) {
        this._vm.$set(state.MATCHES, topicId, {});
    },
    SET_BOARD_STATE(state, data) {
        state.MATCHES[data.topicId].boardState = data.newBoardState;
    },
    PROCESS_CHAT_MESSAGE(state, messageData) {
        let topicId = messageData.topicId;
        let message = messageData.message;
        let messageIndex = messageData.messageIndex;
        let operator = messageData.operator;
        let topicPlayers = [state.MATCHES[topicId].playerWhite, state.MATCHES[topicId].playerBlack];

        // filter out non-players
        if (!topicPlayers.includes(operator)) {
            console.log('Rejected a chat message from: ' + operator);
            return;
        }

        // filter out blank messages
        if (message == '' || message == ' ') {
            console.log('Rejected an empty chat message from: ' + operator);
            return;
        }
        
        state.MATCHES[topicId].messages.push({
            account: operator,
            messageIndex: messageIndex,
            message: message
        });
    },
    PROCESS_CHESS_MOVE(state, messageData) {
        let topicId = messageData.topicId;
        let messageIndex = messageData.sequenceNumber;
        let newPgn = messageData.newPgn;
        let operator = messageData.operator;
        let topicPlayers = [state.MATCHES[topicId].playerWhite, state.MATCHES[topicId].playerBlack];

        // filter out non-players
        if (!topicPlayers.includes(operator)) {
            console.log('Rejected a chess move from: ' + operator);
            return;
        }

        // filter out double moves
        if (state.MATCHES[topicId].pgns.length > 0) {
            if (operator == state.MATCHES[topicId].pgns.at(-1).operator ) {
                console.log('Rejected a double move from: ' + operator);
                return;
            }
        }
        
        state.MATCHES[topicId].pgns.push({
            operator: operator,
            messageIndex: messageIndex,
            newPgn: newPgn
        });
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

    async CREATE_MATCH({ state }, context) {
        const response = await this.dispatch('sessionStorage/CREATE_NEW_TOPIC');

        if (response.result == 'SUCCESS') {
            let newMatchData = {
                messageType: 'matchCreation',
                topicId: response.newTopicId,
                playerWhite: context.playerWhite,
                playerBlack: context.playerBlack,
            };
            
            this.dispatch('ASYNC_EMIT', {
                eventName: 'sendHCSMessage',
                operator: state.ACCOUNT_ID,
                context: newMatchData
            });
        }

        // always return the response
        return response;
    },

    async SUBSCRIBE_TO_TOPIC({ commit }, topicId) {
        commit('CLEAR_MATCH_OBJECT', topicId);
        this.dispatch('ASYNC_EMIT', {
            eventName: 'subscribeToTopic',
            topicId: topicId
        });
    },

    SEND_MESSAGE({ state }, messagePayload) {
        let response = this.dispatch('ASYNC_EMIT', {
            eventName: 'sendHCSMessage',
            operator: state.ACCOUNT_ID,
            context: messagePayload
        });
        return response;
    },

    PROCESS_MESSAGE({ commit }, messageResponse) {
        let messageData = JSON.parse(messageResponse);
        
        switch(messageData.messageType) {
        case 'matchCreation':
            commit('CREATE_MATCH_OBJECT', messageData);
            break;
        case 'chatMessage':
            commit('PROCESS_CHAT_MESSAGE', messageData);
            break;
        case 'chessMove':
            commit('PROCESS_CHESS_MOVE', messageData);
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
    MATCH_PGN_LATEST: (state) => {
        return topicId => {
            return state.MATCHES[topicId].pgns.at(-1).newPgn;
        };
    },
    MATCH_BOARD_STATE: (state) => {
        return topicId => {
            return state.MATCHES[topicId].boardState;
        };
    }
};
