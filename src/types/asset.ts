export enum AssetDenomEnum {
  uatone = 'uatone',
  uphoton = 'uphoton',
}

export enum AssetSymbolEnum {
  ATONE = 'ATONE',
  PHOTON = 'PHOTON',
}

export const ASSET_DECIMALS: Record<AssetDenomEnum, number> = {
  [AssetDenomEnum.uatone]: 6,
  [AssetDenomEnum.uphoton]: 6,
}

export type AssetType = {
  symbol: AssetSymbolEnum
  denom: AssetDenomEnum
  name: string
  logoURI: string
  decimals: number
  balance?: string
  disabled?: boolean
}

export type WhiteListType = string[]
export type BalanceListType = Record<string, string>

import atoneSvg from 'images/atone.svg'
import photonSvg from 'images/photon.svg'

export const SUPPORTED_ASSETS: AssetType[] = [
  {
    symbol: AssetSymbolEnum.ATONE,
    denom: AssetDenomEnum.uatone,
    name: 'AtomOne',
    logoURI: atoneSvg,
    decimals: 6,
  },
  {
    symbol: AssetSymbolEnum.PHOTON,
    denom: AssetDenomEnum.uphoton,
    name: 'Photon',
    logoURI: photonSvg,
    decimals: 6,
  },
]
