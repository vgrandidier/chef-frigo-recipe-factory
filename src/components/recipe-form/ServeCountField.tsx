
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface ServeCountFieldProps {
  nombreCouverts: number;
  setNombreCouverts: (count: number) => void;
}

export const ServeCountField = ({ nombreCouverts, setNombreCouverts }: ServeCountFieldProps) => {
  const handleSliderChange = (value: number[]) => {
    // Ensure the value is rounded to the nearest integer
    const roundedValue = Math.round(value[0]);
    setNombreCouverts(roundedValue);
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Nombre de couverts</label>
      <Slider
        min={1}
        max={12}
        step={1}
        defaultValue={[4]}
        value={[nombreCouverts]}
        onValueChange={handleSliderChange}
        className="py-4"
        showMarks={true}
      />
    </div>
  );
};
