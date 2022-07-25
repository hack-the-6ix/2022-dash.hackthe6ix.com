import { Button, Typography } from '@ht6/react-ui';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';

import Protected from '../../components/Authentication/Protected';
import useAuth from '../../components/Authentication/context';
import Card from '../../components/Card';
import HeadingSection from '../../components/HeadingSection';
import Section from '../../components/Section';
import { ServerResponse, useRequest } from '../../utils/useRequest';

import styles from './Invitation.module.scss';

function InvitationContent() {
  const navigate = useNavigate();
  const authCtx = useAuth();
  const { makeRequest } = useRequest<ServerResponse>('/api/action/rsvp');

  if (!authCtx.isAuthenticated) {
    return null;
  }

  const firstName = authCtx.user.firstName;
  const userConfirmed = authCtx.user.status.confirmed;

  return (
    <main className={styles.root}>
      {userConfirmed && <Navigate replace to='/home' />}
      <HeadingSection
        title={`Welcome back, ${firstName}!`}
        action={{
          onClick: async () => {
            await authCtx.revokeAuth();
            navigate('/');
          },
          children: 'Sign Out',
        }}
        textType='heading2'
        as='h2'
      />
      <Section type='form' as='div'>
        <Card className={styles.content}>
          <Typography textColor='grey' textType='heading4' as='h4'>
            Hack the 6ix Application
          </Typography>
          <Typography textColor='primary-3' textType='heading2' as='h2'>
            Hacker Invitation
          </Typography>
          <Typography textColor='copy-dark' textType='paragraph1' as='p'>
            Congratulations and welcome to Hack the 6ix 2022! We are excited to
            offer you the opportunity to hack with us! To confirm your
            attendance, please RSVP below.
          </Typography>
          <div className={styles.row}>
            <Button
              onClick={async () => {
                makeRequest({
                  method: 'POST',
                  body: JSON.stringify({
                    attending: true,
                  }),
                }).then((res) => {
                  if (res?.status === 200) {
                    navigate('/home');
                  } else {
                    toast.error('An error occurred. Please try again later.');
                  }
                });
              }}
              buttonVariant='solid'
            >
              ACCEPT INVITATION
            </Button>
            <Button
              onClick={async () => {
                makeRequest({
                  method: 'POST',
                  body: JSON.stringify({
                    attending: false,
                  }),
                }).then((res) => {
                  if (res?.status === 200) {
                    // TODO: lock user out? redirect to somewhere?
                  } else {
                    toast.error('An error occurred. Please try again later.');
                  }
                });
              }}
              buttonVariant='outline'
            >
              DECLINE
            </Button>
          </div>
        </Card>
      </Section>
    </main>
  );
}

function Invitation() {
  return (
    <Protected>
      <InvitationContent />
    </Protected>
  );
}

export default Invitation;
