import { path } from '../routes/routes';
import { LinkIn } from '../store/models';

export const contentPageUrl = (slug?: string | number | null) => {
  const _slug = `${slug}`;
  if (_slug?.length) return `/${path('content_page')}/${_slug}`;
  return '/';
};

export const linkTargetUrl = (link: LinkIn) => {
  switch (link.type) {
    case 'external':
      return link.external ?? '/';
    case 'internal':
      return link.internal ?? '/';
    case 'page':
      return contentPageUrl(link.page?.slug ?? link.page?.id);
    default:
      return '/';
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
