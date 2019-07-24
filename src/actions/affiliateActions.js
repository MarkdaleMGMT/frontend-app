import { SEND_INVITE } from "./types";

//action creator to authneticate user during the login page
export const send_invite = (formData, history) => ({
  type: SEND_INVITE,
  payload: formData,
  history: history
});
