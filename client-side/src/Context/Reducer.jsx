export const initialState = {
  setdata: {},
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      let data = action.payload;
      return {
        ...state,
        setdata: { ...state.setdata, ...data },
      };

    default:
      return state;
  }
};
