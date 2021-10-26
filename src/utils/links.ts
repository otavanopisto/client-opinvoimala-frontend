import { path } from '../routes/routes';
import { LinkIn } from '../store/models';

export const contentPageUrl = (slug?: string | number | null) => {
  if (slug) {
    const _slug = `${slug}`;
    if (_slug?.length) return `/${path('content_page')}/${_slug}`;
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
      return contentPageUrl(link.page?.slug ?? link.page?.id);
    default:
      return undefined;
  }
};

export const linkIsPublic = (link: LinkIn) => {
  switch (link.type) {
    case 'page':
      return !!link.page?.isPublic;
    default:
      return true;
  }
};
