import React from 'react';
import { Helmet } from 'react-helmet';

interface Props {
  giosgCompanyId?: string | null;
}

const Chat: React.FC<Props> = ({ giosgCompanyId }) => {
  if (!giosgCompanyId || process.env.NODE_ENV !== 'production') return null;

  return (
    <Helmet>
      <script>
        {`
          (function(w, t, f) {
            var s='script',o='_giosg',h='https://service.giosg.com',e,n;e=t.createElement(s);e.async=1;e.src=h+'/live/';
            w[o]=w[o]||function(){(w[o]._e=w[o]._e||[]).push(arguments)};w[o]._c=f;w[o]._h=h;n=t.getElementsByTagName(s)[0];n.parentNode.insertBefore(e,n);
          })(window,document,${giosgCompanyId});
        `}
      </script>
    </Helmet>
  );
};

export default Chat;
