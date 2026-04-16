import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import { Button } from './gds/Button';
import { Input } from './gds/Input';
import { supabase, STATUS_LABELS, STATUS_DESCRIPTIONS, STATUS_ORDER } from '../../lib/supabase';
import type { Submission } from '../../lib/supabase';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export function SubmissionTracking() {
  const [searchParams] = useSearchParams();
  const [referenceInput, setReferenceInput] = useState(searchParams.get('ref') ?? '');
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Auto-search if reference number came from the URL (e.g. from confirmation page)
  useEffect(() => {
    const refFromUrl = searchParams.get('ref');
    if (refFromUrl) {
      lookupSubmission(refFromUrl);
    }
  }, []);

  const lookupSubmission = async (ref: string) => {
    const cleaned = ref.trim().toUpperCase();
    if (!cleaned) {
      setError('Enter your reference number');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    const { data, error: dbError } = await supabase
      .from('submissions')
      .select('*')
      .eq('reference_number', cleaned)
      .single();

    setLoading(false);

    if (dbError || !data) {
      setSubmission(null);
      setError(`We could not find an application with reference number ${cleaned}. Check the number and try again.`);
      return;
    }

    setSubmission(data as Submission);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    lookupSubmission(referenceInput);
  };

  const currentStatusIndex = submission
    ? STATUS_ORDER.indexOf(submission.status)
    : -1;

  return (
    <div className="govuk-width-container govuk-main-wrapper">
      <div className="govuk-grid-row govuk-clearfix">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">Track your application</h1>

          <p className="govuk-body mb-6">
            Enter the reference number from your confirmation page to see the current status of your application.
          </p>

          <form onSubmit={handleSearch} className="mb-8">
            <Input
              id="reference"
              label="Reference number"
              hint="For example, APP-2026-847523"
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value)}
              error={searched && error && !submission ? error : undefined}
              width="20"
            />
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Find application'}
            </Button>
          </form>

          {submission && (
            <div>
              <div className="border-4 border-[#1d70b8] p-6 mb-8 bg-white">
                <p className="text-sm text-[#505a5f] mb-1">Reference number</p>
                <p className="govuk-heading-m mb-4">{submission.reference_number}</p>
                <p className="text-sm text-[#505a5f] mb-1">Form</p>
                <p className="govuk-body font-bold mb-4">{submission.form_title}</p>
                <p className="text-sm text-[#505a5f] mb-1">Submitted</p>
                <p className="govuk-body">
                  {new Date(submission.submitted_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <h2 className="govuk-heading-l mb-6">Application status</h2>

              <ol className="list-none space-y-0 mb-8">
                {STATUS_ORDER.map((status, index) => {
                  const isDone = index < currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const isPending = index > currentStatusIndex;

                  return (
                    <li key={status} className="flex gap-4">
                      {/* Timeline line + icon */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`
                            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                            ${isDone ? 'bg-[#00703c]' : isCurrent ? 'bg-[#1d70b8]' : 'bg-[#f3f2f1] border-2 border-[#b1b4b6]'}
                          `}
                        >
                          {isDone && <CheckCircle2 className="w-5 h-5 text-white" />}
                          {isCurrent && <Clock className="w-5 h-5 text-white" />}
                          {isPending && <Circle className="w-5 h-5 text-[#b1b4b6]" />}
                        </div>
                        {index < STATUS_ORDER.length - 1 && (
                          <div
                            className={`w-0.5 flex-1 min-h-[2.5rem] ${
                              isDone ? 'bg-[#00703c]' : 'bg-[#b1b4b6]'
                            }`}
                          />
                        )}
                      </div>

                      {/* Text content */}
                      <div className="pb-8">
                        <p
                          className={`font-bold mb-1 ${
                            isCurrent ? 'text-[#1d70b8]' : isPending ? 'text-[#505a5f]' : ''
                          }`}
                        >
                          {STATUS_LABELS[status]}
                          {isCurrent && (
                            <span className="ml-2 inline-block px-2 py-0.5 bg-[#1d70b8] text-white text-xs rounded">
                              Current
                            </span>
                          )}
                        </p>
                        <p
                          className={`text-sm ${
                            isPending ? 'text-[#b1b4b6]' : 'text-[#505a5f]'
                          }`}
                        >
                          {STATUS_DESCRIPTIONS[status]}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="govuk-inset-text">
                <p>
                  <strong>Need help?</strong> Contact your local authority with your reference
                  number <strong>{submission.reference_number}</strong> if you have questions.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8">
            <Link to="/" className="text-[#1d70b8] underline hover:text-[#003078]">
              Return to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
