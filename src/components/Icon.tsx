import React, { FC, useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Colors } from '../theme/styled';

import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';
import { ReactComponent as ChevronDown } from '../assets/icons/chevron-down.svg';
import { ReactComponent as ChevronLeft } from '../assets/icons/chevron-left.svg';
import { ReactComponent as ChevronUp } from '../assets/icons/chevron-up.svg';
import { ReactComponent as Close } from '../assets/icons/close.svg';
import { ReactComponent as Lock } from '../assets/icons/lock.svg';
import { ReactComponent as Menu } from '../assets/icons/menu.svg';
import { ReactComponent as Plus } from '../assets/icons/plus.svg';
import { ReactComponent as SignIn } from '../assets/icons/sign-in.svg';
import { ReactComponent as User } from '../assets/icons/md-person.svg';
import { ReactComponent as Video } from '../assets/icons/video.svg';

const Icons = {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Close,
  Lock,
  Menu,
  Plus,
  SignIn,
  User,
  Video,
};

export type IconType = keyof typeof Icons;

interface Props {
  type: IconType;
  color?: keyof Colors | 'none';
  strokeColor?: keyof Colors;
  width?: number;
}

const Icon: FC<Props> = ({
  type,
  color = 'secondary',
  strokeColor,
  width = 18,
}) => {
  const themeContext = useContext(ThemeContext);

  const stroke = strokeColor ? themeContext.color[strokeColor] : 'none';
  const fill = color && color !== 'none' ? themeContext.color[color] : 'none';

  const iconProps = {
    stroke,
    width,
    fill,
  };

  const IconComponent = Icons[type];

  return <IconComponent {...iconProps} />;
};

export default Icon;
