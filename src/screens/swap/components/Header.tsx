import React from 'react';

import imgSlippage from '@assets/images/slippage.png';

const ScreenSwapHeader: React.FC = () => {
  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <p className="text-white text-lg font-medium">Swap</p>
        <div className="flex flex-row justify-center items-center">
          <img src={imgSlippage} className="w-5 h-5" alt="slippage" />
          <p className="text-white text-md font-medium ml-1">0.5%</p>
        </div>
      </div>
    </>
  );
};

export default ScreenSwapHeader;
