# Base Tombala - Decentralized Turkish Bingo on Base Blockchain

A decentralized Turkish-style bingo game built on Base blockchain with Coinbase MiniKit integration. Players can place bets on numbers 1-25, and the smart contract automatically handles draws and prize distribution.

## 🚀 Features

- **Decentralized Gaming**: Smart contract-based game logic on Base blockchain
- **Fair & Transparent**: All draws are verifiable on-chain
- **Real-time Updates**: Live game state updates via Web3 hooks
- **Mobile-First Design**: Responsive UI optimized for MiniKit
- **Turkish Bingo Rules**: Classic tombala gameplay with 25-number grid
- **Automated Draws**: Scheduled draws every 5 minutes
- **Prize Pool System**: Accumulating ETH rewards for winners

## 🛠 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Blockchain**: Solidity 0.8.27, Hardhat, Base Sepolia/Mainnet
- **Web3 Integration**: Wagmi, Viem, OnChainKit
- **MiniKit**: Coinbase MiniKit for seamless wallet connection
- **Development**: ESLint, TypeScript strict mode
- **Deployment**: Vercel with automated cron jobs

## 🎮 How to Play

1. **Connect Wallet**: Use your Coinbase Wallet or any compatible wallet
2. **Choose Number**: Select any available number from 1-25 grid
3. **Place Bet**: Pay 0.001 ETH to secure your number
4. **Wait for Draw**: Automated draws happen every 5 minutes
5. **Win Prize**: If your number is drawn, win the entire prize pool!
## 📱 Game States

- **Active**: Players can place bets on available numbers
- **Drawing**: Countdown to automatic number selection
- **Results**: Display winning number and prize distribution
- **Loading**: Initializing new round

## 🏗 Smart Contract

The `Tombala.sol` contract handles:

- **Bet Management**: Track player bets and chosen numbers
- **Prize Pool**: Accumulate ETH from all bets
- **Random Draws**: Secure random number generation
- **Prize Distribution**: Automatic winner payouts
- **Game Lifecycle**: Start new rounds after each draw

### Contract Address (Base Sepolia)
```
0xD8D362c4A33C6d180B65d9020C602DFeF48cA37b
```

## � Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- Coinbase Wallet or compatible Web3 wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/base-tombala.git
cd base-tombala

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your contract addresses and API keys

# Start development server
npm run dev
```
cd my-minikit-app
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Çevre değişkenlerini ayarlayın**
```bash
cp .env.local.example .env.local
# .env.local dosyasını doldurun
```

4. **Akıllı kontratı derleyin**
```bash
npm run compile
```

5. **Testleri çalıştırın**
```bash
npm run test
```

6. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

## 📋 Çevre Değişkenleri

`.env.local` dosyasında aşağıdaki değişkenleri ayarlayın:

```bash
# OnChainKit API anahtarı (https://portal.cdp.coinbase.com/)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key

# Akıllı kontrat deploy etmek için private key
PRIVATE_KEY=your_private_key

# Kontrat doğrulama için BaseScan API anahtarı
BASESCAN_API_KEY=your_basescan_key

# Deploy edilen kontrat adresleri
NEXT_PUBLIC_TOMBALA_CONTRACT_ADDRESS_SEPOLIA=0x...
NEXT_PUBLIC_TOMBALA_CONTRACT_ADDRESS_MAINNET=0x...

# Cron job güvenliği için rastgele secret
CRON_SECRET=your_random_secret
```

## 🚀 Deployment

### 1. Sepolia Testnet'e Deploy

```bash
# Kontratı deploy edin
npm run deploy:sepolia

# Kontratı doğrulayın
npm run verify:sepolia <contract_address>
```

### 2. Vercel'e Deploy

```bash
# Vercel CLI ile deploy
vercel

# Veya GitHub'a push edip otomatik deploy
git push origin main
```

### 3. Mainnet'e Deploy

```bash
# Testleri tamamladıktan sonra
npm run deploy:mainnet
npm run verify:mainnet <contract_address>
```

## 📁 Proje Yapısı

```
my-minikit-app/
├── app/
│   ├── components/
│   │   ├── TombalaGame.tsx     # Ana oyun bileşeni
│   │   ├── TombalaHome.tsx     # Anasayfa
│   │   └── DemoComponents.tsx  # Yardımcı bileşenler
│   ├── api/
│   │   ├── cron/               # Otomatik çekiliş API'si
│   │   └── games/              # Oyun geçmişi API'si
│   ├── page.tsx               # Ana sayfa
│   └── providers.tsx          # Web3 provider'lar
├── contracts/
│   └── Tombala.sol           # Akıllı kontrat
├── lib/
│   ├── contracts.ts          # Kontrat konfigürasyonu
│   └── tombala-hooks.ts      # React hook'lar
├── test/
│   └── Tombala.test.js       # Kontrat testleri
├── scripts/
│   └── deploy.js             # Deploy scripti
├── hardhat.config.js         # Hardhat konfigürasyonu
└── vercel.json              # Cron job konfigürasyonu
```

## 🧪 Test Etme

```bash
# Akıllı kontrat testleri
npm run test

