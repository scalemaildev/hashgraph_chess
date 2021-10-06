import Chess from 'chess.js';
const { Client,
        AccountId,
        PrivateKey,
        TopicId,
        TopicCreateTransaction,
        TopicMessageSubmitTransaction } = require("@hashgraph/sdk");

var HederaClient;

/* State */
export const state = () => ({
    ACCOUNT_ID: '',
    PRIVATE_KEY: '',
    ACTIVE_PANEL: 'loadingPanel',
    LOCK_BUTTON: false,
    MATCHES: {},
    GAME_INSTANCES: {}
});

/* MUTATIONS */
export const mutations = {
    /* State Toggles and Setters */
    UNSET_CLIENT(state) {
        HederaClient = null;
        state.ACCOUNT_ID = '';
        state.PRIVATE_KEY = '';
        state.ACTIVE_PANEL = 'startPanel';
        state.LOCK_BUTTON = false;
    },
    SET_ACCOUNT_ID(state, accountId) {
        state.ACCOUNT_ID = accountId;
    },
    SET_PRIVATE_KEY(state, privateKey) {
        state.PRIVATE_KEY = privateKey;
    },
    SET_ACTIVE_PANEL(state, newPanel) {
        state.ACTIVE_PANEL = newPanel;
    },
    TOGGLE_LOCK_BUTTON(state, bool) {
        state.LOCK_BUTTON = bool;
    },
    
    /* Map Object Creation and Clearing */
    CREATE_GAME_INSTANCE(state, topicId) {
        state.GAME_INSTANCES[topicId] = new Chess();
    },
    CLEAR_GAME_INSTANCE(state, topicId) {
        this._vm.$set(state.GAME_INSTANCES, topicId, {});
    },
    CREATE_MATCH_OBJECT(state, messageData) {
        let topicId = messageData.topicId;
        let playerWhite = messageData.playerWhite;
        let playerBlack = messageData.playerBlack;
        let userType = 'o';

        if (state.ACCOUNT_ID == playerWhite) {
            userType = 'w';
        } else if (state.ACCOUNT_ID == playerBlack) {
            userType = 'b';
        }

        this.commit('sessionStorage/CREATE_GAME_INSTANCE', topicId);
        
        this._vm.$set(state.MATCHES, topicId, {
            created: true,
            playerWhite: playerWhite,
            playerBlack: playerBlack,
            userType: userType,
            messages: [{
                account: 'Server',
                message: "Started a new match between " + playerWhite + " and " + playerBlack + "..."
            }],
            pgns: [''],
            boardState: [],
            resigned: false
        });
    },
    CLEAR_MATCH_OBJECT(state, topicId) {
        this._vm.$set(state.MATCHES, topicId, {});
    },

    /* Game Board */
    SET_BOARD_STATE(state, newBoardStateData) {
        let topicId = newBoardStateData.topicId;
        let newBoardState = newBoardStateData.newBoardState;
        
        state.MATCHES[topicId].boardState = newBoardState;
    },
    LOAD_PGN(state, boardData) {
        let topicId = boardData.topicId;
        let newPgn = boardData.newPgn;

        // TODO add a check here?
        state.GAME_INSTANCES[topicId].load_pgn(newPgn);
    },

    /* Message and Move Processing */
    PROCESS_CHAT_MESSAGE(state, messageData) {
        let topicId = messageData.topicId;
        let message = messageData.message;
        let operator = messageData.operator;
        let match = state.MATCHES[topicId];

        // filter out non-players
        if (operator != match.playerWhite && operator != match.playerBlack) {
            console.warn('Rejected a chat message from: ' + operator);
            return;
        }

        // filter out blank messages
        if (message == '' || message == ' ') {
            console.warn('Rejected an empty chat message from: ' + operator);
            return;
        }
        
        state.MATCHES[topicId].messages.push({
            account: operator,
            message: message
        });
    },
    PROCESS_CHESS_MOVE(state, messageData) {
        let topicId = messageData.topicId;
        let newPgn = messageData.newPgn;
        let operator = messageData.operator;
        let match = state.MATCHES[topicId];

        // filter out moves after game is over (game_over() or resigned match)
        if (state.GAME_INSTANCES[topicId].game_over() || state.MATCHES[topicId.resigned]) {
            return;
        }

        // filter out non-players
        if (operator != match.playerWhite && operator != match.playerBlack) {
            console.warn('Rejected a chess move from: ' + operator);
            return;
        }

        // filter out double moves
        if (state.MATCHES[topicId].pgns.length > 0) {
            if (operator == state.MATCHES[topicId].pgns.at(-1).operator ) {
                console.warn('Rejected a double move from: ' + operator);
                return;
            }
        }
        
        state.MATCHES[topicId].pgns.push({
            operator: operator,
            newPgn: newPgn
        });
    },
    PROCESS_RESIGN(state, messageData) {
        let topicId = messageData.topicId;
        let operator = messageData.operator;
        let playerWhite = state.MATCHES[topicId].playerWhite;
        let playerBlack = state.MATCHES[topicId].playerBlack;
        let resignedPlayer = '';

        if (operator == playerWhite) {
            resignedPlayer = 'w';
        } else if (operator == playerBlack) {
            resignedPlayer = 'b';
        } else {
            // somehow got a non-player resignation
            return;
        }

        state.MATCHES[topicId].resigned = resignedPlayer;
    },
};

