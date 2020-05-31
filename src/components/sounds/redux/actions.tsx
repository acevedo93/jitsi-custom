import {
  _ADD_AUDIO_ELEMENT,
  _REMOVE_AUDIO_ELEMENT,
  PLAY_SOUND,
  REGISTER_SOUND,
  STOP_SOUND,
  UNREGISTER_SOUND,
} from "./actionTypes";
import { AudioElement } from "../../media/Audio";
export function _addAudioElement(soundId: string, audioElement: AudioElement) {
  return {
    type: _ADD_AUDIO_ELEMENT,
    audioElement,
    soundId,
  };
}

export function _removeAudioElement(soundId: string) {
  return {
    type: _REMOVE_AUDIO_ELEMENT,
    soundId,
  };
}
export function playSound(soundId: string): Object {
  return {
    type: PLAY_SOUND,
    soundId,
  };
}
export function registerSound(
  soundId: string,
  soundName: string,
  options: Object = {}
): Object {
  return {
    type: REGISTER_SOUND,
    soundId,
    src: `sounds/${soundName}`,
    options,
  };
}
