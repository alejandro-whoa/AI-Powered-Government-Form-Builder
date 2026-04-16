// Form Schema Types based on GDS standards and MVP requirements

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'date' 
  | 'number' 
  | 'radio' 
  | 'checkbox' 
  | 'select'
  | 'email'
  | 'tel'
  | 'postcode';

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'minLength' | 'maxLength' | 'dateRange';
  value?: string | number;
  message: string;
}

export interface ConditionalLogic {
  showWhen: {
    fieldId: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value: string | number | boolean;
  };
}

export interface FieldOption {
  label: string;
  value: string;
  hint?: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  hint?: string;
  options?: FieldOption[];
  validation?: ValidationRule[];
  conditional?: ConditionalLogic;
  sectionId: string;
  order: number;
  // AI extraction metadata
  extracted?: {
    confidence: number;
    boundingBox?: { x: number; y: number; width: number; height: number };
    suggestedType?: FieldType;
    needsReview: boolean;
  };
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  order: number;
}

export interface FormVersion {
  versionNumber: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  createdAt: string;
  createdBy: string;
  publishedAt?: string;
  publishedBy?: string;
  changes?: string;
}

export interface FormSchema {
  id: string;
  title: string;
  description: string;
  department: string;
  version: FormVersion;
  sections: FormSection[];
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
  // Source PDF metadata
  sourcePDF?: {
    filename: string;
    uploadedAt: string;
    uploadedBy: string;
    extractionConfidence: number;
  };
}

export interface AuditLogEntry {
  id: string;
  formId: string;
  version: string;
  action: 'created' | 'updated' | 'published' | 'archived' | 'rollback';
  user: string;
  timestamp: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

export interface FormSubmission {
  id: string;
  formId: string;
  formVersion: string;
  data: Record<string, any>;
  submittedAt: string;
  submittedBy?: string;
  status: 'submitted' | 'processing' | 'completed' | 'rejected';
}
