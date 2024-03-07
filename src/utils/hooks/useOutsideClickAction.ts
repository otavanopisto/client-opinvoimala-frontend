import React, { useEffect } from 'react';

interface UseOutsideClickActionProps {
  ref: React.RefObject<HTMLDivElement>;
  action: Function;
  condition?: boolean;
  disabled?: boolean;
}

/**
 * Triggers given action when detects mouse click outside of the given element defined by ref
 */
export const useOutsideClickAction = ({
  ref,
  action,
  condition = true,
  disabled = false,
}: UseOutsideClickActionProps) => {
  useEffect(() => {
    if (disabled) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (condition && !ref.current?.contains(event.target as Node)) {
        action();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [action, condition, ref, disabled]);
};
