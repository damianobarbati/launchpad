import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import type { RootState } from '@admin/store';

type Props = {
  ifAuthed: boolean;
  element: React.ReactElement<any, any>;
  elseTo: string;
};

const AuthGate = ({ ifAuthed, element, elseTo }: Props) => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.app.token);
  const isAuthenticated = !!token;

  React.useEffect(() => {
    if (ifAuthed && !isAuthenticated) navigate(elseTo);
    else if (!ifAuthed && isAuthenticated) navigate(elseTo);
  }, [ifAuthed, isAuthenticated, elseTo, navigate]);

  if (ifAuthed) {
    if (isAuthenticated) return element;
    return <Navigate to={elseTo} />;
  }
    if (!isAuthenticated) return element;
    return <Navigate to={elseTo} />;
};

export default AuthGate;
