import { SET_LOCATION_URL } from "./actionTypes";
export function setLocationURL(locationURL: URL) {
  return {
    type: SET_LOCATION_URL,
    locationURL,
  };
}
