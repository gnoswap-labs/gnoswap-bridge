import { ReactElement, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { NavLink } from 'react-router-dom'
import ClickAwayListener from 'react-click-away-listener'
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

import { UTIL } from 'consts'

import { Container, Text, View, Row } from 'components'

import useAuth from 'hooks/useAuth'

import AuthStore from 'store/AuthStore'

import bridgeLogo from 'images/bridge_logo.png'
import WalletLogo from 'components/WalletLogo'
import { WalletEnum } from 'types/wallet'
import { CosmosWallet, EvmWallet } from 'types/auth'
import keplrService from 'services/keplrService'
import metaMaskService from 'services/metaMaskService'
import { BlockChainType } from 'types/network'

const WalletBadge = ({
  label,
  walletEnum,
  address,
  onConnect,
  onDisconnect,
}: {
  label: string
  walletEnum: WalletEnum
  address: string | null
  onConnect: () => void
  onDisconnect: () => void
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)

  if (!address) {
    return (
      <button
        className="flex items-center justify-center gap-3 rounded-[14px] border border-white/20 text-lg py-3.5 px-6 min-w-[200px] cursor-pointer hover:border-bridge-sky hover:bg-white/5 bg-transparent text-white/60 transition-colors"
        onClick={onConnect}
      >
        <WalletLogo walleEnum={walletEnum} size={26} />
        <span>{label}</span>
      </button>
    )
  }

  return (
    <ClickAwayListener onClickAway={(): void => setIsOpen(false)}>
      <View className="relative">
        <Row
          className="items-center justify-center rounded-[14px] border border-bridge-sky text-lg py-3.5 px-6 min-w-[200px] cursor-pointer hover:opacity-80 gap-3"
          onClick={(): void => setIsOpen(!isOpen)}
        >
          <WalletLogo walleEnum={walletEnum} size={26} />
          <Text className="text-lg font-normal tracking-[-0.19px]">
            {UTIL.truncate(address, [6, 4])}
          </Text>
        </Row>

        {isOpen && (
          <View className="absolute cursor-pointer bottom-0 h-9 -mb-[38px] justify-center bg-[#484848] rounded-[10px] w-full p-0 text-center hover:bg-[#494f5a] z-[1] animate-[dropdown_0.3s_ease] text-xs">
            <View
              onClick={(): void => {
                onDisconnect()
                setIsOpen(false)
              }}
            >
              Disconnect
            </View>
          </View>
        )}
      </View>
    </ClickAwayListener>
  )
}

const Header = (): ReactElement => {
  const cosmosWallet = useRecoilValue(AuthStore.cosmosWallet)
  const evmWallet = useRecoilValue(AuthStore.evmWallet)
  const { loginCosmos, loginEvm, disconnectCosmos, disconnectEvm } = useAuth()

  const connectKeplr = async (): Promise<void> => {
    if (keplrService.checkInstalled()) {
      const { address, signingCosmosClient } = await keplrService.connect(
        BlockChainType.atomone
      )
      await loginCosmos({
        address,
        signer: signingCosmosClient,
        walletType: WalletEnum.Keplr,
      })
    } else {
      window.open('https://www.keplr.app/download', '_blank')
    }
  }

  const connectMetaMask = async (): Promise<void> => {
    if (metaMaskService.checkInstalled()) {
      const { address, provider } = await metaMaskService.connect()
      const walletClient = createWalletClient({
        account: address as `0x${string}`,
        chain: mainnet,
        transport: custom(provider),
      })
      await loginEvm({
        address,
        walletClient,
        walletType: WalletEnum.MetaMask,
      })
    } else {
      metaMaskService.install()
    }
  }

  const navLinkCls = ({ isActive }: { isActive: boolean }): string =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-white bg-white/10'
        : 'text-white/60 hover:text-white hover:bg-white/5'
    }`

  return (
    <Container className="relative">
      <Container className="max-w-[960px]">
        <View className="flex-row justify-between items-center pt-[47px] pb-[19px] max-[575px]:p-5">
          {/* Navigation */}
          <Row className="items-center gap-1">
            <NavLink to="/" end className={navLinkCls}>
              Send
            </NavLink>
            <NavLink to="/dashboard" className={navLinkCls}>
              Dashboard
            </NavLink>
          </Row>

          {/* Wallet Badges */}
          <Row className="items-center gap-2">
            <WalletBadge
              label="Keplr"
              walletEnum={WalletEnum.Keplr}
              address={cosmosWallet?.address || null}
              onConnect={connectKeplr}
              onDisconnect={disconnectCosmos}
            />
            <WalletBadge
              label="MetaMask"
              walletEnum={WalletEnum.MetaMask}
              address={evmWallet?.address || null}
              onConnect={connectMetaMask}
              onDisconnect={disconnectEvm}
            />
          </Row>
        </View>
      </Container>
    </Container>
  )
}

export default Header
