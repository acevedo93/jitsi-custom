import { config } from "../config/config";
export async function loadConfig(url: string): Promise<Object> {
  // eslint-disable-line no-unused-vars
  // Return "the config.js file" from the global scope - that is how the
  // Web app on both the client and the server was implemented before the
  // React Native app was even conceived.
  return config;
}
