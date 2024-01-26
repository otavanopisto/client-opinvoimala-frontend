import React, { useState } from 'react';
// import { useDebounce } from '../hooks/useDebounce';
import { InstantSearch, SearchBox, useHits, Index } from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { Button } from './inputs';
import Icon from './Icon';
import Link, { LinkItem } from './Link';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface SearchStrapiHit {
  id: string;
  slug: string;
  title?: string;
  name?: string;
}

interface HitsProps {
  title: string;
  type: 'page' | 'test' | 'exercise';
  onSelect: () => void;
}

const SearchHits: React.FC<HitsProps> = props => {
  const { onSelect, title, type } = props;
  const { hits } = useHits();
  const pageHits = hits as unknown as SearchStrapiHit[];
  const { t } = useTranslation();

  return (
    <div>
      <h3>{title}</h3>
      {pageHits.length === 0 ? (
        <p> {t('empty.search', { context: type })}</p>
      ) : (
        <div>
          {pageHits.map(hit => {
            const link: LinkItem = {
              id: hit.id,
              type: type,
              [type]: {
                slug: hit.slug,
                title: hit.title || hit.name,
                isPublic: true,
              },
            };
            return (
              <div key={hit.id} onClick={onSelect}>
                <Link link={link} label={hit.title} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Container = styled.div`
  display: flex;
  @keyframes slideInFromTop {
    0% {
      transform: translateY(-500px);
    }
    100% {
      transform: translateY(0);
    }
  }
  .search-box {
    form {
      display: flex;
      align-items: center;
    }
  }
  .search-toggle-button {
    cursor: pointer;
    border: 2px solid ${p => p.theme.color.secondary};
    border-radius: ${p => p.theme.borderRadius.md};
    display: flex;
    padding: 10px;

    &:hover {
      opacity: 0.8;
    }
    &.active,
    :active {
      background-color: ${p => p.theme.color.secondary};
    }
    &--icon .active {
      color: #fff;
    }
  }
  .search-button {
    cursor: pointer;
    background-color: ${p => p.theme.color.secondary};
    border: 2px solid ${p => p.theme.color.secondary};
    border-radius: ${p => p.theme.borderRadius.md};
    color: #fff;
    display: flex;
    padding: 10px;
    &:hover {
      opacity: 0.8;
    }
  }
  .search-content {
    animation: 0.2s ease-out 0s 1 slideInFromTop;
    position: absolute;
    left: 0;
    width: 100%;
    min-height: 500px;
    opacity: 0.98;
    margin-top: 76px;
    ${p => p.theme.shadows[0]};
    background-color: ${p => p.theme.color.background};
    padding: ${p => p.theme.spacing.lg};
    z-index: 4;
  }
  input {
    padding: ${p => p.theme.spacing.md};
    border: 1px solid ${p => p.theme.color.grey};
    border-radius: ${p => p.theme.borderRadius.md};
    background-color: ${p => p.theme.color.background};
  }
  .hits-container {
    display: flex;
    padding: ${p => p.theme.spacing.md} 0 0 0;
    div {
      flex-grow: 1;
    }
  }
`;

interface Props {
  indexName?: string;
}

const Search: React.FC<Props> = ({ indexName = 'page' }) => {
  const { t } = useTranslation();
  const [searchVisible, setSearchVisible] = useState(false);
  const { searchClient } = instantMeiliSearch(
    'localhost:7700',
    'b39d118407a96b23a9311912ba2d27c860f4f902d91209d0c3057f25d5fd34a5',
    {
      placeholderSearch: false,
    }
  );
  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  return (
    <Container>
      <button
        aria-expanded={searchVisible}
        aria-controls="searchContent"
        aria-label={t('aria.search')}
        className={`search-toggle-button ${searchVisible ? 'active' : ''}`}
        onClick={toggleSearch}
      >
        <Icon
          type="Search"
          color={`${searchVisible ? 'accentLight' : 'accentDark'}`}
          className="search-button--icon active"
          width={22}
        />
      </button>
      {searchVisible && (
        <div id="searchContent" className="search-content">
          <InstantSearch searchClient={searchClient}>
            <SearchBox
              searchAsYouType={false}
              autoFocus
              className="search-box"
              submitIconComponent={() => (
                <div className="search-button">{t('action.search')}</div>
              )}
            />
            <div className="hits-container">
              <div>
                <Index indexName="page">
                  <SearchHits
                    type="page"
                    title={t('label.pages')}
                    onSelect={toggleSearch}
                  />
                </Index>
              </div>
              <div>
                <Index indexName="test">
                  <SearchHits
                    type="test"
                    title={t('label.tests')}
                    onSelect={toggleSearch}
                  />
                </Index>
              </div>
            </div>
          </InstantSearch>
        </div>
      )}
    </Container>
  );
};

export default Search;
