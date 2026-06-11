import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./Text";

const meta = {
  title: "Atoms/Text",
  component: Text,
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
    size: "md",
    weight: "regular",
    muted: false,
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    weight: { control: "select", options: ["regular", "medium", "bold"] },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Muted: Story = { args: { muted: true } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Text {...args} size="xs">
        Extra small text
      </Text>
      <Text {...args} size="sm">
        Small text
      </Text>
      <Text {...args} size="md">
        Medium text
      </Text>
      <Text {...args} size="lg">
        Large text
      </Text>
    </div>
  ),
};

export const AsSpan: Story = {
  args: {
    render: <span />,
    children: "Rendered as an inline span",
  },
};
