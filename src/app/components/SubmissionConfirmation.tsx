import { useLocation, Link } from 'react-router';
import { Button } from './gds/Button';

export function SubmissionConfirmation() {
  const location = useLocation();
  const { referenceNumber, formTitle } = (location.state as {
    referenceNumber?: string;
    formTitle?: string;
  } | null) ?? {};

  // Fallback for direct URL access (e.g. during development)
  const ref = referenceNumber ?? 'APP-' + Math.floor(100000 + Math.random() * 900000);
  const title = formTitle ?? 'your application';

  return (
    <div className="govuk-width-container govuk-main-wrapper">
      <div className="govuk-grid-row govuk-clearfix">
        <div className="govuk-grid-column-two-thirds">
          <div className="govuk-panel govuk-panel--confirmation mb-8">
            <h1 className="govuk-panel__title">
              Application submitted
            </h1>
            <div className="govuk-panel__body mt-4">
              Your reference number
              <br />
              <strong className="govuk-panel__body text-3xl">{ref}</strong>
            </div>
          </div>

          <div className="govuk-inset-text">
            <p>
              <strong>Keep this safe.</strong> You will need your reference number to track
              the progress of {title} or if you need to contact us.
            </p>
          </div>

          <h2 className="govuk-heading-m mt-8 mb-4">What happens next</h2>

          <ol className="list-none space-y-4 mb-8">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#00703c] text-white flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <p className="font-bold mb-1">Application received</p>
                <p className="govuk-body text-sm text-[#505a5f]">
                  Your application is in our queue and will be picked up by a caseworker.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#b1b4b6] text-white flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <p className="font-bold mb-1">Under review</p>
                <p className="govuk-body text-sm text-[#505a5f]">
                  A caseworker will review your application. They may contact you for more information.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#b1b4b6] text-white flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <p className="font-bold mb-1">Decision made</p>
                <p className="govuk-body text-sm text-[#505a5f]">
                  We will contact you with the outcome and any next steps.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#b1b4b6] text-white flex items-center justify-center text-sm font-bold">4</span>
              <div>
                <p className="font-bold mb-1">Complete</p>
                <p className="govuk-body text-sm text-[#505a5f]">
                  Your application has been fully processed.
                </p>
              </div>
            </li>
          </ol>

          <p className="govuk-body mb-8">
            This process usually takes up to 12 weeks. You can check your progress at any time using your reference number.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to={`/track?ref=${ref}`}>
              <Button variant="primary">
                Track your application
              </Button>
            </Link>
            <Link to="/">
              <Button variant="secondary">
                Return to homepage
              </Button>
            </Link>
          </div>

          <div className="mt-8 border-t-2 border-[#b1b4b6] pt-6">
            <h2 className="govuk-heading-s mb-3">Help us improve this service</h2>
            <p className="govuk-body">
              <a href="#" className="text-[#1d70b8] underline hover:text-[#003078]">
                Take a short survey
              </a>{' '}
              to help us improve this service (takes 2 minutes)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
