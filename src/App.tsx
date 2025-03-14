import React, { useContext, useMemo } from 'react';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import suiSdkTheme from '@components/suiSdkTheme';
import { BrowserRouter } from 'react-router';

import AppConfigContext from './contexts/AppConfig';

import Router from './screens';

const App: React.FC = () => {
  const appConfig = useContext(AppConfigContext);

  const { networkConfig } = useMemo(
    () =>
      createNetworkConfig({
        localnet: { url: getFullnodeUrl('localnet') },
        devnet: { url: getFullnodeUrl('devnet') },
        testnet: { url: getFullnodeUrl('testnet') },
        mainnet: { url: getFullnodeUrl('mainnet') },
      }),
    [],
  );
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork={appConfig.suiSdkNetwork}>
          <WalletProvider theme={suiSdkTheme}>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
