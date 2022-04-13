/* UTILS */
const TextDecoder = require("text-encoding").TextDecoder;

/* CHESS.JS */
import Chess from 'chess.js';

/* HASHCONNECT */
import { HashConnect } from "hashconnect";
var hashconnect = new HashConnect();

hashconnect.debug = true; //DEBUG

var appMetaData = {
    name: "Hashgraph Chess",
    description: "Play chess over the Hedera Consensus Service",
    icon: ""
};

/* HEDERA */
const { PrivateKey,
        AccountId,
        TopicId,
        TopicCreateTransaction,
        TransactionId,
        TransactionReceipt,
        Transaction,
        TopicMessageSubmitTransaction } = require("@hashgraph/sdk");

/* STATE */
export const state = () => ({
    WALLET_CONNECTED: false,
    ACTIVE_PANEL: 'loadingPanel',
    MATCHES: {},
    GAME_INSTANCES: {},
    TOPIC_MESSAGE_COUNTS: {}
});

/* MUTATIONS */
export const mutations = {
    /* Setters and Toggles */
    UNSET_CLIENT(state) {
        //TODO unset local storage vars with clear method
        this.commit('localStorage/CLEAR_HC_DATA', {}, { root: true });
        state.WALLET_CONNECTED = false;
        state.ACTIVE_PANEL = 'startPanel';
        state.LOCK_BUTTON = false;
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
        var topicId = messageData.topicId;
        var playerWhite = messageData.playerWhite;
        var playerBlack = messageData.playerBlack;
        var userType = 'o';

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
        var topicId = newBoardStateData.topicId;
        var newBoardState = newBoardStateData.newBoardState;
        
        state.MATCHES[topicId].boardState = newBoardState;
    },
    LOAD_PGN(state, pgnData) {
        var topicId = pgnData.topicId;
        var newPgn = pgnData.newPgn;

        state.GAME_INSTANCES[topicId].load_pgn(newPgn);
    },

    /* Message and Move Processing */
    PROCESS_CHAT_MESSAGE(state, messageData) {
        var topicId = messageData.topicId;
        var message = messageData.message;
        var operator = messageData.operator;
        var match = state.MATCHES[topicId];

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
        var topicId = messageData.topicId;
        var newPgn = messageData.newPgn;
        var operator = messageData.operator;
        var match = state.MATCHES[topicId];

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
        var topicId = messageData.topicId;
        var operator = messageData.operator;
        var playerWhite = state.MATCHES[topicId].playerWhite;
        var playerBlack = state.MATCHES[topicId].playerBlack;
        var resignedPlayer = '';

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
            let initData = await hashconnect.init(appMetaData);
            let connection = await hashconnect.connect();
            
            var privKey = initData.privKey;
            var accountId;
            var pairedWalletData;
            var topic = connection.topic;
            
            var pairingString = hashconnect.generatePairingString(connection, "testnet", false);

            hashconnect.foundExtensionEvent.once((walletMetaData) => {
                pairedWalletData = walletMetaData;
                hashconnect.connectToLocalWallet(pairingString, pairedWalletData);
            });

            hashconnect.pairingEvent.once((pairingData) => {
                accountId = pairingData.accountIds[0];
                commit('localStorage/SET_PRIVATE_KEY', privKey, { root: true });
                commit('localStorage/SET_ACCOUNT_ID', accountId, { root: true });
                commit('localStorage/SET_PAIRING_STRING', pairingString, { root: true });
                commit('localStorage/SET_HC_TOPIC', topic, { root: true });
                commit('localStorage/SET_PAIRED_WALLET', pairedWalletData, { root: true });
                commit('SET_WALLET_CONNECTED');
                commit('SET_ACTIVE_PANEL', 'clientPanel');
            });
        
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
            let privKey = rootState.localStorage.PRIVATE_KEY;
            let topic = rootState.localStorage.HC_TOPIC;
            let pairedWalletData = rootState.localStorage.PAIRED_WALLET;
        
            await hashconnect.init(pairedWalletData, privKey);
            await hashconnect.connect(topic, pairedWalletData);
            
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
            var initialQuery = (state.TOPIC_MESSAGE_COUNTS[topicId] > 0) ? false : true;
            
            let response = await this.$axios.$get(`/api/v1/topics/${topicId}/messages/?limit=100`);
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
        var messagePayload = JSON.stringify(messageData);
        
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
        var topicId = messagePayload.topic_id;
        var msgIndex = messagePayload.sequence_number;
        var rawMessage = new TextDecoder("utf-8").decode(Buffer.from(messagePayload.message, 'base64'));
        var messageObject = JSON.parse(rawMessage);

        // ignore messages whose sequence number we have already seen
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
    async CREATE_TOPIC({ rootState }) {
        try {
            let acctId = rootState.localStorage.ACCOUNT_ID;
            let topic = rootState.localStorage.HC_TOPIC;
            
            let tx = new TopicCreateTransaction();
            let txBytes = await signAndMakeBytes(tx, acctId);

            const transaction = {
                topic,
                byteArray: txBytes,
                
                metadata: {
                    accountToSign: acctId,
                    returnTransaction: true
                }
            };

            let res = await hashconnect.sendTransaction(topic, transaction);
            
            console.log(res);
            
            let topicReceipt;
            if (res.success) topicReceipt = TransactionReceipt.fromBytes(res.receipt);
            const newTopicId = topicReceipt.topicId.toString();

            return newTopicId;
            
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    async CREATE_MATCH({ state }, context) {
        try {
            var newTopicId = await this.dispatch('sessionStorage/CREATE_TOPIC');

            if (!newTopicId) return { success: false };

            var newMatchData = {
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
            var initState = [''];
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
            var resignedPlayer = state.MATCHES[topicId].resigned;
            
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
                    var currentTurn = state.GAME_INSTANCES[topicId].turn();
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

/* UTILS */
async function signAndMakeBytes(tx, signingAcctId) {
    const privateKey = PrivateKey.fromString("302e020100300506032b657004220420b12133b7b9d433a5059624c5ae226c57b60d48d84fc7cad5ebd8c45d69c2d988"); // this is an ACTUAL hedera private key
    const publicKey = privateKey.publicKey;
    
    let newId = TransactionId.generate(signingAcctId);
    tx.setTransactionId(newId);
    tx.setNodeAccountIds([new AccountId(3)]);

    tx = await tx.freeze();
    let txBytes = tx.toBytes();

    const sig = await privateKey.signTransaction(Transaction.fromBytes(txBytes));
    const out = tx.addSignature(publicKey, sig);
    const outBytes = out.toBytes();

    return outBytes;
}
