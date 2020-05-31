import { SET_ROOM } from "./actionTypes";

export function setRoom(room) {
  return {
    type: SET_ROOM,
    room,
  };
}
