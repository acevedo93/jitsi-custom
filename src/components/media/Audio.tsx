import React from "react";

export interface AudioElement {
  currentTime: number;
  pause: () => void;
  play: () => void;
  setSinkId?: (string) => Promise<any>;
  stop: () => void;
}

export interface Props {
  src: Object | string;
  stream?: Object;
  loop?: boolean;
  setRef?: (AudioElement) => void;
}

class Audio extends React.Component<Props> {
  _audioElementImpl?: AudioElement;

  constructor(props: Props) {
    super(props);
  }

  setAudioElementImpl = (element: AudioElement): void => {
    this._audioElementImpl = element;
    const { setRef } = this.props;
    if (typeof setRef === "function") {
      setRef(element ? this : null);
    }
  };
  pause = (): void => {
    this._audioElementImpl && this._audioElementImpl.pause();
  };
  play = (): void => {
    this._audioElementImpl && this._audioElementImpl.play();
  };
  stop = (): void => {
    this._audioElementImpl && this._audioElementImpl.stop();
  };
  setSinkId(sinkId: string): void {
    this._audioElementImpl &&
      typeof this._audioElementImpl.setSinkId === "function" &&
      this._audioElementImpl
        .setSinkId(sinkId)
        .catch((err) => console.log("error setting sink", err));
  }
}

export default Audio;
