import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./Link";

const meta = {
  title: "Atoms/Link",
  component: Link,
  args: {
    children: "Read the documentation",
    href: "#docs",
    underline: "always",
  },
  argTypes: {
    underline: { control: "select", options: ["always", "hover"] },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const UnderlineOnHover: Story = { args: { underline: "hover" } };

export const InText: Story = {
  render: (args) => (
    <p
      style={{
        margin: 0,
        fontFamily: "var(--font-family-body)",
        color: "var(--color-fg)",
      }}
    >
      Body copy with an inline <Link {...args}>link to elsewhere</Link> in the
      sentence.
    </p>
  ),
};
