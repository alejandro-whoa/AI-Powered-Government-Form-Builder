import React from 'react';

export function PhaseBanner() {
  return (
    <div className="govuk-phase-banner bg-white">
      <div className="govuk-width-container">
        <p className="flex items-center gap-3">
          <strong className="govuk-tag">
            BETA
          </strong>
          <span className="text-sm">
            This is a prototype service — your{' '}
            <a href="#" className="text-[#1d70b8] underline hover:text-[#003078]">
              feedback
            </a>{' '}
            will help us to improve it.
          </span>
        </p>
      </div>
    </div>
  );
}
