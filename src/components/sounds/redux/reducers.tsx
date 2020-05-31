import { AudioElement } from "../../media/Audio";
import { AnyAction } from "redux";
import {
  _ADD_AUDIO_ELEMENT,
  _REMOVE_AUDIO_ELEMENT,
  REGISTER_SOUND,
  UNREGISTER_SOUND,
} from "./actionTypes";
export type Sound = {
  /**
   * The HTMLAudioElement which implements the audio playback functionality.
   * Becomes available once the sound resource gets loaded and the sound can
   * not be played until that happens.
   */
  audioElement?: AudioElement;

  /**
   * This field describes the source of the audio resource to be played. It
   * can be either a path to the file or an object depending on the platform
   * (native vs web).
   */
  src: Object | string;

  /**
   * This field is container for all optional parameters related to the sound.
   */
  options: Object;
};

const DEFAULT_STATE = new Map();

export default (state = DEFAULT_STATE, action: AnyAction) => {
  switch (action.type) {
    case _ADD_AUDIO_ELEMENT:
    case _REMOVE_AUDIO_ELEMENT:
      return _addOrRemoveAudioElement(state, action);

    case REGISTER_SOUND:
      return _registerSound(state, action);

    case UNREGISTER_SOUND:
      return _unregisterSound(state, action);

    default:
      return state;
  }
};

function _addOrRemoveAudioElement(state, action) {
  const isAddAction = action.type === _ADD_AUDIO_ELEMENT;
  const nextState = new Map(state);
  const { soundId } = action;

  const sound: any = nextState.get(soundId);

  if (sound) {
    if (isAddAction) {
      nextState.set(
        soundId,
        assign(sound, {
          audioElement: action.audioElement,
        })
      );
    } else {
      nextState.set(
        soundId,
        assign(sound, {
          audioElement: undefined,
        })
      );
    }
  } else {
    console.log(`${action.type}: no sound for id: ${soundId}`);
  }

  return nextState;
}

function _unregisterSound(state, action) {
  const nextState = new Map(state);

  nextState.delete(action.soundId);

  return nextState;
}

function _registerSound(state, action) {
  const nextState = new Map(state);

  nextState.set(action.soundId, {
    src: action.src,
    options: action.options,
  });

  return nextState;
}
// exportar luego esto a un archivo general
export function assign(target: Object, source: Object) {
  let t = target;

  for (const property in source) {
    // eslint-disable-line guard-for-in
    t = _set(t, property, source[property], t === target);
  }

  return t;
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
