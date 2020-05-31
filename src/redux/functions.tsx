export function set(state: Object, property: string, value: any) {
  return _set(state, property, value, /* copyOnWrite */ true);
}

function _set(
  state: Object,
  property: string,
  value: any,
  copyOnWrite: boolean
) {
  // Delete state properties that are to be set to undefined. (It is a matter
  // of personal preference, mostly.)
  if (
    typeof value === "undefined" &&
    Object.prototype.hasOwnProperty.call(state, property)
  ) {
    const newState = copyOnWrite ? { ...state } : state;

    if (delete newState[property]) {
      return newState;
    }
  }

  if (state[property] !== value) {
    if (copyOnWrite) {
      return {
        ...state,
        [property]: value,
      };
    }

    state[property] = value;
  }

  return state;
}

export function assign(target: Object, source: Object) {
  let t = target;

  for (const property in source) {
    // eslint-disable-line guard-for-in
    t = _set(t, property, source[property], t === target);
  }

  return t;
}
