import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "./Form";
import { Field } from "@/components/molecules/field";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";

const meta = {
  title: "Molecules/Form",
  component: Form,
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Login-shaped form: Form + Field + Input + Button, with server errors. */
export const Login: Story = {
  render: () => {
    const [errors, setErrors] = useState<Record<string, string>>({});

    return (
      <div style={{ maxWidth: "20rem" }}>
        <Form
          errors={errors}
          onSubmit={(event) => {
            event.preventDefault();
            // Pretend the server rejected the credentials.
            setErrors({ password: "Incorrect email or password." });
          }}
        >
          <Field.Root name="email">
            <Field.Label>Email</Field.Label>
            <Field.Control
              type="email"
              required
              placeholder="you@example.com"
            />
            <Field.Error />
          </Field.Root>

          <Field.Root name="password">
            <Field.Label>Password</Field.Label>
            <Field.Control render={<Input type="password" required />} />
            <Field.Error />
          </Field.Root>

          <Button type="submit">Sign in</Button>
        </Form>
      </div>
    );
  },
};
