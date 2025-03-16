import React, { useEffect, useRef, useState } from 'react';
import type { CoinBalance, CoinMetadata } from '@mysten/sui/client';
import type { CoinPriceInfo } from 'aftermath-ts-sdk';

import AppConstants from '@constants/app';

import imgCoin from '@assets/images/coin.png';
import imgWallet from '@assets/images/wallet.png';

import { toMoneyFormat, fromMoneyFormat } from '@utilities/number';

type ScreenSwapTargetProps = {
  targetCoinBalance: CoinBalance | undefined;
  targetCoinMetadata: CoinMetadata | null | undefined;
  targetCoinPrice: CoinPriceInfo | null;
  targetCoinAmount: string;
  setTargetCoinAmount: (amount: string) => void;
};
const ScreenSwapTarget: React.FC<ScreenSwapTargetProps> = ({
  targetCoinBalance,
  targetCoinMetadata,
  targetCoinPrice,
  targetCoinAmount,
  setTargetCoinAmount,
}) => {
  const [amount, setAmount] = useState(targetCoinAmount);
  useEffect(() => {
    setAmount(toMoneyFormat(targetCoinAmount));
  }, [targetCoinAmount]);

  const debounceChangeAmount = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-3 mt-5">
        <div className="flex flex-row justify-between items-center">
          <p className="text-white text-xs font-medium underline">You receive</p>
          <div>
            <button
              className="cursor-pointer text-orange-200 hover:text-orange-400 active:text-orange-600 text-xs font-medium"
              onClick={() => {
                const newAmount = ((targetCoinBalance?.coinObjectCount ?? 0) / 2).toString();
                setAmount(toMoneyFormat(newAmount));
                clearTimeout(debounceChangeAmount.current);
                debounceChangeAmount.current = setTimeout(() => {
                  setTargetCoinAmount(newAmount);
                }, AppConstants.DEBOUNCE_CHANGE);
              }}
            >
              Half
            </button>
            <button
              className="cursor-pointer text-orange-200 hover:text-orange-400 active:text-orange-600 text-xs font-medium ml-2"
              onClick={() => {
                const newAmount = (targetCoinBalance?.coinObjectCount ?? 0).toString();
                setAmount(toMoneyFormat(newAmount));
                clearTimeout(debounceChangeAmount.current);
                debounceChangeAmount.current = setTimeout(() => {
                  setTargetCoinAmount(newAmount);
                }, AppConstants.DEBOUNCE_CHANGE);
              }}
            >
              Max
            </button>
          </div>
        </div>
        {!!targetCoinMetadata && (
          <>
            <div className="flex flex-row items-center mt-3">
              <img
                src={targetCoinMetadata.iconUrl || imgCoin}
                className="w-8 h-8"
                alt="target coin icon"
              />
              <p className="text-white text-lg font-semibold ml-2">{targetCoinMetadata.symbol}</p>
              <input
                className="flex-1 text-white text-xl font-semibold p-1 ml-5 text-right focus:outline-none"
                value={amount}
                onChange={(event) => {
                  const newValue = fromMoneyFormat(event.target.value);
                  if (isNaN(Number(newValue))) {
                    return;
                  }
                  const isLastDot = newValue[newValue.length - 1] === '.';
                  const newAmount = `${Math.abs(Number(newValue)).toString()}${isLastDot ? '.' : ''}`;
                  setAmount(toMoneyFormat(newAmount));
                  clearTimeout(debounceChangeAmount.current);
                  debounceChangeAmount.current = setTimeout(() => {
                    setTargetCoinAmount(newAmount);
                  }, AppConstants.DEBOUNCE_CHANGE);
                }}
              />
            </div>
          </>
        )}
        <div className="flex flex-row justify-between items-center mt-3">
          <div className="flex flex-row items-center">
            {!!targetCoinBalance && (
              <>
                <img src={imgWallet} className="w-4 h-4" alt="target coin wallet icon" />
                <p className="text-gray-500 text-sm font-medium ml-1">
                  {targetCoinBalance.coinObjectCount}
                </p>
              </>
            )}
          </div>
          {!!targetCoinPrice && (
            <>
              <p className="text-gray-500 text-sm font-medium">
                $
                {amount
                  ? toMoneyFormat(
                      (targetCoinPrice.price * Number(fromMoneyFormat(amount))).toString(),
                    )
                  : 0}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ScreenSwapTarget;
