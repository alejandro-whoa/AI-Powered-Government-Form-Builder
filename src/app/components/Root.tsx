import { Outlet } from 'react-router';
import { Header } from './gds/Header';
import { PhaseBanner } from './gds/PhaseBanner';

export function Root() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <PhaseBanner />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-[#f3f2f1] border-t-8 border-[#1d70b8] mt-12">
        <div className="govuk-width-container py-6">
          <p className="text-sm text-[#505a5f]">
            Built by the{' '}
            <a href="#" className="text-[#1d70b8] underline">
              Government Digital Service
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
