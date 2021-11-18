import React from 'react';
import styled from 'styled-components';
import { HashLink } from 'react-router-hash-link';
import { useTranslation } from 'react-i18next';
import { TestsSummaryCategory } from '../../store/models';
import Stars from '../Stars';
import { path } from '../../routes/routes';
import { Icon } from 'semantic-ui-react';

const Container = styled.div`
  height: 100%;
  font-family: ${p => p.theme.font.secondary};

  h1 {
    ${p => p.theme.font.h4};
  }

  ul {
    height: 100%;
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid ${p => p.theme.color.grey4};
      padding: ${p => p.theme.spacing.md};

      a {
        display: inline-block;
        margin-top: ${p => p.theme.spacing.md};
        color: ${p => p.theme.color.secondary};
        ${p => p.theme.font.size.sm};

        i {
          margin-left: ${p => p.theme.spacing.lg};
          text-decoration: none;
        }
      }

      .test-summary-categories {
        &__image {
          width: 140px;
          min-height: 120px;
          padding-right: ${p => p.theme.spacing.xl};
          img {
            width: 100%;
          }
        }
        &__main {
          flex: 1;
        }
        &__side {
          ${p => p.theme.font.size.sm};
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
        {categories?.map(({ id, label, image, stars }) => (
          <li key={id}>
            <div className="test-summary-categories__image">
              {image?.url && (
                <img src={image.url} alt={image.alternativeText ?? ''} />
              )}
            </div>

            <div className="test-summary-categories__main">
              <h1>{label}</h1>
              <Stars stars={stars ?? 0} />
              <HashLink to={`/${path('tests')}#category-${id}`}>
                {t('view.well_being_profile.tests_by_category')}
                <Icon name="arrow right" />
              </HashLink>
            </div>

            <div className="test-summary-categories__side">{`${
              stars ?? 0
            } / 5`}</div>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default TestsSummaryCategories;
