import { Checkbox, Dropdown, Input, Typography } from '@ht6/react-ui';
import cx from 'classnames';
import * as yup from 'yup';
import { omit } from 'lodash';
import { ApplicationFormSection } from '..';
import ApplicationFooter from '../../ApplicationFooter';
import { useForm, FormValuesType, useApplicationData } from '../context';
import { ApplicationFormSectionProps } from '../types';
import sharedStyles from '../ApplicationForm.module.scss';

function About({ onNext, onBack, ...props }: ApplicationFormSectionProps) {
  const { enums } = useApplicationData();
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
      <Dropdown
        {...omit(aboutInputProps('gender'), ['outlineColor'])}
        label='Gender'
        options={enums.gender.map((label) => ({
          value: label,
          label,
        }))}
        required
      />
      <Dropdown
        {...omit(aboutInputProps('ethnicity'), ['outlineColor'])}
        className={sharedStyles['field--break']}
        label='Ethinicity'
        options={enums.ethnicity.map((label) => ({
          value: label,
          label,
        }))}
        required
      />
      <Dropdown
        {...omit(aboutInputProps('timezone'), ['outlineColor'])}
        label='Your Timezone'
        options={enums.timezone.map((label) => ({
          value: label,
          label,
        }))}
        required
      />
      <Dropdown
        {...omit(aboutInputProps('size'), ['outlineColor'])}
        label='Shirt Size'
        options={enums.shirt.map((label) => ({
          value: label,
          label,
        }))}
        required
      />
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
          <Dropdown
            {...omit(shippingInfoInputProps('province'), ['outlineColor'])}
            label='Province'
            options={enums.province.map((label) => ({
              value: label,
              label,
            }))}
            required
          />
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
      gender: yup.string().required("Gender can't be blank"),
      ethnicity: yup.string().required("Ethnicity can't be blank"),
      timezone: yup.string().required("Timezone can't be blank"),
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
