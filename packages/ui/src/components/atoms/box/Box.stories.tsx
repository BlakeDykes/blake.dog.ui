import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "./Box";

const meta = {
  title: "Atoms/Box",
  component: Box,
  args: {
    padding: "md",
    children: "Box content",
  },
  argTypes: {
    padding: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          border: "var(--border-width-thin) dashed var(--color-border-strong)",
          display: "inline-block",
          color: "var(--color-fg)",
          fontFamily: "var(--font-family-display)",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AsSection: Story = {
  args: {
    render: <section />,
    children: "Rendered as a section element",
  },
};
