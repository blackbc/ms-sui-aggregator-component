import React from 'react';
import type { CoinMetadata } from '@mysten/sui/client';
import type { RouterCompleteTradeRoute } from 'aftermath-ts-sdk';

import imgLeftRight from '@assets/images/left-right.png';
import imgRoute from '@assets/images/route.png';

type ScreenSwapRouterProps = {
  sourceCoinMetadata: CoinMetadata | null | undefined;
  targetCoinMetadata: CoinMetadata | null | undefined;
  tradeRoute: RouterCompleteTradeRoute | null;
};
const ScreenSwapRouter: React.FC<ScreenSwapRouterProps> = ({
  tradeRoute,
  sourceCoinMetadata,
  targetCoinMetadata,
}) => {
  if (!tradeRoute || !sourceCoinMetadata || !targetCoinMetadata) {
    return <></>;
  }
  return (
    <>
      <div className="mt-5 p-3 border rounded-lg border-gray-500">
        <div className="flex flex-row items-center">
          <p className="text-gray-500 text-sm font-medium">{`1 ${sourceCoinMetadata.symbol} = ${Number((tradeRoute.coinOut.amount * 100n) / tradeRoute.coinIn.amount) / 100} ${targetCoinMetadata.symbol}`}</p>
          <img src={imgLeftRight} className="w-4 h-4 ml-1" alt="left right icon" />
        </div>
        <div className="mt-3 flex flex-row justify-between items-center">
          <p className="text-gray-500 text-xs font-semibold underline">Route</p>
          <button className="cursor-pointer flex flex-row items-center">
            <img src={imgRoute} className="w-4 h-4" alt="route icon" />
            <p className="text-orange-500 text-xs font-semibold underline ml-1">
              {`${tradeRoute.routes.length} Splits, ${tradeRoute.routes.reduce((total, route) => total + route.paths.length, 0)} hops`}
            </p>
          </button>
        </div>
      </div>
    </>
  );
};

export default ScreenSwapRouter;
