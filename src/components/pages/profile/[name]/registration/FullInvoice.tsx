import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Colors, CurrencyToggle } from '@ensdomains/thorin'

import GasDisplay from '@app/components/@atoms/GasDisplay'
import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import { useEstimateFullRegistration } from '@app/hooks/gasEstimation/useEstimateRegistration'
import { useRegistrationTrackingReducer } from '@app/hooks/useRegistrationTrackingReducer'
import { CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE } from '@app/utils/constants'
import useUserConfig from '@app/utils/useUserConfig'
import { formatDuration, ONE_DAY } from '@app/utils/utils'

const OptionBar = styled.div(
  () => css`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
)

const InvoiceContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: ${theme.space['2']};
    width: 100%;
  `,
)

type Props = ReturnType<typeof useEstimateFullRegistration>

const FullInvoice = ({
  seconds,
  totalDurationBasedFee,
  estimatedGasFee,
  hasPremium,
  premiumFee,
  gasPrice,
}: Props) => {
  const { t } = useTranslation(['register', 'common'])
  const { dispatch: dispatchRegistrationTrackingData } = useRegistrationTrackingReducer()

  const { userConfig, setCurrency } = useUserConfig()
  const currencyDisplay = userConfig.currency === 'fiat' ? userConfig.fiat : 'eth'

  const invoiceItems = useMemo(
    () => [
      {
        label: t('invoice.timeRegistration', {
          time: formatDuration(seconds, t),
        }),
        bufferPercentage: CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE,
        value: totalDurationBasedFee,
        color: seconds < 30 * ONE_DAY ? ('orangePrimary' as Colors) : undefined,
      },
      {
        label: t('invoice.estimatedNetworkFee'),
        value: estimatedGasFee,
      },
      ...(hasPremium
        ? [
            {
              label: t('invoice.temporaryPremium'),
              value: premiumFee,
              bufferPercentage: CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE,
              color: 'blue' as Colors,
            },
          ]
        : []),
    ],
    [t, seconds, totalDurationBasedFee, estimatedGasFee, hasPremium, premiumFee],
  )

  useEffect(() => {
    dispatchRegistrationTrackingData({
      name: 'updatePayment',
      payload: {
        currencyUnit: userConfig.currency === 'fiat' ? 'usd' : 'eth',
      },
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userConfig.currency])

  return (
    <InvoiceContainer>
      <OptionBar>
        <GasDisplay gasPrice={gasPrice} />
        <CurrencyToggle
          size="small"
          checked={userConfig.currency === 'fiat'}
          onChange={(e) => setCurrency(e.target.checked ? 'fiat' : 'eth')}
        />
      </OptionBar>
      <Invoice items={invoiceItems} unit={currencyDisplay} totalLabel={t('invoice.total')} />
    </InvoiceContainer>
  )
}

export default FullInvoice
