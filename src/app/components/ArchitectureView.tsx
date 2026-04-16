import { Link } from 'react-router';
import { Button } from './gds/Button';

export function ArchitectureView() {
  return (
    <div className="govuk-width-container govuk-main-wrapper">
      <div className="govuk-grid-row govuk-clearfix">
        <div className="govuk-grid-column-full">
          <h1 className="govuk-heading-xl mb-6">
            System Architecture
          </h1>
          
          <p className="govuk-body mb-6">
            The Government Form Builder follows a three-stage workflow architecture designed to transform 
            PDF forms into accessible digital services while maintaining governance and audit controls.
          </p>
          
          <div className="mb-8">
            <h2 className="govuk-heading-l mb-4">Architecture Overview</h2>
            
            <div className="border border-[#b1b4b6] p-4 bg-white">
              <div className="bg-[#f3f2f1] p-8 text-center">
                <p className="govuk-body text-[#505a5f]">
                  <strong>Architecture Diagram</strong>
                  <br />
                  Three-stage workflow: PDF Upload → AI Extraction → Form Configuration → Publishing → Citizen Access
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="govuk-heading-l mb-4">Three Core Workflows</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-[#1d70b8] pl-4">
                <h3 className="govuk-heading-m mb-2">1. Service Owner / Administrator</h3>
                <p className="govuk-body mb-3">
                  <strong>Purpose:</strong> Initial form ingestion and AI-powered field extraction
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Upload PDF forms through secure interface</li>
                  <li>AI extraction engine detects fields, types, and structure</li>
                  <li>Confidence scores assigned to each extracted field</li>
                  <li>Draft form schema created for review</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-[#00703c] pl-4">
                <h3 className="govuk-heading-m mb-2">2. Caseworker / Processing Officer</h3>
                <p className="govuk-body mb-3">
                  <strong>Purpose:</strong> Form validation, configuration, and publishing
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Review AI-extracted fields and correct any errors</li>
                  <li>Configure validation rules (required, pattern, min/max)</li>
                  <li>Set up conditional logic for dynamic forms</li>
                  <li>Version control and audit trail for all changes</li>
                  <li>Publish approved versions for citizen use</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-[#f47738] pl-4">
                <h3 className="govuk-heading-m mb-2">3. Citizen / Applicant</h3>
                <p className="govuk-body mb-3">
                  <strong>Purpose:</strong> Complete accessible digital forms
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access forms through GOV.UK-compliant interface</li>
                  <li>Multi-section forms with progress tracking</li>
                  <li>Real-time validation and helpful error messages</li>
                  <li>Conditional fields based on previous answers</li>
                  <li>Structured data submission to backend systems</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="govuk-heading-l mb-4">Technical Components</h2>
            
            <dl className="govuk-summary-list">
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Ingestion Service</dt>
                <dd className="govuk-summary-list__value">
                  Receives and stores uploaded PDF source files with metadata
                </dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">AI Extraction Engine</dt>
                <dd className="govuk-summary-list__value">
                  Machine learning models detect form structure, field types, labels, and validation patterns
                </dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Form Builder UI</dt>
                <dd className="govuk-summary-list__value">
                  Interactive interface for reviewing and configuring extracted form schemas
                </dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Schema Registry</dt>
                <dd className="govuk-summary-list__value">
                  Centralized repository storing versioned form definitions with full history
                </dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Publishing Pipeline</dt>
                <dd className="govuk-summary-list__value">
                  Validates schemas and publishes immutable versions with rollback capability
                </dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Runtime API</dt>
                <dd className="govuk-summary-list__value">
                  Serves active and versioned form schemas to rendering applications
                </dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Form Renderer</dt>
                <dd className="govuk-summary-list__value">
                  Dynamic GDS-compliant form interface that adapts to schema configuration
                </dd>
              </div>
            </dl>
          </div>
          
          <div className="govuk-inset-text">
            <p>
              <strong>MVP Focus:</strong> This prototype demonstrates the end-to-end workflow with 
              simulated AI extraction. Production implementation would integrate with OCR/ML services, 
              backend APIs, and department-specific casework systems.
            </p>
          </div>
          
          <Link to="/">
            <Button variant="secondary">
              Back to homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}