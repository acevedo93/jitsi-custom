import { Dispatch } from "redux";
import { parseUri } from "../../utils/uri";
import {
  APP_WILL_MOUNT,
  APP_WILL_UNMOUNT,
  AppWillMountAction,
  AppWillUnMountAction,
} from "./actionTypes";
import {
  configWillLoad,
  loadConfigError,
  setConfig,
  storeConfig,
} from "../../config/redux/actions";

import { loadConfig } from "../../lib-jitsi-meet/function";
import { setLocationURL } from "../../connection/redux/actions";
import { setRoom } from "../../conference/redux/actions";

export const appWillMount = (app: Object) => {
  return (dispatch: Dispatch<AppWillMountAction>) => {
    // init api
    dispatch({
      type: APP_WILL_MOUNT,
      app,
    });
  };
};

export const appWillUnmount = (app: Object) => {
  return (dispatch: Dispatch<AppWillUnMountAction>) => {
    dispatch({
      type: APP_WILL_UNMOUNT,
      app,
    });
  };
};

export const appNavigate = (uri: String) => {
  return async (dispatch: Dispatch<any>, getState: Function) => {
    //configurar el location correcto para mandar al nuevo room

    let location = parseUri(uri);
    // if(!location || !location.host) {
    //   const defaultLocation = "https://localhost:3000/welcomePage";
    // }
    location.protocol || (location.protocol = "https:");
    const { contextRoot, host, room } = location;
    const locationURL = new URL(location.toString());

    // dispara el inicio de la configuracion para el nuevo room
    dispatch(configWillLoad(locationURL, room));
    let protocol = location.protocol.toLowerCase();
    const baseURL = `${protocol}//${host}${contextRoot || "/"}`;
    let url = `${baseURL}config.js`;
    let config;
    // revisar configuracion para cuando existe un error y debe recargar a configuracion previa
    if (!config) {
      try {
        config = await loadConfig(url);
        dispatch(storeConfig(baseURL, config));
      } catch (err) {
        console.log(err);
      }
    }
    if (getState()["base/config"].locationURL !== locationURL) {
      dispatch(
        loadConfigError(new Error("Config no longer needed!"), locationURL)
      );
    }
    dispatch(setLocationURL(locationURL));
    dispatch(setConfig(config));
    dispatch(setRoom(room));
    dispatch(redirectWithStoredParams(locationURL.pathname));
    console.log(getState());
  };
};

export function redirectWithStoredParams(pathname: string) {
  return (dispatch: Dispatch<any>, getState: Function) => {
    const { locationURL } = getState()["base/connection"];
    const newLocationURL = new URL(locationURL.href);
    newLocationURL.pathname = pathname;
    window.location.assign(newLocationURL.toString());
  };
}
