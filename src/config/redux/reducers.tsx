import { CONFIG_WILL_LOAD, LOAD_CONFIG_ERROR, SET_CONFIG } from "./actionTypes";
import { set } from "../../redux/functions";
import { equals } from "../functions";

import _ from "lodash";
const initial_state = {};

export default (state: any = initial_state, action) => {
  switch (action.type) {
    case CONFIG_WILL_LOAD:
      console.log(action);
      return {
        error: undefined,

        /**
         * The URL of the location associated with/configured by this
         * configuration.
         *
         * @type URL
         */
        locationURL: action.locationURL,
      };
      break;
    case LOAD_CONFIG_ERROR:
      if (state.locationURL === action.locationURL) {
        return {
          error: action.error,
        };
      }
      break;
    case SET_CONFIG:
      return _setConfig(state, action);
    default:
      return state;
  }
};
// */
function _setConfig(state, { config }) {
  console.log(state, config);
  // The mobile app bundles jitsi-meet and lib-jitsi-meet at build time and
  // does not download them at runtime from the deployment on which it will
  // join a conference. The downloading is planned for implementation in the
  // future (later rather than sooner) but is not implemented yet at the time
  // of this writing and, consequently, we must provide legacy support in the
  // meantime.

  // eslint-disable-next-line no-param-reassign
  config = _translateLegacyConfig(config);

  const newState = _.merge(
    {},
    config,
    { error: undefined },

    // The config of _getInitialState() is meant to override the config
    // downloaded from the Jitsi Meet deployment because the former contains
    // values that are mandatory.
    initial_state
  );

  // _cleanupConfig(newState);

  return equals(state, newState) ? state : newState;
}

// */
function _translateLegacyConfig(oldValue: Object) {
  let newValue = oldValue;

  const oldConfigToNewConfig = {
    analytics: [
      ["analyticsScriptUrls", "scriptURLs"],
      ["googleAnalyticsTrackingId", "googleAnalyticsTrackingId"],
    ],
  };

  // Translate the old config properties into the new config properties.
  Object.keys(oldConfigToNewConfig).forEach((section) => {
    if (typeof oldValue[section] !== "object") {
      newValue = set(newValue, section, {});
    }

    for (const [oldKey, newKey] of oldConfigToNewConfig[section]) {
      if (oldKey in newValue && !(newKey in newValue[section])) {
        const v = newValue[oldKey];

        // Do not modify oldValue.
        if (newValue === oldValue) {
          newValue = {
            ...newValue,
          };
        }
        delete newValue[oldKey];

        // Do not modify the section because it may be from oldValue
        // i.e. do not modify oldValue.
        newValue[section] = {
          ...newValue[section],
          [newKey]: v,
        };
      }
    }
  });

  return newValue;
}
