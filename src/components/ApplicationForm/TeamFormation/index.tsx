import { Button, Input, Typography } from '@ht6/react-ui';
import { Dispatch, MouseEventHandler, SetStateAction, useState } from 'react';
import cx from 'classnames';
import { ApplicationFormSection, FormValuesType, useForm } from '..';
import { useConfig } from '../../Configuration/context';
import sharedStyles from '../ApplicationForm.module.scss';
import styles from './TeamFormation.module.scss';
import ApplicationFooter from '../../ApplicationFooter';
import { ApplicationFormSectionProps } from '../types';

function InitScreen({
  setShowJoin,
}: {
  setShowJoin: Dispatch<SetStateAction<boolean>>;
}) {
  const { teamFormationEndDate } = useConfig();
  const { values, setValues } = useForm('team');

  const formattedDate = new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(teamFormationEndDate);
  const formattedTime = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'est',
  }).format(teamFormationEndDate);

  return (
    <>
      <Typography textColor='primary-3' textType='heading2' as='h2'>
        You're currently not on a team.
      </Typography>
      <Typography textColor='copy-dark' textType='heading4' as='p'>
        Don't have a team? No worries! You can go solo or decide after
        submitting your application. Just remember to do so before{' '}
        {formattedDate} at {formattedTime} EST.
      </Typography>
      <div className={styles.buttons}>
        <Button
          onClick={() => {
            // TODO: Add actual request to make the team
            setValues({
              ...values,
              team: {
                ...values.team,
                code: 'xxxxxx',
                members: ['YOU'],
                owner: true,
              },
            });
          }}
          type='button'
        >
          Create Team
        </Button>
        <Button onClick={() => setShowJoin(true)} type='button'>
          Join Team
        </Button>
      </div>
    </>
  );
}

function TeamScreen({
  onNext,
}: {
  onNext: MouseEventHandler<HTMLButtonElement>;
}) {
  const { values, initialValues, setValues } = useForm('team');
  return (
    <>
      <Typography textColor='primary-3' textType='heading2' as='h2'>
        {values.team.owner
          ? 'Your team has been created!'
          : 'You have joined a team!'}
      </Typography>
      <Typography
        className={styles.title}
        textColor='primary-3'
        textType='heading3'
        as='h3'
      >
        Team Code
      </Typography>
      <Typography
        className={sharedStyles.items}
        textColor='copy-dark'
        textType='heading4'
        as='ul'
      >
        <li>{values.team.code}</li>
        <li>Teammates can join by entering the Team Code above.</li>
      </Typography>
      <Typography
        className={styles.title}
        textColor='primary-3'
        textType='heading3'
        as='h3'
      >
        Members
      </Typography>
      <Typography
        className={sharedStyles.items}
        textColor='copy-dark'
        textType='heading4'
        as='ul'
      >
        {values.team.members.map((member, key) => (
          <li key={key}>{member}</li>
        ))}
      </Typography>
      <ApplicationFooter
        className={styles.footer}
        leftAction={{
          children: 'Leave Team',
          onClick: () => {
            // TODO: Add team leaving logic
            console.log('REEEE');
            setValues({
              ...values,
              team: {
                ...initialValues.team,
              },
            });
          },
        }}
        rightAction={{
          children: 'Save & Continue',
          onClick: onNext,
        }}
      />
    </>
  );
}

function JoinScreen({
  setShowJoin,
}: {
  setShowJoin: Dispatch<SetStateAction<boolean>>;
}) {
  const [code, setCode] = useState('');
  const { setFieldValue, defaultInputProps } = useForm('team');
  return (
    <>
      <Typography textColor='primary-3' textType='heading2' as='h2'>
        Join Team
      </Typography>
      <Typography textColor='copy-dark' textType='heading4' as='p'>
        Already have a code? Enter it below to join!
      </Typography>
      <div className={styles.join}>
        <Input
          // Just to get the styling related stuff
          {...defaultInputProps('code')}
          onChange={(e) => setCode(e.currentTarget.value)}
          placeholder='Enter team code'
          label='Team Code'
          value={code}
        />
        <Button
          onClick={() => {
            setFieldValue('team.code', code);
            setShowJoin(false);
          }}
          className={styles.joinBtn}
          type='button'
        >
          Join Team
        </Button>
      </div>
      <ApplicationFooter
        className={styles.footer}
        leftAction={{
          children: 'Back',
          onClick: () => setShowJoin(false),
        }}
      />
    </>
  );
}

function TeamFormation({
  onNext,
  onBack,
  ...props
}: ApplicationFormSectionProps) {
  const [showJoin, setShowJoin] = useState(false);
  const { values } = useForm('team');

  return (
    <ApplicationFormSection {...props} name='Join Team'>
      <div
        className={cx(
          sharedStyles['field--full-width'],
          showJoin && styles['root--left'],
          styles.root
        )}
      >
        {values.team.code ? (
          <TeamScreen onNext={onNext} />
        ) : showJoin ? (
          <JoinScreen setShowJoin={setShowJoin} />
        ) : (
          <InitScreen setShowJoin={setShowJoin} />
        )}
      </div>
    </ApplicationFormSection>
  );
}

TeamFormation.validate = (values: FormValuesType) => {
  return {};
};

export default TeamFormation;
