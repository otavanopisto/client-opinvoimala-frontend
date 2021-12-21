import React from 'react';
import styled from 'styled-components';
import { HashLink } from 'react-router-hash-link';
import { useTranslation } from 'react-i18next';
import { TestsSummaryCategory } from '../../store/models';
import Stars from '../Stars';
import { path } from '../../routes/routes';
import Icon from '../Icon';
import NoCompletedTests from './NoCompletedTests';

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
          width: 140px;
          padding-right: ${p => p.theme.spacing.xl};
          img {
            width: 100%;
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
            width: 52px;
            img {
              position: absolute;
              top: 10px;
              left: 0;
              width: 48px;
              min-width: 48px;
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

  return (
    <Container>
      <ul>
        {categories?.map(({ id, label, image, stars, completedTests }) => (
          <li key={id}>
            <div className="test-summary-categories__image">
              {image?.url && (
                <img src={image.url} alt={image.alternativeText ?? ''} />
              )}
            </div>

            <div className="test-summary-categories__main">
              <h2>{label}</h2>

              {!!completedTests ? (
                <Stars stars={stars ?? 0} />
              ) : (
                <NoCompletedTests />
              )}

              <HashLink to={`/${path('tests')}#category-${id}`}>
                {t('view.well_being_profile.tests_by_category')}
                <Icon type="ArrowRight" strokeColor="secondary" color="none" />
              </HashLink>
            </div>

            {stars !== null && stars !== undefined && (
              <div className="test-summary-categories__side">
                {`${stars ?? 0} / 5`}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default TestsSummaryCategories;
