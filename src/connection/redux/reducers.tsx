import {
  CONNECTION_DISCONNECTED,
  CONNECTION_ESTABLISHED,
  CONNECTION_FAILED,
  CONNECTION_WILL_CONNECT,
  SET_LOCATION_URL,
} from "./actionTypes";
import { AnyAction } from "redux";
import { set } from "../../redux/functions";

export default (state = {}, action) => {
  switch (action.type) {
    case SET_LOCATION_URL:
      return _setLocationURL(state, action);
  }
  return state;
};

function _setLocationURL(state: Object, { locationURL }: { locationURL: URL }) {
  return set(state, "locationURL", locationURL);
}
