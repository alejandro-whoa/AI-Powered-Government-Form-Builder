import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './gds/Button';
import { Input } from './gds/Input';
import { Upload, FileText, AlertCircle } from 'lucide-react';

export function UploadPDF() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [department, setDepartment] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrors({ ...errors, file: 'The selected file must be a PDF' });
        setSelectedFile(null);
      } else if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, file: 'The selected file must be smaller than 10MB' });
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setErrors({ ...errors, file: '' });
      }
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formTitle.trim()) {
      newErrors.title = 'Enter a form title';
    }
    
    if (!department) {
      newErrors.department = 'Select a department';
    }
    
    if (!selectedFile) {
      newErrors.file = 'Select a PDF file';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Simulate upload and AI extraction
    setUploading(true);
    setTimeout(() => {
      navigate('/extraction/blue-badge-001');
    }, 2000);
  };
  
  return (
    <div className="govuk-width-container govuk-main-wrapper">
      <div className="govuk-grid-row govuk-clearfix">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">
            Upload a PDF form
          </h1>
          
          <p className="govuk-body">
            Upload a digitally-generated PDF form to begin the conversion process. The AI will extract form fields and structure automatically.
          </p>
          
          <div className="govuk-inset-text">
            <p>
              <strong>Supported formats:</strong> Digitally-generated PDFs with form fields work best. Scanned PDFs may require manual field creation.
            </p>
          </div>
          
          {Object.keys(errors).length > 0 && (
            <div className="border-4 border-[#d4351c] p-4 mb-6" role="alert">
              <h2 className="govuk-heading-m flex items-center gap-2 mb-3">
                <AlertCircle className="w-6 h-6" />
                There is a problem
              </h2>
              <ul className="list-none space-y-2">
                {Object.entries(errors).map(([key, error]) => (
                  error && (
                    <li key={key}>
                      <a href={`#${key}`} className="text-[#d4351c] underline hover:text-[#942514] font-bold">
                        {error}
                      </a>
                    </li>
                  )
                ))}
              </ul>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <Input
              id="title"
              label="Form title"
              hint="Enter a descriptive name for this form"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              error={errors.title}
              width="20"
            />
            
            <div className="mb-6">
              <label htmlFor="department" className="block mb-1 font-bold">
                Department
              </label>
              <div className="text-[#505a5f] mb-1">
                Select the government department responsible for this form
              </div>
              {errors.department && (
                <p className="text-[#d4351c] font-bold mb-1 flex items-start">
                  <span className="mr-1 font-bold text-lg">!</span>
                  <span>Error: {errors.department}</span>
                </p>
              )}
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={`
                  w-full max-w-[29.5rem] px-2 py-1 border-2 border-[#0b0c0c]
                  ${errors.department ? 'border-[#d4351c] border-4' : ''}
                  focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-[#0b0c0c]
                  bg-white cursor-pointer
                `}
              >
                <option value="">Please select</option>
                <option value="dft">Department for Transport</option>
                <option value="home-office">Home Office</option>
                <option value="dwp">Department for Work and Pensions</option>
                <option value="hmrc">HM Revenue & Customs</option>
                <option value="moj">Ministry of Justice</option>
                <option value="defra">Department for Environment, Food & Rural Affairs</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="file" className="block mb-1 font-bold">
                Upload PDF file
              </label>
              <div className="text-[#505a5f] mb-1">
                Maximum file size: 10MB
              </div>
              {errors.file && (
                <p className="text-[#d4351c] font-bold mb-1 flex items-start">
                  <span className="mr-1 font-bold text-lg">!</span>
                  <span>Error: {errors.file}</span>
                </p>
              )}
              
              <div className={`
                border-2 border-dashed p-8 text-center
                ${errors.file ? 'border-[#d4351c]' : 'border-[#b1b4b6]'}
                ${selectedFile ? 'bg-[#f3f2f1]' : 'bg-white'}
              `}>
                {!selectedFile ? (
                  <>
                    <Upload className="w-12 h-12 mx-auto mb-4 text-[#505a5f]" />
                    <p className="mb-4">Drag and drop a PDF here, or</p>
                    <label 
                      htmlFor="file" 
                      className="inline-block px-4 py-2 bg-[#f3f2f1] text-[#0b0c0c] border-2 border-transparent hover:bg-[#dbdad9] shadow-[0_2px_0_#929191] cursor-pointer font-bold focus-within:outline-none focus-within:ring-4 focus-within:ring-yellow-400"
                    >
                      Choose file
                    </label>
                    <input
                      type="file"
                      id="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </>
                ) : (
                  <>
                    <FileText className="w-12 h-12 mx-auto mb-4 text-[#00703c]" />
                    <p className="font-bold mb-2">{selectedFile.name}</p>
                    <p className="text-sm text-[#505a5f] mb-4">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-[#1d70b8] underline hover:text-[#003078]"
                    >
                      Remove file
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="primary" 
                type="submit"
                disabled={uploading}
              >
                {uploading ? 'Processing...' : 'Upload and extract fields'}
              </Button>
              
              <Button 
                variant="secondary" 
                type="button"
                onClick={() => navigate('/')}
                disabled={uploading}
              >
                Cancel
              </Button>
            </div>
          </form>
          
          {uploading && (
            <div className="mt-6 p-4 bg-[#f3f2f1] border-l-4 border-[#1d70b8]">
              <p className="font-bold mb-2">Processing your form...</p>
              <p className="text-sm">
                Our AI is analysing the PDF structure and extracting form fields. This usually takes 10-30 seconds.
              </p>
              <div className="mt-4 w-full bg-white h-2 rounded overflow-hidden">
                <div className="bg-[#1d70b8] h-full animate-[pulse_1.5s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
