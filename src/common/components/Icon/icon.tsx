import React from "react";
import { ICON_FAMILIES } from "./icon.constants";
import { IconProps } from "./icon.types";

const Icon = <T extends keyof typeof ICON_FAMILIES>({
  familyName,
  iconName,
  ...rest
}: IconProps<T>) => {
  const IconComponent = ICON_FAMILIES[familyName];
  return <IconComponent name={iconName} {...rest} />;
};

export default Icon;
