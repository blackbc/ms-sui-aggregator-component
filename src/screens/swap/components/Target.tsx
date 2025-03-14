import React, { useState } from 'react';
import type { CoinBalance, CoinMetadata } from '@mysten/sui/client';
import type { CoinPriceInfo } from 'aftermath-ts-sdk';

import imgCoin from '@assets/images/coin.png';
import imgWallet from '@assets/images/wallet.png';

type ScreenSwapTargetProps = {
  targetCoinBalance: CoinBalance | undefined;
  targetCoinMetadata: CoinMetadata | null | undefined;
  targetCoinPrice: CoinPriceInfo | null;
};
const ScreenSwapTarget: React.FC<ScreenSwapTargetProps> = ({
  targetCoinBalance,
  targetCoinMetadata,
  targetCoinPrice,
}) => {
  const [amount, setAmount] = useState('0');

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-3 mt-5">
        <div className="flex flex-row justify-between items-center">
          <p className="text-white text-xs font-medium underline">You receive</p>
          <div>
            <button
              className="cursor-pointer text-orange-200 hover:text-orange-400 active:text-orange-600 text-xs font-medium"
              onClick={() => {
                setAmount(((targetCoinBalance?.coinObjectCount ?? 0) / 2).toString());
              }}
            >
              Half
            </button>
            <button
              className="cursor-pointer text-orange-200 hover:text-orange-400 active:text-orange-600 text-xs font-medium ml-2"
              onClick={() => {
                setAmount((targetCoinBalance?.coinObjectCount ?? 0).toString());
              }}
            >
              Max
            </button>
          </div>
        </div>
        <div className="flex flex-row items-center mt-3">
          {!!targetCoinMetadata && (
            <>
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
                  setAmount(event.target.value);
                }}
              />
            </>
          )}
          {!targetCoinMetadata && (
            <>
              <div className="h-8"></div>
            </>
          )}
        </div>
        <div className="flex flex-row justify-between items-center mt-3">
          <div className="flex flex-row items-center">
            <img src={imgWallet} className="w-4 h-4" alt="target coin wallet icon" />
            <p className="text-gray-500 text-sm font-medium ml-1">
              {targetCoinBalance?.coinObjectCount ?? '--'}
            </p>
          </div>
          <p className="text-gray-500 text-sm font-medium">
            ${targetCoinPrice && amount ? targetCoinPrice.price * Number(amount) : 0}
          </p>
        </div>
      </div>
    </>
  );
};

export default ScreenSwapTarget;
