import { ICON_FAMILIES } from "./icon.constants";
import { ComponentProps } from "react";

// Extract icon name types from each icon family
type IconName<T extends keyof typeof ICON_FAMILIES> = ComponentProps<
  (typeof ICON_FAMILIES)[T]
>["name"];

// Create a type that extends all icon component props and replaces 'name' with 'iconName'
type IconProps<T extends keyof typeof ICON_FAMILIES = keyof typeof ICON_FAMILIES> = Omit<
  ComponentProps<(typeof ICON_FAMILIES)[T]>,
  "name"
> & {
  familyName: T;
  iconName: IconName<T>;
};

export type { IconProps };
