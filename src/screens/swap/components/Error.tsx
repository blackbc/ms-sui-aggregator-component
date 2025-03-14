import React from 'react';

import imgWarning from '@assets/images/warning.png';

type ScreenSwapErrorProps = {
  error: string;
};
const ScreenSwapError: React.FC<ScreenSwapErrorProps> = ({ error }) => {
  if (!error) {
    return '';
  }
  return (
    <>
      <div className="flex flex-row items-center mt-5">
        <img src={imgWarning} className="h-4 w-4" alt="warning icon" />
        <p className="text-red-500 text-sm font-medium ml-1">{error}</p>
      </div>
    </>
  );
};

export default ScreenSwapError;
