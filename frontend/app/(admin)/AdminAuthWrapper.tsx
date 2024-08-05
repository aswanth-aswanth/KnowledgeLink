"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkTokenExpiration } from "@/store/authSlice";
import { selectAuthState } from "@/store/selectors";
import SignIn from "@/components/auth/SignIn";

const AdminAuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useSelector(selectAuthState);
  const dispatch = useDispatch();
  console.log("isAuthenticated : ", isAuthenticated);
  console.log("user : ", user);

  useEffect(() => {
    dispatch(checkTokenExpiration());
    setIsLoading(false);
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return <SignIn />;
  }

  return <>{children}</>;
};

export default AdminAuthWrapper;
