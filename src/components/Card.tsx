import { observer } from 'mobx-react-lite';
import React from 'react';
import styled from 'styled-components';
import { Link as LinkType } from '../store/models';
import { useStore } from '../store/storeContext';
import { linkIsPublic } from '../utils/links';
import Link from './Link';

const Container = styled.article<{ isLocked?: boolean }>`
  background-color: ${p => p.theme.color.background};
  border-radius: ${p => p.theme.borderRadius.sm};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  ${p => p.theme.shadows[0]};

  main {
    position: relative;
    background-color: ${p => (p.isLocked ? p.theme.color.grey3 : 'none')};
    border-bottom: 2px solid ${p => p.theme.color.background};
    border-top-left-radius: ${p => p.theme.borderRadius.sm};
    border-top-right-radius: ${p => p.theme.borderRadius.sm};
    flex: 1;
    padding: ${p => p.theme.spacing.lg} ${p => p.theme.spacing.lg};

    .card__badge {
      position: absolute;
      top: ${p => p.theme.spacing.lg};
      right: ${p => p.theme.spacing.lg};
    }

    h1 {
      ${p => p.theme.font.h4};
      line-height: 28px;
    }

    p {
      ${p => p.theme.font.size.md};
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      min-height: 90px;
    }

    h1,
    p {
      color: ${p => (p.isLocked ? p.theme.color.grey : undefined)};
    }
  }

  footer {
    border-bottom-left-radius: ${p => p.theme.borderRadius.sm};
    border-bottom-right-radius: ${p => p.theme.borderRadius.sm};
    padding: ${p => p.theme.spacing.sm} ${p => p.theme.spacing.lg};
    background-color: ${p => p.theme.color.grey3};
    text-align: center;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${p => p.theme.color.secondary};
      font-family: ${p => p.theme.font.secondary};
      ${p => p.theme.font.size.md};
      svg {
        margin-left: ${p => p.theme.spacing.md};
      }
    }
  }
`;

interface Props {
  title?: string | null;
  text?: string | null;
  link?: LinkType | null;
  isLocked?: boolean;
  badge?: JSX.Element | false | null;
}

const Card: React.FC<Props> = observer(
  ({ title, text, link, isLocked, badge }) => {
    const {
      auth: { isLoggedIn },
    } = useStore();

    const isLinkPublic = link ? linkIsPublic(link) : undefined;

    return (
      <Container isLocked={isLocked || (!isLinkPublic && !isLoggedIn)}>
        <main>
          {title && <h1>{title}</h1>}
          {text && <p>{text}</p>}
          {badge && <div className="card__badge">{badge}</div>}
        </main>

        {link && (
          <footer>
            <Link link={link} label={link.label} showArrow center />
          </footer>
        )}
      </Container>
    );
  }
);

export default Card;
