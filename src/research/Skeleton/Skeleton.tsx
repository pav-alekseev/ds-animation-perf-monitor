import React from "react";
import "./Skeleton.css";

interface SkeletonProps {
  variant: "repaint" | "composite";
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant,
  width = "100%",
  height = "40px",
  borderRadius = "16px",
}) => {
  return (
    <div
      className={`skeleton-base skeleton-${variant}`}
      style={{ width, height, borderRadius }}
    />
  );
};
