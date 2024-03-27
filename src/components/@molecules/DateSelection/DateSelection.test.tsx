import { act, render, renderHook, screen, userEvent, waitFor } from '@app/test-utils'

import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ONE_YEAR } from '@app/utils/time'

import { DateSelection } from './DateSelection'

describe('DateSelection', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })
  it('should render a plus minus counter if no name was provided', () => {
    render(<DateSelection minSeconds={0} seconds={ONE_YEAR} setSeconds={() => {}} />)

    expect(screen.getByTestId('plus-minus-control-input')).toBeInTheDocument()
  })
  it('should show a calendar if user is picking by date', async () => {
    render(<DateSelection minSeconds={0} seconds={ONE_YEAR} setSeconds={() => {}} />)

    screen.getByTestId('date-selection').click()

    expect(screen.getByText('1 year registration.', { exact: true })).toBeVisible()
  })
  it('should set back to one year when switching to a year toggle if previously was set to less', async () => {
    const { result } = renderHook(() => useState(ONE_YEAR))
    const { rerender } = render(
      <DateSelection minSeconds={0} seconds={result.current[0]} setSeconds={result.current[1]} />,
    )

    const dateSelection = screen.getByTestId('date-selection')

    await userEvent.click(dateSelection)

    await waitFor(() => {
      expect(dateSelection).toHaveTextContent('Pick by years')
    })

    act(() => {
      result.current[1](ONE_YEAR / 2)
    })

    rerender(
      <DateSelection minSeconds={0} seconds={result.current[0]} setSeconds={result.current[1]} />,
    )

    expect(screen.getByText('6 month registration.', { exact: true })).toBeVisible()

    await userEvent.click(dateSelection)

    await waitFor(() => {
      expect(dateSelection).toHaveTextContent('Pick by date')
    })

    rerender(
      <DateSelection minSeconds={0} seconds={result.current[0]} setSeconds={result.current[1]} />,
    )

    expect(screen.getByText('1 year registration.', { exact: true })).toBeVisible()
  })
})
