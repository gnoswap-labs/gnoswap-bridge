⚠️ This project is under development, forked from [terra-money/bridge-web-app](https://github.com/terra-money/bridge-web-app). Use at your own risk.

# Gno.land Bridge

A web frontend for bridging GNOT, GRC20, ATONE, and PHOTON tokens between Gno.land, AtomOne, Ethereum, and Base using the [Union protocol](https://union.build).

## Features

- Bridge ATONE/PHOTON across AtomOne ↔ Ethereum ↔ Base
- Bridge GNOT/GRC20 tokens across Gno.land ↔ EVM Chains (Coming soon)
- Adena Wallet support (Gno.land) (Coming soon)
- Keplr wallet support (AtomOne)
- MetaMask / EVM wallet support (Ethereum, Base)
- Live packet dashboard via Union GraphQL API


## Development

**Requirements:** Node.js 20+, [pnpm](https://pnpm.io)

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview
```

## Deployment

Configured for [Vercel](https://vercel.com) (`vercel.json`).

## License

Apache-2.0 — see [LICENSE](./LICENSE).

> This project is a fork of [terra-money/bridge-web-app](https://github.com/terra-money/bridge-web-app),  
> Copyright 2021 Terraform Labs, PTE. LTD., licensed under the Apache License, Version 2.0.  
> See [NOTICE](./NOTICE) for details.
