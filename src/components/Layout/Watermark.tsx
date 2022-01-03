import React from 'react';
import styled from 'styled-components';
import { ReactComponent as WatermarkNegativeSvg } from '../../assets/watermark-negative.svg';
import { ReactComponent as WatermarkDefaultSvg } from '../../assets/watermark.svg';

const Container = styled.div<{ position: string }>`
  position: absolute;
  ${p => p.position};

  @media ${p => p.theme.breakpoint.tablet} {
    top: -50px;
    right: 30px;
    left: auto;
    bottom: auto;
    svg {
      width: 80px;
    }
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
}) => {
  const positionCss = getPositionCss({ top, right, bottom, left });

  const Image = isNegative ? WatermarkNegativeSvg : WatermarkDefaultSvg;

  return (
    <Container position={positionCss} aria-hidden="true">
      <Image width={`${width}px`} aria-hidden="true" />
    </Container>
  );
};

export default Watermark;
