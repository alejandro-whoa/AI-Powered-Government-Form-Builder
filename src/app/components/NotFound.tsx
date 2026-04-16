import { Link } from 'react-router';
import { Button } from './gds/Button';

export function NotFound() {
  return (
    <div className="govuk-width-container govuk-main-wrapper">
      <div className="govuk-grid-row govuk-clearfix">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl mb-6">
            Page not found
          </h1>
          
          <p className="govuk-body mb-6">
            If you typed the web address, check it is correct.
          </p>
          
          <p className="govuk-body mb-6">
            If you pasted the web address, check you copied the entire address.
          </p>
          
          <p className="govuk-body mb-8">
            If the web address is correct or you selected a link or button,{' '}
            <a href="#" className="text-[#1d70b8] underline hover:text-[#003078]">
              contact the Government Form Builder team
            </a>{' '}
            if you need to speak to someone about your application.
          </p>
          
          <Link to="/">
            <Button variant="primary">
              Go to homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
