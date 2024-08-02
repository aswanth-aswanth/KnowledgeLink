"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthState, checkTokenExpiration } from "@/store/authSlice";
import SignIn from "@/app/(admin)/admin/sign-in/SignIn";

const AdminAuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const router = useRouter();

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
