import React, { Fragment } from "react";
import Tooltip from "@atlaskit/tooltip";
import Icon from "../../assets/components/Icon";

class ToolBoxItem extends React.Component<any> {
  static defaultProps = {
    disabled: false,
    label: "",
    showLabel: false,
    t: undefined,
    tooltip: "",
    tooltipPosition: "top",
    visible: true,
  };
  accessibilityLabel: any;
  tooltip: String | undefined;
  label: String | undefined;

  constructor(props) {
    super(props);
  }

  _renderItem = () => {
    const {
      disabled,
      elementAfter,
      onClick,
      showLabel,
      tooltipPosition,
    } = this.props;
    const className = showLabel ? "overflow-menu-item" : "toolbox-button";
    const props = {
      "aria-label": this.accessibilityLabel,
      className: className + (disabled ? " disabled" : ""),
      onClick: disabled ? undefined : onClick,
    };
    const elementType = showLabel ? "li" : "div";
    const useTooltip = this.tooltip && this.tooltip.length > 0;
    let children = (
      <Fragment>
        {this._renderIcon()}
        <div>Hola</div>
        {showLabel && <span>{this.label}</span>}
        {elementAfter}
      </Fragment>
    );

    if (useTooltip) {
      children = (
        <Tooltip content={this.tooltip} position={tooltipPosition}>
          {children}
        </Tooltip>
      );
    }

    return React.createElement(elementType, props, children);
  };
  _onClick(...args) {
    const { disabled, onClick } = this.props;

    disabled || (onClick && onClick(...args));
  }
  render() {
    return this.props.visible ? this._renderItem() : null;
  }
  _renderIcon() {
    const { customClass, disabled, icon, showLabel, toggled } = this.props;
    const iconComponent = <Icon src={icon} />;
    const elementType = showLabel ? "span" : "div";
    const className = `${
      showLabel ? "overflow-menu-item-icon" : "toolbox-icon"
    } ${toggled ? "toggled" : ""} ${disabled ? "disabled" : ""} ${
      customClass ?? ""
    }`;

    return React.createElement(elementType, { className }, iconComponent);
  }
}

export { ToolBoxItem };
