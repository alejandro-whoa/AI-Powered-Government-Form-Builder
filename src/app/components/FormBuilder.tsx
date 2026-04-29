import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { Button } from './gds/Button';
import { Input } from './gds/Input';
import { Select } from './gds/Select';
import { Checkbox } from './gds/Checkbox';
import { mockExtractedForm } from '../data/mockData';
import { FormField, FormSchema, FieldType } from '../types/schema';
import { Edit, Trash2, Plus, Save, Eye, ChevronDown, ChevronUp } from 'lucide-react';

function loadSavedForm(formId: string | undefined): FormSchema | null {
  if (!formId) return null;
  try {
    const raw = sessionStorage.getItem(`form-${formId}`);
    return raw ? (JSON.parse(raw) as FormSchema) : null;
  } catch {
    return null;
  }
}

export function FormBuilder() {
  const navigate = useNavigate();
  const { formId } = useParams();
  const location = useLocation();

  const initialForm =
    (location.state as { form?: FormSchema } | null)?.form ??
    loadSavedForm(formId) ??
    mockExtractedForm;

  const [form, setForm] = useState(initialForm);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(form.sections.map(s => s.id))
  );
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };
  
  const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
    setForm({
      ...form,
      fields: form.fields.map(f => 
        f.id === fieldId ? { ...f, ...updates } : f
      ),
    });
  };
  
  const handleSaveAndPublish = () => {
    // In real system, this would validate and publish
    setShowPublishDialog(true);
  };
  
  const confirmPublish = () => {
    const publishedForm: FormSchema = {
      ...form,
      version: {
        ...form.version,
        status: 'published',
        versionNumber: form.version.versionNumber.replace('-draft', ''),
        publishedAt: new Date().toISOString(),
        publishedBy: 'caseworker',
      },
      fields: form.fields.map(({ extracted: _e, ...rest }) => rest),
    };
    if (formId) {
      sessionStorage.setItem(`form-published-${formId}`, JSON.stringify(publishedForm));
      sessionStorage.setItem(`form-${formId}`, JSON.stringify(publishedForm));
    }
    navigate(`/versions/${formId}`);
  };
  
  return (
    <div className="govuk-width-container govuk-main-wrapper">
      {showPublishDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-2xl w-full">
            <h2 className="govuk-heading-l mb-4">Publish form version?</h2>
            <p className="govuk-body mb-6">
              This will create version <strong>1.0.0</strong> of "{form.title}" and make it available for use.
              You can roll back to previous versions if needed.
            </p>
            <div className="flex gap-4">
              <Button variant="primary" onClick={confirmPublish}>
                Publish form
              </Button>
              <Button variant="secondary" onClick={() => setShowPublishDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="govuk-grid-row govuk-clearfix">
        <div className="govuk-grid-column-full">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="govuk-caption">
                Form builder · {form.department}
              </span>
              <h1 className="govuk-heading-xl mb-2">
                {form.title}
              </h1>
              <span className="govuk-tag govuk-tag--grey">
                {form.version.status} · v{form.version.versionNumber}
              </span>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                onClick={() => navigate(`/form/${formId}`)}
              >
                <Eye className="inline-block w-5 h-5 mr-2" />
                Preview
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSaveAndPublish}
              >
                <Save className="inline-block w-5 h-5 mr-2" />
                Save & publish
              </Button>
            </div>
          </div>
          
          <div className="govuk-inset-text mb-6">
            <p className="mb-2">
              <strong>Form configuration:</strong> Review AI-extracted fields and configure validation rules, 
              conditional logic, and field properties.
            </p>
            <p className="text-sm text-[#505a5f]">
              Fields marked with a yellow tag need review due to lower confidence scores from the AI extraction.
            </p>
          </div>
          
          <div className="mb-6">
            <h2 className="govuk-heading-l">Form sections and fields</h2>
            
            {form.sections.map((section) => {
              const sectionFields = form.fields.filter(f => f.sectionId === section.id);
              const isExpanded = expandedSections.has(section.id);
              
              return (
                <div key={section.id} className="border border-[#b1b4b6] mb-4">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-4 bg-[#f3f2f1] hover:bg-[#e9e9e9] flex justify-between items-center text-left"
                  >
                    <div>
                      <h3 className="govuk-heading-m mb-1">{section.title}</h3>
                      {section.description && (
                        <p className="text-sm text-[#505a5f]">{section.description}</p>
                      )}
                      <p className="text-sm text-[#505a5f] mt-2">
                        {sectionFields.length} field{sectionFields.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-[#505a5f]" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-[#505a5f]" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="p-4">
                      {sectionFields.map((field) => (
                        <div 
                          key={field.id} 
                          className={`
                            mb-4 p-4 border-l-4 
                            ${field.extracted?.needsReview ? 'border-[#f47738] bg-[#fff7f0]' : 'border-[#b1b4b6] bg-white'}
                          `}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-bold">{field.label}</h4>
                                {field.extracted?.needsReview && (
                                  <span className="govuk-tag govuk-tag--yellow text-xs">
                                    Needs review
                                  </span>
                                )}
                              </div>
                              {field.hint && (
                                <p className="text-sm text-[#505a5f] mb-2">{field.hint}</p>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingField(editingField === field.id ? null : field.id)}
                                className="text-[#1d70b8] hover:text-[#003078] p-2"
                                title="Edit field"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                className="text-[#d4351c] hover:text-[#942514] p-2"
                                title="Delete field"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-[#505a5f] block">Field type</span>
                              <span className="font-bold">{field.type}</span>
                            </div>
                            <div>
                              <span className="text-[#505a5f] block">Field ID</span>
                              <span className="font-mono text-xs">{field.id}</span>
                            </div>
                            {field.extracted && (
                              <div>
                                <span className="text-[#505a5f] block">AI confidence</span>
                                <span className="font-bold">
                                  {(field.extracted.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            )}
                            <div>
                              <span className="text-[#505a5f] block">Validation rules</span>
                              <span className="font-bold">
                                {field.validation?.length || 0} rule{(field.validation?.length || 0) !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                          
                          {editingField === field.id && (
                            <div className="mt-4 p-4 bg-white border border-[#b1b4b6]">
                              <h5 className="font-bold mb-3">Edit field configuration</h5>
                              
                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <Input
                                  label="Field label"
                                  value={field.label}
                                  onChange={(e) => handleFieldUpdate(field.id, { label: e.target.value })}
                                />
                                
                                <div>
                                  <label className="block mb-1 font-bold">Field type</label>
                                  <select
                                    value={field.type}
                                    onChange={(e) => handleFieldUpdate(field.id, { type: e.target.value as FieldType })}
                                    className="w-full px-2 py-1 border-2 border-[#0b0c0c] focus:outline-none focus:ring-4 focus:ring-yellow-400"
                                  >
                                    <option value="text">Text</option>
                                    <option value="textarea">Text area</option>
                                    <option value="email">Email</option>
                                    <option value="tel">Telephone</option>
                                    <option value="number">Number</option>
                                    <option value="date">Date</option>
                                    <option value="postcode">Postcode</option>
                                    <option value="radio">Radio buttons</option>
                                    <option value="checkbox">Checkboxes</option>
                                    <option value="select">Select dropdown</option>
                                  </select>
                                </div>
                              </div>
                              
                              <div className="mb-4">
                                <label className="block mb-1 font-bold">Hint text (optional)</label>
                                <input
                                  type="text"
                                  value={field.hint || ''}
                                  onChange={(e) => handleFieldUpdate(field.id, { hint: e.target.value })}
                                  className="w-full px-2 py-1 border-2 border-[#0b0c0c] focus:outline-none focus:ring-4 focus:ring-yellow-400"
                                  placeholder="Help text to display under the field label"
                                />
                              </div>
                              
                              <div className="mb-4">
                                <Checkbox
                                  name={`validation-${field.id}`}
                                  options={[
                                    { label: 'Required field', value: 'required' },
                                  ]}
                                  values={field.validation?.some(v => v.type === 'required') ? ['required'] : []}
                                  onChange={(values) => {
                                    // Update validation rules
                                    const hasRequired = values.includes('required');
                                    const otherRules = field.validation?.filter(v => v.type !== 'required') || [];
                                    handleFieldUpdate(field.id, {
                                      validation: hasRequired 
                                        ? [{ type: 'required', message: `Enter ${field.label.toLowerCase()}` }, ...otherRules]
                                        : otherRules
                                    });
                                  }}
                                />
                              </div>
                              
                              {field.conditional && (
                                <div className="p-3 bg-[#f3f2f1] border-l-4 border-[#1d70b8] mb-4">
                                  <p className="text-sm">
                                    <strong>Conditional logic:</strong> This field is shown when{' '}
                                    <strong>{field.conditional.showWhen.fieldId}</strong>{' '}
                                    {field.conditional.showWhen.operator} <strong>{field.conditional.showWhen.value}</strong>
                                  </p>
                                </div>
                              )}
                              
                              <div className="flex gap-3">
                                <Button 
                                  variant="primary" 
                                  onClick={() => setEditingField(null)}
                                >
                                  Save changes
                                </Button>
                                <Button 
                                  variant="secondary" 
                                  onClick={() => setEditingField(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <button
                        className="flex items-center gap-2 text-[#1d70b8] hover:text-[#003078] font-bold mt-4"
                      >
                        <Plus className="w-5 h-5" />
                        Add field to this section
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex gap-4 mt-8">
            <Button variant="primary" onClick={handleSaveAndPublish}>
              Save & publish version
            </Button>
            <Button variant="secondary" onClick={() => navigate('/')}>
              Save draft
            </Button>
            <Button variant="link" onClick={() => navigate(`/versions/${formId}`)}>
              View version history
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
