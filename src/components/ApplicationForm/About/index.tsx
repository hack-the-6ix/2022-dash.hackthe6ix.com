import { Checkbox, Dropdown, Input, Typography } from '@ht6/react-ui';
import { useEffect } from 'react';
import * as yup from 'yup';

import { useApplicationData } from '..';
import ApplicationFormSection from '../../ApplicationFormSection';
import { SectionProps, useFormikHelpers } from '../helpers';

import sharedStyles from '../ApplicationForm.module.scss';

export const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  canEmail: false,
  gender: '',
  pronouns: '',
  ethnicity: '',
  timezone: '',
  size: '',
  shippingInfo: {
    isCanadian: false,
    line1: '',
    line2: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',
  },
};

export const validate = yup.lazy((values) => {
  let schema = {
    firstName: yup.string().required("First Name can't be blank"),
    lastName: yup.string().required("Last Name can't be blank"),
    email: yup
      .string()
      .email('Please provide a valid email.')
      .required("Email can't be blank"),
    phone: yup.string().required("Phone Number can't be blank"),
    canEmail: yup.boolean(),
    gender: yup.string().required("Gender can't be blank"),
    ethnicity: yup.string().required("Ethnicity can't be blank"),
    timezone: yup.string().required("Timezone can't be blank"),
    shippingInfo: {
      country: yup.string().required("Country can't be blank"),
    },
  } as any;

  if (values.shippingInfo.country !== 'Canada') {
    schema.shippingInfo = {
      ...schema.shippingInfo,
      isCanadian: yup.bool().isFalse(),
    };
  }

  if (values.shippingInfo.isCanadian) {
    schema = {
      size: yup.string().required("Size can't be blank"),
      shippingInfo: {
        ...schema.shippingInfo,
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
      },
    };
  }

  return yup.object({
    ...schema,
    shippingInfo: yup.object(schema.shippingInfo),
  });
}) as any;

function About(props: SectionProps<typeof initialValues>) {
  const { applyFieldProps } = useFormikHelpers<typeof initialValues>(props);
  const { enums } = useApplicationData();
  const { isCanadian, country } = props.values.shippingInfo;
  const { setFieldValue } = props;

  useEffect(() => {
    if (!isCanadian) {
      setFieldValue('shippingInfo', {
        isCanadian,
        country,
      });
      setFieldValue('size', '');
    }
  }, [setFieldValue, isCanadian, country]);

  return (
    <ApplicationFormSection>
      <Input
        {...applyFieldProps({
          name: 'firstName',
          label: 'First Name',
          required: true,
        })}
        placeholder='Enter first name'
        disabled
      />
      <Input
        {...applyFieldProps({
          name: 'lastName',
          label: 'Last Name',
          required: true,
        })}
        placeholder='Enter last name'
        disabled
      />
      <Input
        {...applyFieldProps({
          name: 'email',
          label: 'Email',
          required: true,
        })}
        placeholder='name@gmail.com'
        type='email'
        disabled
      />
      <Input
        {...applyFieldProps({
          name: 'phone',
          label: 'Phone Number',
          required: true,
        })}
        placeholder='1234567890'
        type='phone'
      />
      <Checkbox
        {...applyFieldProps({
          name: 'canEmail',
          label:
            'I give permission to Hack the 6ix for sending me emails containing information from the event sponsors.',
          omitOutline: true,
          isFullWidth: true,
          isCheckbox: true,
        })}
        color='primary-3'
      />
      <Dropdown
        {...applyFieldProps({
          name: 'gender',
          label: 'Gender',
          omitOutline: true,
          required: true,
        })}
        options={enums.gender.map((label) => ({
          value: label,
          label,
        }))}
      />
      <Dropdown
        {...applyFieldProps({
          name: 'pronouns',
          label: 'Pronouns',
          omitOutline: true,
          required: true,
        })}
        options={enums.pronouns.map((label) => ({
          value: label,
          label,
        }))}
      />
      <Dropdown
        {...applyFieldProps({
          name: 'ethnicity',
          label: 'Ethnicity',
          omitOutline: true,
          required: true,
        })}
        options={enums.ethnicity.map((label) => ({
          value: label,
          label,
        }))}
      />
      <Dropdown
        {...applyFieldProps({
          name: 'timezone',
          label: 'Your Timezone',
          omitOutline: true,
          required: true,
        })}
        options={enums.timezone.map((label) => ({
          value: label,
          label,
        }))}
      />
      <Dropdown
        {...applyFieldProps({
          name: 'shippingInfo.country',
          label: 'Country',
          required: true,
          omitOutline: true,
        })}
        disabled={props.readonly || isCanadian}
        options={enums.countries.map((label) => ({
          value: label,
          label,
        }))}
      />
      <Checkbox
        {...applyFieldProps({
          label: (
            <span>
              I live in Canada <strong>and</strong> I want to receive Hack the
              6ix swag.
            </span>
          ),
          name: 'shippingInfo.isCanadian',
          omitOutline: true,
          isFullWidth: true,
          isCheckbox: true,
          isNextRow: true,
        })}
        disabled={props.readonly || country !== 'Canada'}
        color='primary-3'
      />
      {isCanadian && (
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
            {...applyFieldProps({
              name: 'shippingInfo.line1',
              label: 'Address Line 1',
              required: true,
            })}
            placeholder='Enter street number and street name'
          />
          <Input
            {...applyFieldProps({
              name: 'shippingInfo.line2',
              label: 'Address Line 2',
              required: true,
            })}
            placeholder='Apartment, suite number, etc.'
          />
          <Input
            {...applyFieldProps({
              name: 'shippingInfo.city',
              label: 'City',
              required: true,
            })}
            placeholder='Enter city name'
          />
          <Dropdown
            {...applyFieldProps({
              name: 'shippingInfo.province',
              label: 'Province',
              required: true,
              omitOutline: true,
            })}
            options={enums.province.map((label) => ({
              value: label,
              label,
            }))}
          />
          <Input
            {...applyFieldProps({
              name: 'shippingInfo.postalCode',
              label: 'Postal Code',
              required: true,
            })}
            placeholder='Ex. V4Q3H9'
          />
          <Dropdown
            {...applyFieldProps({
              name: 'size',
              label: 'Shirt Size',
              omitOutline: true,
              required: true,
            })}
            options={enums.shirt.map((label) => ({
              value: label,
              label,
            }))}
          />
        </>
      )}
    </ApplicationFormSection>
  );
}

export default About;
