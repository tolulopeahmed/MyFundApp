// ReduxReducers.js
import {
  SET_USER_TOKEN, // Import action type constants
  ADD_BANK_ACCOUNT,
  DELETE_BANK_ACCOUNT,
  LOAD_BANK_ACCOUNTS,
  SET_USER_INFO,
  UPDATE_USER_PROFILE,
  SET_PROFILE_IMAGE_URI,
  ADD_MESSAGE,
  CLEAR_MESSAGES,
  UPDATE_SAVINGS_GOAL,
  UPDATE_ACCOUNT_BALANCES,
  UPDATE_USER_TRANSACTIONS,
  ADD_CARD,
  FETCH_CARDS_SUCCESS,
  ADD_CARD_SUCCESS,
  DELETE_CARD_SUCCESS,
  LOAD_CARDS,
  SET_AUTO_SAVE_SETTINGS,
  SET_AUTO_SAVE_OFF,
  SET_AUTO_INVEST_SETTINGS,
  SET_AUTO_INVEST_OFF,
  SET_TOP_SAVERS_DATA,
  SET_SELECTED_TOP_SAVER,
  SET_USER_PERCENTAGE,
  SET_KYC_STATUS,
  ADD_ALERT_MESSAGE
} from './ReduxActions';


const initialState = {
  accountBalances: {
    savings: 0,
    investment: 0,
    properties: 0,
    wallet: 0,
  },
  
  userTransactions: [],
  messages: [],
  authToken: null, // Add a new property to store the authentication token
  bankAccounts: [], // Initial state should come from AsyncStorage or API if available
  cards: [], // Initialize cards state

  profileImageUri: null, // Add a new field to store the profile picture URI

  kycStatus: null,

  alertMessages: [],


  topSaversData: {
    current_user: {
      id: null,
      first_name: '',
      last_name: '',
      email: '',
      profile_picture: '',
      individual_percentage: 0,
    },
    top_savers: [],
  },

  autoSaveSettings: {
    active: false,
    amount: 0,
    frequency: '',
  },

  autoInvestSettings: {
    active: false,
    amount: 0,
    frequency: '',
  },

  userInfo: {
    // Initialize user-related fields here
    is_first_time_signup: false,
    id: '',
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    profileImageUrl: null, // Initialize profileImageUrl as null
    token: '',
    referralValue: '',
    preferred_asset: '',
    savings_goal_amount: '',
    time_period: '',
    bankRecords: [],
    cards: [],
    top_saver_percentage: 0, // Initialize as needed
  },
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_TOKEN:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          token: action.payload,
        },
      };
      case UPDATE_SAVINGS_GOAL:
        return {
          ...state,
          userInfo: {
            ...state.userInfo,
            preferred_asset: action.payload.preferred_asset,
            savings_goal_amount: action.payload.savings_goal_amount,
            time_period: action.payload.time_period,
          },
        }; 
    case ADD_BANK_ACCOUNT:
      return {
        ...state,
        bankAccounts: [...state.bankAccounts, action.payload],
      };
    case DELETE_BANK_ACCOUNT:
      return {
        ...state,
        bankAccounts: state.bankAccounts.filter(
          (account) => account.account_number !== action.payload
        ),
      };
    case LOAD_BANK_ACCOUNTS:
      return {
        ...state,
        bankAccounts: action.payload,
      };
    case ADD_CARD:
      return {
        ...state,
        cards: [...state.cards, action.payload],
      };

      case FETCH_CARDS_SUCCESS:
        return {
          ...state,
          cards: action.payload,
        };
      case ADD_CARD_SUCCESS:
        return {
          ...state,
          cards: [...state.cards, action.payload],
        };
      case DELETE_CARD_SUCCESS:
        return {
          ...state,
          cards: state.cards.filter((card) => card.id !== action.payload),
        };
    case LOAD_CARDS:
      return {
        ...state,
        cards: action.payload,
      };
    case SET_USER_INFO:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.payload,
          top_saver_percentage: action.payload.top_saver_percentage,
        },
      };
      case UPDATE_USER_PROFILE: // Ensure this matches your action type
      return {
          ...state,
          userInfo: {
            ...state.userInfo,
            firstName: action.payload.first_name,
            lastName: action.payload.last_name,
            mobileNumber: action.payload.phone_number,
          },
        };
      
      case SET_PROFILE_IMAGE_URI:
      return {
        ...state,
        profileImageUri: action.payload,
      };
      case ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };
        case CLEAR_MESSAGES:
            return {
                ...state,
                messages: [],
            };
        
            case UPDATE_ACCOUNT_BALANCES:
              return {
                ...state,
                accountBalances: {
                  ...state.accountBalances,
                  ...action.payload, // Merge the new balances into the existing state
                },
              };
      case UPDATE_USER_TRANSACTIONS:
          return {
            ...state,
            userTransactions: action.payload,
          };

      
          case SET_AUTO_SAVE_SETTINGS:
            return {
              ...state,
              autoSaveSettings: {
                ...action.payload,
              },
            };
          case SET_AUTO_SAVE_OFF:
            return {
              ...state,
              autoSaveSettings: {
                ...state.autoSaveSettings,
                active: false, 
              },
            };

            case SET_AUTO_INVEST_SETTINGS:
              return {
                ...state,
                autoInvestSettings: {
                  ...action.payload,
                },
              };
            case SET_AUTO_INVEST_OFF:
              return {
                ...state,
                autoInvestSettings: {
                  ...state.autoInvestSettings,
                  active: false,
                },
              };
              case SET_TOP_SAVERS_DATA:
                return {
                  ...state,
                  topSaversData: action.payload, // Update the top savers data
                };
              case SET_SELECTED_TOP_SAVER:
                return {
                  ...state,
                  selectedTopSaver: action.payload, // Update the selected top saver
                };
              case SET_USER_PERCENTAGE:
                return {
                  ...state,
                  userPercentage: action.payload, // Update the user percentage
                };
                case SET_KYC_STATUS:
                  return {
                    ...state,
                    kycStatus: action.payload,
                  };
              case ADD_ALERT_MESSAGE:
                return {
                  ...state,
                  alertMessages: action.alertMessages,
                };
            
     default:
      return state;

     
  }
};

export default Reducer;
