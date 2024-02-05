import React from 'react';
import { useHits } from 'react-instantsearch';
import Link, { LinkItem } from '../../Link';
import { useTranslation } from 'react-i18next';

interface GenericHit {
  id: string;
  slug: string;
}

interface Role {
  created_by: string;
  description: string;
  id: number;
  name: string;
  type: string;
  updated_by: string;
}

interface Page extends GenericHit {
  title: string;
  users_permissions_roles: Role[];
}

interface Test extends GenericHit {
  name: string;
  roles: Role[];
}

type SearchStrapiHit = Page | Test;

interface HitsProps {
  title: string;
  type: 'page' | 'test' | 'exercise';
  onSelect: () => void;
}

const Hits: React.FC<HitsProps> = ({ onSelect, title, type }) => {
  const { hits } = useHits();
  const pageHits = hits as unknown as SearchStrapiHit[];
  const { t } = useTranslation();

  const getRoles = (hit: SearchStrapiHit) => {
    switch (type) {
      case 'page':
        return (hit as Page).users_permissions_roles;
      case 'test':
        return (hit as Test).roles;
      default:
        return [];
    }
  };

  const getTitle = (hit: SearchStrapiHit) => {
    switch (type) {
      case 'page':
        return (hit as Page).title;
      case 'test':
        return (hit as Test).name;
      default:
        return 'Tuntematon sivutyyppi';
    }
  };

  return (
    <div>
      <h3>{title}</h3>
      {pageHits.length === 0 ? (
        <p> {t('empty.search', { context: type })}</p>
      ) : (
        <div>
          {pageHits.map(hit => {
            const roles = getRoles(hit);
            const isPublic =
              roles.length === 0 || roles.some(role => role.name === 'Public');

            const link: LinkItem = {
              id: hit.id,
              type: type,
              [type]: {
                slug: hit.slug,
                title: getTitle(hit),
                isPublic: isPublic,
              },
            };
            return (
              <div key={hit.id} onClick={onSelect}>
                <Link link={link} label={getTitle(hit)} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Hits;
