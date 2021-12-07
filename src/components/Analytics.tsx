import React, { FC } from 'react';
import Helmet from 'react-helmet';
import { useCookiebotConsent } from '../utils/hooks/useCookiebotConsent';

interface Props {
  gaMeasurementId?: string | null;
}

export const Analytics: FC<Props> = ({ gaMeasurementId }) => {
  const cookieConsent = useCookiebotConsent();

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
};

export default Analytics;
