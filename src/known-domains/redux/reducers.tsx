// Lista de dominios conocidos por la app
import { ADD_KNOWN_DOMAINS } from "./actionTypes";
import { APP_WILL_MOUNT } from "../../app/redux/actionTypes";
export const DEFAULT_STATE = [
  "alpha.jitsi.net",
  "beta.meet.jit.si",
  "meet.jit.si",
  "8x8.vc",
];

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ADD_KNOWN_DOMAINS:
      return _addKnownDomains(state, action.knownDomains);

    case APP_WILL_MOUNT:
      // In case persistence has deserialized a weird redux state:
      return _addKnownDomains(state, DEFAULT_STATE);

    default:
      return state;
  }
};

function _addKnownDomains(state, knownDomains) {
  // In case persistence has deserialized a weird redux state:
  let nextState = Array.isArray(state) ? state : [];

  if (Array.isArray(knownDomains)) {
    nextState = Array.from(state);
    for (let knownDomain of knownDomains) {
      knownDomain = knownDomain.toLowerCase();
      !nextState.includes(knownDomain) && nextState.push(knownDomain);
    }
  }

  return nextState;
}
