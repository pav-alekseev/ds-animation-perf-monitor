import type { Meta, StoryObj } from "@storybook/react";
import { BouncingBox } from "./BouncingBox";

const meta: Meta<typeof BouncingBox> = {
  title: "Research/Performance Experiments",
  component: BouncingBox,
};

type Story = StoryObj<typeof BouncingBox>;

export const LayoutAnimation: Story = {
  args: {
    variant: "layout",
  },
};

export const CompositeAnimation: Story = {
  args: {
    variant: "composite",
  },
};

export default meta;
