import React from 'react';
import { useAccount } from 'wagmi';
import { Button, Icon } from './DemoComponents';

interface TombalaHomeProps {
  onStartGame: () => void;
}

export function TombalaHome({ onStartGame }: TombalaHomeProps) {
  const { isConnected } = useAccount();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center">
        <h1 className="text-3xl font-bold mb-2">🎯 Tombala</h1>
        <p className="text-blue-100 mb-4">
          Blockchain tabanlı Türk Tombala oyunu
        </p>
        <p className="text-sm text-blue-200">
          Base ağında güvenli ve adil oyun deneyimi
        </p>
      </div>

      {/* Game Rules Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Icon name="star" className="text-yellow-500 mr-2" />
          Oyun Kuralları
        </h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
            <div>
              <p className="font-medium text-gray-800">Sayı Seçimi</p>
              <p>1-25 arasından bir sayı seçin</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
            <div>
              <p className="font-medium text-gray-800">Bahis Miktarı</p>
              <p>Sabit 0.001 ETH bahis yapın</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
            <div>
              <p className="font-medium text-gray-800">Çekiliş</p>
              <p>24 saat sonra rastgele kazanan belirlenir</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
            <div>
              <p className="font-medium text-gray-800">Ödül</p>
              <p>Kazanan kasanın %90&apos;ını alır</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Icon name="check" className="text-green-500 mr-2" />
          Özellikler
        </h2>
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center">
            <Icon name="check" className="text-green-500 mr-2" size="sm" />
            <span>%100 şeffaf ve adil oyun</span>
          </div>
          <div className="flex items-center">
            <Icon name="check" className="text-green-500 mr-2" size="sm" />
            <span>Akıllı kontrat güvencesi</span>
          </div>
          <div className="flex items-center">
            <Icon name="check" className="text-green-500 mr-2" size="sm" />
            <span>Anında ödeme</span>
          </div>
          <div className="flex items-center">
            <Icon name="check" className="text-green-500 mr-2" size="sm" />
            <span>Düşük işlem ücretleri</span>
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-bold mb-3 text-gray-800">📊 İstatistikler</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">24h</div>
            <div className="text-gray-600">Oyun Süresi</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">25</div>
            <div className="text-gray-600">Maks. Sayı</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center pt-4">
        {isConnected ? (
          <Button
            onClick={onStartGame}
            size="lg"
            className="w-full"
            icon={<Icon name="arrow-right" size="md" />}
          >
            Oyuna Başla
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-600 text-sm">
              Oyuna katılmak için cüzdanınızı bağlayın
            </p>
            <Button
              onClick={() => {}} // Wallet connection is handled by the main app
              size="lg"
              className="w-full opacity-50 cursor-not-allowed"
              disabled
            >
              Cüzdan Bağlayın
            </Button>
          </div>
        )}
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-yellow-600 text-lg mr-2">⚠️</div>
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Dikkat</p>
            <p>Bu bir demo uygulamasıdır. Testnet üzerinde çalışır. Gerçek para kaybetme riski yoktur.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
