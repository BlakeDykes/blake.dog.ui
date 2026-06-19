import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "./Toggle";

const meta = {
  title: "Atoms/Toggle",
  component: Toggle,
  args: {
    "aria-label": "Favorite",
    children: "★",
    disabled: false,
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PressedByDefault: Story = { args: { defaultPressed: true } };

export const Disabled: Story = { args: { disabled: true } };
