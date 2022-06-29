import { Checkbox, Input, Typography } from '@ht6/react-ui';
import cx from 'classnames';
import * as yup from 'yup';
import { omit } from 'lodash';
import { ApplicationFormSection, FormValuesType, useForm } from '..';
import ApplicationFooter from '../../ApplicationFooter';
import sharedStyles from '../ApplicationForm.module.scss';
import { ApplicationFormSectionProps } from '../types';

function About({ onNext, onBack, ...props }: ApplicationFormSectionProps) {
  const { defaultInputProps: shippingInfoInputProps } = useForm('shippingInfo');
  const { defaultInputProps: aboutInputProps, values } = useForm(
    'about',
    props.disabled
  );
  return (
    <ApplicationFormSection {...props} name='About You'>
      <Input
        {...aboutInputProps('firstName')}
        placeholder='Enter first name'
        label='First Name'
        required
      />
      <Input
        {...aboutInputProps('lastName')}
        placeholder='Enter last name'
        label='Last Name'
        required
      />
      <Input
        {...aboutInputProps('email')}
        placeholder='name@gmail.com'
        label='Email'
        type='email'
        required
      />
      <Checkbox
        {...omit(aboutInputProps('canEmail'), ['outlineColor'])}
        label='I give permission to Hack the 6ix for sending me emails containing information from the event sponsors.'
        color='primary-3'
        className={cx(sharedStyles['field--full-width'])}
      />
      <div className={cx(sharedStyles.placeholder)} />
      <div
        className={cx(sharedStyles['field--break'], sharedStyles.placeholder)}
      />
      <div className={cx(sharedStyles.placeholder)} />
      <div className={cx(sharedStyles.placeholder)} />
      <Checkbox
        {...omit(shippingInfoInputProps('isCanadian'), ['outlineColor'])}
        label={
          <span>
            I live in Canada <strong>and</strong> I want to receive Hack the 6ix
            swag.
          </span>
        }
        color='primary-3'
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles['field--break']
        )}
      />
      {values.shippingInfo.isCanadian && (
        <>
          <div className={sharedStyles['field--full-width']}>
            <Typography textColor='primary-3' textType='heading3' as='h2'>
              Shipping Address
            </Typography>
            <Typography textColor='copy-dark' textType='paragraph1' as='p'>
              We will ship your Hack The 6ix swag to this address if you live in
              Canada and submit a project on Devpost at the event.
            </Typography>
          </div>
          <Input
            {...shippingInfoInputProps('line1')}
            placeholder='Enter street number and street name'
            label='Address Line 1'
            required
          />
          <Input
            {...shippingInfoInputProps('line2')}
            className={sharedStyles['field--break']}
            placeholder='Apartment, suite number, etc.'
            label='Address Line 2'
            required
          />
          <Input
            {...shippingInfoInputProps('city')}
            className={sharedStyles['field--break']}
            placeholder='Enter city name'
            label='City'
            required
          />
          <div className={cx(sharedStyles.placeholder)} />
          <Input
            {...shippingInfoInputProps('postalCode')}
            placeholder='Ex. V4Q3H9'
            label='Postal Code'
            required
          />
        </>
      )}
      <ApplicationFooter
        className={sharedStyles.footer}
        rightAction={{
          children: 'Save & Continue',
          onClick: onNext,
          type: 'submit',
        }}
      />
    </ApplicationFormSection>
  );
}

About.validate = (values: FormValuesType) => {
  const validationSchema: {
    about: yup.AnySchema;
    shippingInfo?: yup.AnySchema;
  } = {
    about: yup.object().shape({
      firstName: yup.string().required("First Name can't be blank"),
      lastName: yup.string().required("Last Name can't be blank"),
      email: yup
        .string()
        .email('Please provide a valid email.')
        .required("Email can't be blank"),
      canEmail: yup.boolean(),
      gender: yup
        .string()
        .oneOf(['Male', 'Female', 'Other', 'Prefer not to respond'])
        .required("Gender can't be blank"),
      ethnicity: yup
        .string()
        .oneOf([
          'American Indian or Alaska Native',
          'Asian',
          'Black or African American',
          'Hispanic or Latino',
          'White',
          'Prefer not to respond',
        ])
        .required("Ethnicity can't be blank"),
      timezone: yup
        .string()
        .oneOf([
          '(GMT -12:00) Eniwetok, Kwajalein',
          '(GMT -11:00) Midway Island, Samoa',
          '(GMT -10:00) Hawaii',
          '(GMT -9:30) Taiohae',
          '(GMT -9:00) Alaska',
          '(GMT -8:00) Pacific Time (US &amp; Canada)',
          '(GMT -7:00) Mountain Time (US &amp; Canada)',
          '(GMT -6:00) Central Time (US &amp; Canada), Mexico City',
          '(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima',
          '(GMT -4:30) Caracas',
          '(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz',
          '(GMT -3:30) Newfoundland',
          '(GMT -3:00) Brazil, Buenos Aires, Georgetown',
          '(GMT -2:00) Mid-Atlantic',
          '(GMT -1:00) Azores, Cape Verde Islands',
          '(GMT) Western Europe Time, London, Lisbon, Casablanca',
          '(GMT +1:00) Brussels, Copenhagen, Madrid, Paris',
          '(GMT +2:00) Kaliningrad, South Africa',
          '(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg',
          '(GMT +3:30) Tehran',
          '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi',
          '(GMT +4:30) Kabul',
          '(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent',
          '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi',
          '(GMT +5:45) Kathmandu, Pokhara',
          '(GMT +6:00) Almaty, Dhaka, Colombo',
          '(GMT +6:30) Yangon, Mandalay',
          '(GMT +7:00) Bangkok, Hanoi, Jakarta',
          '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong',
          '(GMT +8:45) Eucla',
          '(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk',
          '(GMT +9:30) Adelaide, Darwin',
          '(GMT +10:00) Eastern Australia, Guam, Vladivostok',
          '(GMT +10:30) Lord Howe Island',
          '(GMT +11:00) Magadan, Solomon Islands, New Caledonia',
          '(GMT +11:30) Norfolk Island',
          '(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka',
          '(GMT +12:45) Chatham Islands',
          '(GMT +13:00) Apia, Nukualofa',
          '(GMT +14:00) Line Islands, Tokelau',
        ])
        .required("Timezone can't be blank"),
      size: yup
        .string()
        .oneOf(['XS', 'S', 'M', 'L', 'XL'])
        .required("Size can't be blank"),
    }),
  };

  if (values.shippingInfo.isCanadian) {
    validationSchema.shippingInfo = yup.object().shape({
      line1: yup.string().required("Address Line 1 can't be blank"),
      line2: yup.string().required("Address Line 2 can't be blank"),
      city: yup.string().required("City can't be blank"),
      province: yup.string().required("Province can't be blank"),
      postalCode: yup
        .string()
        .matches(
          /^[A-Z]\d[A-Z]\d[A-Z]\d$/,
          'Please provide a valid Postal Code (All caps)'
        )
        .required("Postal Code can't be blank"),
    });
  }

  return validationSchema;
};

export default About;
