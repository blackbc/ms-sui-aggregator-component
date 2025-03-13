import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router';

import RouteConstants from '@constants/route';

import ComponentLoading from '@components/loading';

const ScreenSwap = React.lazy(() => import('./swap'));

const Router: React.FC = () => {
  return (
    <>
      <Routes>
        <Route
          path={`${RouteConstants.PATH_SWAP}`}
          element={
            <Suspense fallback={<ComponentLoading />}>
              <ScreenSwap />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate replace to={`${RouteConstants.PATH_SWAP}`} />} />
      </Routes>
    </>
  );
};

export default Router;
