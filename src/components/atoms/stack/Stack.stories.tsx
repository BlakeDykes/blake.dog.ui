import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { Stack } from "./Stack";

const meta = {
  title: "Atoms/Stack",
  component: Stack,
  args: {
    direction: "row",
    gap: "sm",
    align: "center",
    justify: "start",
    wrap: false,
  },
  argTypes: {
    direction: { control: "select", options: ["row", "column"] },
    gap: { control: "select", options: ["none", "xs", "sm", "md", "lg", "xl"] },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch"],
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between"],
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Row: Story = {
  render: (args) => (
    <Stack {...args}>
      <Button>One</Button>
      <Button variant="outline">Two</Button>
      <Button variant="ghost">Three</Button>
    </Stack>
  ),
};

export const Column: Story = {
  args: { direction: "column", align: "start" },
  render: (args) => (
    <Stack {...args}>
      <Button>One</Button>
      <Button variant="outline">Two</Button>
      <Button variant="ghost">Three</Button>
    </Stack>
  ),
};
