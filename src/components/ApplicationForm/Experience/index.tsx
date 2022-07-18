import {
  Checkbox,
  Input,
  Textarea,
  FileUpload,
  Dropdown,
  SearchDropdown,
} from '@ht6/react-ui';
import * as yup from 'yup';
import stringSimilarity from 'string-similarity';
import { SectionProps, useFormikHelpers } from '../helpers';
import { useApplicationData } from '..';
import ApplicationFormSection from '../../ApplicationFormSection';
import { useEffect } from 'react';
import { useRequest } from '../../../utils/useRequest';
import toast from 'react-hot-toast';

export const initialValues = {
  school: '',
  study: '',
  year: '',
  hackathons: '',
  resume: null,
  canDistribute: false,
  github: '',
  portfolio: '',
  linkedin: '',
  project: '',
};

export const validate = yup.object({
  school: yup.string().required("Your School can't be blank"),
  study: yup.string().required("Your Program of Study can't be blank"),
  year: yup.string().required("Year of Study can't be blank"),
  hackathons: yup
    .string()
    .required("Number of Hackathons Attended can't be blank"),
  resume: yup.mixed().required("Resume can't be blank"),
  project: yup
    .string()
    // @ts-ignore-next-line
    .count(200, 'Project Description must be within 200 words')
    .required("Project Description can't be blank"),
});

function Experience(props: SectionProps<typeof initialValues>) {
  const { applyFieldProps } = useFormikHelpers<typeof initialValues>(props);
  const { makeRequest } = useRequest('/api/action/updateResume');
  const { enums } = useApplicationData();

  useEffect(() => {
    const file = (props.values.resume as unknown as FileList)?.item?.(0);
    if (!file) return;
    toast.loading('Uploading resume...', { id: 'experience-resume' });
    const body = new FormData();
    body.append('resume', file);
    (async () => {
      await makeRequest({
        headers: {
          'content-type': undefined,
        } as any,
        method: 'PUT',
        body,
      });
      toast.success('Resume Uploaded', { id: 'experience-resume' });
    })();
  }, [makeRequest, props.values.resume]);

  const schoolSubset = stringSimilarity
    .findBestMatch(props.values.school, enums.school)
    .ratings.sort((a, b) => b.rating - a.rating);

  return (
    <ApplicationFormSection>
      <SearchDropdown
        {...applyFieldProps({
          name: 'school',
          label: 'Your School (Most Recently Attended)',
          omitOutline: true,
          required: true,
        })}
        placeholder='Select an option'
        options={schoolSubset.slice(0, 10).map((school) => ({
          value: school.target,
          label: school.target,
        }))}
        onChange={(e) => {
          props.setFieldValue('school', e.currentTarget.value);
        }}
      />
      <Dropdown
        {...applyFieldProps({
          name: 'study',
          label: 'Your Program of Study',
          omitOutline: true,
          required: true,
        })}
        options={enums.programOfStudy.map((label) => ({
          value: label,
          label,
        }))}
      />
      <Dropdown
        {...applyFieldProps({
          name: 'year',
          label: 'Year of Study',
          omitOutline: true,
          required: true,
        })}
        options={enums.yearsOfStudy.map((label) => ({
          value: label,
          label,
        }))}
      />
      <Dropdown
        {...applyFieldProps({
          name: 'hackathons',
          label: 'Number of Hacakthons Attended',
          omitOutline: true,
          required: true,
        })}
        options={enums.hackathonsAttended.map((label) => ({
          value: label,
          label,
        }))}
      />
      <FileUpload
        {...applyFieldProps({
          name: 'resume',
          label: 'Your Resume',
          omitOutline: true,
          required: true,
          isFullWidth: true,
        })}
        accept={['application/pdf']}
        value={props.values.resume}
        onChange={(e) => {
          props.setFieldValue('resume', e.currentTarget.files);
        }}
      />
      <Checkbox
        {...applyFieldProps({
          name: 'canDistribute',
          label:
            'I allow Hack the 6ix to distribute my resume to its event sponsors.',
          omitOutline: true,
          isFullWidth: true,
          isNextRow: true,
        })}
        color='primary-3'
      />
      <Input
        {...applyFieldProps({
          name: 'github',
          label: 'Github Link',
        })}
        placeholder='Ex. https://github.com/fpunny'
        type='url'
      />
      <Input
        {...applyFieldProps({
          name: 'portfolio',
          label: 'Personal Website or Portfolio',
          isNextRow: true,
        })}
        placeholder='Ex. https://fpunny.xyz'
        type='url'
      />
      <Input
        {...applyFieldProps({
          name: 'linkedin',
          label: 'LinkedIn',
          isNextRow: true,
        })}
        placeholder='Ex. https://linkedin.com/fpunny'
        type='url'
      />
      <Textarea
        {...applyFieldProps({
          name: 'project',
          label:
            'Describe a project that you are proud of and explain the impact it had.',
          omitOutline: true,
          isNextRow: true,
          isFullWidth: true,
          required: true,
        })}
        limit={200}
        rows={5}
      />
    </ApplicationFormSection>
  );
}

export default Experience;
