import { createContext } from 'react';

const AppConfigContext = createContext<{
  suiSdkNetwork: 'devnet' | 'localnet' | 'testnet' | 'mainnet';
  aftermathSdkNetwork: 'DEVNET' | 'LOCAL' | 'TESTNET' | 'MAINNET';
}>({
  suiSdkNetwork: import.meta.env.VITE_SUI_SDK_NETWORK || 'mainnet',
  aftermathSdkNetwork: import.meta.env.VITE_AFTERMATH_SDK_NETWORK || 'MAINNET',
});

export default AppConfigContext;
