import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { LinkIn } from '../store/models';
import { useStore } from '../store/storeContext';
import { linkIsPublic, linkTargetUrl } from '../utils/links';
import Icon from './Icon';

const Content = styled.div<{ center?: boolean; linkStyle: 'normal' | 'alert' }>`
  display: flex;
  justify-content: ${p => (p.center ? 'center' : 'space-between')};
  align-items: center;
  width: 100%;
  color: ${p => (p.linkStyle === 'alert' ? p.theme.color.accent : undefined)};

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

const LinkButton = styled.button`
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
`;

// Extend basic link model with additional "button" type
export interface LinkItem extends Omit<LinkIn, 'type'> {
  type: 'external' | 'internal' | 'page' | 'test' | 'exercise' | 'button';
  onClick?: () => void;
  style?: 'normal' | 'alert';
}

interface Props {
  link: LinkItem;
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

  const isButton = link.type === 'button' && !!link.onClick;

  const isExternal = link.type === 'external';
  const url = !isButton && linkTargetUrl(link as LinkIn);
  const isPublic = isButton ? true : linkIsPublic(link as LinkIn);
  const showLock = !isPublic && !isLoggedIn;

  const content = (
    <Content center={center} linkStyle={link.style ?? 'normal'}>
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

  if (isButton) {
    return (
      <LinkButton role="link" type="button" onClick={link.onClick}>
        <span className="link">{content}</span>
      </LinkButton>
    );
  }

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
