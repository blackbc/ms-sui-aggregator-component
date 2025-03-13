import React, { useEffect, useMemo } from 'react';
import { ConnectButton, useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { Aftermath } from 'aftermath-ts-sdk';

import { CoinTypes } from '@constants/coins';

const ScreenSwap: React.FC = () => {
  const account = useCurrentAccount();
  console.log(account);
  const { data: balanceCoin } = useSuiClientQuery('getBalance', {
    owner: account?.address || '',
    coinType: CoinTypes.sui,
  });
  console.log(balanceCoin);
  const { data: metadataCoin } = useSuiClientQuery('getCoinMetadata', {
    coinType: CoinTypes.cetus,
  });
  console.log(metadataCoin);

  const aftermath = useMemo(() => new Aftermath('MAINNET'), []);
  useEffect(() => {
    aftermath.init();
    const router = aftermath.Router();
    router
      .getCompleteTradeRouteGivenAmountIn({
        coinInType: CoinTypes.sui,
        coinOutType: CoinTypes.cetus,
        coinInAmount: BigInt(1 * Number('1e9')),
      })
      .then((route) => {
        console.log(route);
        console.log(Number(route.routes[0].coinIn.amount) / Number('1e9'));
        console.log(Number(route.routes[0].coinOut.amount) / Number('1e9'));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [aftermath]);

  return (
    <>
      <div className="h-full">
        {!account && (
          <>
            <div className="flex flex-row justify-center mt-5">
              <ConnectButton />
            </div>
          </>
        )}
        {!!account && (
          <>
            <div className="mt-5"></div>
          </>
        )}
      </div>
    </>
  );
};

export default ScreenSwap;
