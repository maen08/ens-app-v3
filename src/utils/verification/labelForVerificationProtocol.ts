import type { VerificationProtocol } from '@app/transaction/user/input/VerifyProfile/VerifyProfile-flow'

export const labelForVerificationProtocol = (protocol: VerificationProtocol) => {
  if (protocol === 'dentity') return 'dentity.com'
  throw new Error(`Unknown verification protocol: ${protocol}`)
}
