# services/ - Wallet Service Integrations

각 블록체인 지갑과의 연결, 네트워크 전환, 트랜잭션 서명을 담당하는 서비스 레이어.

## 파일별 역할

| 파일 | 지갑 | 대상 체인 | 주요 기능 |
|------|------|-----------|-----------|
| `terraService.ts` | Terra Station Extension | Terra | connect, post (트랜잭션 전송) |
| `metaMaskService.ts` | MetaMask | EVM 전체 | connect, switchNetwork, addNetworkAndSwitch |
| `keplrService.ts` | Keplr Extension | Cosmos/IBC | connect, experimentalSuggestChain |
| `bscService.ts` | Binance Chain Wallet | BSC | connect, checkInstalled |
| `walletConnectService.ts` | WalletConnect (EVM) | EVM 모바일 | connect via WC provider |
| `terraWalletConnectService.ts` | WalletConnect (Terra) | Terra 모바일 | connect via WC + Terra.js |
| `coinBaseService.ts` | Coinbase Wallet | EVM | connect via CoinbaseWalletSDK |

## 공통 패턴

모든 서비스는 다음 인터페이스를 따름:
- `checkInstalled()` — 브라우저 익스텐션 설치 여부 확인
- `connect()` — 지갑 연결 및 주소 반환
- `install()` — 설치 페이지로 리다이렉트 (일부 서비스)

## 체인별 지갑 매핑

- **Terra** → terraService, terraWalletConnectService
- **EVM (ETH, BSC, Avalanche, Fantom, Polygon, Moonbeam)** → metaMaskService, walletConnectService, coinBaseService
- **BSC 전용** → bscService (Binance Chain Wallet)
- **Cosmos/IBC** → keplrService

## 의존 관계

- `metaMaskService` → ethers.js (Web3 Provider)
- `keplrService` → @keplr-wallet/cosmos, cosmjs
- `terraService` → @terra-money/terra.js
- `walletConnectService` → @walletconnect/web3-provider
- `terraWalletConnectService` → @walletconnect/client + Terra.js

## 사용 위치

- `src/hooks/useAuth.ts` — 로그인 시 서비스 호출
- `src/hooks/useSelectWallet.ts` — 지갑 선택 모달에서 연결
- `src/App/SelectWalletModal/` — UI에서 서비스 트리거
