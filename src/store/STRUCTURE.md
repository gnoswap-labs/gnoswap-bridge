# store/ - Recoil State Management

Recoil atoms/selectors를 사용한 글로벌 상태 관리. 각 스토어는 독립적인 관심사를 담당.

## 스토어별 상세

### AuthStore.ts — 인증 상태
| Atom/Selector | 타입 | 설명 |
|---------------|------|------|
| `loginUser` | atom | `{ address, walletType }` — 현재 로그인된 사용자 |
| `isLoggedIn` | selector | address + extension 존재 여부로 로그인 판단 |

### NetworkStore.ts — 네트워크 연결
| Atom/Selector | 타입 | 설명 |
|---------------|------|------|
| `terraExt` | atom | Terra Station Extension 연결 상태 |
| `etherBaseExt` | atom | EVM 체인 Extension 연결 상태 |
| `keplrExt` | atom | Keplr Extension 연결 상태 |
| `terraLocal` | atom | 선택된 Terra 네트워크 (mainnet/testnet) |
| `isTestnet` | selector | 테스트넷 여부 판단 |

### SendStore.ts — 전송 폼 (가장 큰 스토어)
| Atom/Selector | 타입 | 설명 |
|---------------|------|------|
| `asset` | atom | 선택된 자산 (토큰) |
| `toAddress` | atom | 수신 주소 |
| `amount` | atom | 전송 금액 |
| `memo` | atom | 메모 |
| `fromBlockChain` | atom | 출발 체인 |
| `toBlockChain` | atom | 도착 체인 |
| `bridgeUsed` | atom | 사용할 브릿지 (IBC/Axelar/Wormhole) |
| `fee` | atom | 트랜잭션 수수료 |
| `gasPrices` | atom | 가스 가격 |
| `bridgeFee` | atom | 브릿지 수수료 |
| `amountAfterBridgeFee` | selector | 수수료 차감 후 수령 금액 |
| `validationResult` | atom | 폼 검증 결과 |
| `loginUserAssetList` | atom | 사용자 보유 자산 목록 |

### SendProcessStore.ts — 전송 프로세스
| Atom/Selector | 타입 | 설명 |
|---------------|------|------|
| `sendProcessStatus` | atom | 프로세스 상태: `Input` → `Confirm` → `Finish` |

### ContractStore.ts — 컨트랙트 정보
| Atom/Selector | 타입 | 설명 |
|---------------|------|------|
| `initOnlyShuttle` | atom | Shuttle 전용 초기화 플래그 |

### SelectWalletStore.ts — 지갑 선택 모달
| Atom/Selector | 타입 | 설명 |
|---------------|------|------|
| `selectWalletModal` | atom | 모달 표시/숨김 상태 |

## 데이터 흐름

```
[지갑 연결] → AuthStore.loginUser
           → NetworkStore.terraExt / etherBaseExt / keplrExt

[체인 선택] → SendStore.fromBlockChain / toBlockChain
           → SendStore.bridgeUsed (자동 결정)

[금액 입력] → SendStore.amount → useSendValidate → SendStore.validationResult

[전송 실행] → SendProcessStore: Input → Confirm → Finish
```
