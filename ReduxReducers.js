// ReduxReducers.js

const initialState = {
  //authToken: null, // Add a new property to store the authentication token
  bankAccounts: [], // Initial state should come from AsyncStorage or API if available
  profileImageUri: null, // Add a new field to store the profile picture URI
  userInfo: {
    // Initialize user-related fields here
    is_first_time_signup: false,
    id: '',
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    profileImageUrl: '',
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
    case 'SET_USER_TOKEN':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          token: action.payload,
        },
      };
    case 'ADD_BANK_ACCOUNT':
      return {
        ...state,
        bankAccounts: [...state.bankAccounts, action.payload],
      };
    case 'DELETE_BANK_ACCOUNT':
      return {
        ...state,
        bankAccounts: state.bankAccounts.filter(
          (account) => account.account_number !== action.payload
        ),
      };
    case 'SET_USER_INFO':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.payload,
        },
      };
    case 'SET_PROFILE_IMAGE_URI':
      return {
        ...state,
        profileImageUri: action.payload,
      };
    // Add other user-related actions and reducers here

    default:
      return state;
  }
};

export default Reducer;
