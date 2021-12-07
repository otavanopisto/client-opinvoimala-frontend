import React, { FC } from 'react';
import Helmet from 'react-helmet';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store/storeContext';
import { useCookiebotConsent } from '../utils/hooks/useCookiebotConsent';

interface Props {
  gaMeasurementId?: string | null;
}

export const Analytics: FC<Props> = observer(({ gaMeasurementId }) => {
  const {
    settings: { isCookiebotActivated },
  } = useStore();

  const cookieConsent = useCookiebotConsent(isCookiebotActivated);

  if (!gaMeasurementId || !cookieConsent.statistics) {
    return null;
  }

  return (
    <Helmet>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
      ></script>

      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaMeasurementId}');
        `}
      </script>
    </Helmet>
  );
});

export default Analytics;
