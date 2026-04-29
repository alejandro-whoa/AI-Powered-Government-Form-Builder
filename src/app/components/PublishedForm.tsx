import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from './gds/Button';
import { Input } from './gds/Input';
import { Textarea } from './gds/Textarea';
import { DateInput } from './gds/DateInput';
import { Radio } from './gds/Radio';
import { Checkbox } from './gds/Checkbox';
import { Select } from './gds/Select';
import { mockPublishedForm } from '../data/mockData';
import { FormField } from '../types/schema';
import { AlertCircle } from 'lucide-react';
import { supabase, generateReferenceNumber } from '../../lib/supabase';

export function PublishedForm() {
  const navigate = useNavigate();
  const { formId } = useParams();
  
  const form = (() => {
    try {
      const raw =
        sessionStorage.getItem(`form-published-${formId}`) ??
        sessionStorage.getItem(`form-${formId}`);
      return raw ? JSON.parse(raw) : mockPublishedForm;
    } catch {
      return mockPublishedForm;
    }
  })();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const currentSection = form.sections[currentSectionIndex];
  const sectionFields = form.fields.filter(f => f.sectionId === currentSection.id);
  
  // Check if field should be shown based on conditional logic
  const shouldShowField = (field: FormField) => {
    if (!field.conditional) return true;
    
    const { fieldId, operator, value } = field.conditional.showWhen;
    const fieldValue = formData[fieldId];
    
    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'notEquals':
        return fieldValue !== value;
      case 'contains':
        return Array.isArray(fieldValue) && fieldValue.includes(value);
      default:
        return true;
    }
  };
  
  const visibleFields = sectionFields.filter(shouldShowField);
  
  const validateSection = () => {
    const newErrors: Record<string, string> = {};
    
    visibleFields.forEach(field => {
      field.validation?.forEach(rule => {
        const value = formData[field.id];
        
        if (rule.type === 'required') {
          if (!value || (Array.isArray(value) && value.length === 0)) {
            newErrors[field.id] = rule.message;
          } else if (field.type === 'date' && value) {
            if (!value.day || !value.month || !value.year) {
              newErrors[field.id] = rule.message;
            }
          }
        }
        
        if (rule.type === 'pattern' && value) {
          const regex = new RegExp(rule.value as string);
          if (!regex.test(value)) {
            newErrors[field.id] = rule.message;
          }
        }
        
        if (rule.type === 'maxLength' && value) {
          if (value.length > (rule.value as number)) {
            newErrors[field.id] = rule.message;
          }
        }
      });
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = async () => {
    if (!validateSection()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentSectionIndex < form.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0);
      return;
    }

    // Final section — save submission to Supabase
    setSubmitting(true);
    setSubmitError('');

    const referenceNumber = generateReferenceNumber();

    const { error } = await supabase.from('submissions').insert({
      reference_number: referenceNumber,
      form_id: formId ?? form.id,
      form_title: form.title,
      department: form.department,
      form_data: formData,
      status: 'received',
    });

    if (error) {
      setSubmitError('There was a problem submitting your application. Please try again.');
      setSubmitting(false);
      return;
    }

    navigate('/confirmation', {
      state: { referenceNumber, formTitle: form.title },
    });
  };
  
  const handleBack = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const renderField = (field: FormField) => {
    const value = formData[field.id];
    const error = errors[field.id];
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'postcode':
        return (
          <Input
            key={field.id}
            label={field.label}
            hint={field.hint}
            error={error}
            type={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            width={field.type === 'postcode' ? '10' : '20'}
          />
        );
        
      case 'textarea':
        return (
          <Textarea
            key={field.id}
            label={field.label}
            hint={field.hint}
            error={error}
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
          />
        );
        
      case 'date':
        return (
          <DateInput
            key={field.id}
            label={field.label}
            hint={field.hint}
            error={error}
            value={value || { day: '', month: '', year: '' }}
            onChange={(val) => setFormData({ ...formData, [field.id]: val })}
          />
        );
        
      case 'radio':
        return (
          <Radio
            key={field.id}
            label={field.label}
            hint={field.hint}
            error={error}
            options={field.options || []}
            name={field.id}
            value={value}
            onChange={(val) => setFormData({ ...formData, [field.id]: val })}
          />
        );
        
      case 'checkbox':
        return (
          <Checkbox
            key={field.id}
            label={field.label}
            hint={field.hint}
            error={error}
            options={field.options || []}
            name={field.id}
            values={value || []}
            onChange={(val) => setFormData({ ...formData, [field.id]: val })}
          />
        );
        
      case 'select':
        return (
          <Select
            key={field.id}
            label={field.label}
            hint={field.hint}
            error={error}
            options={field.options || []}
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="govuk-width-container govuk-main-wrapper">
      <div className="govuk-grid-row govuk-clearfix">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption">{form.department}</span>
          <h1 className="govuk-heading-xl mb-6">
            {form.title}
          </h1>
          
          <p className="govuk-body mb-6">
            {form.description}
          </p>
          
          {/* Progress indicator */}
          <div className="mb-8 p-4 bg-[#f3f2f1] border-l-4 border-[#1d70b8]">
            <p className="text-sm text-[#505a5f] mb-2">
              Section {currentSectionIndex + 1} of {form.sections.length}
            </p>
            <div className="w-full bg-white h-2 rounded overflow-hidden">
              <div 
                className="bg-[#1d70b8] h-full transition-all duration-300"
                style={{ width: `${((currentSectionIndex + 1) / form.sections.length) * 100}%` }}
              />
            </div>
          </div>
          
          {submitError && (
            <div className="border-4 border-[#d4351c] p-4 mb-6" role="alert">
              <p className="govuk-body font-bold">{submitError}</p>
            </div>
          )}

          {Object.keys(errors).length > 0 && (
            <div className="border-4 border-[#d4351c] p-4 mb-6" role="alert">
              <h2 className="govuk-heading-m flex items-center gap-2 mb-3">
                <AlertCircle className="w-6 h-6" />
                There is a problem
              </h2>
              <ul className="list-none space-y-2">
                {Object.entries(errors).map(([fieldId, error]) => {
                  const field = form.fields.find(f => f.id === fieldId);
                  return (
                    <li key={fieldId}>
                      <a 
                        href={`#${fieldId}`} 
                        className="text-[#d4351c] underline hover:text-[#942514] font-bold"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(fieldId)?.focus();
                        }}
                      >
                        {error}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          
          <h2 className="govuk-heading-l mb-4">
            {currentSection.title}
          </h2>
          
          {currentSection.description && (
            <p className="govuk-body mb-6">
              {currentSection.description}
            </p>
          )}
          
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            {visibleFields.map(renderField)}
            
            <div className="flex gap-4 mt-8">
              {currentSectionIndex < form.sections.length - 1 ? (
                <Button variant="primary" type="submit">
                  Continue
                </Button>
              ) : (
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit application'}
                </Button>
              )}
              
              {currentSectionIndex > 0 && (
                <Button variant="secondary" type="button" onClick={handleBack}>
                  Back
                </Button>
              )}
            </div>
          </form>
        </div>
        
        <div className="govuk-grid-column-one-third">
          <aside className="border-l-4 border-[#1d70b8] pl-4 mt-8">
            <h2 className="govuk-heading-s mb-3">Form sections</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              {form.sections.map((section, index) => (
                <li 
                  key={section.id}
                  className={`
                    ${index === currentSectionIndex ? 'font-bold text-[#1d70b8]' : ''}
                    ${index < currentSectionIndex ? 'text-[#00703c]' : ''}
                  `}
                >
                  {section.title}
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </div>
  );
}
