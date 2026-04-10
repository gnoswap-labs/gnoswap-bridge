# packages/ - Bridge Protocol Implementations

외부 브릿지 프로토콜 SDK 및 내부 프로토콜 구현체.

## 패키지별 상세

### axelar/ — Axelar Network 브릿지
**파일:** `index.ts`
**역할:** Axelar SDK를 통한 크로스체인 전송 지원
**주요 함수:**
- `getDepositAddress()` — 목적지 체인의 입금 주소 생성
- `getAxelarFee()` — 브릿지 수수료 계산 (REST API)

**지원 경로:** Terra ↔ Ethereum, Avalanche, Moonbeam, Kujira
**의존:** `@axelar-network/axelarjs-sdk`, Axios

### wormhole/ — Wormhole (Portal) 브릿지
**파일:** `fees.ts`
**역할:** Wormhole Portal 수수료 계산
**주요 함수:**
- `getWormholeFees()` — 가스비 기반 수수료 산출

**지원 경로:** Terra ↔ BSC, Avalanche, Polygon, Fantom, Ethereum
**의존:** `@certusone/wormhole-sdk`, CoinGecko API, Alchemy API

### injective/ — Injective 체인 지원
**파일:** `index.ts`
**역할:** Injective 네트워크 전용 트랜잭션 처리
**참고:** IBC 전송 시 Injective 특유의 메시지 포맷 처리

### tns/ — Terra Name Service
**파일:** `useTns.ts`
**역할:** TNS 이름 → 주소 변환 (예: `alice.ust` → `terra1...`)
**의존:** Apollo Client (GraphQL)

### walletconnect/ — WalletConnect 프로토콜 구현
```
walletconnect/
├── core/           # WalletConnect 코어 로직 (Connector, Session 관리)
└── socket-transport/  # WebSocket 전송 레이어 (SocketTransport)
```
**참고:** graphify 분석에서 `Connector` (61 edges)와 `SocketTransport` (21 edges)가 가장 연결이 많은 God Node로 식별됨. WalletConnect v1 프로토콜의 핵심 구현체.

## 브릿지 선택 로직

`src/hooks/useUpdateBridgeType.ts`에서 From/To 체인 조합에 따라 자동으로 브릿지를 결정:

| From → To | 선택되는 브릿지 |
|-----------|----------------|
| Terra → Cosmos 체인 | IBC |
| Terra → Ethereum/Avalanche | Axelar |
| Terra → Fantom/Polygon | Wormhole 또는 Axelar (사용자 선택) |
| EVM → Terra | Axelar 또는 Wormhole |
| Cosmos → Terra | IBC |
