/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Card, RightArrowSVG, Typography } from '@ensdomains/thorin'

const Main = styled.main(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['16']};
  `,
)

const Header = styled.header<{ $isConnected: boolean }>(
  ({ theme, $isConnected }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${theme.space['4']};
    gap: ${theme.space['4']};
    min-height: ${$isConnected ? '529px' : 'unset'};
  `,
)

const Heading = styled.h1(
  ({ theme }) => css`
    font-size: 52px;
    font-size: 850;
    color: ${theme.colors.textPrimary};
    text-align: center;
    line-height: 104%;
    @media (min-width: 360px) {
      font-size: 60px;
    }
    @media (min-width: 640px) {
      font-size: 76px;
    }
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space['2']};
    flex-direction: column;

    @media (min-width: 360px) {
      flex-direction: row;
    }
  `,
)

const Caption = styled(Typography)`
  text-align: center;
  max-width: 538px;
`

const PartnershipAnnouncement = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    background-color: ${theme.colors.backgroundPrimary};
    border-radius: ${theme.radii['4xLarge']};
    font-size: ${theme.fontSizes.body};
    font-weight: ${theme.fontWeights.bold};
    display: flex;
    justify-content: space-between;
    a {
      color: ${theme.colors.greenDim};
      cursor: pointer;
    }
    a:hover {
      color: ${theme.colors.green};
    }
    @media (min-width: 640px) {
      border-radius: ${theme.radii['3xLarge']};
    }
  `,
)

const CenteredCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const CardWithEmoji = styled(CenteredCard)`
  padding-top: 83px;
  position: relative;

  img {
    position: absolute;
    top: -72px;
  }
`

export default function Page() {
  const { t } = useTranslation('migrate')

  const { isConnected } = useAccount()

  const title = isConnected ? t('title.connected') : t('title.unconnected')

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Main>
        <PartnershipAnnouncement>
          <span>{t('partnership.text')}</span>
          <a>
            {t('partnership.watch')} <RightArrowSVG />
          </a>
        </PartnershipAnnouncement>
        <Header $isConnected={isConnected}>
          <Heading>{title}</Heading>
          <Caption fontVariant="bodyLarge">
            {isConnected ? t('caption.connected') : t('caption.unconnected')}
          </Caption>
          <ButtonContainer>
            <Button colorStyle="greenPrimary">
              {isConnected ? t('cta.connected') : t('cta.unconnected')}
            </Button>
            <Button colorStyle="greenSecondary">{t('cta.learn-more')}</Button>
          </ButtonContainer>
        </Header>
        {isConnected ? (
          <div>
            <CardWithEmoji>
              <img src="/confetti.png" width={108} height={108} alt="🎉" />
              <Typography fontVariant="headingTwo">{t('accessible.title')}</Typography>
              <Typography fontVariant="body">{t('accessible.caption')}</Typography>
            </CardWithEmoji>
          </div>
        ) : null}
      </Main>
    </>
  )
}