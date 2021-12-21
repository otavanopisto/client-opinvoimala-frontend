import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { LinkIn } from '../store/models';
import { useStore } from '../store/storeContext';
import { linkIsPublic, linkTargetUrl } from '../utils/links';
import Icon from './Icon';

const Content = styled.div<{ center?: boolean }>`
  display: flex;
  justify-content: ${p => (p.center ? 'center' : 'space-between')};
  align-items: center;
  width: 100%;

  .link__label-container {
    min-height: 28px;
    display: flex;
    align-items: center;
  }

  svg,
  i {
    height: inherit;
    margin-right: ${p => p.theme.spacing.sm};

    &.arrow-icon {
      position: relative;
      left: 0px;
      margin-left: ${p => p.theme.spacing.sm};
      transition: left 0.1s ease-in-out;
    }
  }

  :hover {
    svg.arrow-icon {
      left: 5px;
    }
  }
`;

interface Props {
  link: LinkIn;
  label?: string | null;
  showArrow?: boolean;
  center?: boolean;
}

const Link: React.FC<Props> = ({
  link,
  label,
  showArrow,
  center,
  children,
}) => {
  const {
    auth: { isLoggedIn },
  } = useStore();

  if (!link) return null;

  const isExternal = link.type === 'external';
  const url = linkTargetUrl(link);
  const isPublic = linkIsPublic(link);
  const showLock = !isPublic && !isLoggedIn;

  const content = (
    <Content center={center}>
      {label && (
        <div className="link__label-container">
          {showLock && <Icon type="Lock" />}
          {label}
        </div>
      )}
      <div className="link__label-container">
        {!label && showLock && <Icon type="Lock" />}
        {children}
        {showArrow && (
          <Icon
            className="arrow-icon"
            type="ArrowRight"
            strokeColor="secondary"
            color="none"
            width={22}
          />
        )}
      </div>
    </Content>
  );

  if (!url) return null;

  if (isExternal) {
    return (
      <a href={url} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return <RouterLink to={url}>{content}</RouterLink>;
};

export default Link;
