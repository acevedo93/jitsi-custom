import React from "react";
import { Dispatch } from "redux";
import { generateRoomWithoutSeparator } from "../../utils/roomNameGenerator.js";
import { connect } from "react-redux";
import { SettingsButtons } from "../../components/settingsButton/SettingsButtons";
import { appNavigate } from "../../app/redux/actions";
import "./styles.scss";
const ROOM_NAME_VALIDATE_PATTERN_STR = "^[^?&:\u0022\u0027%#]+$";
const WINDOW_WIDTH_THRESHOLD = 425;
interface Props {
  path: string;
  /**
   * Whether the calendar functionality is enabled or not.
   */
  _calendarEnabled: boolean;

  /**
   * Whether the insecure room name functionality is enabled or not.
   */
  _enableInsecureRoomNameWarning: boolean;

  /**
   * Whether the recent list is enabled
   */
  _recentListEnabled: Boolean;

  /**
   * Room name to join to.
   */
  _room: string;

  /**
   * The current settings.
   */
  _settings: Object;

  /**
   * The Redux dispatch Function.
   */
  dispatch?: Dispatch<any>;
  appNavigate: any;
}

class WelcomePage extends React.Component<Props, any> {
  _mounted?: boolean;
  _additionalContentRef;
  _additionalToolbarContentRef;
  _roomInputRef;
  _additionalContentTemplate: any = document.getElementById(
    "welcome-page-additional-content-template"
  );
  _additionalToolbarContentTemplate: any = document.getElementById(
    "settings-toolbar-additional-content-template"
  );
  static defaultProps = {
    _room: "",
  };
  state = {
    animateTimeoutId: undefined,
    generatedRoomname: true,
    insecureRoomName: false,
    joining: false,
    room: "",
    roomPlaceholder: "",
    updateTimeoutId: undefined,
    selectedTab: 0,
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      ...this.state,
      generatedRoomname: true, // en el orifinal esto apunta a un archivo interfaceConfig
      selectedTab: 0,
    };
    this._additionalContentRef = null;
  }

  componentDidMount() {
    this._mounted = true;
    document.body.classList.add("welcome-page");
    document.title = "jitsi-custom";
    if (this.state.generatedRoomname) {
      this._updateRoomname();
    }
  }
  componentWillUnmount() {
    this._clearTimeouts();
    this._mounted = false;
  }
  _updateRoomname = () => {
    const generatedRoomname = generateRoomWithoutSeparator();
    const roomPlaceholder = "";
    const updateTimeoutId = setTimeout(this._updateRoomname, 10000);

    this._clearTimeouts();
    this.setState(
      {
        generatedRoomname,
        roomPlaceholder,
        updateTimeoutId,
      },
      () => this._animateRoomnameChanging(generatedRoomname)
    );
  };
  _clearTimeouts = () => {
    clearTimeout(this.state.animateTimeoutId);
    clearTimeout(this.state.updateTimeoutId);
  };
  // animacion de letras
  _animateRoomnameChanging(word: string) {}

  static getDerivedStateFromProps(props: Props, state) {
    return {
      room: props._room || state.room,
    };
  }
  _shouldShowAdditionalContent = () => {
    return (
      this._additionalContentTemplate &&
      this._additionalContentTemplate.content &&
      this._additionalContentTemplate.innerHTML.trim()
    );
  };
  _shouldShowAdditionalToolbarContent = () => {
    return (
      this._additionalToolbarContentTemplate &&
      this._additionalToolbarContentTemplate.content &&
      this._additionalToolbarContentTemplate.innerHTML.trim()
    );
  };
  _setAdditionalContentRef = (el) => {
    this._additionalContentRef = el;
  };
  _setAdditionalToolbarContentRef = (el) => {
    this._additionalToolbarContentRef = el;
  };
  _setRoomInputRef = (el) => {
    this._roomInputRef = el;
  };
  _shouldShowResponsiveText = () => {
    const { innerWidth } = window;

    return innerWidth <= WINDOW_WIDTH_THRESHOLD;
  };
  _onJoin = () => {
    const room = this.state.room || this.state.generatedRoomname;
    if (room) {
      this.setState({ joining: true });

      // By the time the Promise of appNavigate settles, this component
      // may have already been unmounted.
      const onAppNavigateSettled = () =>
        this._mounted && this.setState({ joining: false });
      // luego de hacer el input se guarda el room nuevo;
      // y redirecciona
      this.props.appNavigate(room);

      //   .then(onAppNavigateSettled, onAppNavigateSettled);
    }
  };
  _onFormSubmit = (event) => {
    event.preventDefault();

    // if (!this._roomInputRef || this._roomInputRef.reportValidity()) {
    //   this._onJoin();
    // }
    this._onJoin();
  };

  // _renderTabs() {
  //   const { _calendarEnabled, _recentListEnabled } = this.props;

  //   const tabs: any = [];

  //   if (_calendarEnabled) {
  //     tabs.push({
  //       label: "go",
  //       content: <CalendarList />,
  //     });
  //   }

  //   if (_recentListEnabled) {
  //     tabs.push({
  //       label: t("welcomepage.recentList"),
  //       content: <RecentList />,
  //     });
  //   }

  //   if (tabs.length === 0) {
  //     return null;
  //   }

  //   return (
  //     <Tabs
  //       onSelect={this._onTabSelected}
  //       selected={this.state.selectedTab}
  //       tabs={tabs}
  //     />
  //   );
  // }
  _renderInsecureRoomNameWarning() {
    if (
      this.props._enableInsecureRoomNameWarning &&
      this.state.insecureRoomName
    ) {
      return this._doRenderInsecureRoomNameWarning();
    }

    return null;
  }
  _doRenderInsecureRoomNameWarning() {
    return (
      <div className="insecure-room-name-warning">
        {/* <Icon src={IconWarning} /> */}
        <span>Insecure room</span>
      </div>
    );
  }
  _onRoomChange = (ev) => {
    this.setState({
      room: ev.target.value,
      insecureRoomName:
        this.props._enableInsecureRoomNameWarning &&
        ev.target.value &&
        ev.target.value,
    });
  };

  render() {
    // const { t } = this.props;
    const APP_NAME = "Jitsi Custom";
    const showAdditionalContent: boolean = this._shouldShowAdditionalContent();
    const showAdditionalToolbarContent = this._shouldShowAdditionalToolbarContent();
    const showResponsiveText = this._shouldShowResponsiveText();
    return (
      <div
        className={`welcome ${
          showAdditionalContent ? "with-content" : "without-content"
        }`}
        id="welcome_page"
      >
        <div className="welcome-watermark">{/* <Watermarks /> */}</div>
        <div className="header">
          <div className="welcome-page-settings">
            <SettingsButtons defaultTab={"calentar_tab"} />
            {showAdditionalToolbarContent ? (
              <div
                className="settings-toolbar-content"
                ref={this._setAdditionalToolbarContentRef}
              />
            ) : null}
          </div>
          <div className="header-image" />
          <div className="header-text">
            <h1 className="header-text-title">JITSI CUSTOM</h1>
            <p className="header-text-description">Descripcion</p>
          </div>
          <div id="enter_room">
            <div className="enter-room-input-container">
              <div className="enter-room-title">Enter room</div>
              <form onSubmit={this._onFormSubmit}>
                <input
                  autoFocus={true}
                  className="enter-room-input"
                  id="enter_room_field"
                  onChange={this._onRoomChange}
                  pattern={ROOM_NAME_VALIDATE_PATTERN_STR}
                  placeholder={this.state.roomPlaceholder}
                  ref={this._setRoomInputRef}
                  title={"welcomepage.roomNameAllowedChars"}
                  type="text"
                  value={this.state.room}
                />
                {/* {this._renderInsecureRoomNameWarning()} // verificar generacion de nombres inseguros */}
              </form>
            </div>
            <div
              className="welcome-page-button"
              id="enter_room_button"
              onClick={this._onFormSubmit}
            >
              go
            </div>
          </div>
          {/* {this._renderTabs()} */}
        </div>
        {/* {showAdditionalContent ? (
          <div
            className="welcome-page-content"
            ref={this._setAdditionalContentRef}
          />
        ) : null} */}
      </div>
    );
  }
}
function _mapStateToProps(state: Object) {
  return {
    _calendarEnabled: true, //revisar si tiene el calendario de google habilitado
    _enableInsecureRoomNameWarning: true,
    //state["features/base/config"].enableInsecureRoomNameWarning || false,
    _recentListEnabled: true,
    // ver como genera este nombre
    //state["features/base/conference"].room,
    _settings: {},
    //state["features/base/settings"],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    appNavigate: (room) => dispatch(appNavigate(room)),
  };
}
export default connect(_mapStateToProps, mapDispatchToProps)(WelcomePage);
