import React, { useMemo } from 'react';
import type { CoinMetadata } from '@mysten/sui/client';
import type { CoinPriceInfo } from 'aftermath-ts-sdk';
import type { RouterCompleteTradeRoute } from 'aftermath-ts-sdk';

import imgSlippage from '@assets/images/slippage.png';

type ScreenSwapHeaderProps = {
  sourceCoinAmount: string;
  sourceCoinMetadata: CoinMetadata | null | undefined;
  sourceCoinPrice: CoinPriceInfo | null;
  targetCoinMetadata: CoinMetadata | null | undefined;
  targetCoinPrice: CoinPriceInfo | null;
  tradeRoute: RouterCompleteTradeRoute | null;
};
const ScreenSwapHeader: React.FC<ScreenSwapHeaderProps> = ({
  sourceCoinAmount,
  sourceCoinMetadata,
  sourceCoinPrice,
  targetCoinMetadata,
  targetCoinPrice,
  tradeRoute,
}) => {
  const slippage = useMemo(() => {
    if (
      !Number(sourceCoinAmount) ||
      !sourceCoinMetadata ||
      !sourceCoinPrice ||
      !targetCoinMetadata ||
      !targetCoinPrice ||
      !tradeRoute
    ) {
      return 0;
    }
    const expertedAmount =
      (Number(sourceCoinAmount) * sourceCoinPrice.price) / targetCoinPrice.price;
    const realAmount =
      Number(
        (tradeRoute.coinOut.amount * 100n) / BigInt(Number(`1e${targetCoinMetadata.decimals}`)),
      ) / 100;
    return 1 - realAmount / expertedAmount;
  }, [
    sourceCoinAmount,
    sourceCoinMetadata,
    sourceCoinPrice,
    targetCoinMetadata,
    targetCoinPrice,
    tradeRoute,
  ]);

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <p className="text-white text-lg font-medium">Swap</p>
        <div className="flex flex-row justify-center items-center">
          {slippage > 0 && (
            <>
              <img src={imgSlippage} className="w-5 h-5" alt="slippage" />
              <p className="text-white text-md font-medium ml-1">{(slippage * 100).toFixed(2)}%</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ScreenSwapHeader;
