import React from "react";
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

export default function ChooseRoadmapType() {
  const { isDarkMode } = useDarkMode();
  return (
    <AlertDialog>
      <div className="flex justify-center mt-8">
        <AlertDialogTrigger>
          <Button variant="outline" className={`${isDarkMode && "bg-dark-900 text-white"}`}>
            Submit
          </Button>
        </AlertDialogTrigger>
      </div>
      <AlertDialogContent className="bg-white p-8">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl font-bold text-gray-600 mb-8">
            Choose the type of roadmap
          </AlertDialogTitle>
          <AlertDialogDescription>
            <RadioGroupForm />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
