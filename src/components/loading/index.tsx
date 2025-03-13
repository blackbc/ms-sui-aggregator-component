import React from 'react';

import ComponentSpinner from '../spinner';

const ComponentLoading: React.FC = () => {
  return (
    <>
      <div className="h-full flex justify-center items-center">
        <div className="w-8 h-8">
          <ComponentSpinner />
        </div>
      </div>
    </>
  );
};

export default ComponentLoading;
