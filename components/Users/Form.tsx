import { Dialog, Button, type ButtonProps } from '@radix-ui/themes';
import Form, { Field } from '@/components/Form';

type ComponentProps = ButtonProps & {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValues?: Record<string, string>;
  onSubmit: (values: FormSubmission) => Promise<void>;
  onDelete?: () => Promise<void>;
  title: string;
  description: string;
  roles?: string[];
};

const Component = ({
  open,
  setOpen,
  initialValues = {},
  onSubmit,
  onDelete,
  title,
  description,
  roles,
  ...props
}: ComponentProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button {...props} />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
        <Form
          variant="dialog"
          onSubmit={onSubmit}
          initialValues={initialValues}
          onDelete={onDelete}
          deleteMessage="Are you sure you want to delete this user's role?"
          deleteLabel="Delete"
          deleteTitle="Delete user role"
        >
          <Field
            disabled={!!onDelete}
            mt="4"
            label="Email"
            name="email"
            type="email"
            required
          />
          <Field
            label="Role"
            name="role"
            type="select"
            required
            values={roles}
            labels={roles}
            mb="6"
          />
        </Form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default Component;