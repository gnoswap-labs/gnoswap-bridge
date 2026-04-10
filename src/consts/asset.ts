import { AssetSymbolEnum, AssetDenomEnum } from 'types/asset'

const ATOMONE_DECIMAL = 1e6
const ETHER_BASE_DECIMAL = 1e18

const symbolOfDenom: Record<AssetDenomEnum, AssetSymbolEnum> = {
  [AssetDenomEnum.uatone]: AssetSymbolEnum.ATONE,
  [AssetDenomEnum.uphoton]: AssetSymbolEnum.PHOTON,
}

export default {
  symbolOfDenom,
  ATOMONE_DECIMAL,
  ETHER_BASE_DECIMAL,
}
