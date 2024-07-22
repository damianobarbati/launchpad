import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Header from '@admin/component/Header';
import type { RootState } from '@admin/store';

const Layout = () => {
  const token = useSelector((state: RootState) => state.app.token);
  const isAuthenticated = !!token;

  return (
    <>
      {isAuthenticated && <Header />}
      <Outlet />
    </>
  );
};

export default Layout;
