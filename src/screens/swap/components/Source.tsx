import React, { useEffect, useRef, useState } from 'react';
import type { CoinBalance, CoinMetadata } from '@mysten/sui/client';
import type { CoinPriceInfo } from 'aftermath-ts-sdk';

import AppConstants from '@constants/app';

import imgCoin from '@assets/images/coin.png';
import imgWallet from '@assets/images/wallet.png';

type ScreenSwapSourceProps = {
  sourceCoinBalance: CoinBalance | undefined;
  sourceCoinMetadata: CoinMetadata | null | undefined;
  sourceCoinPrice: CoinPriceInfo | null;
  sourceCoinAmount: string;
  setSourceCoinAmount: (amount: string) => void;
};
const ScreenSwapSource: React.FC<ScreenSwapSourceProps> = ({
  sourceCoinBalance,
  sourceCoinMetadata,
  sourceCoinPrice,
  sourceCoinAmount,
  setSourceCoinAmount,
}) => {
  const [amount, setAmount] = useState(sourceCoinAmount);
  useEffect(() => {
    setAmount(sourceCoinAmount);
  }, [sourceCoinAmount]);

  const debounceChangeAmount = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-3 mt-5">
        <div className="flex flex-row justify-between items-center">
          <p className="text-white text-xs font-medium underline">You pay</p>
          <div>
            <button
              className="cursor-pointer text-orange-200 hover:text-orange-400 active:text-orange-600 text-xs font-medium"
              onClick={() => {
                const newAmount = ((sourceCoinBalance?.coinObjectCount ?? 0) / 2).toString();
                setAmount(newAmount);
                clearTimeout(debounceChangeAmount.current);
                debounceChangeAmount.current = setTimeout(() => {
                  setSourceCoinAmount(newAmount);
                }, AppConstants.DEBOUNCE_CHANGE);
              }}
            >
              Half
            </button>
            <button
              className="cursor-pointer text-orange-200 hover:text-orange-400 active:text-orange-600 text-xs font-medium ml-2"
              onClick={() => {
                const newAmount = (sourceCoinBalance?.coinObjectCount ?? 0).toString();
                setAmount(newAmount);
                clearTimeout(debounceChangeAmount.current);
                debounceChangeAmount.current = setTimeout(() => {
                  setSourceCoinAmount(newAmount);
                }, AppConstants.DEBOUNCE_CHANGE);
              }}
            >
              Max
            </button>
          </div>
        </div>
        {!!sourceCoinMetadata && (
          <>
            <div className="flex flex-row items-center mt-3">
              <img
                src={sourceCoinMetadata.iconUrl || imgCoin}
                className="w-8 h-8"
                alt="source coin icon"
              />
              <p className="text-white text-lg font-semibold ml-2">{sourceCoinMetadata.symbol}</p>
              <input
                className="flex-1 text-white text-xl font-semibold p-1 ml-5 text-right focus:outline-none"
                value={amount}
                onChange={(event) => {
                  if (isNaN(Number(event.target.value))) {
                    return;
                  }
                  const isLastDot = event.target.value[event.target.value.length - 1] === '.';
                  const newAmount = `${Math.abs(Number(event.target.value)).toString()}${isLastDot ? '.' : ''}`;
                  setAmount(newAmount);
                  clearTimeout(debounceChangeAmount.current);
                  debounceChangeAmount.current = setTimeout(() => {
                    setSourceCoinAmount(newAmount);
                  }, AppConstants.DEBOUNCE_CHANGE);
                }}
              />
            </div>
          </>
        )}
        <div className="flex flex-row justify-between items-center mt-3">
          <div className="flex flex-row items-center">
            {!!sourceCoinBalance && (
              <>
                <img src={imgWallet} className="w-4 h-4" alt="source coin wallet icon" />
                <p className="text-gray-500 text-sm font-medium ml-1">
                  {sourceCoinBalance.coinObjectCount}
                </p>
              </>
            )}
          </div>
          {!!sourceCoinPrice && (
            <>
              <p className="text-gray-500 text-sm font-medium">
                ${amount ? sourceCoinPrice.price * Number(amount) : 0}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ScreenSwapSource;
