import { ICON_FAMILIES } from '@/common/components/Icon/icon.constants';
import { IconProps } from '@/common/components/Icon/icon.types';
import React from 'react';
const Icon = <T extends keyof typeof ICON_FAMILIES>({
  familyName,
  iconName,
  ...rest
}: IconProps<T>) => {
  const IconComponent = ICON_FAMILIES[familyName];
  return <IconComponent name={iconName} {...rest} />;
};

export default Icon;
