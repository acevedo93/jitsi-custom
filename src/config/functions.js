import _ from "lodash";
import INTERFACE_CONFIG_WHITELIST from "./interfaceConfigWhiteList";
import CONFIG_WHITELIST from "./configWhiteList.js";
import { parseURLParams } from "../utils/uri";
export function setConfigFromURLParams(
  config,
  interfaceConfig,
  loggingConfig,
  location
) {
  const params = parseURLParams(location);
  const json = {};

  // At this point we have:
  // params = {
  //     "config.disableAudioLevels": false,
  //     "config.channelLastN": -1,
  //     "interfaceConfig.APP_NAME": "Jitsi Meet"
  // }
  // We want to have:
  // json = {
  //     config: {
  //         "disableAudioLevels": false,
  //         "channelLastN": -1
  //     },
  //     interfaceConfig: {
  //         "APP_NAME": "Jitsi Meet"
  //     }
  // }
  config && (json.config = {});
  interfaceConfig && (json.interfaceConfig = {});
  loggingConfig && (json.loggingConfig = {});

  for (const param of Object.keys(params)) {
    let base = json;
    const names = param.split(".");
    const last = names.pop();

    for (const name of names) {
      base = base[name] = base[name] || {};
    }

    base[last] = params[param];
  }

  overrideConfigJSON(config, interfaceConfig, loggingConfig, json);
}

export function overrideConfigJSON(
  config,
  interfaceConfig,
  loggingConfig,
  json
) {
  for (const configName of Object.keys(json)) {
    let configObj;

    if (configName === "config") {
      configObj = config;
    } else if (configName === "interfaceConfig") {
      configObj = interfaceConfig;
    } else if (configName === "loggingConfig") {
      configObj = loggingConfig;
    }
    if (configObj) {
      const configJSON = _getWhitelistedJSON(configName, json[configName]);

      if (!_.isEmpty(configJSON)) {
        console.log(
          `Extending ${configName} with: ${JSON.stringify(configJSON)}`
        );

        // eslint-disable-next-line arrow-body-style
        _.mergeWith(configObj, configJSON, (oldValue, newValue) => {
          // XXX We don't want to merge the arrays, we want to
          // overwrite them.
          return Array.isArray(oldValue) ? newValue : undefined;
        });
      }
    }
  }
}

function _getWhitelistedJSON(configName, configJSON) {
  if (configName === "interfaceConfig") {
    return _.pick(configJSON, INTERFACE_CONFIG_WHITELIST);
  } else if (configName === "config") {
    return _.pick(configJSON, CONFIG_WHITELIST);
  }

  return configJSON;
}

export function equals(a, b) {
  return _.isEqual(a, b);
}
