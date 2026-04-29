import { useNavigate, useParams } from 'react-router';
import { Button } from './gds/Button';
import { mockAuditLog, mockExtractedForm, mockPublishedForm } from '../data/mockData';
import { Clock, User, FileText, CheckCircle2 } from 'lucide-react';
import type { FormSchema } from '../types/schema';

function loadForm(formId: string | undefined): FormSchema | null {
  if (!formId) return null;
  try {
    const raw =
      sessionStorage.getItem(`form-published-${formId}`) ??
      sessionStorage.getItem(`form-${formId}`);
    return raw ? (JSON.parse(raw) as FormSchema) : null;
  } catch {
    return null;
  }
}

export function VersionManagement() {
  const navigate = useNavigate();
  const { formId } = useParams();

  const savedForm = loadForm(formId);
  const isRealForm = !!savedForm;

  const formTitle = savedForm?.title ?? 'Blue Badge Application';
  const versions = savedForm
    ? [savedForm.version]
    : [mockPublishedForm.version, mockExtractedForm.version];
  const auditLog = isRealForm && savedForm
    ? [{
        id: 'audit-001',
        formId: savedForm.id,
        version: savedForm.version.versionNumber,
        action: savedForm.version.status === 'published' ? 'published' as const : 'created' as const,
        user: savedForm.version.publishedBy ?? savedForm.version.createdBy,
        timestamp: savedForm.version.publishedAt ?? savedForm.version.createdAt,
      }]
    : mockAuditLog;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="govuk-width-container govuk-main-wrapper">
      <div className="govuk-grid-row govuk-clearfix">
        <div className="govuk-grid-column-full">
          <span className="govuk-caption">Version management</span>
          <h1 className="govuk-heading-xl mb-6">
            {formTitle}
          </h1>
          
          <div className="mb-8">
            <h2 className="govuk-heading-l mb-4">Published versions</h2>
            
            <div className="border border-[#b1b4b6]">
              {versions.filter(v => v.status === 'published').map((version, index) => (
                <div 
                  key={version.versionNumber}
                  className={`p-4 ${index > 0 ? 'border-t border-[#b1b4b6]' : ''} ${version.status === 'published' ? 'bg-[#f0f4f5]' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="govuk-heading-m mb-0">
                          Version {version.versionNumber}
                        </h3>
                        <span className={`
                          govuk-tag
                          ${version.status === 'published' ? 'govuk-tag--green' : ''}
                          ${version.status === 'draft' ? 'govuk-tag--grey' : ''}
                          ${version.status === 'review' ? 'govuk-tag--yellow' : ''}
                        `}>
                          {version.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-[#505a5f]">
                          <User className="w-4 h-4" />
                          Created by {version.createdBy} on {formatDate(version.createdAt)}
                        </p>
                        
                        {version.publishedAt && (
                          <p className="flex items-center gap-2 text-[#00703c] font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            Published by {version.publishedBy} on {formatDate(version.publishedAt)}
                          </p>
                        )}
                        
                        {version.changes && (
                          <p className="text-[#505a5f]">
                            <strong>Changes:</strong> {version.changes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="secondary" 
                        onClick={() => navigate(`/form/${formId}?version=${version.versionNumber}`)}
                      >
                        Preview
                      </Button>
                      {version.status === 'published' && (
                        <Button variant="warning">
                          Rollback
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="govuk-heading-l mb-4">Draft versions</h2>
            
            <div className="border border-[#b1b4b6]">
              {versions.filter(v => v.status === 'draft').map((version, index) => (
                <div 
                  key={version.versionNumber}
                  className={`p-4 ${index > 0 ? 'border-t border-[#b1b4b6]' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="govuk-heading-m mb-0">
                          Version {version.versionNumber}
                        </h3>
                        <span className="govuk-tag govuk-tag--grey">
                          {version.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-[#505a5f]">
                          <User className="w-4 h-4" />
                          Created by {version.createdBy} on {formatDate(version.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="primary" 
                        onClick={() => navigate(`/builder/${formId}`)}
                      >
                        Continue editing
                      </Button>
                      <Button variant="warning">
                        Delete draft
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="govuk-heading-l mb-4">Audit log</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#b1b4b6]">
                    <th className="text-left py-3 font-bold">Timestamp</th>
                    <th className="text-left py-3 font-bold">User</th>
                    <th className="text-left py-3 font-bold">Action</th>
                    <th className="text-left py-3 font-bold">Version</th>
                    <th className="text-left py-3 font-bold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((entry) => (
                    <tr key={entry.id} className="border-b border-[#b1b4b6]">
                      <td className="py-3 text-sm">
                        {formatDate(entry.timestamp)}
                      </td>
                      <td className="py-3 text-sm">{entry.user}</td>
                      <td className="py-3">
                        <span className={`
                          inline-block px-2 py-1 text-xs font-bold uppercase rounded
                          ${entry.action === 'published' ? 'bg-[#00703c] text-white' : ''}
                          ${entry.action === 'created' ? 'bg-[#1d70b8] text-white' : ''}
                          ${entry.action === 'updated' ? 'bg-[#f47738] text-white' : ''}
                        `}>
                          {entry.action}
                        </span>
                      </td>
                      <td className="py-3 text-sm font-mono">{entry.version}</td>
                      <td className="py-3 text-sm">
                        {entry.changes ? (
                          <button className="text-[#1d70b8] underline hover:text-[#003078]">
                            View {entry.changes.length} change{entry.changes.length !== 1 ? 's' : ''}
                          </button>
                        ) : (
                          <span className="text-[#505a5f]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <Button variant="secondary" onClick={() => navigate(`/builder/${formId}`)}>
            Back to form builder
          </Button>
        </div>
      </div>
    </div>
  );
}
