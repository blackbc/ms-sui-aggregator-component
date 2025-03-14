import React, { useEffect, useState } from 'react';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import type { RouterCompleteTradeRoute, CoinPriceInfo } from 'aftermath-ts-sdk';

import useAftermathSdk from '@hooks/useAftermathSdk';

import ScreenSwapHeader from './components/Header';
import ScreenSwapSource from './components/Source';
import ScreenSwapSwap from './components/Swap';
import ScreenSwapTarget from './components/Target';
import ScreenSwapRouter from './components/Router';
import ScreenSwapTrade from './components/Trade';

const ScreenSwap: React.FC = () => {
  const [sourceCoinType] = useState('0x2::sui::SUI');
  const [targetCoinType] = useState(
    '0x6864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS',
    // '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
  );

  const account = useCurrentAccount();

  const { data: sourceCoinBalance } = useSuiClientQuery('getBalance', {
    owner: account?.address || '',
    coinType: sourceCoinType,
  });
  const { data: targetCoinBalance } = useSuiClientQuery('getBalance', {
    owner: account?.address || '',
    coinType: targetCoinType,
  });
  const { data: sourceCoinMetadata } = useSuiClientQuery('getCoinMetadata', {
    coinType: sourceCoinType,
  });
  const { data: targetCoinMetadata } = useSuiClientQuery('getCoinMetadata', {
    coinType: targetCoinType,
  });

  const [sourceCoinPrice, setSourceCoinPrice] = useState<CoinPriceInfo | null>(null);
  const [targetCoinPrice, setTargetCoinPrice] = useState<CoinPriceInfo | null>(null);
  const [, setTradeRoute] = useState<RouterCompleteTradeRoute | null>(null);

  const aftermathSdk = useAftermathSdk();
  useEffect(() => {
    const prices = aftermathSdk.Prices();
    prices
      .getCoinPriceInfo({
        coin: sourceCoinType,
      })
      .then((price) => {
        setSourceCoinPrice(price);
      })
      .catch(() => {
        setSourceCoinPrice(null);
      });
  }, [aftermathSdk, sourceCoinType]);
  useEffect(() => {
    const prices = aftermathSdk.Prices();
    prices
      .getCoinPriceInfo({
        coin: targetCoinType,
      })
      .then((price) => {
        setTargetCoinPrice(price);
      })
      .catch(() => {
        setTargetCoinPrice(null);
      });
  }, [aftermathSdk, targetCoinType]);
  useEffect(() => {
    if (account?.address) {
      const router = aftermathSdk.Router();
      router
        .getCompleteTradeRouteGivenAmountIn({
          coinInType: sourceCoinType,
          coinOutType: targetCoinType,
          coinInAmount: BigInt(0.01 * Number('1e9')),
          referrer: account.address,
        })
        .then((route) => {
          setTradeRoute(route);
        })
        .catch(() => {
          setTradeRoute(null);
        });
    }
  }, [aftermathSdk, account, sourceCoinType, targetCoinType]);

  return (
    <>
      <div className="h-full">
        <div className="flex flex-row justify-center mt-5 p-5">
          <div className="w-xl p-5 border border-white rounded-lg">
            <ScreenSwapHeader />
            <ScreenSwapSource
              sourceCoinBalance={sourceCoinBalance}
              sourceCoinMetadata={sourceCoinMetadata}
              sourceCoinPrice={sourceCoinPrice}
            />
            <ScreenSwapSwap />
            <ScreenSwapTarget
              targetCoinBalance={targetCoinBalance}
              targetCoinMetadata={targetCoinMetadata}
              targetCoinPrice={targetCoinPrice}
            />
            <ScreenSwapRouter />
            <ScreenSwapTrade account={account} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenSwap;
