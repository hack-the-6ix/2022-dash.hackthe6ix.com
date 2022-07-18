import { Checkbox, Dropdown, Input, Typography } from '@ht6/react-ui';
import * as yup from 'yup';
import ApplicationFormSection from '../../ApplicationFormSection';
import { SectionProps, useFormikHelpers } from '../helpers';
import { useApplicationData } from '..';
import sharedStyles from '../ApplicationForm.module.scss';

export const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  canEmail: false,
  gender: '',
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
    country: 'Canada',
  },
};

export const validate = yup.object({
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
  shippingInfo: yup.lazy((value: typeof initialValues.shippingInfo) =>
    yup.object(
      value.isCanadian
        ? {
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
          }
        : undefined
    )
  ),
});

function About(props: SectionProps<typeof initialValues>) {
  const { applyFieldProps } = useFormikHelpers<typeof initialValues>(props);
  const { enums } = useApplicationData();

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
          name: 'ethnicity',
          label: 'Ethnicity',
          omitOutline: true,
          required: true,
          isNextRow: true,
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
        color='primary-3'
      />
      {props.values.shippingInfo.isCanadian && (
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
              isNextRow: true,
              required: true,
            })}
            placeholder='Apartment, suite number, etc.'
          />
          <Input
            {...applyFieldProps({
              name: 'shippingInfo.city',
              label: 'City',
              isNextRow: true,
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
              name: 'shippingInfo.country',
              label: 'Country',
              required: true,
              omitOutline: true,
            })}
            options={enums.countries.map((label) => ({
              value: label,
              label,
            }))}
            disabled
          />
        </>
      )}
    </ApplicationFormSection>
  );
}

export default About;
