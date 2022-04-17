/* UTILS */
const TextDecoder = require("text-encoding").TextDecoder;
import { signAndMakeBytes } from "../assets/js/utils";

/* CHESS.JS */
import Chess from 'chess.js';

/* HASHCONNECT */
import { HashConnect } from "hashconnect";
var hashconnect = new HashConnect();

//hashconnect.debug = true; //DEBUG

var appMetadata = {
    name: "Hashgraph Chess",
    description: "Play chess over the Hedera Consensus Service",
    icon: "https://scalemailpublic.s3.us-east-2.amazonaws.com/bn.png"
};

/* HEDERA */
const { TopicCreateTransaction,
        TransactionReceipt,
        TopicMessageSubmitTransaction } = require("@hashgraph/sdk");

/* STATE */
export const state = () => ({
    ACTIVE_PANEL: 'loadingPanel',
    WALLET_DATA_FOUND: false,
    WALLET_CONNECTED: false,
    MATCHES: {},
    GAME_INSTANCES: {},
    TOPIC_MESSAGE_COUNTS: {}
});

/* MUTATIONS */
export const mutations = {
    /* Setters and Toggles */
    UNSET_CLIENT(state) {
        this.commit('localStorage/CLEAR_WALLET_DATA', {}, { root: true });
        state.WALLET_CONNECTED = false;
        state.WALLET_DATA_FOUND = false;
        state.ACTIVE_PANEL = 'startPanel';
    },
    SET_WALLET_DATA_FOUND(state) {
        state.WALLET_DATA_FOUND = true;
    },
    SET_WALLET_CONNECTED(state) {
        state.WALLET_CONNECTED = true;
    },
    DISCONNECT_WALLET(state) {
        state.WALLET_CONNECTED = false;
    },
    SET_ACTIVE_PANEL(state, newPanel) {
        state.ACTIVE_PANEL = newPanel;
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

        if (messageData.account == playerWhite) {
            userType = 'w';
        } else if (messageData.account == playerBlack) {
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
        let operator = messageData.sender;
        let match = state.MATCHES[topicId];

        // filter out non-players
        if (operator != match.playerWhite && operator != match.playerBlack) {
            console.warn('Rejected a chat message from: ' + operator);
            return;
        }

        // filter out blank messages
        if (message.trim() == '') {
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
        let operator = messageData.sender;
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
        if (state.MATCHES[topicId].pgns.length > 0 && operator == state.MATCHES[topicId].pgns.at(-1).operator) {
            console.warn('Rejected a double move from: ' + operator);
            return;
        }
        
        state.MATCHES[topicId].pgns.push({
            operator: operator,
            newPgn: newPgn
        });
    },
    PROCESS_RESIGN(state, messageData) {
        let topicId = messageData.topicId;
        let operator = messageData.sender;
        let playerWhite = state.MATCHES[topicId].playerWhite;
        let playerBlack = state.MATCHES[topicId].playerBlack;
        let resignedPlayer = '';

        if (operator == playerWhite) {
            resignedPlayer = 'w';
        } else if (operator == playerBlack) {
            resignedPlayer = 'b';
        } else {
            // somehow got a non-player resignation
            console.warn('Rejected a resignation attempt from non-player: ' + operator);
            return;
        }

        state.MATCHES[topicId].resigned = resignedPlayer;
    },
};

/* Actions */
export const actions = {
    /* HASH CONNECT */
    async INIT_HASH_CONNECT({ commit }) {
        try {
            // init hashconnect
            let initData = await hashconnect.init(appMetadata);
            let connection = await hashconnect.connect();

            // variables to store locally
            let privKey = initData.privKey;
            let pairedWalletData;
            let topic = connection.topic;
            let pairingString = hashconnect.generatePairingString(connection, "testnet", false);

            // find hashpack browser extension & connect
            hashconnect.foundExtensionEvent.once((walletMetaData) => {
                pairedWalletData = walletMetaData;
                hashconnect.connectToLocalWallet(pairingString, pairedWalletData);
            });

            // after user accepts pairing store the data locally
            hashconnect.pairingEvent.once((pairingData) => {
                let walletData = {
                    ACCOUNT_ID: pairingData.accountIds[0],
                    CONNECTION_TOPIC: topic,
                    TOPIC_PRIVATE_KEY: privKey,
                    TOPIC_PAIRING_STRING: pairingString,
                    METADATA: pairedWalletData
                };

                commit('localStorage/SAVE_WALLET_DATA', walletData, { root: true });
                commit('SET_WALLET_DATA_FOUND');
                commit('SET_WALLET_CONNECTED');
                commit('SET_ACTIVE_PANEL', 'clientPanel');
            });

            // kick off event chain
            hashconnect.findLocalWallets();

            return {
                success: true
            };
        } catch (error) {
            console.warn(error);
            return {
                success: false
            };
        }
    },
    async REINIT_HASH_CONNECT({ commit, rootState }) {
        try {
            let walletData = rootState.localStorage.WALLET_DATA;
            let privKey = walletData.TOPIC_PRIVATE_KEY;
            let topic = walletData.CONNECTION_TOPIC;
            let walletMetadata = walletData.METADATA;
            
            await hashconnect.init(walletMetadata, privKey);
            await hashconnect.connect(topic, walletMetadata);
            
            commit('SET_WALLET_CONNECTED');
            commit('SET_ACTIVE_PANEL', 'clientPanel');

            return {
                success: true
            };
        } catch (error) {
            console.warn(error);
            return {
                success: false
            };
        }
    },
    
    /* Topic Subscription and Messages */
    async QUERY_TOPIC({ state, commit }, topicId) {
        try {
            // is this our initial query of the topic?
            let initialQuery = (state.TOPIC_MESSAGE_COUNTS[topicId] > 0) ? false : true;

            // topic info query
            let topicInfo = await this.$axios.get(`/api/v1/topics/${topicId}/messages?order=desc&limit=1`);
            let lastMessage = topicInfo.data.messages[0];
            let topicSequenceCount = lastMessage.sequence_number;
            let lastReadMessage = 0;

            // loop through topic. process messages until we hit limit from our topic info query
            // note: this is not great, esp. for 100+ message topics. gRPC subs are easier to work with, but require a server
            while (lastReadMessage < topicSequenceCount) {
                var response; // API wont let me query gt:0
                if (lastReadMessage === 0) {
                    response = await this.$axios.$get(`/api/v1/topics/${topicId}/messages/?limit=100`);
                } else {
                    response = await this.$axios.$get(`/api/v1/topics/${topicId}/messages/?limit=100&sequenceNumber=gt:${lastReadMessage}`);
                }
                
                response.messages.forEach(message => {
                    lastReadMessage = message.sequence_number;
                    this.dispatch('sessionStorage/PROCESS_MESSAGE', message);
                });
            }

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
    async SEND_MESSAGE({ rootState }, messageData) {   
        try {
            let acctId = rootState.localStorage.WALLET_DATA.ACCOUNT_ID;
            let topic = rootState.localStorage.WALLET_DATA.CONNECTION_TOPIC;
            let messagePayload = JSON.stringify(messageData);

            let tx = new TopicMessageSubmitTransaction()
                .setMessage(messagePayload)
                .setTopicId(messageData.topicId);
            
            let txBytes = await signAndMakeBytes(tx, acctId);

            let transaction = {
                topic,
                byteArray: txBytes,

                metadata: {
                    accountToSign: acctId,
                    returnTransaction: false
                }
            };

            let res = await hashconnect.sendTransaction(topic, transaction);

            if (res.success) {
                return {
                    success: true
                };
            } else {
                return {
                    success: false,
                    responseMessage: "Transaction rejected."
                };
            }
        } catch (error) {
            return {
                success: false,
                responseMessage: error
            };
        }
    },
    // not to be mistaken for PROCESS_CHAT_MESSAGE
    PROCESS_MESSAGE({ commit, state, rootState }, messagePayload) {
        let topicId = messagePayload.topic_id;
        let msgIndex = messagePayload.sequence_number;
        let rawMessage = new TextDecoder("utf-8").decode(Buffer.from(messagePayload.message, 'base64'));
        let messageObject = JSON.parse(rawMessage);
        messageObject.sender = messagePayload.payer_account_id;

        // ignore messages whose sequence number we have already seen
        if (state.TOPIC_MESSAGE_COUNTS[topicId] >= msgIndex) {
            return;
        } else {
            commit('INCREMENT_TOPIC_MESSAGE_COUNT', topicId);
        }
        
        switch(messageObject.messageType) {
        case 'matchCreation':
            messageObject.account = rootState.localStorage.WALLET_DATA.ACCOUNT_ID;
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
    async CREATE_TOPIC({ rootState }) {
        try {
            let acctId = rootState.localStorage.WALLET_DATA.ACCOUNT_ID;
            let topic = rootState.localStorage.WALLET_DATA.CONNECTION_TOPIC;
            
            let tx = new TopicCreateTransaction();
            let txBytes = await signAndMakeBytes(tx, acctId);

            let transaction = {
                topic,
                byteArray: txBytes,
                
                metadata: {
                    accountToSign: acctId,
                    returnTransaction: false
                }
            };

            let topicReceipt;
            let res = await hashconnect.sendTransaction(topic, transaction);

            // TODO: handle failed transaction
            if (res.success) {
                topicReceipt = TransactionReceipt.fromBytes(res.receipt);
                let newTopicId = topicReceipt.topicId.toString();
                return {
                    success: true,
                    newTopicId
                };
            } else {
                return {
                    success: false,
                    responseMessage: "Transaction rejected."
                };
            }
        } catch (error) {
            return {
                success: false,
                responseMessage: error
            };
        }
    },
    async CREATE_MATCH({ rootState }, context) {
        try {
            let newTopicResult = await this.dispatch('sessionStorage/CREATE_TOPIC');
            let operator = rootState.localStorage.WALLET_DATA.ACCOUNT_ID;

            if (!newTopicResult.success) return {
                success: false,
                responseMessage: newTopicResult.responseMessage
            };

            let newTopicId = newTopicResult.newTopicId;

            let newMatchData = {
                messageType: 'matchCreation',
                topicId: newTopicId,
                operator: operator,
                playerWhite: operator,
                playerBlack: context.playerBlack,
            };

            let matchCreationResult = await this.dispatch('sessionStorage/SEND_MESSAGE', newMatchData);

            if (matchCreationResult.success) {   
                return {
                    success: true,
                    responseMessage: 'Created new topic ' + newTopicId,
                    newTopicId: newTopicId,
                };
            } else {
                return {
                    success: false,
                    responseMessage: 'Match creation message rejected. Created topic is now an orphan.'
                };
            }
        } catch (error) {
            return {
                success: false,
                responseMessage: 'Failed to create a new match.'
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
