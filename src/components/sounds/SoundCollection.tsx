import React from "react";
import Audio, { AudioElement } from "../media/Audio";
import { Sound } from "./redux/reducers";
import { connect } from "react-redux";
import { _addAudioElement, _removeAudioElement } from "./redux/actions";
export interface Props {
  _addAudioElement: Function;
  _removeAudioElement: Function;
  _sounds: Map<string, Sound>;
}
class SoundsCollection extends React.Component<Props> {
  render() {
    let key = 0;
    const sounds: any = [];
    if (this.props._sounds) {
      Array.from(this.props._sounds.values(), (sound: any, soundId: any) => {
        const { options, src } = sound;
        const props = {
          key,
          setRef: this._setRef.bind(this, soundId),
          src,
          loop: options.loop,
        };
        sounds.push(<Audio {...props} />);
        key += 1;
      });

      return sounds;
    }
    return null;
  }
  _setRef = (soundId: string, element: AudioElement) => {
    if (element) {
      this.props._addAudioElement(soundId, element);
    } else {
      this.props._removeAudioElement(soundId);
    }
  };
}
function _mapStateToProps(state) {
  return {
    _sounds: state.sounds,
  };
}
function _mapDispatchToProps(dispatch: Function) {
  return {
    _addAudioElement(soundId: string, audioElement: AudioElement) {
      dispatch(_addAudioElement(soundId, audioElement));
    },
    _removeAudioElement(soundId: string) {
      dispatch(_removeAudioElement(soundId));
    },
  };
}
export default connect(_mapStateToProps, _mapDispatchToProps)(SoundsCollection);
