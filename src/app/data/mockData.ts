import { FormSchema, AuditLogEntry } from '../types/schema';

// Mock Blue Badge Application Form - realistic government form
export const mockExtractedForm: FormSchema = {
  id: 'blue-badge-001',
  title: 'Blue Badge Application',
  description: 'Apply for a Blue Badge to help you park closer to your destination if you have a disability or health condition that affects your mobility.',
  department: 'Department for Transport',
  version: {
    versionNumber: '1.0.0-draft',
    status: 'draft',
    createdAt: '2026-04-15T10:30:00Z',
    createdBy: 'sarah.johnson@transport.gov.uk',
  },
  sections: [
    {
      id: 'personal-details',
      title: 'Personal details',
      description: 'We need to know who the Blue Badge is for.',
      order: 1,
    },
    {
      id: 'address',
      title: 'Address',
      description: 'Where does the applicant live?',
      order: 2,
    },
    {
      id: 'eligibility',
      title: 'Eligibility',
      description: 'Tell us about the disability or health condition.',
      order: 3,
    },
    {
      id: 'mobility',
      title: 'Mobility and walking',
      description: 'Tell us about how the condition affects walking.',
      order: 4,
    },
    {
      id: 'supporting-info',
      title: 'Supporting information',
      description: 'Additional details to support your application.',
      order: 5,
    },
    {
      id: 'declaration',
      title: 'Declaration',
      description: 'Confirm the information is correct.',
      order: 6,
    },
  ],
  fields: [
    // Personal Details Section
    {
      id: 'full-name',
      type: 'text',
      label: 'Full name',
      hint: 'Enter the applicant\'s full name as it appears on official documents',
      sectionId: 'personal-details',
      order: 1,
      validation: [
        { type: 'required', message: 'Enter the applicant\'s full name' },
        { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
      ],
      extracted: {
        confidence: 0.95,
        boundingBox: { x: 50, y: 120, width: 300, height: 30 },
        suggestedType: 'text',
        needsReview: false,
      },
    },
    {
      id: 'date-of-birth',
      type: 'date',
      label: 'Date of birth',
      hint: 'For example, 27 3 1990',
      sectionId: 'personal-details',
      order: 2,
      validation: [
        { type: 'required', message: 'Enter the applicant\'s date of birth' },
      ],
      extracted: {
        confidence: 0.88,
        boundingBox: { x: 50, y: 160, width: 200, height: 30 },
        suggestedType: 'date',
        needsReview: false,
      },
    },
    {
      id: 'ni-number',
      type: 'text',
      label: 'National Insurance number',
      hint: 'It\'s on your National Insurance card, benefit letter, payslip or P60. For example, \'QQ 12 34 56 C\'.',
      sectionId: 'personal-details',
      order: 3,
      validation: [
        { type: 'pattern', value: '^[A-Z]{2}[0-9]{6}[A-Z]$', message: 'Enter a National Insurance number in the correct format' },
      ],
      extracted: {
        confidence: 0.72,
        boundingBox: { x: 50, y: 200, width: 250, height: 30 },
        suggestedType: 'text',
        needsReview: true,
      },
    },
    {
      id: 'contact-number',
      type: 'tel',
      label: 'Contact telephone number',
      hint: 'We may need to contact you about this application',
      sectionId: 'personal-details',
      order: 4,
      validation: [
        { type: 'required', message: 'Enter a contact telephone number' },
      ],
      extracted: {
        confidence: 0.91,
        boundingBox: { x: 50, y: 240, width: 250, height: 30 },
        suggestedType: 'tel',
        needsReview: false,
      },
    },
    // Address Section
    {
      id: 'address-line-1',
      type: 'text',
      label: 'Building and street',
      sectionId: 'address',
      order: 1,
      validation: [
        { type: 'required', message: 'Enter building and street' },
      ],
      extracted: {
        confidence: 0.85,
        boundingBox: { x: 50, y: 300, width: 350, height: 30 },
        suggestedType: 'text',
        needsReview: false,
      },
    },
    {
      id: 'town-city',
      type: 'text',
      label: 'Town or city',
      sectionId: 'address',
      order: 2,
      validation: [
        { type: 'required', message: 'Enter town or city' },
      ],
      extracted: {
        confidence: 0.89,
        boundingBox: { x: 50, y: 340, width: 300, height: 30 },
        suggestedType: 'text',
        needsReview: false,
      },
    },
    {
      id: 'postcode',
      type: 'postcode',
      label: 'Postcode',
      sectionId: 'address',
      order: 3,
      validation: [
        { type: 'required', message: 'Enter postcode' },
        { type: 'pattern', value: '^[A-Z]{1,2}[0-9]{1,2}[A-Z]? ?[0-9][A-Z]{2}$', message: 'Enter a real postcode' },
      ],
      extracted: {
        confidence: 0.93,
        boundingBox: { x: 50, y: 380, width: 150, height: 30 },
        suggestedType: 'postcode',
        needsReview: false,
      },
    },
    // Eligibility Section
    {
      id: 'eligibility-type',
      type: 'radio',
      label: 'Which of these describes the applicant?',
      hint: 'Select the option that best describes their situation',
      sectionId: 'eligibility',
      order: 1,
      options: [
        { 
          label: 'Receives higher rate mobility component of Disability Living Allowance (DLA)',
          value: 'dla-higher',
        },
        { 
          label: 'Receives enhanced rate mobility component of Personal Independence Payment (PIP)',
          value: 'pip-enhanced',
        },
        { 
          label: 'Receives War Pensioners\' Mobility Supplement',
          value: 'wpms',
        },
        { 
          label: 'Has received a lump sum benefit payment within tariff levels 1-8 of the Armed Forces Compensation Scheme',
          value: 'afcs',
        },
        { 
          label: 'Cannot walk or has considerable difficulty walking',
          value: 'walking-difficulty',
          hint: 'This includes people who can walk but need considerable effort',
        },
        { 
          label: 'Drives regularly, has a severe disability in both arms and cannot operate pay-and-display parking machines',
          value: 'upper-limb',
        },
      ],
      validation: [
        { type: 'required', message: 'Select which option describes the applicant' },
      ],
      extracted: {
        confidence: 0.78,
        boundingBox: { x: 50, y: 450, width: 400, height: 180 },
        suggestedType: 'radio',
        needsReview: true,
      },
    },
    // Mobility Section - Conditional fields
    {
      id: 'walking-distance',
      type: 'select',
      label: 'What is the maximum distance the applicant can walk without severe discomfort?',
      hint: 'Severe discomfort means breathlessness or significant pain',
      sectionId: 'mobility',
      order: 1,
      options: [
        { label: 'Less than 20 metres', value: 'under-20' },
        { label: 'Between 20 and 50 metres', value: '20-50' },
        { label: 'Between 50 and 100 metres', value: '50-100' },
        { label: 'More than 100 metres', value: 'over-100' },
      ],
      conditional: {
        showWhen: {
          fieldId: 'eligibility-type',
          operator: 'equals',
          value: 'walking-difficulty',
        },
      },
      validation: [
        { type: 'required', message: 'Select the maximum walking distance' },
      ],
      extracted: {
        confidence: 0.65,
        boundingBox: { x: 50, y: 650, width: 400, height: 120 },
        suggestedType: 'select',
        needsReview: true,
      },
    },
    {
      id: 'walking-time',
      type: 'select',
      label: 'How long does it take the applicant to walk 20 metres?',
      sectionId: 'mobility',
      order: 2,
      options: [
        { label: 'Cannot walk 20 metres', value: 'cannot' },
        { label: 'More than 5 minutes', value: 'over-5min' },
        { label: 'Between 2 and 5 minutes', value: '2-5min' },
        { label: 'Less than 2 minutes', value: 'under-2min' },
      ],
      conditional: {
        showWhen: {
          fieldId: 'eligibility-type',
          operator: 'equals',
          value: 'walking-difficulty',
        },
      },
      validation: [
        { type: 'required', message: 'Select how long it takes to walk 20 metres' },
      ],
      extracted: {
        confidence: 0.68,
        boundingBox: { x: 50, y: 790, width: 400, height: 120 },
        suggestedType: 'select',
        needsReview: true,
      },
    },
    // Supporting Information
    {
      id: 'medical-condition',
      type: 'textarea',
      label: 'Describe the medical condition or disability',
      hint: 'Include details about how it affects mobility. You have up to 500 characters.',
      sectionId: 'supporting-info',
      order: 1,
      validation: [
        { type: 'required', message: 'Enter details about the medical condition' },
        { type: 'maxLength', value: 500, message: 'Description must be 500 characters or less' },
      ],
      extracted: {
        confidence: 0.71,
        boundingBox: { x: 50, y: 930, width: 450, height: 100 },
        suggestedType: 'textarea',
        needsReview: true,
      },
    },
    {
      id: 'healthcare-professional',
      type: 'text',
      label: 'Name of GP or healthcare professional',
      hint: 'We may contact them to verify information in this application',
      sectionId: 'supporting-info',
      order: 2,
      validation: [
        { type: 'required', message: 'Enter the name of a GP or healthcare professional' },
      ],
      extracted: {
        confidence: 0.82,
        boundingBox: { x: 50, y: 1050, width: 350, height: 30 },
        suggestedType: 'text',
        needsReview: false,
      },
    },
    // Declaration
    {
      id: 'declaration-confirm',
      type: 'checkbox',
      label: 'Declaration',
      sectionId: 'declaration',
      order: 1,
      options: [
        {
          label: 'I confirm that the information I have provided is correct and complete to the best of my knowledge',
          value: 'confirmed',
        },
      ],
      validation: [
        { type: 'required', message: 'You must confirm the declaration to continue' },
      ],
      extracted: {
        confidence: 0.90,
        boundingBox: { x: 50, y: 1150, width: 450, height: 40 },
        suggestedType: 'checkbox',
        needsReview: false,
      },
    },
    {
      id: 'false-info-warning',
      type: 'checkbox',
      label: 'I understand that providing false information is an offence',
      sectionId: 'declaration',
      order: 2,
      options: [
        {
          label: 'I understand that providing false or misleading information may result in prosecution',
          value: 'understood',
        },
      ],
      validation: [
        { type: 'required', message: 'You must confirm you understand this warning' },
      ],
      extracted: {
        confidence: 0.87,
        boundingBox: { x: 50, y: 1200, width: 450, height: 40 },
        suggestedType: 'checkbox',
        needsReview: false,
      },
    },
  ],
  createdAt: '2026-04-15T10:30:00Z',
  updatedAt: '2026-04-15T10:30:00Z',
  sourcePDF: {
    filename: 'blue-badge-application-form.pdf',
    uploadedAt: '2026-04-15T10:28:00Z',
    uploadedBy: 'sarah.johnson@transport.gov.uk',
    extractionConfidence: 0.84,
  },
};

// Published version of the form
export const mockPublishedForm: FormSchema = {
  ...mockExtractedForm,
  id: 'blue-badge-001',
  version: {
    versionNumber: '1.0.0',
    status: 'published',
    createdAt: '2026-04-15T10:30:00Z',
    createdBy: 'sarah.johnson@transport.gov.uk',
    publishedAt: '2026-04-16T09:00:00Z',
    publishedBy: 'mark.davies@transport.gov.uk',
    changes: 'Initial published version',
  },
  fields: mockExtractedForm.fields.map(field => ({
    ...field,
    extracted: undefined, // Remove extraction metadata from published version
  })),
};

// Mock audit trail
export const mockAuditLog: AuditLogEntry[] = [
  {
    id: 'audit-001',
    formId: 'blue-badge-001',
    version: '1.0.0-draft',
    action: 'created',
    user: 'sarah.johnson@transport.gov.uk',
    timestamp: '2026-04-15T10:30:00Z',
  },
  {
    id: 'audit-002',
    formId: 'blue-badge-001',
    version: '1.0.0-draft',
    action: 'updated',
    user: 'sarah.johnson@transport.gov.uk',
    timestamp: '2026-04-15T14:22:00Z',
    changes: [
      {
        field: 'ni-number',
        oldValue: { type: 'text', validation: [] },
        newValue: { type: 'text', validation: [{ type: 'pattern', value: '^[A-Z]{2}[0-9]{6}[A-Z]$' }] },
      },
      {
        field: 'eligibility-type',
        oldValue: { options: 4 },
        newValue: { options: 6 },
      },
    ],
  },
  {
    id: 'audit-003',
    formId: 'blue-badge-001',
    version: '1.0.0',
    action: 'published',
    user: 'mark.davies@transport.gov.uk',
    timestamp: '2026-04-16T09:00:00Z',
  },
];

// Mock form list for homepage
export const mockFormsList = [
  {
    id: 'blue-badge-001',
    title: 'Blue Badge Application',
    department: 'Department for Transport',
    version: '1.0.0',
    status: 'published' as const,
    lastUpdated: '2026-04-16T09:00:00Z',
  },
  {
    id: 'passport-001',
    title: 'Passport Renewal Application',
    department: 'Home Office',
    version: '2.1.0-draft',
    status: 'draft' as const,
    lastUpdated: '2026-04-14T16:45:00Z',
  },
  {
    id: 'dla-001',
    title: 'Disability Living Allowance Claim',
    department: 'Department for Work and Pensions',
    version: '3.0.0-review',
    status: 'review' as const,
    lastUpdated: '2026-04-12T11:20:00Z',
  },
];
