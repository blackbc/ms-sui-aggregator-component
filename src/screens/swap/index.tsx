import React from 'react';
import { ConnectButton, useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';

const ScreenSwap: React.FC = () => {
  const account = useCurrentAccount();
  console.log(account);
  const { data: balanceSui } = useSuiClientQuery('getBalance', {
    owner: account?.address || '',
    coinType: '0x2::sui::SUI',
  });
  console.log(balanceSui);
  const { data: balanceUsdc } = useSuiClientQuery('getBalance', {
    owner: account?.address || '',
    coinType: '0x168da5bf1f48dafc111b0a488fa454aca95e0b5e::usdc::USDC',
  });
  console.log(balanceUsdc);

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
        {!!account && <></>}
      </div>
    </>
  );
};

export default ScreenSwap;
