export enum WalletEnum {
  MetaMask = 'MetaMask',
  Keplr = 'Keplr',
}

export const WalletTitle: Record<WalletEnum, string> = {
  MetaMask: 'MetaMask',
  Keplr: 'Keplr (Extension)',
}

export const WalletSupportBrowser: Record<
  WalletEnum,
  { isSupport: boolean; errorMessage: string }
> = {
  MetaMask: {
    isSupport: true,
    errorMessage: 'Available for desktop Chrome and Firefox.',
  },
  Keplr: {
    isSupport: true,
    errorMessage: 'Available for desktop Chrome and Firefox.',
  },
}
