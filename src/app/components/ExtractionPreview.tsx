import { useNavigate, useParams, useLocation } from 'react-router';
import { Button } from './gds/Button';
import { mockExtractedForm } from '../data/mockData';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import type { FormSchema } from '../types/schema';

export function ExtractionPreview() {
  const navigate = useNavigate();
  const { formId } = useParams();
  const location = useLocation();

  // Use real extracted data when navigated from UploadPDF, otherwise show mock
  const form: FormSchema =
    (location.state as { form?: FormSchema } | null)?.form ?? mockExtractedForm;
  const fieldsNeedingReview = form.fields.filter(f => f.extracted?.needsReview);
  const overallConfidence = form.sourcePDF?.extractionConfidence || 0;
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.85) return 'text-[#00703c]';
    if (confidence >= 0.70) return 'text-[#f47738]';
    return 'text-[#d4351c]';
  };
  
  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.85) return 'High confidence';
    if (confidence >= 0.70) return 'Medium confidence';
    return 'Low confidence';
  };
  
  return (
    <div className="govuk-width-container govuk-main-wrapper">
      <div className="govuk-grid-row govuk-clearfix">
        <div className="govuk-grid-column-full">
          <span className="govuk-caption">Form extraction complete</span>
          <h1 className="govuk-heading-xl mb-6">
            {form.title}
          </h1>
          
          <div className="govuk-panel govuk-panel--confirmation mb-8">
            <h2 className="govuk-panel__title">
              AI Extraction Complete
            </h2>
            <div className="govuk-panel__body mt-4">
              <span className="block text-3xl font-bold">
                {form.fields.length} fields detected
              </span>
              <span className="block mt-2 text-xl">
                Overall confidence: {(overallConfidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          
          {fieldsNeedingReview.length > 0 && (
            <div className="govuk-warning-text mb-6">
              <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
              <strong className="govuk-warning-text__text">
                <span className="govuk-warning-text__assistive">Warning</span>
                {fieldsNeedingReview.length} field{fieldsNeedingReview.length !== 1 ? 's' : ''} need{fieldsNeedingReview.length === 1 ? 's' : ''} manual review due to low confidence scores
              </strong>
            </div>
          )}
          
          <div className="mb-8">
            <h2 className="govuk-heading-l mb-4">Extraction summary</h2>
            
            <dl className="govuk-summary-list">
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Source file</dt>
                <dd className="govuk-summary-list__value">{form.sourcePDF?.filename}</dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Uploaded by</dt>
                <dd className="govuk-summary-list__value">{form.sourcePDF?.uploadedBy}</dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Department</dt>
                <dd className="govuk-summary-list__value">{form.department}</dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Sections detected</dt>
                <dd className="govuk-summary-list__value">{form.sections.length}</dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Fields detected</dt>
                <dd className="govuk-summary-list__value">{form.fields.length}</dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Fields needing review</dt>
                <dd className="govuk-summary-list__value">
                  {fieldsNeedingReview.length === 0 ? (
                    <span className="text-[#00703c] flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      All fields extracted successfully
                    </span>
                  ) : (
                    <span className="text-[#f47738] flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      {fieldsNeedingReview.length} field{fieldsNeedingReview.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
          
          <div className="mb-8">
            <h2 className="govuk-heading-l mb-4">Extracted fields by section</h2>
            
            {form.sections.map((section) => {
              const sectionFields = form.fields.filter(f => f.sectionId === section.id);
              
              return (
                <div key={section.id} className="mb-6 border-b border-[#b1b4b6] pb-4">
                  <h3 className="govuk-heading-m mb-4">{section.title}</h3>
                  
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[#b1b4b6]">
                        <th className="text-left py-2 text-sm">Field label</th>
                        <th className="text-left py-2 text-sm">Type</th>
                        <th className="text-left py-2 text-sm">Confidence</th>
                        <th className="text-left py-2 text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sectionFields.map((field) => (
                        <tr key={field.id} className="border-b border-[#b1b4b6]">
                          <td className="py-3">
                            <span className="font-bold">{field.label}</span>
                            {field.hint && (
                              <span className="block text-sm text-[#505a5f] mt-1">
                                {field.hint}
                              </span>
                            )}
                          </td>
                          <td className="py-3">
                            <span className="inline-block px-2 py-1 bg-[#f3f2f1] text-sm rounded">
                              {field.type}
                            </span>
                          </td>
                          <td className="py-3">
                            {field.extracted && (
                              <span className={`font-bold ${getConfidenceColor(field.extracted.confidence)}`}>
                                {(field.extracted.confidence * 100).toFixed(0)}%
                              </span>
                            )}
                          </td>
                          <td className="py-3">
                            {field.extracted?.needsReview ? (
                              <span className="govuk-tag govuk-tag--yellow flex items-center gap-1 w-fit">
                                <AlertTriangle className="w-4 h-4" />
                                Review
                              </span>
                            ) : (
                              <span className="govuk-tag govuk-tag--green flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-4 h-4" />
                                OK
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
          
          <div className="govuk-inset-text">
            <p>
              <strong>Next step:</strong> Review and configure the extracted fields in the form builder. 
              You can adjust field types, add validation rules, and set up conditional logic.
            </p>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button 
              variant="primary" 
              onClick={() => navigate(`/builder/${formId}`)}
            >
              Continue to form builder
              <ArrowRight className="inline-block w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={() => navigate('/')}
            >
              Save and return later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
