export const initialState = {
  selectedMovie: {},
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_MOVIE":
      let data = action.payload;
      debugger
      return {
        ...state,
        selectedMovie: { ...state.selectedMovie, ...data },
      };

    default:
      return state;
  }
};
