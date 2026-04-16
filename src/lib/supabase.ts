import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types that match the Supabase database tables
export interface Submission {
  id: string;
  reference_number: string;
  form_id: string;
  form_title: string;
  department: string;
  form_data: Record<string, any>;
  status: 'received' | 'under_review' | 'decision_made' | 'complete';
  email: string | null;
  submitted_at: string;
  updated_at: string;
}

export interface SubmissionUpdate {
  id: string;
  submission_id: string;
  status: string;
  message: string;
  created_at: string;
}

export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `APP-${year}-${random}`;
}

export const STATUS_LABELS: Record<Submission['status'], string> = {
  received: 'Application received',
  under_review: 'Under review',
  decision_made: 'Decision made',
  complete: 'Complete',
};

export const STATUS_DESCRIPTIONS: Record<Submission['status'], string> = {
  received: 'We have received your application and it is in our queue.',
  under_review: 'A caseworker is reviewing your application.',
  decision_made: 'A decision has been made. We will contact you shortly.',
  complete: 'Your application has been fully processed.',
};

export const STATUS_ORDER: Submission['status'][] = [
  'received',
  'under_review',
  'decision_made',
  'complete',
];
