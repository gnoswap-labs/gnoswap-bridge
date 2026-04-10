import { ReactElement, useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import SendStore from 'store/SendStore'
import { BlockChainType, isCosmosChain, isEvmChain } from 'types/network'
const isBrowser = typeof window !== 'undefined'
const isChrome =
  isBrowser &&
  /Chrome/.test(navigator.userAgent) &&
  !/Edg/.test(navigator.userAgent)
const isEdgeChromium = isBrowser && /Edg/.test(navigator.userAgent)
const isFirefox = isBrowser && /Firefox/.test(navigator.userAgent)
import KeplrImg from 'images/Keplr.png'
import MetamaskImg from 'images/metamask.svg'
import keplrService from 'services/keplrService'
import metaMaskService from 'services/metaMaskService'

const autoCompleteButtonClass =
  'absolute top-1/2 -mt-[13px] right-0 bg-bridge-gray text-xs rounded-[5px] px-2.5 leading-6 h-[26px] flex items-center cursor-pointer hover:bg-[#323842]'

const autoCompleteLinkClass =
  'absolute top-1/2 -mt-[13px] right-0 bg-bridge-gray text-white text-xs rounded-[5px] px-2.5 leading-6 h-[26px] flex items-center no-underline hover:bg-[#323842]'

export default function AutoFillButton(): ReactElement {
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const setToAddress = useSetRecoilState(SendStore.toAddress)

  useEffect(() => {
    setToAddress('')
  }, [toBlockChain])

  if (isEvmChain(toBlockChain)) {
    if (!(isBrowser && (isChrome || isEdgeChromium))) {
      return <></>
    } else if (!metaMaskService.checkInstalled()) {
      return (
        <a
          className={autoCompleteLinkClass}
          href="https://metamask.io/download/"
          target="_blank"
          rel="noreferrer"
        >
          Install
          <img className="w-5 ml-2" src={MetamaskImg} alt="Metamask" />
        </a>
      )
    } else {
      return (
        <div
          className={autoCompleteButtonClass}
          onClick={async (): Promise<void> => {
            if (metaMaskService.checkInstalled()) {
              const { address } = await metaMaskService.connect()
              setToAddress(address)
            }
          }}
        >
          Autofill
          <img className="w-5 ml-2" src={MetamaskImg} alt="Metamask" />
        </div>
      )
    }
  } else if (isCosmosChain(toBlockChain)) {
    if (!(isBrowser && (isChrome || isEdgeChromium || isFirefox))) {
      return <></>
    } else if (!keplrService.checkInstalled()) {
      return (
        <a
          className={autoCompleteLinkClass}
          href="https://www.keplr.app/download"
          target="_blank"
          rel="noreferrer"
        >
          Install
          <img className="w-5 ml-2" src={KeplrImg} alt="Keplr" />
        </a>
      )
    } else {
      return (
        <div
          className={autoCompleteButtonClass}
          onClick={async (): Promise<void> => {
            if (keplrService.checkInstalled()) {
              const { address } = await keplrService.connect(toBlockChain)
              setToAddress(address)
            }
          }}
        >
          Autofill
          <img className="w-5 ml-2" src={KeplrImg} alt="Keplr" />
        </div>
      )
    }
  }

  return <></>
}
