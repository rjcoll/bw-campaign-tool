'use client';
import React from 'react';
import {
  Container,
  Link,
  Text,
  Heading,
  Dialog,
  type BoxProps,
} from '@radix-ui/themes';
import { auth } from '@/helpers/firebase';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useLocalstorageState } from 'rooks';
import { useSearchParams } from 'next/navigation';
import { useEffectOnceWhen } from 'rooks';
import useUser from '@/hooks/useUser';
import SignIn from '@/components/Users/SignIn';
import AppWrapper from '@/components/AppWrapper';
import Menu from '@/components/Users/Menu';
import { Provider as UserProvider } from '@/contexts/User';
import useStatusUpdate from '@/hooks/useStatusUpdate';
import usePermissions from '@/hooks/usePermissions';

type SignInWrapperProps = {
  children: React.ReactNode;
  force?: boolean;
  loading?: boolean;
  role?: string;
  breadcrumbs?: Breadcrumb[];
  permissions?: string[];
  user?: User;
  innerProps?: BoxProps;
};

const SignInWrapper = ({
  children,
  force,
  loading,
  role,
  breadcrumbs,
  permissions,
  user: _user,
  innerProps = {},
}: SignInWrapperProps) => {
  const [user, _loading] = useUser(_user, true);
  const searchParams = useSearchParams();
  const [sent, setSent] = React.useState(false);
  const [email, setEmail] = useLocalstorageState('bwcampaigns:email', '');
  const [open, setOpen] = React.useState(false);
  const onAddMessage = useStatusUpdate();
  const [isAllowed, permsLoading] = usePermissions(permissions, user);

  const isSignedIn = !!user?.id;

  const onSignedIn = React.useCallback(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, email, window.location.href).then(() => {
        onAddMessage({ message: 'You are now signed in', variant: 'success' });
      });
    }
  }, [email, onAddMessage]);

  const onComplete = React.useCallback(
    ({ email }: { email: string }) => {
      setEmail(email);
      setSent(true);
    },
    [setEmail],
  );

  useEffectOnceWhen(
    () => {
      onSignedIn();
    },
    !!searchParams.get('oobCode') && !!email,
  );

  if (_loading || permsLoading) {
    return (
      <AppWrapper innerProps={innerProps} breadcrumbs={breadcrumbs} loading />
    );
  }

  if (sent) {
    return (
      <AppWrapper
        innerProps={innerProps}
        breadcrumbs={breadcrumbs}
        loading={loading}
      >
        <Container size="1" align="center">
          <Heading align="center" my="8" as="h1">
            Check your inbox
          </Heading>
          <Text as="div" align="center">
            Click the link in the email to sign in.
          </Text>
        </Container>
      </AppWrapper>
    );
  }

  if (!isSignedIn && force) {
    return (
      <AppWrapper
        innerProps={innerProps}
        breadcrumbs={breadcrumbs}
        loading={loading}
      >
        <Container size="1" align="center">
          <Heading as="h1" my="8" align="center">
            Please sign in to continue
          </Heading>
          <SignIn
            style={{ width: '100%' }}
            email={email}
            onComplete={onComplete}
          />
        </Container>
      </AppWrapper>
    );
  }

  if (
    isSignedIn &&
    ((role && !user?.roles?.includes('admin') && !user?.roles.includes(role)) ||
      (permissions && !isAllowed))
  ) {
    return (
      <AppWrapper
        innerProps={innerProps}
        breadcrumbs={breadcrumbs}
        loading={loading}
      >
        <Container size="1" align="center">
          <Heading as="h1" my="8" align="center">
            You do not have permission to view this page
          </Heading>
        </Container>
      </AppWrapper>
    );
  }

  return (
    <UserProvider value={user}>
      <AppWrapper
        breadcrumbs={breadcrumbs}
        loading={loading}
        innerProps={innerProps}
        actions={
          <>
            {!isSignedIn && (
              <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger>
                  <Link href="#">Sign In</Link>
                </Dialog.Trigger>
                <Dialog.Content>
                  <SignIn email={email} onComplete={onComplete} />
                </Dialog.Content>
              </Dialog.Root>
            )}
            {isSignedIn && <Menu />}
          </>
        }
      >
        {children}
      </AppWrapper>
    </UserProvider>
  );
};

const Wrapper = (props: SignInWrapperProps) => {
  return (
    <React.Suspense>
      <SignInWrapper {...props} />
    </React.Suspense>
  );
};
export default Wrapper;