# Test coverage
npx hardhat coverage

# Gas raporu
npx hardhat test --gas-reporter
```

## 🔧 Geliştirme

### Yeni Özellik Ekleme

1. Kontrat değişiklikleri için `contracts/Tombala.sol` düzenleyin
2. Frontend değişiklikleri için `app/components/` altını düzenleyin
3. Testleri güncelleyin ve çalıştırın
4. Deploy ve test edin

### Debug

```bash
# Hardhat console
npx hardhat console --network base-sepolia

# Kontrat logs
npx hardhat run scripts/debug.js --network base-sepolia
```

## 📊 Akıllı Kontrat Detayları

### Ana Fonksiyonlar

- `placeBet(uint256 number)`: Bahis yapma
- `drawWinner()`: Kazanan çekme (otomatik)
- `startNewGame()`: Yeni oyun başlatma (otomatik)
- `getGameStats()`: Oyun istatistikleri
- `getFilledNumbers()`: Dolu sayılar

### Events

- `BetPlaced`: Bahis yapıldığında
- `GameDrawn`: Kazanan çekildiğinde
- `NewGameStarted`: Yeni oyun başladığında

## 🛣️ Roadmap

### V1.0 (Mevcut)
- [x] Temel tombala oyunu
- [x] Akıllı kontrat
- [x] MiniKit entegrasyonu
- [x] Otomatik çekiliş

### V2.0 (Gelecek)
- [ ] Farklı token desteği ($DEGEN, $HIGHER)
- [ ] Liderlik tablosu
- [ ] Oyun geçmişi arayüzü
- [ ] Chainlink VRF entegrasyonu
- [ ] Çoklu oyun modları

### V3.0 (Uzun Vadeli)
- [ ] NFT ödülleri
- [ ] Turnuva sistemi
- [ ] Sosyal özellikler
- [ ] Mobil uygulama

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişiklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'e push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🔗 Linkler

- [Base Docs](https://docs.base.org/)
- [OnChainKit Docs](https://onchainkit.xyz/)
- [MiniKit Docs](https://docs.base.org/building-with-base/minikit)
- [Hardhat Docs](https://hardhat.org/)

## 🆘 Destek

Sorularınız için:
- [Issues](https://github.com/your-repo/issues) açın
- [Base Discord](https://discord.gg/buildonbase) kanalına katılın
- [OnChainKit Community](https://github.com/coinbase/onchainkit) takip edin

---

**Tombala Mini App** - Base ile inşa edildi 🔵

## Template Features

### Frame Configuration
- `.well-known/farcaster.json` endpoint configured for Frame metadata and account association
- Frame metadata automatically added to page headers in `layout.tsx`

### Background Notifications
- Redis-backed notification system using Upstash
- Ready-to-use notification endpoints in `api/notify` and `api/webhook`
- Notification client utilities in `lib/notification-client.ts`

### Theming
- Custom theme defined in `theme.css` with OnchainKit variables
- Pixel font integration with Pixelify Sans
- Dark/light mode support through OnchainKit

### MiniKit Provider
The app is wrapped with `MiniKitProvider` in `providers.tsx`, configured with:
- OnchainKit integration
- Access to Frames context
- Sets up Wagmi Connectors
- Sets up Frame SDK listeners
- Applies Safe Area Insets

## Customization

To get started building your own frame, follow these steps:

1. Remove the DemoComponents:
   - Delete `components/DemoComponents.tsx`
   - Remove demo-related imports from `page.tsx`

2. Start building your Frame:
   - Modify `page.tsx` to create your Frame UI
   - Update theme variables in `theme.css`
   - Adjust MiniKit configuration in `providers.tsx`

3. Add your frame to your account:
   - Cast your frame to see it in action
   - Share your frame with others to start building your community

## Learn More

- [MiniKit Documentation](https://docs.base.org/builderkits/minikit/overview)
- [OnchainKit Documentation](https://docs.base.org/builderkits/onchainkit/getting-started)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
