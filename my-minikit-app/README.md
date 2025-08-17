# MiniKit Template

# 🎯 Tombala Mini App

Blockchain tabanlı **Türk Tombala oyunu** - Base ağında çalışan güvenli ve adil mini uygulama.

## 🎮 Oyun Hakkında

Tombala, geleneksel Türk tombala oyununun blockchain versiyonudur. Oyuncular 1-25 arasından bir sayı seçer, 0.001 ETH bahis yapar ve 24 saat sonra yapılan çekilişte kazananı bekler.

### 🎯 Özellikler

- ⚡ **Anında Oyun**: MiniKit entegrasyonu ile hızlı cüzdan bağlantısı
- 🔒 **%100 Güvenli**: Akıllı kontrat ile şeffaf ve manipüle edilemez oyun
- 💰 **Adil Ödül Dağıtımı**: Kazanan kasanın %90'ını alır
- 🕐 **24 Saatlik Döngü**: Her gün yeni oyun, otomatik çekiliş
- 📱 **Mobil Uyumlu**: Base app içinde mükemmel çalışır

### 🎲 Oyun Kuralları

1. **Sayı Seçimi**: 1-25 arasından tek bir sayı seçin
2. **Bahis**: Sabit 0.001 ETH ödeme yapın
3. **Bekleme**: 24 saat sonra otomatik çekiliş
4. **Kazanma**: Seçilen sayılardan birisi rastgele kazanan olur

## 🚀 Teknoloji Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Blockchain**: Base (Sepolia test / Mainnet production)
- **Akıllı Kontrat**: Solidity 0.8.27
- **Web3 Kütüphaneleri**: OnChainKit, Wagmi, Viem
- **Test Framework**: Hardhat
- **Deployment**: Vercel
- **Otomasyon**: Vercel Cron Jobs

## 🛠️ Kurulum

### Önkoşullar

- Node.js 18+
- npm veya yarn
- Base Sepolia testnet ETH'i
- OnChainKit API anahtarı

### Adımlar

1. **Repo'yu klonlayın**
```bash
git clone <your-repo-url>
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
