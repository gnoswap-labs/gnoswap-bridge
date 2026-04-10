import { ReactElement } from 'react'
import MetamaskImg from '../../../images/metamask.svg'
import { BlockChainType } from 'types'

interface MetamaskTokenProps {
  name: string
  chain: BlockChainType
  imgUrl: string
  token: string
  decimals: number
}

export default function MetamaskButton({
  name,
  chain,
  imgUrl,
  token,
  decimals,
}: MetamaskTokenProps): ReactElement {
  const fixedName = name.startsWith('axl') ? name.slice(3) : name

  return (
    <button
      className="border-0 mx-auto flex items-center justify-center bg-transparent text-white cursor-pointer mb-5 mt-1.5 py-1.5 px-3 rounded-[0.6rem] hover:bg-[#202020]"
      onClick={(): void => {
        window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: token,
              symbol: fixedName,
              decimals,
              image: imgUrl,
            },
          },
        })
      }}
    >
      <img className="w-5 mr-2.5" src={MetamaskImg} alt="Metamask logo" />
      Add {chain === BlockChainType.ethereum ? fixedName : name} to Metamask
    </button>
  )
}
