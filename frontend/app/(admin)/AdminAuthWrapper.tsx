'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkTokenExpiration } from '@/redux/auth/auth.slice';
import { selectAuthState } from '@/redux/auth/auth.selectors';
import SignIn from '@/components/auth/SignIn';
import { useAppDispatch } from '@/hooks/useRedux';

const AdminAuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useSelector(selectAuthState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkTokenExpiration());
    setIsLoading(false);
  }, [dispatch]);

  if (isLoading) {
    return <div className="dark:text-white">Loading...</div>;
  }

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <SignIn />;
  }

  return <>{children}</>;
};

export default AdminAuthWrapper;
