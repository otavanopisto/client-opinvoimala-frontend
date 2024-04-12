import React from 'react';

interface Props extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  prefixApiDomain?: boolean;
  apiSrc?: string;
  alt?: string | null;
}

const Image: React.FC<Props> = ({
  prefixApiDomain,
  alt = '',
  src,
  apiSrc,
  ...props
}) => {
  return (
    <img
      {...props}
      alt={alt ?? ''}
      // src from api's media are in format /uploads/image-file-name.jpg and it needs to be prefixed with api base url!
      src={apiSrc ? `${process.env.REACT_APP_API_URL}${apiSrc}` : src}
    />
  );
};

export default Image;
