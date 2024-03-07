import React from 'react';
import styled from 'styled-components';
import { HashLink } from 'react-router-hash-link';
import { useTranslation } from 'react-i18next';
import { Link, TestsSummaryCategory } from '../../store/models';
import Stars from '../Stars';
import { path } from '../../routes/routes';
import Icon from '../Icon';
import { linkTargetUrl } from '../../utils/links';
import Image from '../Image';

const Container = styled.div`
  height: 100%;
  font-family: ${p => p.theme.font.secondary};
  padding-left: ${p => p.theme.spacing.lg};
  padding-right: ${p => p.theme.spacing.lg};

  h2 {
    ${p => p.theme.font.h4};
  }

  ul {
    height: 100%;
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    li {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: ${p => p.theme.spacing.lg};
      padding-bottom: ${p => p.theme.spacing.lg};
      padding-left: ${p => p.theme.spacing.md};
      padding-right: ${p => p.theme.spacing.md};

      :not(:last-child) {
        border-bottom: 1px solid ${p => p.theme.color.grey4};
      }

      a {
        display: flex;
        align-items: center;
        margin-top: ${p => p.theme.spacing.md};
        color: ${p => p.theme.color.secondary};
        ${p => p.theme.font.size.sm};
        text-decoration: none;

        svg {
          margin-left: ${p => p.theme.spacing.sm};
          transition: all 0.1s ease-in-out;
        }

        &:hover {
          svg {
            margin-left: ${p => p.theme.spacing.md};
          }
        }
      }

      .test-summary-categories {
        &__image {
          width: 52px;
          img {
            position: absolute;
            top: 10px;
            left: 0;
            width: 48px;
            min-width: 48px;
          }
        }
        &__main {
          flex: 1;
        }
        &__side {
          ${p => p.theme.font.size.xs};
          position: absolute;
          right: ${p => p.theme.spacing.md};
        }
      }
    }
  }

  @media ${p => p.theme.breakpoint.mobile} {
    ul {
      li {
        .test-summary-categories {
          &__image {
            width: 140px;
            padding-right: ${p => p.theme.spacing.xl};
            img {
              position: static;
              top: auto;
              left: auto;
              min-width: auto;
              width: 100%;
            }
          }
        }
      }
    }
  }
`;

interface Props {
  categories?: TestsSummaryCategory[] | null;
}

const TestsSummaryCategories: React.FC<Props> = ({ categories }) => {
  const { t } = useTranslation();

  const renderCategoryLink = (link: Link | null, categoryId: number) => {
    const linkTo = link && linkTargetUrl(link);
    const to = linkTo ?? `/${path('tests')}#category-${categoryId}`;

    const label = (
      <>
        {link?.label ?? t('view.well_being_profile.tests_by_category')}
        <Icon type="ArrowRight" strokeColor="secondary" color="none" />
      </>
    );

    if (link?.type === 'external') {
      return (
        <a href={to} target="_blank" rel="noreferrer">
          {label}
        </a>
      );
    }

    return <HashLink to={to}>{label}</HashLink>;
  };

  return (
    <Container>
      <ul>
        {categories?.map(
          ({ id, label, image, testCategoryLink, stars, completedTests }) => (
            <li key={id}>
              <div className="test-summary-categories__image">
                {image?.url && (
                  <Image apiSrc={image.url} alt={image.alternativeText} />
                )}
              </div>

              <div className="test-summary-categories__main">
                <h2>{label}</h2>

                <Stars stars={!!completedTests ? stars : null} />

                {renderCategoryLink(testCategoryLink, id)}
              </div>

              {stars !== null && stars !== undefined && (
                <div className="test-summary-categories__side">
                  {`${stars ?? 0} / 5`}
                </div>
              )}
            </li>
          )
        )}
      </ul>
    </Container>
  );
};

export default TestsSummaryCategories;
