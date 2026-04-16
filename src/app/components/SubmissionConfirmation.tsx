import { Link } from 'react-router';
import { Button } from './gds/Button';

export function SubmissionConfirmation() {
  const referenceNumber = 'BBG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  
  return (
    <div className="govuk-width-container govuk-main-wrapper">
      <div className="govuk-grid-row govuk-clearfix">
        <div className="govuk-grid-column-two-thirds">
          <div className="govuk-panel govuk-panel--confirmation mb-8">
            <h1 className="govuk-panel__title">
              Application complete
            </h1>
            <div className="govuk-panel__body mt-4">
              Your reference number
              <br />
              <strong className="govuk-panel__body text-3xl">{referenceNumber}</strong>
            </div>
          </div>
          
          <p className="govuk-body">
            We have sent you a confirmation email.
          </p>
          
          <h2 className="govuk-heading-m mt-8 mb-4">
            What happens next
          </h2>
          
          <p className="govuk-body">
            We've sent your application to the relevant local authority.
          </p>
          
          <p className="govuk-body">
            They will contact you either to confirm your Blue Badge or to ask for more information.
          </p>
          
          <p className="govuk-body mb-8">
            This usually takes up to 12 weeks, but can take longer if we need to contact your GP or healthcare professional.
          </p>
          
          <div className="govuk-inset-text">
            <p>
              <strong>Important:</strong> Keep your reference number safe. You'll need it to track your application or if you need to contact us.
            </p>
          </div>
          
          <h2 className="govuk-heading-m mt-8 mb-4">
            If you need help
          </h2>
          
          <p className="govuk-body">
            Contact your local authority if you have questions about your application.
          </p>
          
          <p className="govuk-body mb-8">
            <a href="#" className="text-[#1d70b8] underline hover:text-[#003078]">
              Find your local authority contact details
            </a>
          </p>
          
          <Link to="/">
            <Button variant="primary">
              Return to homepage
            </Button>
          </Link>
          
          <div className="mt-8 border-t-2 border-[#b1b4b6] pt-6">
            <h2 className="govuk-heading-s mb-3">
              Help us improve this service
            </h2>
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
