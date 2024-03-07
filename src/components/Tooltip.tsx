import React from 'react';
import { Popup, PopupProps } from 'semantic-ui-react';
import styled from 'styled-components';

const StyledPopup = styled(Popup)`
  &.ui.popup {
    padding: ${p => p.theme.spacing.md};
    font-family: ${p => p.theme.font.secondary};
    color: ${p => p.theme.color.secondary};
    z-index: 11000;
  }
`;

export interface Props extends PopupProps {
  content?: string;
}

const Tooltip: React.FC<Props> = ({ content, trigger }) => {
  return (
    <StyledPopup
      content={content}
      position="top center"
      size="tiny"
      trigger={trigger}
    />
  );
};
export default Tooltip;
