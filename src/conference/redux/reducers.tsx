import { set, assign } from "../../redux/functions";
import { SET_ROOM } from "./actionTypes";
import { VIDEO_QUALITY_LEVELS } from "../constants";

const DEFAULT_STATE = {
  conference: undefined,
  e2eeSupported: undefined,
  joining: undefined,
  leaving: undefined,
  locked: undefined,
  maxReceiverVideoQuality: VIDEO_QUALITY_LEVELS.HIGH,
  password: undefined,
  passwordRequired: undefined,
  preferredVideoQuality: VIDEO_QUALITY_LEVELS.HIGH,
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_ROOM:
      return _setRoom(state, action);
  }

  return state;
};

function _setRoom(state, action) {
  let { room } = action;

  // aca no esta verificando si el room es valido

  return assign(state, {
    error: undefined,
    room,
  });
}
