import { observer } from 'mobx-react-lite';
import React from 'react';
import styled from 'styled-components';
import { Link as LinkType, Image } from '../store/models';
import { useStore } from '../store/storeContext';
import { linkIsPublic } from '../utils/links';
import Heading, { HeadingLevel } from './Heading';
import Link from './Link';

const Container = styled.article<{ isLocked?: boolean }>`
  background-color: ${p => p.theme.color.background};
  border-radius: ${p => p.theme.borderRadius.sm};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  ${p => p.theme.shadows[0]};

  img {
    width: 100%;
    object-fit: cover;
    margin: 0;

    border-radius: 0;
    border-top-left-radius: ${p => p.theme.borderRadius.sm};
    border-top-right-radius: ${p => p.theme.borderRadius.sm};

    aspect-ratio: 16 / 9;
  }

  main {
    position: relative;
    background-color: ${p => (p.isLocked ? p.theme.color.grey3 : 'none')};
    border-bottom: 2px solid ${p => p.theme.color.background};
    border-top-left-radius: ${p => p.theme.borderRadius.sm};
    border-top-right-radius: ${p => p.theme.borderRadius.sm};
    flex: 1;
    padding-bottom: ${p => p.theme.spacing.lg};
    min-height: 200px;

    .card-heading,
    p,
    ul {
      padding: 0 ${p => p.theme.spacing.lg};
    }

    .card__badge {
      position: absolute;
      top: ${p => p.theme.spacing.lg};
      right: ${p => p.theme.spacing.lg};
    }

    .card-heading {
      ${p => p.theme.font.h4};
      line-height: 28px;
      padding-right: 48px;
      margin-top: ${p => p.theme.spacing.lg};
      margin-bottom: ${p => p.theme.spacing.md};
    }

    p {
      margin-top: ${p => p.theme.spacing.sm};
      ${p => p.theme.font.size.sm};
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }

    .card-heading,
    p {
      color: ${p => (p.isLocked ? p.theme.color.grey : undefined)};
    }
  }

  footer {
    border-bottom-left-radius: ${p => p.theme.borderRadius.sm};
    border-bottom-right-radius: ${p => p.theme.borderRadius.sm};
    padding: ${p => p.theme.spacing.md} ${p => p.theme.spacing.lg};
    background-color: ${p => p.theme.color.grey3};
    text-align: center;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${p => p.theme.color.secondary};
      font-family: ${p => p.theme.font.secondary};
      ${p => p.theme.font.size.sm};
      text-decoration: none;
    }
  }
`;

const TagList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    display: inline-block;
    padding: 0 ${p => p.theme.spacing.md};
    background-color: ${p => p.theme.color.accentLight};
    border-radius: ${p => p.theme.borderRadius.sm};

    color: ${p => p.theme.color.secondary};
    font-family: ${p => p.theme.font.secondary};
    ${p => p.theme.font.size.xs};

    :not(:last-child) {
      margin-right: ${p => p.theme.spacing.sm};
    }
  }
`;

interface Props {
  title?: string | null;
  text?: string | null;
  image?: Image | null;
  tags?: string[];
  link?: LinkType | null;
  isLocked?: boolean;
  badges?: JSX.Element[] | null;
  headingLevel?: HeadingLevel;
}

const Card: React.FC<Props> = observer(
  ({
    title,
    text,
    image,
    tags,
    link,
    isLocked,
    badges,
    headingLevel = 'h2',
  }) => {
    const {
      auth: { isLoggedIn },
    } = useStore();

    const isLinkPublic = link ? linkIsPublic(link) : undefined;

    return (
      <Container isLocked={isLocked || (isLinkPublic === false && !isLoggedIn)}>
        {image && <img src={image.url} alt={image.alternativeText ?? ''} />}

        <main>
          {title && (
            <Heading level={headingLevel} className="card-heading">
              {title}
            </Heading>
          )}

          {text && <p>{text}</p>}

          {!!tags?.length && (
            <TagList>
              {tags.map((tag, i) => (
                <li key={`${tag}-${i}`}>{tag}</li>
              ))}
            </TagList>
          )}

          {!!badges?.length && (
            <div className="card__badge">
              {badges.map((badge, i) => (
                <span key={i}>{badge}</span>
              ))}
            </div>
          )}
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
