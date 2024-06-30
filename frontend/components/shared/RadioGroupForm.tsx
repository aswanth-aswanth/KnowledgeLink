import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RadioGroupFormProps {
  onTypeChange: (type: string) => void;
}

export default function RadioGroupForm({ onTypeChange }: RadioGroupFormProps) {
  const [selectedType, setSelectedType] = useState("public_voting");

  const handleChange = (value: string) => {
    setSelectedType(value);
    onTypeChange(value);
  };

  return (
    <RadioGroup
      value={selectedType}
      onValueChange={handleChange}
      className="gap-6"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="expert_collaboration" id="r1" />
        <Label htmlFor="r1">Expert collaboration roadmap</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="public_voting" id="r2" />
        <Label htmlFor="r2">Public voting roadmap</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="moderator_submission" id="r3" />
        <Label htmlFor="r3">Moderator submission roadmap</Label>
      </div>
    </RadioGroup>
  );
}
