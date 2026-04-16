import { Link } from 'react-router';
import { Button } from './gds/Button';
import { mockFormsList } from '../data/mockData';
import { FileText, Upload, Eye, CheckCircle2 } from 'lucide-react';

export function Home() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'govuk-tag--green';
      case 'draft':
        return 'govuk-tag--grey';
      case 'review':
        return 'govuk-tag--yellow';
      default:
        return '';
    }
  };
  
  return (
    <div className="govuk-width-container govuk-main-wrapper">
      <div className="govuk-grid-row govuk-clearfix">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl mb-6">
            Government Form Builder
          </h1>
          
          <p className="govuk-body">
            Transform PDF forms into accessible, user-friendly digital services that meet GDS standards.
          </p>
          
          <p className="govuk-body">
            This platform enables government departments to:
          </p>
          
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Upload PDF forms for AI-powered field extraction</li>
            <li>Review and configure form schemas with validation rules</li>
            <li>Publish versioned forms with full audit trails</li>
            <li>Deliver accessible digital forms to citizens</li>
          </ul>
          
          <div className="mb-8">
            <Link to="/upload">
              <Button variant="primary">
                Upload a PDF form
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="govuk-grid-column-one-third">
          <aside className="border-l-4 border-[#1d70b8] pl-4 mt-8">
            <h2 className="govuk-heading-s mb-3">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/architecture" className="text-[#1d70b8] underline hover:text-[#003078]">
                  System Architecture
                </Link>
              </li>
              <li>
                <a href="#" className="text-[#1d70b8] underline hover:text-[#003078]">
                  GDS Design System
                </a>
              </li>
              <li>
                <a href="#" className="text-[#1d70b8] underline hover:text-[#003078]">
                  Accessibility Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-[#1d70b8] underline hover:text-[#003078]">
                  API Documentation
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </div>
      
      <div className="govuk-grid-row mt-12 govuk-clearfix">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-l mb-6">How it works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="border-l-4 border-[#1d70b8] pl-4">
              <Upload className="w-8 h-8 text-[#1d70b8] mb-3" />
              <h3 className="govuk-heading-s mb-2">1. Upload PDF</h3>
              <p className="govuk-body-s">
                Service owners upload existing PDF forms to the platform
              </p>
            </div>
            
            <div className="border-l-4 border-[#1d70b8] pl-4">
              <Eye className="w-8 h-8 text-[#1d70b8] mb-3" />
              <h3 className="govuk-heading-s mb-2">2. Review & Edit</h3>
              <p className="govuk-body-s">
                AI extracts fields. Caseworkers review and configure validation
              </p>
            </div>
            
            <div className="border-l-4 border-[#1d70b8] pl-4">
              <CheckCircle2 className="w-8 h-8 text-[#1d70b8] mb-3" />
              <h3 className="govuk-heading-s mb-2">3. Publish</h3>
              <p className="govuk-body-s">
                Forms are versioned and published with full audit trail
              </p>
            </div>
            
            <div className="border-l-4 border-[#1d70b8] pl-4">
              <FileText className="w-8 h-8 text-[#1d70b8] mb-3" />
              <h3 className="govuk-heading-s mb-2">4. Citizens Complete</h3>
              <p className="govuk-body-s">
                Accessible digital forms render dynamically for end users
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="govuk-grid-row govuk-clearfix">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-l mb-4">Forms in the system</h2>
          
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-[#b1b4b6]">
                <th className="text-left py-3 font-bold">Form name</th>
                <th className="text-left py-3 font-bold">Department</th>
                <th className="text-left py-3 font-bold">Version</th>
                <th className="text-left py-3 font-bold">Status</th>
                <th className="text-left py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockFormsList.map((form) => (
                <tr key={form.id} className="border-b border-[#b1b4b6]">
                  <td className="py-3">
                    <Link 
                      to={`/builder/${form.id}`}
                      className="text-[#1d70b8] underline hover:text-[#003078] font-bold"
                    >
                      {form.title}
                    </Link>
                  </td>
                  <td className="py-3 text-sm">{form.department}</td>
                  <td className="py-3 text-sm">{form.version}</td>
                  <td className="py-3">
                    <span className={`govuk-tag ${getStatusColor(form.status)}`}>
                      {form.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-3">
                      <Link 
                        to={`/builder/${form.id}`}
                        className="text-[#1d70b8] underline hover:text-[#003078] text-sm"
                      >
                        Edit
                      </Link>
                      <Link 
                        to={`/versions/${form.id}`}
                        className="text-[#1d70b8] underline hover:text-[#003078] text-sm"
                      >
                        Versions
                      </Link>
                      {form.status === 'published' && (
                        <Link 
                          to={`/form/${form.id}`}
                          className="text-[#1d70b8] underline hover:text-[#003078] text-sm"
                        >
                          Preview
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}