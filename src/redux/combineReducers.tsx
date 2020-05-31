import { combineReducers } from "redux";
import app from "../app/redux/reducers";
import config from "../config/redux/reducers";
import connection from "../connection/redux/reducers";
import sounds from "../components/sounds/redux/reducers";
import knowDomains from "../known-domains/redux/reducers";
import conferences from "../conference/redux/reducers";

const rootReducer = combineReducers({
  app,
  sounds,
  "base/config": config,
  "base/connection": connection,
  "base/knowDommains": knowDomains,
  "base/conference": conferences,
});

export default rootReducer;
