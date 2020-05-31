import { APP_WILL_MOUNT, APP_WILL_UNMOUNT } from "./actionTypes";
import { AnyAction } from "redux";

export default (state: any = {}, action: AnyAction) => {
  switch (action.type) {
    case APP_WILL_MOUNT:
      const { app } = action;
      if (state.app != app) {
        return {
          ...state,
          app,
        };
      }
      break;
    case APP_WILL_UNMOUNT:
      if (state.app === action.app) {
        return {
          ...state,
          app: undefined,
        };
      }
    default:
      return state;
  }
};
