import React from "react";

interface VideoPageProps {
  path: string;
}

class VideoPage extends React.Component<VideoPageProps> {
  render() {
    return <div>Hola desde el video page</div>;
  }
}

export default VideoPage;
