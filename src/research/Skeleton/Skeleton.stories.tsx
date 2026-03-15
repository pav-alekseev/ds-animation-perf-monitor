import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Research/Skeleton Experiments",
  component: Skeleton,
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "20px",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Skeleton & { count?: number }>;

export const RepaintCase: Story = {
  args: {
    variant: "repaint",
  },
};

export const CompositeCase: Story = {
  args: {
    variant: "composite",
  },
};
