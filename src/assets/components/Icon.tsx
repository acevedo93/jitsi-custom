// @flow

import React from "react";

export const DEFAULT_COLOR = "white";

export const DEFAULT_SIZE = 24;

/**
 * Implements an Icon component that takes a loaded SVG file as prop and renders it as an icon.
 *
 * @param {Props} props - The props of the component.
 * @returns {Reactelement}
 */
function Icon(props: any) {
  const {
    className,
    color,
    id,
    onClick,
    size,
    src: IconComponent,
    style,
  } = props;

  const calculatedColor = DEFAULT_COLOR;
  const calculatedSize = DEFAULT_SIZE;

  return (
    <div
      className={`jitsi-icon ${className}`}
      onClick={onClick}
      style={{ color: calculatedColor, fontSize: calculatedSize }}
    >
      {/* <IconComponent
        fill={calculatedColor}
        height={calculatedSize}
        id={id}
        width={calculatedSize}
      /> */}
    </div>
  );
}

Icon.defaultProps = {
  className: "",
};

export default Icon;
