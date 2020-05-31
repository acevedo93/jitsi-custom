export const URI_PROTOCOL_PATTERN = "^([a-z][a-z0-9\\.\\+-]*:)";
const _URI_AUTHORITY_PATTERN = "(//[^/?#]+)";
const _URI_PATH_PATTERN = "([^?#]*)";
export const parseUri = (uri: any) => {
  // if (typeof uri !== "string") {
  //   return undefined;
  // }
  const obj = parseStandardURIString(_fixURIStringScheme(uri));
  console.log(obj);
  return obj;
};

export function parseURIString(uri) {
  if (typeof uri !== "string") {
    return undefined;
  }
  console.log("antes", uri);
  const obj = parseStandardURIString(_fixURIStringScheme(uri));
  console.log("despues", obj);
  // Add the properties that are specific to a Jitsi Meet resource (location)
  // such as contextRoot, room:

  // contextRoot
  obj.contextRoot = getLocationContextRoot(obj);

  // The room (name) is the last component/segment of pathname.
  const { pathname } = obj;

  // XXX While the components/segments of pathname are URI encoded, Jitsi Meet
  // on the client and/or server sides still don't support certain characters.
  const contextRootEndIndex = pathname.lastIndexOf("/");
  let room = pathname.substring(contextRootEndIndex + 1) || undefined;

  // if (room) {
  //   const fixedRoom = _fixRoom(room);

  //   if (fixedRoom !== room) {
  //     room = fixedRoom;

  //     // XXX Drive fixedRoom into pathname (because room is derived from
  //     // pathname).
  //     obj.pathname =
  //       pathname.substring(0, contextRootEndIndex + 1) + (room || "");
  //   }
  // }
  obj.room = room;

  return obj;
}
export function getLocationContextRoot({ pathname }: { pathname: string }) {
  const contextRootEndIndex = pathname.lastIndexOf("/");

  return contextRootEndIndex === -1
    ? "/"
    : pathname.substring(0, contextRootEndIndex + 1);
}
function _fixURIStringScheme(uri: string) {
  const protocol = "https://localhost:3000/video-meeting/";

  return protocol + uri;
}

export function parseStandardURIString(str: string) {
  /* eslint-disable no-param-reassign */

  const obj: any = {
    toString: _standardURIToString,
  };

  let regex;
  let match: Array<string> | null;

  // XXX A URI string as defined by RFC 3986 does not contain any whitespace.
  // Usually, a browser will have already encoded any whitespace. In order to
  // avoid potential later problems related to whitespace in URI, strip any
  // whitespace. Anyway, the Jitsi Meet app is not known to utilize unencoded
  // whitespace so the stripping is deemed safe.
  str = str.replace(/\s/g, "");

  // protocol
  regex = new RegExp(URI_PROTOCOL_PATTERN, "gi");
  match = regex.exec(str);
  if (match) {
    obj.protocol = match[1].toLowerCase();
    str = str.substring(regex.lastIndex);
  }

  // authority
  regex = new RegExp(`^${_URI_AUTHORITY_PATTERN}`, "gi");
  match = regex.exec(str);
  if (match) {
    let authority: string = match[1].substring(/* // */ 2);

    str = str.substring(regex.lastIndex);

    // userinfo
    const userinfoEndIndex = authority.indexOf("@");

    if (userinfoEndIndex !== -1) {
      authority = authority.substring(userinfoEndIndex + 1);
    }

    obj.host = authority;

    // port
    const portBeginIndex = authority.lastIndexOf(":");

    if (portBeginIndex !== -1) {
      obj.port = authority.substring(portBeginIndex + 1);
      authority = authority.substring(0, portBeginIndex);
    }

    // hostname
    obj.hostname = authority;
  }

  // pathname
  regex = new RegExp(`^${_URI_PATH_PATTERN}`, "gi");
  match = regex.exec(str);

  let pathname;

  if (match) {
    pathname = match[1];
    str = str.substring(regex.lastIndex);
  } else {
    pathname = undefined;
  }
  if (pathname) {
    pathname.startsWith("/") || (pathname = `/${pathname}`);
  } else {
    pathname = "/";
  }
  obj.pathname = pathname;
  obj.room = obj.pathname.split("/")[2];
  // query
  if (str.startsWith("?")) {
    let hashBeginIndex = str.indexOf("#", 1);

    if (hashBeginIndex === -1) {
      hashBeginIndex = str.length;
    }
    obj.search = str.substring(0, hashBeginIndex);
    str = str.substring(hashBeginIndex);
  } else {
    obj.search = ""; // Google Chrome
  }

  // fragment
  obj.hash = str.startsWith("#") ? str : "";

  /* eslint-enable no-param-reassign */
  return obj;
}

function _standardURIToString(this: any) {
  // eslint-disable-next-line no-invalid-this
  const { hash, host, pathname, protocol, search } = this;
  let str = "";

  protocol && (str += protocol);

  // TODO userinfo

  host && (str += `//${host}`);
  str += pathname || "/";
  search && (str += search);
  hash && (str += hash);

  return str;
}

export function parseURLParams(
  url: URL,
  dontParse: boolean = false,
  source: string = "hash"
): Object {
  const paramStr = source === "search" ? url.search : url.hash;
  const params = {};
  const paramParts = (paramStr && paramStr.substr(1).split("&")) || [];

  // Detect and ignore hash params for hash routers.
  if (source === "hash" && paramParts.length === 1) {
    const firstParam = paramParts[0];

    if (firstParam.startsWith("/") && firstParam.split("&").length === 1) {
      return params;
    }
  }

  paramParts.forEach((part) => {
    const param = part.split("=");
    const key = param[0];

    if (!key) {
      return;
    }

    let value;

    try {
      value = param[1];

      if (!dontParse) {
        const decoded = decodeURIComponent(value).replace(/\\&/, "&");

        value = decoded === "undefined" ? undefined : JSON.parse(decoded);
      }
    } catch (e) {
      console.log(e, `Failed to parse URL parameter value: ${String(value)}`);

      return;
    }
    params[key] = value;
  });

  return params;
}
