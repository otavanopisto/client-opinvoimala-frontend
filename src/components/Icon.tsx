import React, { FC, useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Colors } from '../theme/styled';

import { ReactComponent as Annotation } from '../assets/icons/comment-exclamation.svg';
import { ReactComponent as ArrowLeft } from '../assets/icons/arrow-left.svg';
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';
import { ReactComponent as ChartLine } from '../assets/icons/chart-line.svg';
import { ReactComponent as Chat } from '../assets/icons/bx-chat.svg';
import { ReactComponent as Check } from '../assets/icons/check.svg';
import { ReactComponent as ChevronDown } from '../assets/icons/chevron-down.svg';
import { ReactComponent as ChevronLeft } from '../assets/icons/chevron-left.svg';
import { ReactComponent as ChevronUp } from '../assets/icons/chevron-up.svg';
import { ReactComponent as Close } from '../assets/icons/close.svg';
import { ReactComponent as Completed } from '../assets/icons/completed-check.svg';
import { ReactComponent as Download } from '../assets/icons/download.svg';
import { ReactComponent as Lock } from '../assets/icons/lock.svg';
import { ReactComponent as Menu } from '../assets/icons/menu.svg';
import { ReactComponent as Minus } from '../assets/icons/minus.svg';
import { ReactComponent as Plus } from '../assets/icons/plus.svg';
import { ReactComponent as SignIn } from '../assets/icons/sign-in.svg';
import { ReactComponent as User } from '../assets/icons/md-person.svg';
import { ReactComponent as Video } from '../assets/icons/video.svg';
import { ReactComponent as Thumbs } from '../assets/icons/thumbs.svg';

const Icons = {
  Annotation,
  ArrowLeft,
  ArrowRight,
  ChartLine,
  Chat,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Close,
  Completed,
  Download,
  Lock,
  Menu,
  Minus,
  Plus,
  SignIn,
  User,
  Video,
  Thumbs,
};

export type IconType = keyof typeof Icons;

interface Props {
  type: IconType;
  color?: keyof Colors | 'none';
  strokeColor?: keyof Colors;
  width?: number;
  className?: string;
}

const Icon: FC<Props> = ({
  type,
  color = 'secondary',
  strokeColor,
  width = 18,
  className,
}) => {
  const themeContext = useContext(ThemeContext);

  const stroke = strokeColor ? themeContext.color[strokeColor] : 'none';
  const fill = color && color !== 'none' ? themeContext.color[color] : 'none';

  const iconProps = {
    stroke,
    width,
    fill,
    className,
  };

  const IconComponent = Icons[type];

  return <IconComponent {...iconProps} />;
};

export default Icon;
