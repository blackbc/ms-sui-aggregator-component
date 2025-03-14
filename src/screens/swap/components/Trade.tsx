import React, { useState } from 'react';
import type { WalletAccount } from '@mysten/wallet-standard';
import { ConnectModal } from '@mysten/dapp-kit';

import imgTrade from '@assets/images/trade.png';

type ScreenSwapTradeProps = {
  account: WalletAccount | null;
};
const ScreenSwapTrade: React.FC<ScreenSwapTradeProps> = ({ account }) => {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  return (
    <>
      <ConnectModal
        trigger={<></>}
        open={isConnectModalOpen}
        onOpenChange={(isOpen) => setIsConnectModalOpen(isOpen)}
      />
      {!account && (
        <>
          <button
            type="button"
            className="cursor-pointer text-black bg-white hover:bg-gray-200 active:bg-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 w-full mt-5"
            onClick={() => setIsConnectModalOpen(true)}
          >
            Connect Wallet
          </button>
        </>
      )}
      {!!account && (
        <>
          <button
            type="button"
            className="cursor-pointer text-black bg-white hover:bg-gray-200 active:bg-gray-400 font-medium rounded-lg text-md px-5 py-2.5 w-full flex flex-row justify-center items-center mt-5"
          >
            <img src={imgTrade} className="w-4 h-4" alt="trade" />
            <span className="ml-1">Trade</span>
          </button>
        </>
      )}
    </>
  );
};

export default ScreenSwapTrade;
