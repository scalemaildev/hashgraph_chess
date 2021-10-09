/* UTILS */
const TextDecoder = require("text-encoding").TextDecoder;

/* CHESS.JS */
import Chess from 'chess.js';

/* HEDERA */
const { Client,
        AccountId,
        PrivateKey,
        TopicId,
        TopicCreateTransaction,
        TopicMessageSubmitTransaction } = require("@hashgraph/sdk");

var HederaClient;

/* STATE */
export const state = () => ({
    ACCOUNT_ID: '',
    PRIVATE_KEY: '',
    ACTIVE_PANEL: 'loadingPanel',
    LOCK_BUTTON: false,
    MATCHES: {},
    GAME_INSTANCES: {},
    TOPIC_MESSAGE_COUNTS: {}
});

/* MUTATIONS */
export const mutations = {
    /* Setters and Toggles */
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
    TOGGLE_INITIAL_QUERY_COMPLETE(state, topicId) {
        state.MATCHES[topicId].initialQueryComplete = true;
    },

    /* Topic Message Counts */
    CREATE_TOPIC_MESSAGE_COUNT(state, topicId) {
        state.TOPIC_MESSAGE_COUNTS[topicId] = 0;
    },
    INCREMENT_TOPIC_MESSAGE_COUNT(state, topicId) {
        state.TOPIC_MESSAGE_COUNTS[topicId]++;
    },
    
    /* Map Object Creation */
    CREATE_GAME_INSTANCE(state, topicId) {
        state.GAME_INSTANCES[topicId] = new Chess();
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
            playerWhite: playerWhite,
            playerBlack: playerBlack,
            userType: userType,
            messages: [{
                account: 'Server',
                message: "Started a new match between " + playerWhite + " and " + playerBlack + "..."
            }],
            pgns: [''],
            boardState: [],
            resigned: false,
            initialQueryComplete: false
        });
    },

    /* Game Board */
    SET_BOARD_STATE(state, newBoardStateData) {
        let topicId = newBoardStateData.topicId;
        let newBoardState = newBoardStateData.newBoardState;
        
        state.MATCHES[topicId].boardState = newBoardState;
    },
    LOAD_PGN(state, pgnData) {
        let topicId = pgnData.topicId;
        let newPgn = pgnData.newPgn;

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
    /* Hedera Client */
    async INIT_HEDERA_CLIENT({}, context) {
        try {
            let accountId = AccountId.fromString(context.accountId);
            let privateKey = PrivateKey.fromString(context.privateKey);
            HederaClient = Client.forTestnet();
            HederaClient.setOperator(accountId, privateKey);
            return {
                success: true,
                responseMessage: 'Initialized Hedera client'
            };
        } catch (error) {
            return {
                success: false,
                responseMessage: 'Hedera client failed to initialize'
            };
        }
    },
    
    /* Topic Subscription and Messages */
    async QUERY_TOPIC({ state, commit }, topicId) {
        try {
            // is this our initial query of the topic?
            let initialQuery = true;
            if (state.TOPIC_MESSAGE_COUNTS[topicId] > 0) {
                initialQuery = false;
            }
            
            let response = await this.$axios.$get(`/api/v1/topics/${topicId}/messages/`);
            response.messages.forEach(message => {
                this.dispatch('sessionStorage/PROCESS_MESSAGE', message);
            });

            if (initialQuery) {
                commit('TOGGLE_INITIAL_QUERY_COMPLETE', topicId);
            }

            return {
                success: true,
                responseMessage: `Queried topic: ${topicId}`
            };
        } catch (error) {
            return {
                success: false,
                responseMessage: `Failed to query topic: ${topicId}`
            };
        }
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
    PROCESS_MESSAGE({ commit, state }, messagePayload) {
        let topicId = messagePayload.topic_id;
        let msgIndex = messagePayload.sequence_number;
        let rawMessage = new TextDecoder("utf-8").decode(Buffer.from(messagePayload.message, 'base64'));
        let messageObject = JSON.parse(rawMessage);

        // ignore messages whose sequence number we already have seen
        if (state.TOPIC_MESSAGE_COUNTS[topicId] >= msgIndex) {
            return;
        } else {
            commit('INCREMENT_TOPIC_MESSAGE_COUNT', topicId);
        }
        
        switch(messageObject.messageType) {
        case 'matchCreation':
            commit('CREATE_MATCH_OBJECT', messageObject);
            break;
        case 'chatMessage':
            commit('PROCESS_CHAT_MESSAGE', messageObject);
            break;
        case 'chessMove':
            commit('PROCESS_CHESS_MOVE', messageObject);
            break;
        case 'resignPlayer':
            commit('PROCESS_RESIGN', messageObject);
            break;
        default:
            console.log('Got unknown message type: ' + messageObject.messageType);
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
