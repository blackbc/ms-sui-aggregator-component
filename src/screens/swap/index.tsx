import React, { useEffect, useState } from 'react';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';

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
  console.log(account);

  const { data: balanceSourceCoin } = useSuiClientQuery('getBalance', {
    owner: account?.address || '',
    coinType: sourceCoinType,
  });
  console.log(balanceSourceCoin);
  const { data: balanceTargetCoin } = useSuiClientQuery('getBalance', {
    owner: account?.address || '',
    coinType: targetCoinType,
  });
  console.log(balanceTargetCoin);

  const { data: metadataSourceCoin } = useSuiClientQuery('getCoinMetadata', {
    coinType: sourceCoinType,
  });
  console.log(metadataSourceCoin);
  const { data: metadataTargetCoin } = useSuiClientQuery('getCoinMetadata', {
    coinType: targetCoinType,
  });
  console.log(metadataTargetCoin);

  const aftermathSdk = useAftermathSdk();
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
          console.log(route);
          console.log(Number(route.routes[0].coinIn.amount) / Number('1e9'));
          console.log(Number(route.routes[0].coinOut.amount) / Number('1e9'));
          // router
          //   .getTransactionForCompleteTradeRoute({
          //     walletAddress: account.address,
          //     completeRoute: route,
          //     slippage: 0.1,
          //   })
          //   .then((tx) => {
          //     console.log(tx);
          //   })
          //   .catch((error) => {
          //     console.log(error);
          //   });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [aftermathSdk, account, sourceCoinType, targetCoinType]);

  return (
    <>
      <div className="h-full">
        <div className="flex flex-row justify-center mt-5 p-5">
          <div className="w-xl p-5 border border-white rounded-lg">
            <ScreenSwapHeader />
            <ScreenSwapSource />
            <ScreenSwapSwap />
            <ScreenSwapTarget />
            <ScreenSwapRouter />
            <ScreenSwapTrade account={account} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenSwap;
