import React from 'react';
import styled from 'styled-components';
import { LinkList as LinkListType } from '../store/models';
import Link from './Link';

const Container = styled.section`
  margin: ${p => p.theme.spacing.xl} 0;

  h1 {
    ${p => p.theme.font.h2};
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      a {
        display: flex;
        justify-content: space-between;
        width: 100%;
        border: 1px solid ${p => p.theme.color.secondary};
        border-radius: ${p => p.theme.borderRadius.md};
        background-color: ${p => p.theme.color.grey3};
        margin: ${p => p.theme.spacing.md} 0;
        padding: ${p => p.theme.spacing.md} ${p => p.theme.spacing.lg};

        font-family: ${p => p.theme.font.secondary};
        ${p => p.theme.font.size.md};
        color: ${p => p.theme.color.secondary};
        text-decoration: none;
        :hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

interface Props {
  list: LinkListType;
}

const LinkList: React.FC<Props> = ({ list }) => {
  const { title, links } = list;

  return (
    <Container>
      <h1>{title}</h1>

      <ul>
        {links.map(link => (
          <li key={link.id}>
            <Link link={link} label={link.label} showArrow />
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default LinkList;
