import React from 'react';
import {
  Divider,
  Message as SemanticMessage,
  MessageProps,
} from 'semantic-ui-react';

export interface Props extends MessageProps {}

const Message: React.FC<Props> = ({ size = 'mini', ...props }) => (
  <>
    <SemanticMessage {...props} size={size} />
    <Divider hidden aria-hidden="true" />
  </>
);

export default Message;
