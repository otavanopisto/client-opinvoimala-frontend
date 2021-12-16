import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Wrapper from './Wrapper';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/storeContext';
import Link from '../Link';
import { Divider, Grid, Icon } from 'semantic-ui-react';
import useWindowDimensions from '../../utils/hooks';
import NoPrint from '../NoPrint';

const StyledFooter = styled.footer`
  background-color: ${p => p.theme.color.grey3};
  padding-top: ${p => p.theme.spacing.lg};

  ${p => p.theme.font.size.md};

  .footer__description-text {
    margin: ${p => p.theme.spacing.md} 0;
    width: 40%;
  }

  ul.footer__social-media-list {
    list-style-type: none;
    padding: 0;
    li {
      margin: ${p => p.theme.spacing.md} 0;
      a {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-family: ${p => p.theme.font.secondary};
        color: ${p => p.theme.color.foreground};

        i.inverted.circular.icon {
          text-decoration: none;
          margin-left: ${p => p.theme.spacing.md};
          background-color: ${p => p.theme.color.secondary} !important;
        }
      }
    }

    @media ${p => p.theme.breakpoint.tablet} {
      display: flex;
      flex-wrap: wrap;

      li {
        margin: 0;
        margin-bottom: ${p => p.theme.spacing.md};
        &:not(:last-child) {
          margin-right: ${p => p.theme.spacing.lg};
        }
        a {
          flex-direction: row-reverse;
          i.inverted.circular.icon {
            margin-right: ${p => p.theme.spacing.md};
            margin-left: 0 !important;
          }
        }
      }
    }
  }

  .footer__copyright-text,
  .footer__links-list {
    ${p => p.theme.font.size.sm};
  }

  ul.footer__links-list {
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;

    li {
      &:not(:last-child) {
        margin-right: ${p => p.theme.spacing.lg};
      }
    }
  }
`;

const LogoArea = styled.div`
  margin-top: 30px;
  background-color: ${p => p.theme.color.background};

  div.logo-area__image-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    img {
      width: 70px;
      margin: ${p => p.theme.spacing.lg} 0;
      border-radius: 0;
      @media ${p => p.theme.breakpoint.tablet} {
        width: 50px;
      }
    }
  }
`;

const Footer: React.FC = observer(() => {
  const { t } = useTranslation();
  const { isTablet } = useWindowDimensions();

  const {
    settings: { settings },
  } = useStore();

  const { phone, email, description, organisation, socialMedia, logos, links } =
    settings ?? {};

  const copyright = organisation ? `\u00A9 ${organisation}` : '';

  const renderInfo = () => (
    <>
      <h4>{settings?.appName ?? t('app_name')}</h4>

      {description && <p>{description}</p>}

      {!!email && <a href={`mailto:${email}`}>{`${email}`}</a>}
      {!!phone && <p>{`${t('phone_abbrv')} ${phone}`}</p>}
    </>
  );

  const renderSocialMediaLinks = () => (
    <ul className="footer__social-media-list">
      {socialMedia?.map(({ id, platform, label, url }) => {
        if (!url) return null;
        return (
          <li key={id}>
            <a href={url} target="_blank" rel="noreferrer">
              {label}
              <Icon circular inverted name={(platform ?? 'linkify') as any} />
            </a>
          </li>
        );
      })}
    </ul>
  );

  const renderLinks = () => (
    <ul className="footer__links-list">
      {links?.map(link => (
        <li key={link.id}>
          <Link link={link}>{link.label}</Link>
        </li>
      ))}
    </ul>
  );

  const renderLogos = () => {
    if (!logos?.length) return;

    return (
      <LogoArea>
        <Wrapper>
          <Grid verticalAlign="middle">
            {logos.map(({ id, url, alternativeText }) => (
              <div key={id} className="logo-area__image-container">
                <img src={url} alt={alternativeText ?? ''} />
              </div>
            ))}
          </Grid>
        </Wrapper>
      </LogoArea>
    );
  };

  return (
    <NoPrint>
      <StyledFooter>
        <Wrapper>
          <Grid columns={2} doubling>
            <Grid.Column>{renderInfo()}</Grid.Column>
            <Grid.Column textAlign="right">
              {renderSocialMediaLinks()}
            </Grid.Column>
          </Grid>

          <Divider section />

          <Grid columns={2} doubling>
            <Grid.Column verticalAlign="middle">{renderLinks()}</Grid.Column>
            <Grid.Column
              verticalAlign="middle"
              textAlign={isTablet ? 'left' : 'right'}
              className="footer__copyright-text"
            >
              {copyright}
            </Grid.Column>
          </Grid>
        </Wrapper>

        {renderLogos()}
      </StyledFooter>
    </NoPrint>
  );
});

export default Footer;
