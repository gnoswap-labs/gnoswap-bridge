import { ReactElement } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import switchSvg from 'images/switch.svg'
import shuttleGif from 'images/shuttle.gif'
import ibcGif from 'images/ibc.gif'
const bridgeGifs = [shuttleGif, ibcGif]

import { NETWORK } from 'consts'

import { BlockChainType } from 'types/network'

import useAuth from 'hooks/useAuth'

import SendStore from 'store/SendStore'

import SelectBlockChain from '../../components/SelectBlockChain'
import SelectBridge from 'components/SelectBridge'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

const BlockChainNetwork = (): ReactElement => {
  const status = useRecoilValue(SendProcessStore.sendProcessStatus)
  const [toBlockChain, setToBlockChain] = useRecoilState(SendStore.toBlockChain)

  const [fromBlockChain, setFromBlockChain] = useRecoilState(
    SendStore.fromBlockChain
  )
  const { setBlockchainStorage } = useAuth()

  return (
    <div className="relative flex px-10 max-[575px]:px-0">
      <div className="relative flex items-center justify-between w-full">
        {bridgeGifs.map((gif, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-no-repeat bg-center bg-[length:40%_60%] pointer-events-none"
            style={{
              backgroundImage: `url(${gif})`,
              opacity: 0.4,
              top: `${(i - 1) * 20}%`,
            }}
          />
        ))}

        <SelectBlockChain
          {...{
            blockChain: fromBlockChain,
            setBlockChain: (value): void => {
              setFromBlockChain(value)
              setToBlockChain(BlockChainType.atomone)
              setBlockchainStorage({
                fromBlockChain: value,
                toBlockChain: BlockChainType.atomone,
              })
            },
            optionList: [
              {
                label: NETWORK.blockChainName[BlockChainType.atomone],
                value: BlockChainType.atomone,
                isDisabled: fromBlockChain === BlockChainType.atomone,
              },
              {
                label: NETWORK.blockChainName[BlockChainType.ethereum],
                value: BlockChainType.ethereum,
                isDisabled: fromBlockChain === BlockChainType.ethereum,
              },
              {
                label: `${
                  NETWORK.blockChainName[BlockChainType.base]
                } (paused)`,
                value: BlockChainType.base,
                isDisabled: true,
              },
            ],
            label: 'FROM',
          }}
        />
        <div style={{ height: '100%', display: 'flex', alignItems: 'start' }}>
          <SelectBridge />
          {status === ProcessStatus.Input && (
            <button
              className="absolute bottom-0 -translate-x-1/2 translate-y-1/2 bg-transparent border-0 cursor-pointer [&_img]:w-[27px] [&_img]:transition-all [&_img]:duration-300 [&_img]:ease-in-out [&_img]:-rotate-90 [&_img]:hover:-rotate-180"
              style={{
                filter:
                  'invert(94%) sepia(0%) saturate(711%) hue-rotate(223deg) brightness(69%) contrast(90%)',
              }}
              onClick={(): void => {
                setToBlockChain(fromBlockChain)
                setFromBlockChain(toBlockChain)
              }}
            >
              <img src={switchSvg} alt="switch" />
            </button>
          )}
        </div>
        <SelectBlockChain
          {...{
            blockChain: toBlockChain,
            setBlockChain: (b): void => {
              setToBlockChain(b)
              if (fromBlockChain !== BlockChainType.atomone) {
                setFromBlockChain(BlockChainType.atomone)
              }
              setBlockchainStorage({
                fromBlockChain: BlockChainType.atomone,
                toBlockChain: b,
              })
            },
            optionList: [
              {
                label: NETWORK.blockChainName[BlockChainType.atomone],
                value: BlockChainType.atomone,
                isDisabled: toBlockChain === BlockChainType.atomone,
              },
              {
                label: NETWORK.blockChainName[BlockChainType.ethereum],
                value: BlockChainType.ethereum,
                isDisabled: toBlockChain === BlockChainType.ethereum,
              },
              {
                label: `${
                  NETWORK.blockChainName[BlockChainType.base]
                } (paused)`,
                value: BlockChainType.base,
                isDisabled: true,
              },
            ],
            label: 'TO',
          }}
        />
      </div>
    </div>
  )
}

export default BlockChainNetwork
