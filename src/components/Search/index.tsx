import React, { useState, useRef } from 'react';
import { InstantSearch, SearchBox, Index } from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import Icon from '../Icon';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useOutsideClickAction } from '../../utils/hooks';
import { useWindowDimensions } from '../../utils/hooks';
import { Button } from '../inputs';
import SearchHits from './components/hits';

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
  .search-box-container {
    form {
      display: flex;
      align-items: center;
    }
  }
  .search-toggle-button {
    cursor: pointer;
    padding: ${p => p.theme.spacing.md};
    border: 2px solid ${p => p.theme.color.secondary};
    border-radius: ${p => p.theme.borderRadius.md};
    display: flex;
    position: relative;
    z-index: 6;
    &:hover {
      opacity: 0.8;
    }
    &.active,
    :active {
      background-color: ${p => p.theme.color.secondary};
    }
    &--desktop {
      cursor: pointer;
      height: 40px;
      width: 40px;
      border: 1px solid ${p => p.theme.color.secondary};
      border-radius: 50px;
      display: flex;
      position: relative;
      z-index: 6;
      &:hover {
        opacity: 0.8;
      }
      &.active,
      :active {
        background-color: ${p => p.theme.color.secondary};
      }
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
    border: 1px solid ${p => p.theme.color.grey};
    position: absolute;
    left: 0;
    width: 100%;
    min-height: 100vh;
    opacity: 0.98;
    top: 0;
    margin-top: 0;
    padding: ${p => p.theme.spacing.lg};
    ${p => p.theme.shadows[0]};
    background-color: ${p => p.theme.color.background};
    z-index: 7;

    form {
      margin-right: 30px;
    }
    input {
      max-width: 400px;
      min-width: 100px;
    }

    #closeSearch {
      position: absolute;
      top: 0;
      right: 0;
      margin: ${p => p.theme.spacing.sm};
    }

    @media ${p => p.theme.breakpoint.tablet} {
      min-height: 500px;
      border: none;
      top: auto;
      margin-top: 88px;
      z-index: 4;

      form {
        margin-right: auto;
      }

      input {
        width: 400px;
        max-width: none;
      }
    }

    @media ${p => p.theme.breakpoint.mobile} {
    }
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
  }

  .hits {
    flex-grow: 1;
    padding: ${p => p.theme.spacing.md};

    margin-right: ${p => p.theme.spacing.md};
    &:last-child {
      margin-right: 0;
    }
  }
`;

interface Props {
  indexName?: string;
}

const Search: React.FC<Props> = ({ indexName = 'page' }) => {
  const { t } = useTranslation();
  const { isTablet, isMobile } = useWindowDimensions();
  const searchContentRef = useRef(null);
  const [searchVisible, setSearchVisible] = useState(false);

  useOutsideClickAction({
    ref: searchContentRef,
    condition: searchVisible,
    action: () => {
      setSearchVisible(false);
    },
  });

  const host = process.env.REACT_APP_MEILI_HOST;
  const key = process.env.REACT_APP_MEILI_PUBLIC_KEY;

  if (!host || !key) {
    return null;
  }

  const { searchClient } = instantMeiliSearch(host, key, {
    placeholderSearch: false,
  });

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const buttonModifier = isTablet
    ? 'search-toggle-button'
    : 'search-toggle-button--desktop';
  return (
    <Container ref={searchContentRef}>
      <Button
        ariaLabel={t('aria.main_navigation')}
        aria-expanded={searchVisible}
        id="search-toggle-button"
        variant="outlined"
        modifier={buttonModifier}
        color="secondary"
        icon={<Icon type="Search" strokeColor="secondary" />}
        onClick={toggleSearch}
      />
      {searchVisible && (
        <div id="searchContent" className="search-content">
          <InstantSearch searchClient={searchClient}>
            <div className="search-box-container">
              <SearchBox
                searchAsYouType={false}
                autoFocus
                resetIconComponent={() => (
                  <div className="search-button">
                    {isMobile ? (
                      <Icon type="Minus" color="background" />
                    ) : (
                      t('action.empty')
                    )}
                  </div>
                )}
                submitIconComponent={() => (
                  <div className="search-button">
                    {isMobile ? (
                      <Icon type="Search" color="background" />
                    ) : (
                      t('action.search')
                    )}
                  </div>
                )}
              />
            </div>
            <div className={`hits-container${isMobile ? '--mobile' : ''}`}>
              <div className="hits">
                <Index indexName="page">
                  <SearchHits
                    type="page"
                    title={t('label.pages')}
                    onSelect={toggleSearch}
                  />
                </Index>
              </div>
              <div className="hits">
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
          <Button
            ariaLabel={t('aria.close')}
            id="closeSearch"
            variant="filled"
            icon={<Icon type="Close" strokeColor="background" />}
            onClick={toggleSearch}
            noMargin
          />
        </div>
      )}
    </Container>
  );
};

export default Search;
