import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { UploadPDF } from "./components/UploadPDF";
import { ExtractionPreview } from "./components/ExtractionPreview";
import { FormBuilder } from "./components/FormBuilder";
import { VersionManagement } from "./components/VersionManagement";
import { PublishedForm } from "./components/PublishedForm";
import { SubmissionConfirmation } from "./components/SubmissionConfirmation";
import { ArchitectureView } from "./components/ArchitectureView";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "upload", Component: UploadPDF },
      { path: "extraction/:formId", Component: ExtractionPreview },
      { path: "builder/:formId", Component: FormBuilder },
      { path: "versions/:formId", Component: VersionManagement },
      { path: "form/:formId", Component: PublishedForm },
      { path: "confirmation", Component: SubmissionConfirmation },
      { path: "architecture", Component: ArchitectureView },
      { path: "*", Component: NotFound },
    ],
  },
]);