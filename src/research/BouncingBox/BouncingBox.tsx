import React from "react";

import "./BouncingBox.css";

interface BouncingBoxProps {
  variant: "layout" | "composite";
  label?: string;
}

export const BouncingBox: React.FC<BouncingBoxProps> = ({ variant, label }) => {
  return (
    <div className={`box ${variant}-animation`}>
      {label || (variant === "layout" ? "Reflow/Repaint" : "Composite Layer")}
    </div>
  );
};
