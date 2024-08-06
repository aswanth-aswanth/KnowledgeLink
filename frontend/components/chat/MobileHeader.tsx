import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthState, clearAuthState } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { FiLogOut, FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";

const MobileHeader: React.FC = () => {
  const { user } = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(clearAuthState());
    router.push("/sign-in");
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <header className="md:hidden flex justify-between items-center p-2 bg-white dark:bg-gray-800 shadow-md">
      <Button variant="ghost" onClick={handleBack}>
        <FiArrowLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-lg font-semibold">Chat</h1>
      <Button variant="ghost" onClick={handleLogout}>
        <FiLogOut className="h-6 w-6" />
      </Button>
    </header>
  );
};

export default MobileHeader;
