import { ADD_KNOWN_DOMAINS } from "./actionTypes";
export function addKnownDomains(knownDomains: string | Array<string>) {
  return {
    type: ADD_KNOWN_DOMAINS,
    knownDomains:
      typeof knownDomains === "string" ? [knownDomains] : knownDomains,
  };
}
