import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import type { RouterCompleteTradeRoute, CoinPriceInfo } from 'aftermath-ts-sdk';

import useAftermathSdk from '@hooks/useAftermathSdk';

import ScreenSwapHeader from './components/Header';
import ScreenSwapSource from './components/Source';
import ScreenSwapSwap from './components/Swap';
import ScreenSwapTarget from './components/Target';
import ScreenSwapRouter from './components/Router';
import ScreenSwapError from './components/Error';
import ScreenSwapTrade from './components/Trade';

const ScreenSwap: React.FC = () => {
  const aftermathSdk = useAftermathSdk();

  const [sourceCoinType, setSourceCoinType] = useState('0x2::sui::SUI');
  const [targetCoinType, setTargetCoinType] = useState(
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

  const [sourceCoinAmount, setSourceCoinAmount] = useState('0');
  const [targetCoinAmount, setTargetCoinAmount] = useState('0');

  const onShouldSwap = useCallback(() => {
    const [_targetCoinType, _sourceCoinType] = [sourceCoinType, targetCoinType];
    setSourceCoinType(_sourceCoinType);
    setTargetCoinType(_targetCoinType);
    setSourceCoinAmount('0');
    setTargetCoinAmount('0');
    setTradeRoute(null);
  }, [sourceCoinType, targetCoinType]);

  const [tradeRoute, setTradeRoute] = useState<RouterCompleteTradeRoute | null>(null);
  const getRouteIn = useCallback(
    (
      sourceCoinType: string,
      sourceCoinDecimal: number,
      targetCoinType: string,
      targetCoinDecimal: number,
      address: string,
      amount: number,
    ) => {
      const router = aftermathSdk.Router();
      router
        .getCompleteTradeRouteGivenAmountIn({
          coinInType: sourceCoinType,
          coinOutType: targetCoinType,
          coinInAmount: BigInt(amount * Number(`1e${sourceCoinDecimal}`)),
          referrer: address,
        })
        .then((route) => {
          setTradeRoute(route);
          setTargetCoinAmount(
            (
              Number(
                ((route?.coinOut.amount || BigInt(0)) * 100n) /
                  BigInt(Number(`1e${targetCoinDecimal}`)),
              ) / 100
            ).toString(),
          );
        })
        .catch(() => {
          setTradeRoute(null);
        });
    },
    [aftermathSdk],
  );
  const getRouteOut = useCallback(
    (
      sourceCoinType: string,
      sourceCoinDecimal: number,
      targetCoinType: string,
      targetCoinDecimal: number,
      address: string,
      amount: number,
    ) => {
      const router = aftermathSdk.Router();
      router
        .getCompleteTradeRouteGivenAmountOut({
          coinInType: sourceCoinType,
          coinOutType: targetCoinType,
          coinOutAmount: BigInt(amount * Number(`1e${targetCoinDecimal}`)),
          slippage: 0.01,
          referrer: address,
        })
        .then((route) => {
          setTradeRoute(route);
          setSourceCoinAmount(
            (
              Number(
                ((route?.coinIn.amount || BigInt(0)) * 100n) /
                  BigInt(Number(`1e${sourceCoinDecimal}`)),
              ) / 100
            ).toString(),
          );
        })
        .catch(() => {
          setTradeRoute(null);
        });
    },
    [aftermathSdk],
  );

  const error = useMemo(() => {
    if ((sourceCoinBalance?.coinObjectCount ?? 0) < Number(sourceCoinAmount)) {
      return 'Invalid balance';
    }
    return '';
  }, [sourceCoinBalance, sourceCoinAmount]);

  return (
    <>
      <div className="h-full">
        <div className="flex flex-row justify-center mt-5 p-5">
          <div className="w-xl p-5 border border-white rounded-lg">
            <ScreenSwapHeader
              sourceCoinAmount={sourceCoinAmount}
              sourceCoinMetadata={sourceCoinMetadata}
              sourceCoinPrice={sourceCoinPrice}
              targetCoinMetadata={targetCoinMetadata}
              targetCoinPrice={targetCoinPrice}
              tradeRoute={tradeRoute}
            />
            <ScreenSwapSource
              sourceCoinBalance={sourceCoinBalance}
              sourceCoinMetadata={sourceCoinMetadata}
              sourceCoinPrice={sourceCoinPrice}
              sourceCoinAmount={sourceCoinAmount}
              setSourceCoinAmount={(amount) => {
                setTradeRoute(null);
                setSourceCoinAmount(amount);
                if (Number(amount)) {
                  getRouteIn(
                    sourceCoinType,
                    sourceCoinMetadata?.decimals || 9,
                    targetCoinType,
                    targetCoinMetadata?.decimals || 9,
                    account?.address || '',
                    Number(amount),
                  );
                } else {
                  setTargetCoinAmount('0');
                }
              }}
            />
            <ScreenSwapSwap onClick={onShouldSwap} />
            <ScreenSwapTarget
              targetCoinBalance={targetCoinBalance}
              targetCoinMetadata={targetCoinMetadata}
              targetCoinPrice={targetCoinPrice}
              targetCoinAmount={targetCoinAmount}
              setTargetCoinAmount={(amount) => {
                setTradeRoute(null);
                setTargetCoinAmount(amount);
                if (Number(amount)) {
                  getRouteOut(
                    sourceCoinType,
                    sourceCoinMetadata?.decimals || 9,
                    targetCoinType,
                    targetCoinMetadata?.decimals || 9,
                    account?.address || '',
                    Number(amount),
                  );
                } else {
                  setSourceCoinAmount('0');
                }
              }}
            />
            <ScreenSwapRouter
              sourceCoinMetadata={sourceCoinMetadata}
              targetCoinMetadata={targetCoinMetadata}
              tradeRoute={tradeRoute}
            />
            <ScreenSwapError error={error} />
            <ScreenSwapTrade account={account} disabled={!tradeRoute || !!error} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenSwap;
