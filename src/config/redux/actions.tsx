import { CONFIG_WILL_LOAD, LOAD_CONFIG_ERROR, SET_CONFIG } from "./actionTypes";
import { interfaceConfig } from "../interfaceConfig";
import { loggingConfig } from "../loggingConfig";
import { setConfigFromURLParams } from "../functions";
import { Dispatch } from "redux";
import { jitsiLocalStorage } from "js-utils";
import { addKnownDomains } from "../../known-domains/redux/actions";
import { parseURIString } from "../../utils/uri";
export function configWillLoad(locationURL: URL, room: string) {
  console.log(locationURL, room);
  return {
    type: CONFIG_WILL_LOAD,
    locationURL,
    room,
  };
}

export function loadConfigError(error: Error, locationURL: URL) {
  return {
    type: LOAD_CONFIG_ERROR,
    error,
    locationURL,
  };
}

export function setConfig(config: Object = {}) {
  return (dispatch: Dispatch<any>, getState: Function) => {
    const { locationURL } = getState()["base/connection"];

    // Now that the loading of the config was successful override the values
    // with the parameters passed in the hash part of the location URI.
    // TODO We're still in the middle ground between old Web with config,
    // interfaceConfig, and loggingConfig used via global variables and new
    // Web and mobile reading the respective values from the redux store.
    // On React Native there's no interfaceConfig at all yet and
    // loggingConfig is not loaded but there's a default value in the redux
    // store.
    // Only the config will be overridden on React Native, as the other
    // globals will be undefined here. It's intentional - we do not care to
    // override those configs yet.
    locationURL &&
      setConfigFromURLParams(
        // On Web the config also comes from the window.config global,
        // but it is resolved in the loadConfig procedure.
        config,
        interfaceConfig,
        loggingConfig,
        locationURL
      );

    dispatch({
      type: SET_CONFIG,
      config,
    });
  };
}

export function storeConfig(baseURL: string, config: Object) {
  return (dispatch: Dispatch<any>) => {
    // Try to store the configuration in localStorage. If the deployment
    // specified 'getroom' as a function, for example, it does not make
    // sense to and it will not be stored.
    let b = false;

    try {
      if (typeof config === "undefined" || config !== config) {
        // jitsiLocalStorage.setItem(
        //   `config.js/${baseURL}`,
        //   JSON.stringify(config)
        // );
        window.localStorage.setItem(
          `config.js/${baseURL}`,
          JSON.stringify(config)
        );
        b = true;
      }
    } catch (e) {
      // Ignore the error because the caching is optional.
    }
    console.log(b);

    // If base/config knows a domain, then the app knows it.
    if (b) {
      try {
        dispatch(addKnownDomains(parseURIString(baseURL).host));
      } catch (e) {
        console.log(e);
        // Ignore the error because the fiddling with "known domains" is
        // a side effect here.
      }
    }

    // return b;
    console.log("STORECONFIG");
    console.log(baseURL, config);
  };
}
