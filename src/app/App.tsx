import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import store from "../redux/store.js";
import { AtlasKitThemeProvider } from "@atlaskit/theme";
import { AppRoutes } from "../routes";
import { appWillMount } from "./redux/actions";
import SoundsCollection from "../components/sounds/SoundCollection";

class App extends React.Component {
  componentDidMount() {
    store.dispatch(appWillMount(this));
    console.log(store.getState());
  }
  render() {
    return (
      <Provider store={store}>
        <AtlasKitThemeProvider mode="dark">
          <SoundsCollection />
          <AppRoutes />
        </AtlasKitThemeProvider>
      </Provider>
    );
  }
}

export default App;
