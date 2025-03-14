import React from 'react';

import imgUpDown from '@assets/images/up-down.png';

type ScreenSwapSwapProps = {
  onClick: () => void;
};
const ScreenSwapSwap: React.FC<ScreenSwapSwapProps> = ({ onClick }) => {
  return (
    <>
      <div className="relative">
        <button
          className="cursor-pointer bg-black border rounded-full border-gray-500 p-3 hover:bg-gray-800 active:bg-gray-600 absolute top-[-11px] left-[calc(50%_-_21px)]"
          onClick={() => onClick()}
        >
          <img src={imgUpDown} className="h-4 2-4" alt="up down icon" />
        </button>
      </div>
    </>
  );
};

export default ScreenSwapSwap;
