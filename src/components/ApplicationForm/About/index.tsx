import { Input, Typography } from "@ht6/react-ui";
import cx from 'classnames';
import { ApplicationFormSection, FormValuesType, useForm } from "..";
import ApplicationFooter from "../../ApplicationFooter";
import sharedStyles from '../ApplicationForm.module.scss';
import { ApplicationFormSectionProps } from "../types";

export function validate(values: FormValuesType) {

}

function About(props: ApplicationFormSectionProps) {
  const { defaultInputProps: shippingInfoInputProps } = useForm('shippingInfo');
  const { defaultInputProps: aboutInputProps, values } = useForm('about');
  return (
    <ApplicationFormSection
      name='About You'
    >
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
      <div
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles.placeholder,
        )}
      />
      <div
        className={cx(
          sharedStyles.placeholder,
        )}
      />
      <div
        className={cx(
          sharedStyles['field--break'],
          sharedStyles.placeholder,
        )}
      />
      <div
        className={cx(
          sharedStyles.placeholder,
        )}
      />
      <div
        className={cx(
          sharedStyles.placeholder,
        )}
      />
      <div
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles['field--break'],
          sharedStyles.placeholder,
        )}
      />
      {values.shippingInfo.isCanadian && (
        <>
          <div className={sharedStyles['field--full-width']}>
            <Typography
              textColor='primary-3'
              textType='heading3'
              as='h2'
            >
              Shipping Address
            </Typography>
            <Typography
              textColor='copy-dark'
              textType='paragraph1'
              as='p'
            >
              We will ship your Hack The 6ix swag to this address if you live in Canada and submit a project on Devpost at the event.
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
          <div
            className={cx(
              sharedStyles.placeholder,
            )}
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
          onClick: props.onNext,
          type: 'submit',
        }}
      />
    </ApplicationFormSection>
  );
}

export default About;
