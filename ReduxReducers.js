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
  DELETE_CARD,
  LOAD_CARDS,
  DELETE_CARD_SUCCESS,
  DELETE_CARD_FAILURE,
  FETCH_USER_CARDS_SUCCESS,
  FETCH_USER_CARDS_FAILURE,
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
    preferred_asset: '',
    savings_goal_amount: '',
    time_period: '',
    bankRecords: [],
    cards: [],
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

    case DELETE_CARD_SUCCESS:
      return {
        ...state,
        cards: state.cards.filter((card) => card.id !== action.payload),
      };

    case DELETE_CARD_FAILURE:
      return {
        ...state,
        error: action.payload,
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
      case UPDATE_SAVINGS_GOAL:
        return {
          ...state,
          userInfo: {
            ...state.userInfo,
            ...action.payload,
          },
        };

      case UPDATE_ACCOUNT_BALANCES:
        return {
          ...state,
          accountBalances: action.payload,
        };
      case UPDATE_USER_TRANSACTIONS:
          return {
            ...state,
            userTransactions: action.payload,
          };
    default:

      case FETCH_USER_CARDS_SUCCESS:
        return {
          ...state,
          cards: action.payload,
        };

      case FETCH_USER_CARDS_FAILURE:
        return {
          ...state,
          error: action.payload,
        };    
      return state;
  }
};

export default Reducer;
