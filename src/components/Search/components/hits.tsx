import React from 'react';
import { useHits } from 'react-instantsearch';
import Link, { LinkItem } from '../../Link';
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

const Hits: React.FC<HitsProps> = ({ onSelect, title, type }) => {
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

export default Hits;
