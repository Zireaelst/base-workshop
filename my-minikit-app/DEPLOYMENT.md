# Deployment Guide

## Contract Deployment ✅

The Tombala smart contract has been successfully deployed to Base Sepolia:

- **Contract Address**: `0xD8D362c4A33C6d180B65d9020C602DFeF48cA37b`
- **Network**: Base Sepolia Testnet
- **Deployment Transaction**: `0xbb2916ac157aa4926c415cf4cbd77954de0a7e375bd24e653b5255d666683a3c`
- **Deployer Address**: `0x6602130E170195670407CeE93932C1B0b9454aDD`

## Vercel Deployment Steps

### 1. Environment Variables Setup

In your Vercel dashboard, add these environment variables:

```bash
# Contract Addresses
NEXT_PUBLIC_TOMBALA_CONTRACT_ADDRESS_SEPOLIA=0xD8D362c4A33C6d180B65d9020C602DFeF48cA37b
NEXT_PUBLIC_TOMBALA_CONTRACT_ADDRESS_MAINNET=

# OnChainKit Configuration (get from Coinbase Developer Portal)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Base Tombala
NEXT_PUBLIC_ICON_URL=/icon.png

# Cron Job Security
CRON_SECRET=generate_random_secret_for_cron_jobs

# Optional: Redis for notifications
REDIS_URL=your_redis_url_if_needed
REDIS_TOKEN=your_redis_token_if_needed

# Private key (for cron job contract interactions)
PRIVATE_KEY=7fd789f59d00550f0f723d2a8654c4b9446d60bbad58aefcfdd270d5613dbab6
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Or connect your GitHub repo and enable auto-deployment
```

### 3. Verify Deployment

After deployment, verify these features:

- [ ] Wallet connection works
- [ ] Contract interaction (place bet)
- [ ] Game state updates
- [ ] Cron job for draws (check /api/cron)
- [ ] Toast notifications
- [ ] Responsive design

### 4. MiniKit Integration

The app is ready for MiniKit with:

- [x] Proper manifest.json configuration
- [x] Mobile-optimized UI
- [x] Wallet integration via OnChainKit
- [x] Frame-ready structure
- [x] English localization

### 5. Post-Deployment Tasks

1. **Update README** with live demo URL
2. **Contract Verification** on BaseScan (optional)
3. **Monitor Cron Jobs** in Vercel dashboard
4. **Test All Features** on live site
5. **Submit to Base ecosystem** if desired

## Next Steps

- **Mainnet Deployment**: Deploy contract to Base Mainnet when ready
- **Additional Features**: Leaderboards, multiple game modes, etc.
- **Mobile App**: Consider PWA or native app
- **Marketing**: Social media, community engagement

## Support

If you encounter any issues:

1. Check Vercel function logs
2. Verify environment variables
3. Test contract on Base Sepolia explorer
4. Review console for errors

Contract is live and ready for production use! 🚀
