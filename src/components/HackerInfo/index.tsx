import { Button, Typography } from '@ht6/react-ui';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

import DevpostLogo from '../../assets/devpost.png';
import DiscordLogo from '../../assets/discord.png';
import HopinLogo from '../../assets/hopin.png';
import useAuth from '../../components/Authentication/context';
import { ServerResponse, useRequest } from '../../utils/useRequest';
import IconLink from '../IconLink';

import styles from './HackerInfo.module.scss';

function HackerInfo() {
  const [isRsvpEnabled, setIsRsvpEnabled] = useState(true);
  const { makeRequest } = useRequest<ServerResponse>('/api/action/rsvp');
  const authCtx = useAuth();

  if (!authCtx.isAuthenticated) {
    return null;
  }

  const email = authCtx.user.email;
  const userConfirmed = authCtx.user.status.confirmed;

  return (
    <div className={styles.container}>
      {!userConfirmed && <Navigate replace to='/invite' />}
      <div>
        <Typography textColor='primary-3' textType='heading3' as='h3'>
          APPLICATION STATUS
        </Typography>
        <Typography textColor='primary-3' textType='paragraph1' as='p'>
          Welcome to Hack the 6ix 2022! Thanks for confirming your attendance as
          a hacker!
        </Typography>
        <Typography textColor='primary-3' textType='paragraph1' as='p'>
          If you can no longer attend Hack the 6ix, please let us know so we can
          pass this opportunity to a waitlisted participant.
        </Typography>
        <Button
          buttonVariant='outline'
          disabled={!isRsvpEnabled}
          onClick={async () => {
            makeRequest({
              method: 'POST',
              body: JSON.stringify({
                attending: false,
              }),
            }).then((res) => {
              if (res?.status === 200) {
                // TODO: lock user out? redirect to somewhere?
                setIsRsvpEnabled(false);
                toast.success('Your attendance to HT6 has been cancelled.');
              } else {
                toast.error('An error occurred. Please try again later.');
              }
            });
          }}
        >
          I CAN NO LONGER ATTEND HT6
        </Button>
      </div>
      <div>
        <Typography textColor='primary-3' textType='heading3' as='h3'>
          JOIN OUR DISCORD
        </Typography>
        <Typography textColor='primary-3' textType='paragraph1' as='p'>
          Join our Discord server to get the latest updates and meet fellow
          hackers!
        </Typography>
        <Typography textColor='primary-3' textType='paragraph1' as='p'>
          Issue the following command in the <b>#verification</b> channel to
          gain access:
        </Typography>
        <div className={styles.command}>
          <Typography textColor='primary-3' textType='heading4' as='h4'>
            !verify {email}
          </Typography>
        </div>
      </div>
      <div>
        <Typography textColor='primary-3' textType='heading3' as='h3'>
          USEFUL LINKS
        </Typography>
        <div className={styles.links}>
          <IconLink
            logo={HopinLogo}
            title='Hopin'
            link='https://hopin.com/'
            description='All our live events and workshops are here!'
          />
          <IconLink
            logo={DiscordLogo}
            title='Discord'
            link='https://discord.com/'
            description='Connect with hackers, mentors and sponsors!'
          />
          <IconLink
            logo={DevpostLogo}
            title='Devpost'
            link='https://devpost.com/'
            description='Submit your projects here!'
          />
        </div>
      </div>
    </div>
  );
}

export default HackerInfo;
