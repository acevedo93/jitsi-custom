import { ToolBoxItem } from "../toolBoxItem/ToolBoxItem";
import React from "react";
// interface Props {
//   /**
//    * Function to be called after the click handler has been processed.
//    */
//   afterClick?: Function;

//   /**
//    * Extra styles which will be applied in conjunction with `styles` or
//    * `toggledStyles` when the button is disabled;
//    */
//   disabledStyles?: Styles;

//   /**
//    * Whether to show the label or not.
//    */
//   showLabel: boolean;

//   /**
//    * Collection of styles for the button.
//    */
//   styles: Styles;

//   /**
//    * Collection of styles for the button, when in toggled state.
//    */
//   toggledStyles: Styles;

//   /**
//    * From which direction the tooltip should appear, relative to the button.
//    */
//   tooltipPosition: string;

//   /**
//    * Whether this button is visible or not.
//    */
//   visible: boolean;
//   /**
//    * Whether we are in filmstrip only mode or not.
//    */
//   _filmstripOnly: boolean;

//   /**
//    * The default tab at which the settings dialog will be opened.
//    */
//   defaultTab: string;

//   /**
//    * The redux {@code dispatch} function.
//    */
//   dispatch: Function;
// }

export const defaultDisabledButtonStyles = {
  iconStyle: {
    opacity: 0.5,
  },
  labelStyle: {
    opacity: 0.5,
  },
  style: undefined,
  underlayColor: undefined,
};

class SettingsButtons extends React.Component<any> {
  static defaultProps = {
    afterClick: undefined,
    disabledStyles: defaultDisabledButtonStyles,
    showLabel: false,
    styles: undefined,
    toggledStyles: undefined,
    tooltipPosition: "top",
    visible: true,
  };
  constructor(props) {
    super(props);
  }
  _isDisabled() {
    return false;
  }

  _onClick = () => {
    const { afterClick } = this.props;
    this._handleClick();
    afterClick && afterClick();
  };
  _handleClick() {
    const {
      _filmstripOnly,
      defaultTab = "calentar_tab",
      dispatch,
    } = this.props;
    // if (_filmstripOnly) {
    //   dispatch(openDeviceSelectionPopup());
    // } else {
    //   dispatch(openSettingsDialog(defaultTab));
    // }
  }
  //   _getIcon() {
  //     return (this._isToggled() ? this.toggledIcon : this.icon) || this.icon;
  //   }
  _isToggled() {
    return false;
  }

  render() {
    const props = {
      ...this.props,
      accessibilityLabel: "texto de entrada",
      disabled: false,
      elementAfter: null,
      icon: {},
      label: "Label String",
      toggled: false,
      tooltip: "toolTip",
    };

    return (
      <ToolBoxItem
        disabled={this._isDisabled()}
        onClick={this._onClick}
        {...props}
      />
    );
  }
}

export { SettingsButtons };
