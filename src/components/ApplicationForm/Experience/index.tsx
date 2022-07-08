import {
  Checkbox,
  Input,
  Textarea,
  FileUpload,
  Dropdown,
  SearchDropdown,
} from '@ht6/react-ui';
import stringSimilarity from 'string-similarity';
import * as yup from 'yup';
import cx from 'classnames';
import { omit } from 'lodash';
import { ApplicationFormSection } from '..';
import ApplicationFooter from '../../ApplicationFooter';
import { useForm, FormValuesType, useApplicationData } from '../context';
import { ApplicationFormSectionProps } from '../types';
import sharedStyles from '../ApplicationForm.module.scss';

function Experience({ onBack, onNext, ...props }: ApplicationFormSectionProps) {
  const { enums } = useApplicationData();
  const { defaultInputProps, setFieldValue, values } = useForm(
    'experience',
    props.disabled
  );

  const schoolSubset = stringSimilarity
    .findBestMatch(values.experience.school, enums.school)
    .ratings.sort((a, b) => b.rating - a.rating);

  return (
    <ApplicationFormSection {...props} name='Your Experience'>
      <SearchDropdown
        {...omit(defaultInputProps('school'), ['outlineColor'])}
        onChange={(e) => {
          setFieldValue('experience.school', e.currentTarget.value);
        }}
        label='Your School (Most Recently Attended)'
        placeholder='Select an option'
        options={schoolSubset.slice(0, 10).map((school) => ({
          value: school.target,
          label: school.target,
        }))}
        required
      />
      <Dropdown
        {...omit(defaultInputProps('study'), ['outlineColor'])}
        label='Your Program of Study'
        options={enums.programOfStudy.map((label) => ({
          value: label,
          label,
        }))}
        required
      />
      <Dropdown
        {...omit(defaultInputProps('year'), ['outlineColor'])}
        label='Year of Study'
        options={enums.yearsOfStudy.map((label) => ({
          value: label,
          label,
        }))}
        required
      />
      <Dropdown
        {...omit(defaultInputProps('hackathons'), ['outlineColor'])}
        label='Number of Hacakthons Attended'
        options={enums.hackathonsAttended.map((label) => ({
          value: label,
          label,
        }))}
        required
      />
      <FileUpload
        {...omit(defaultInputProps('resume'), ['outlineColor'])}
        onChange={(e) => {
          setFieldValue('experience.resume', e.currentTarget.files);
        }}
        label='Your Resume'
        required
      />
      <Checkbox
        {...omit(defaultInputProps('canDistribute'), ['outlineColor'])}
        label='I allow Hack the 6ix to distribute my resume to its event sponsors.'
        color='primary-3'
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles['field--break']
        )}
      />
      <Input
        {...defaultInputProps('github')}
        placeholder='Ex. https://github.com/fpunny'
        label='Github Link'
        type='url'
      />
      <Input
        {...defaultInputProps('portfolio')}
        className={sharedStyles['field--break']}
        placeholder='Ex. https://fpunny.xyz'
        label='Personal Website or Portfolio'
        type='url'
      />
      <Input
        {...defaultInputProps('linkedin')}
        className={sharedStyles['field--break']}
        placeholder='Ex. https://linkedin.com/fpunny'
        label='LinkedIn'
        type='url'
      />
      <Textarea
        {...omit(defaultInputProps('project'), ['outlineColor'])}
        label='Describe a project that you are proud of and explain the impact it had.'
        className={cx(
          sharedStyles['field--full-width'],
          sharedStyles['field--break']
        )}
        limit={200}
        required
        rows={5}
      />
      <ApplicationFooter
        className={sharedStyles.footer}
        leftAction={{
          children: 'Back',
          onClick: onBack,
        }}
        rightAction={{
          children: 'Save & Continue',
          onClick: onNext,
        }}
      />
    </ApplicationFormSection>
  );
}

Experience.validate = (values: FormValuesType) => {
  return {
    experience: yup.object().shape({
      school: yup.string().required("Your School can't be blank"),
      study: yup.string().required("Your Program of Study can't be blank"),
      year: yup.string().required("Year of Study can't be blank"),
      hackathons: yup
        .string()
        .required("Number of Hackathons Attended can't be blank"),
      resume: yup.mixed().required("Resume can't be blank"),
      project: yup.string().required("Project Description can't be blank"),
    }),
  };
};

export default Experience;
