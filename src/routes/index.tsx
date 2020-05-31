import React, { Suspense } from "react";

import { Router } from "@reach/router";
import { Redirect } from "@reach/router";
import WelcomePage from "../pages/welcomePage";
import VideoPage from "../pages/videoPage";

export const AppRoutes = () => (
  <Suspense fallback={<div />}>
    <Router>
      <WelcomePage path="/welcome" />
      <VideoPage path="/video-meeting/:id" />
      <Redirect from="/" to="/welcome" noThrow />
    </Router>
  </Suspense>
);
