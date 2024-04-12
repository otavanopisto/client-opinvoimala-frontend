import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Wrapper from './Wrapper';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/storeContext';
import Link from '../Link';
import { Divider, Grid, Icon } from 'semantic-ui-react';
import { useWindowDimensions } from '../../utils/hooks';
import NoPrint from '../NoPrint';
import Image from '../Image';

const StyledFooter = styled.footer`
  background-color: ${p => p.theme.color.grey3};
  padding-top: ${p => p.theme.spacing.xl};

  ${p => p.theme.font.size.sm};

  h1 {
    ${p => p.theme.font.h4};
  }

  .footer__description-text {
    margin: ${p => p.theme.spacing.md} 0;
    width: 40%;
  }

  ul.footer__social-media-list {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    padding: 0;
    li {
      margin: 0;
      margin-bottom: ${p => p.theme.spacing.lg};

      div {
        display: inline-block;
        a {
          align-items: center;
          color: ${p => p.theme.color.foreground};
          display: flex;
          flex-direction: row-reverse;
          font-family: ${p => p.theme.font.secondary};
          justify-content: flex-end;
          text-decoration: none;
          :hover {
            text-decoration: underline;
          }

          i.inverted.circular.icon {
            text-decoration: none;

            margin-right: ${p => p.theme.spacing.md};
            margin-left: 0;

            background-color: ${p => p.theme.color.secondary} !important;
          }
        }
      }
    }

    @media ${p => p.theme.breakpoint.tablet} {
      display: block;
      flex-wrap: wrap;

      li {
        margin: ${p => p.theme.spacing.md} 0;
        &:not(:last-child) {
          margin-right: ${p => p.theme.spacing.lg};
        }
        a {
          flex-direction: row;
          i.inverted.circular.icon {
            margin-left: ${p => p.theme.spacing.md};
          }
        }
      }
    }
  }

  .footer__copyright-text,
  .footer__links-list {
    ${p => p.theme.font.size.xs};
    li {
      margin-top: ${p => p.theme.spacing.sm};
      margin-bottom: ${p => p.theme.spacing.sm};
    }
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
      width: 50px;
      margin: ${p => p.theme.spacing.lg} 0;
      border-radius: 0;
      @media ${p => p.theme.breakpoint.tablet} {
        width: 70px;
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
      <h1>{settings?.appName ?? t('app_name')}</h1>

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
            <div>
              <a href={url} target="_blank" rel="noreferrer">
                {label}
                <Icon circular inverted name={(platform ?? 'linkify') as any} />
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );

  const renderLinks = () => (
    <ul className="footer__links-list">
      {links?.map(link => (
        <li key={link.id}>
          <Link link={link} label={link.label} />
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
                <Image apiSrc={url} alt={alternativeText} />
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

          <Divider section aria-hidden="true" />

          <Grid columns={2} doubling>
            <Grid.Column width={10} verticalAlign="middle">
              {renderLinks()}
            </Grid.Column>
            <Grid.Column
              width={6}
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
