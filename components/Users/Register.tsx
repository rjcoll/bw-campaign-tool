
import React from 'react';
import Form from '@/components/Users/RegisterForm';
import { type ButtonProps } from '@radix-ui/themes';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/helpers/firebase';

const Register = ({ ...props }: ButtonProps ) => {
  const [open, setOpen] = React.useState(false);
  const onSubmit = async (values: FormSubmission) => {
  await createUserWithEmailAndPassword(auth, values.email as string, values.password as string)
    setOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  return (
    <Form
      open={open}
      setOpen={setOpen}
      onSubmit={onSubmit as any} // eslint-disable-line
      title={`Sign in`}
      {...props}
    />
  );
};

export default Register;