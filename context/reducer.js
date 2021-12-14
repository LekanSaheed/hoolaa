export const reducer = (state, action) => {
  if (action.type === "TOGGLE_NAV") {
    return {
      ...state,
      isToggled: !state.isToggled,
    };
  }
};
