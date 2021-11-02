import { path } from '../routes/routes';
import { InternalLinkTarget, Link, LinkIn } from '../store/models';

export const subPageUrl = (
  baseRoute: string,
  slug?: string | number | null
) => {
  if (slug) {
    const _slug = `${slug}`;
    if (_slug?.length) return `/${baseRoute}/${_slug}`;
  }
  return undefined;
};

export const linkTargetUrl = (link: LinkIn) => {
  switch (link.type) {
    case 'external':
      return link.external?.length ? link.external : undefined;
    case 'internal':
      return link.internal?.length ? link.internal : undefined;
    case 'page':
      return subPageUrl(path('content_page'), link.page?.slug ?? link.page?.id);
    case 'test':
      return subPageUrl(path('tests'), link.test?.slug ?? link.test?.id);
    default:
      return undefined;
  }
};

export const linkIsPublic = (link: LinkIn) => {
  switch (link.type) {
    case 'page':
      return !!link.page?.isPublic;
    case 'test':
      return !!link.test?.isPublic;
    default:
      return true;
  }
};

interface MakeLink {
  id: number;
  type: 'external' | 'internal' | 'page' | 'test';
  label: string;
  target?: InternalLinkTarget;
  url?: string;
}

export const makeLink = ({ id, type, label, target, url }: MakeLink): Link => {
  const link = {
    id,
    type,
    label,
    external: null,
    internal: null,
    test: null,
    exercise: null,
    page: null,
  };

  switch (type) {
    case 'page':
      return { ...link, page: target ?? null };
    case 'test':
      return { ...link, test: target ?? null };
    case 'internal':
      return { ...link, internal: url ?? null };
    case 'external':
      return { ...link, external: url ?? null };
    default:
      return link;
  }
};
