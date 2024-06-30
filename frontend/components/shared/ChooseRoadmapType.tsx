import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import RadioGroupForm from "./RadioGroupForm";
import { useDarkMode } from "@/hooks/useDarkMode";
import { RootState } from "@/store";

interface ChooseRoadmapTypeProps {
  onContinue: (roadmapType: string) => void;
}

export default function ChooseRoadmapType({
  onContinue,
}: ChooseRoadmapTypeProps) {
  const { isDarkMode } = useDarkMode();
  const [roadmapType, setRoadmapType] = useState("public_voting");
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [showRoadmapTypeDialog, setShowRoadmapTypeDialog] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const router = useRouter();

  const handleSubmit = () => {
    if (isAuthenticated) {
      setShowRoadmapTypeDialog(true);
    } else {
      setShowAuthWarning(true);
    }
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleContinue = () => {
    setShowRoadmapTypeDialog(false);
    onContinue(roadmapType);
  };

  return (
    <>
      <Button
        variant="outline"
        className={`${isDarkMode ? "bg-dark-900 text-white" : ""}`}
        onClick={handleSubmit}
      >
        Submit
      </Button>

      <AlertDialog
        open={showRoadmapTypeDialog}
        onOpenChange={setShowRoadmapTypeDialog}
      >
        <AlertDialogContent
          className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white"}`}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl font-bold mb-8">
              Choose the type of roadmap
            </AlertDialogTitle>
            <AlertDialogDescription>
              <RadioGroupForm onTypeChange={setRoadmapType} />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowRoadmapTypeDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleContinue}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showAuthWarning} onOpenChange={setShowAuthWarning}>
        <AlertDialogContent
          className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white"}`}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to create a roadmap. Please sign in to
              continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAuthWarning(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSignIn}>
              Sign In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
