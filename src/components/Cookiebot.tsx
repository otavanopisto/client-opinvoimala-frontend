import React from 'react';
import { Helmet } from 'react-helmet';

interface Props {
  cbid?: string | null;
}

const Cookiebot: React.FC<Props> = ({ cbid }) => {
  if (!cbid) {
    return null;
  }

  return (
    <Helmet>
      <script
        data-culture="FI"
        id="Cookiebot"
        src="https://consent.cookiebot.com/uc.js"
        data-cbid={cbid}
        data-blockingmode="auto"
        type="text/javascript"
      ></script>
    </Helmet>
  );
};

export default Cookiebot;
