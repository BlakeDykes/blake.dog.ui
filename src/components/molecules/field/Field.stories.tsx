import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./Field";
import { Input } from "@/components/atoms/input";

const meta = {
  title: "Molecules/Field",
  component: Field.Root,
} satisfies Meta<typeof Field.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: "20rem" }}>
      <Field.Root name="email">
        <Field.Label>Email</Field.Label>
        <Field.Control placeholder="you@example.com" />
        <Field.Description>We never share your address.</Field.Description>
        <Field.Error />
      </Field.Root>
    </div>
  ),
};

export const WithInputAtom: Story = {
  render: () => (
    <div style={{ maxWidth: "20rem" }}>
      <Field.Root name="email">
        <Field.Label>Email</Field.Label>
        <Field.Control render={<Input placeholder="you@example.com" />} />
        <Field.Description>Composed with the Input atom.</Field.Description>
        <Field.Error />
      </Field.Root>
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div style={{ maxWidth: "20rem" }}>
      <Field.Root name="email">
        <Field.Label>Email</Field.Label>
        <Field.Control type="email" required placeholder="you@example.com" />
        <Field.Error match="valueMissing">This field is required.</Field.Error>
        <Field.Error match="typeMismatch">
          Enter a valid email address.
        </Field.Error>
      </Field.Root>
    </div>
  ),
};
