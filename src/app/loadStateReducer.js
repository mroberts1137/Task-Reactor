export const loadStateReducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
};
