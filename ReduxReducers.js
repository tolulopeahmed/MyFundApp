// bankReducer.js

const initialState = {
    bankAccounts: [], // Initial state should come from AsyncStorage or API if available
  };
  
  const bankReducer = (state = initialState, action) => {
    switch (action.type) {
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
      default:
        return state;
    }
  };
  
  export default bankReducer;
  