import AuthGate from "@admin/component/AuthGate";
import Layout from "@admin/component/Layout";
import Ops from "@admin/views/Ops";
import { Spinner } from "@ui/component/Spinner";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const Auth = React.lazy(() => import("@admin/views/Auth"));
const Home = React.lazy(() => import("@admin/views/Home"));
// const UserList = React.lazy(() => import("@admin/views/UserList"));
// const User = React.lazy(() => import("@admin/views/User"));
const NotFound = React.lazy(() => import("@admin/views/NotFound"));
const Maintenance = React.lazy(() => import("@admin/views/Maintenance"));

const Router = () => {
  return (
    <BrowserRouter basename={"/"}>
      <ErrorBoundary fallback={<Ops />}>
        <React.Suspense fallback={<Spinner centered={true} />}>
          <Routes>
            <Route path={"/"} element={<Layout />}>
              <Route path={"/"} element={<AuthGate ifAuthed={true} element={<Navigate to={"/home"} />} elseTo={"/auth"} />} />
              <Route path={"/auth"} element={<AuthGate ifAuthed={false} element={<Auth onSuccess={"/"} />} elseTo={"/"} />} />
              <Route path={"/home"} element={<AuthGate ifAuthed={true} element={<Home />} elseTo={"/auth"} />} />
              {/*<Route path={"/users"} element={<AuthGate ifAuthed={true} element={<UserList />} elseTo={"/auth"} />} />*/}
              {/*<Route path={"/user/:id?"} element={<AuthGate ifAuthed={true} element={<User />} elseTo={"/auth"} />} />*/}
              <Route path={"/maintenance"} element={<Maintenance />} />
              <Route path={"*"} element={<NotFound />} />
            </Route>
          </Routes>
        </React.Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Router;
