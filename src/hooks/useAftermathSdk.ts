import { useContext, useMemo } from 'react';
import { Aftermath } from 'aftermath-ts-sdk';

import AppConfigContext from '@/contexts/AppConfig';

const useAftermathSdk = () => {
  const appConfig = useContext(AppConfigContext);

  const aftermathSdk = useMemo(() => {
    const _aftermathSdk = new Aftermath(appConfig.aftermathSdkNetwork);
    _aftermathSdk.init();
    return _aftermathSdk;
  }, [appConfig]);

  return aftermathSdk;
};

export default useAftermathSdk;
