import * as React from 'react';
import { createPortal } from 'react-dom';
import { ReadingRulerBase } from './reading-ruler-base';

/**
 * ReadingRulerPortalProps
 */
interface ReadingRulerPortalProps {
  active: boolean;
  onClose?: () => void;
}

/**
 * ReadingRulerPortal
 * @param props props
 * @returns Reading ruler within portal component
 */
const ReadingRuler: React.FC<ReadingRulerPortalProps> = props =>
  createPortal(
    <ReadingRulerBase active={props.active} onClose={props.onClose} />,
    document.body
  );

export default ReadingRuler;