/* Actions */
export const actions = {
    /* Hedera Hashgraph Client */
    async INIT_HASHGRAPH_CLIENT({}, context) {
        try {
            let accountId = AccountId.fromString(context.accountId);
            let privateKey = PrivateKey.fromString(context.privateKey);
            HederaClient = Client.forTestnet();
            HederaClient.setOperator(accountId, privateKey);
            return {
                success: true,
                responseMessage: 'Hedera Hashgraph client initialized'
            };
        } catch (error) {
            return {
                success: false,
                responseMessage: 'Hedera Hashgraph client failed to initialize'
            };
        }
    },
    
    /* Topic Subscription and Messages */
    async SUBSCRIBE_TO_TOPIC({ commit }, topicId) {
        //if we're subbing to a topic, clear out any pre-existing data for it
        commit('CLEAR_MATCH_OBJECT', topicId);
        commit('CLEAR_GAME_INSTANCE', topicId);
        
        const response = await this.dispatch('ASYNC_EMIT', {
            eventName: 'subscribeToTopic',
            topicId: topicId
        });
        
        return response;
    },
    async SEND_MESSAGE({ state }, messageData) {
        messageData['operator'] = state.ACCOUNT_ID;
        let messagePayload = JSON.stringify(messageData);
        
        try {
            await new TopicMessageSubmitTransaction({
                topicId: TopicId.fromString(messageData.topicId),
                message: messagePayload})
                .execute(HederaClient);

            return {
                success: true,
                responseMessage: 'Sent message to HCS'
            };
        } catch (error) {
            return {
                success: false,
                responseMessage: 'Failed to send message to HCS'
            };
        }
    },
    // not to be mistaken for PROCESS_CHAT_MESSAGE
    PROCESS_MESSAGE({ commit, state }, messageResponse) {
        let messageData = JSON.parse(messageResponse);

        //filter out irrelevant subs
        if (messageData.messageType != 'matchCreation' && !state.MATCHES[messageData.topicId]) {
            return;
        }
        
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
        case 'resignPlayer':
            commit('PROCESS_RESIGN', messageData);
            break;
        default:
            console.log('Got unknown message type: ' + messageData.messageType);
        }
    },

    /* Topic and Match Creation */
    async CREATE_TOPIC() {
        const tx = await new TopicCreateTransaction().execute(HederaClient);
        const topicReceipt = await tx.getReceipt(HederaClient);
        const newTopicId = topicReceipt.topicId.toString();

        return newTopicId;
    },
    async CREATE_MATCH({ state }, context) {
        try {
            let newTopicId = await this.dispatch('sessionStorage/CREATE_TOPIC');

            let newMatchData = {
                messageType: 'matchCreation',
                topicId: newTopicId,
                operator: state.ACCOUNT_ID,
                playerWhite: context.playerWhite,
                playerBlack: context.playerBlack,
            };

            this.dispatch('sessionStorage/SEND_MESSAGE', newMatchData);
            
            return {
                success: true,
                responseMessage: 'Created new topic ' + newTopicId,
                newTopicId: newTopicId,
            };
        } catch (error) {
            return {
                success: false,
                responseMessage: 'Failed to create a new topic',
                errorMessage: error
            };
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
    MATCH_PGNS: (state) => {
        return topicId => {
            return state.MATCHES[topicId].pgns;
        };
    },
    LATEST_MATCH_PGN: (state) => {
        return topicId => {
            return state.MATCHES[topicId].pgns.at(-1).newPgn;
        };
    },
    GAME_INSTANCE: (state) => {
        return topicId => {
            return state.GAME_INSTANCES[topicId];
        };
    },
    GAME_PGN: (state) => {
        return topicId => {
            return state.GAME_INSTANCES[topicId].pgn();
        };
    },
    GAME_STATE: (state) => {
        return topicId => {
            return state.GAME_INSTANCES[topicId].board();
        };
    },
    GAME_TURN(state) {
        return topicId => {
            return state.GAME_INSTANCES[topicId].turn();
        };
    },
    GAME_LEGAL_MOVES(state) {
        return args => {
            return state.GAME_INSTANCES[args.topicId].moves({ square: args.square, verbose: true });
        };
    },
    GAME_HISTORY(state) {
        return topicId => {
            let initState = [''];
            return initState.concat(state.GAME_INSTANCES[topicId].history());
        };
    },
    GAME_CHECK_STATUS(state) {
        return topicId => {
            return state.GAME_INSTANCES[topicId].in_check();
        };
    },
    GAME_RESIGNED_STATUS(state) {
        return topicId => {
            // check if either player resigned
            let resignedPlayer = state.MATCHES[topicId].resigned;
            
            if (resignedPlayer == 'w') {
                return 'Game Result: Resignation - Black Wins';
            } else if (resignedPlayer == 'b') {
                return 'Game Result: Resignation - White Wins';
            } else {
                return false;
            }
        };
    },
    GAME_OVER_STATUS(state) {
        return topicId => {
            // game_over() check
            if (state.GAME_INSTANCES[topicId].game_over()) {
                // check specific game over type
                if (state.GAME_INSTANCES[topicId].in_checkmate()) {
                    let currentTurn = state.GAME_INSTANCES[topicId].turn();
                    if (currentTurn == 'w') {
                        return 'Game Result: Checkmate - Black Wins';
                    } else {
                        return 'Game Result: Checkmate - White Wins';
                    }
                } else if (state.GAME_INSTANCES[topicId].in_draw()) {
                    return 'Game Result: Draw';
                } else if (state.GAME_INSTANCES[topicId].in_stalemate()) {
                    return 'Game Result: Stalemate';
                } else if (state.GAME_INSTANCES[topicId].in_threefold_repetition()) {
                    return 'Game Result: Threefold Repetition';
                } else {
                    return 'Game Result: Unknown';
                }
            } else {
                return false;
            }
        };
    }
};
