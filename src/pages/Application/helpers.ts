import { getIn, setIn } from 'formik';
import { isEmpty } from 'lodash';

import { ApplicationEnumType } from '../../components/ApplicationForm';
import { initialValues as about } from '../../components/ApplicationForm/About';
import { initialValues as atHt6 } from '../../components/ApplicationForm/AtHt6';
import { initialValues as experience } from '../../components/ApplicationForm/Experience';
import { NestedKey } from '../../types';

type ClientApplication = typeof about & typeof experience & typeof atHt6;

type ServerApplication = {
  // About
  emailConsent: boolean;
  phoneNumber: string;
  gender: string;
  pronouns: string;
  ethnicity: string;
  timezone: string;
  country: string;
  wantSwag: boolean;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
  shirtSize: string;

  // Experience
  school: string;
  program: string;
  yearsOfStudy: string;
  hackathonsAttended: string;
  resumeFileName: string;
  resumeSharePermission: boolean;
  githubLink: string;
  portfolioLink: string;
  linkedinLink: string;
  projectEssay: string;

  // At Ht6
  requestedWorkshops: string;
  whyHT6Essay: string;
  techInnovationEssay: string;
  mlhCOC: boolean;
  mlhEmail: boolean;
  mlhData: boolean;
};

function remap<A extends object, B extends object>(
  mappings: [NestedKey<A>, NestedKey<B>][],
  obj: A
): B {
  return mappings.reduce((acc, [field1, field2 = field1]) => {
    acc = setIn(acc, field2, getIn(obj, field1));
    return acc;
  }, {} as any);
}

export function serializeApplication(
  values: ClientApplication
): Partial<ServerApplication> {
  let serializedData = remap(
    [
      // About you
      ['phone', 'phoneNumber'],
      ['canEmail', 'emailConsent'],
      ['gender', 'gender'],
      ['pronouns', 'pronouns'],
      ['ethnicity', 'ethnicity'],
      ['timezone', 'timezone'],
      ['size', 'shirtSize'],
      ['shippingInfo.isCanadian', 'wantSwag'],
      ['shippingInfo.line1', 'addressLine1'],
      ['shippingInfo.line2', 'addressLine2'],
      ['shippingInfo.city', 'city'],
      ['shippingInfo.province', 'province'],
      ['shippingInfo.postalCode', 'postalCode'],
      ['shippingInfo.country', 'country'],

      // Experience
      ['school', 'school'],
      ['study', 'program'],
      ['year', 'yearsOfStudy'],
      ['hackathons', 'hackathonsAttended'],
      ['canDistribute', 'resumeSharePermission'],
      ['github', 'githubLink'],
      ['portfolio', 'portfolioLink'],
      ['linkedin', 'linkedinLink'],
      ['project', 'projectEssay'],

      // At Ht6
      ['interest', 'requestedWorkshops'],
      ['accompolish', 'whyHT6Essay'],
      ['explore', 'techInnovationEssay'],
      ['mlh', 'mlhCOC'],
      ['mlhEmail', 'mlhEmail'],
      ['mlhShare', 'mlhData'],
    ],
    values
  );

  // Apply some special rules
  const workshops = values.interest ?? [];
  if (values.otherInterest)
    workshops.push(values.otherInterest.replace(/ *, */g, ','));
  serializedData.requestedWorkshops = workshops.join(',');

  // ! Missing following fields for this year
  // phoneNumber, pronouns
  return {
    ...serializedData,
    phoneNumber: serializedData.phoneNumber,
  };
}

export function deserializeApplication(
  values: ServerApplication,
  enums: ApplicationEnumType
): ClientApplication {
  let deserializedData = {
    // Apply initialValues
    ...about,
    ...experience,
    ...atHt6,
    ...remap(
      [
        // About you
        ['phoneNumber', 'phone'],
        ['emailConsent', 'canEmail'],
        ['gender', 'gender'],
        ['pronouns', 'pronouns'],
        ['ethnicity', 'ethnicity'],
        ['timezone', 'timezone'],
        ['shirtSize', 'size'],
        ['wantSwag', 'shippingInfo.isCanadian'],
        ['addressLine1', 'shippingInfo.line1'],
        ['addressLine2', 'shippingInfo.line2'],
        ['city', 'shippingInfo.city'],
        ['province', 'shippingInfo.province'],
        ['postalCode', 'shippingInfo.postalCode'],
        ['country', 'shippingInfo.country'],

        // Experience
        ['school', 'school'],
        ['program', 'study'],
        ['yearsOfStudy', 'year'],
        ['hackathonsAttended', 'hackathons'],
        ['resumeSharePermission', 'canDistribute'],
        ['githubLink', 'github'],
        ['portfolioLink', 'portfolio'],
        ['linkedinLink', 'linkedin'],
        ['projectEssay', 'project'],

        // At Ht6
        ['whyHT6Essay', 'accompolish'],
        ['techInnovationEssay', 'explore'],
        ['mlhCOC', 'mlh'],
        ['mlhEmail', 'mlhEmail'],
        ['mlhData', 'mlhShare'],
      ],
      values
    ),
  };

  // Apply special rules
  const rawWorkshops = (values.requestedWorkshops ?? '')
    .split(',')
    .filter((v) => !isEmpty(v));
  if (rawWorkshops.length) {
    const [customWorkshops, workshops] = rawWorkshops.reduce<
      [string[], string[]]
    >(
      (acc, workshop) => {
        acc[enums.requestedWorkshops.includes(workshop) ? 1 : 0].push(workshop);
        return acc;
      },
      [[], []]
    );
    deserializedData.otherInterest = customWorkshops[0];
    deserializedData.interest = workshops;

    if (customWorkshops[0]) deserializedData.interest.push('other');
  }

  if (values.resumeFileName) {
    deserializedData.resume = values.resumeFileName as any;
  }

  return deserializedData;
}
