import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import Layout from '../components/Layout';
import { useStore } from '../store/storeContext';

interface Props {}

const CookieDeclaration: React.FC<Props> = observer(() => {
  const { t } = useTranslation();
  const cookieDeclarationRef = useRef<HTMLDivElement>(null);

  const {
    settings: { settings },
  } = useStore();

  const { cookiebotDomainGroupId } = settings?.scripts ?? {};

  useEffect(() => {
    const scriptTag: any = document.createElement('script');
    scriptTag.async = true;
    scriptTag.type = 'text/javascript';
    scriptTag.id = 'CookieDeclaration';
    scriptTag.src = `https://consent.cookiebot.com/${cookiebotDomainGroupId}/cd.js`;
    scriptTag['data-culture'] = 'FI';

    cookieDeclarationRef.current?.appendChild(scriptTag);
  }, [cookiebotDomainGroupId]);

  const hero = {
    title: t('route.cookies'),
  };

  if (!cookiebotDomainGroupId) {
    return null;
  }

  return (
    <Layout hero={hero}>
      <div ref={cookieDeclarationRef}></div>
    </Layout>
  );
});

export default CookieDeclaration;
