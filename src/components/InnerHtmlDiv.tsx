import React from 'react';

const noConcentContainerStyle = `
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  margin: 16px 0;

  background: #eee;
  border: 1px solid #ddd;
  border-radius: 8px;

  color: #666;
  font-size: 14px;
  font-style: italic;
`;

interface Props {
  html: string;
}

const InnerHtmlDiv: React.FC<Props> = ({ html }) => {
  const marketingConcent = false;

  const regex = /<iframe.*<\/iframe>/gi;

  let __html = html;

  if (!marketingConcent) {
    __html = __html.replaceAll(
      regex,
      `<div style="${noConcentContainerStyle}">Markkinointievästeet tulee olla hyväksyttynä, jotta tämä sisältö voidaan näyttää.</div>`
    );
  }

  return <div dangerouslySetInnerHTML={{ __html }}></div>;
};

export default InnerHtmlDiv;
