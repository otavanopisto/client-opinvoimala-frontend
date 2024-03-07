import React from 'react';
import styled from 'styled-components';
import { ReactComponent as WatermarkNegativeSvg } from '../../assets/watermark-negative.svg';
import { ReactComponent as WatermarkDefaultSvg } from '../../assets/watermark.svg';
import { useWindowDimensions } from '../../utils/hooks';

const Container = styled.div<{ position: string }>`
  position: absolute;
  svg {
    width: 80px;
  }

  @media ${p => p.theme.breakpoint.tablet} {
    top: auto;
    right: auto;
    ${p => p.position};
    svg {
      width: auto;
    }
  }

  @media print {
    display: none;
  }
`;

interface Position {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface Props extends Position {
  width?: number;
  isNegative?: boolean;
  showOnlyOnScreensAbove?: number;
}

const getPositionCss = ({ top, right, bottom, left }: Position) => {
  let css = '';
  if (top !== undefined && !isNaN(top)) css += `top: ${top}px;`;
  if (right !== undefined && !isNaN(right)) css += `right: ${right}px;`;
  if (bottom !== undefined && !isNaN(bottom)) css += `bottom: ${bottom}px;`;
  if (left !== undefined && !isNaN(left)) css += `left: ${left}px;`;
  return css;
};

const Watermark: React.FC<Props> = ({
  width = 150,
  isNegative = false,
  top,
  right,
  bottom,
  left,
  showOnlyOnScreensAbove,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  const positionCss = getPositionCss({ top, right, bottom, left });

  const Image = isNegative ? WatermarkNegativeSvg : WatermarkDefaultSvg;

  if (showOnlyOnScreensAbove && windowWidth < showOnlyOnScreensAbove) {
    return null;
  }

  return (
    <Container position={positionCss} aria-hidden="true">
      <Image width={`${width}px`} aria-hidden="true" />
    </Container>
  );
};

export default Watermark;
