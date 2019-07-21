export const signupUser = (formData, history) => ({
  type: "SET_USER",
  payload: formData,
  history: history
});
