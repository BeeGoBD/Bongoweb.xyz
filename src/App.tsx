import { useState } from 'react';
import { WizardStep, WebsiteDemo } from './types';
import BackgroundGlows from './components/BackgroundGlows';
import Step1Welcome from './components/Step1Welcome';
import Step2Guarantee from './components/Step2Guarantee';
import Step3Management from './components/Step3Management';
import Step4Pricing from './components/Step4Pricing';
import MainPreviewZone from './components/MainPreviewZone';
import LiveBrowserPage from './components/LiveBrowserPage';
import PhotoShowcasePage from './components/PhotoShowcasePage';
import PackagesPage from './components/PackagesPage';
import OrderConsultPage from './components/OrderConsultPage';
import VideoFaqPage from './components/VideoFaqPage';
import LiveSupportWidget from './components/LiveSupportWidget';

type AppPage = 'wizard' | 'dashboard' | 'live-browser' | 'photo-showcase' | 'packages' | 'order' | 'video-faq';

export default function App() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [currentPage, setCurrentPage] = useState<AppPage>('wizard');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDemoForOrder, setSelectedDemoForOrder] = useState<WebsiteDemo | string | null>(null);

  // Scroll to top whenever page changes
  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Handlers for wizard navigation
  const handleNextStep = () => {
    if (currentStep < 5) {
      const next = (currentStep + 1) as WizardStep;
      setCurrentStep(next);
      if (next === 5) {
        navigateTo('dashboard');
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  };

  const handleOpenOrderWithDemo = (demo?: WebsiteDemo | string) => {
    if (demo) {
      setSelectedDemoForOrder(demo);
    } else {
      setSelectedDemoForOrder('Standard Starter Website');
    }
    navigateTo('order');
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-900 antialiased font-sans selection:bg-indigo-600 selection:text-white flex flex-col justify-between">
      {/* Quiet Luxury Ambient Lighting */}
      <BackgroundGlows />

      {/* Floating Live Support Widget - Visible on Every Screen */}
      <LiveSupportWidget />

      {/* Full Page Navigation Router */}
      {currentPage === 'wizard' && (
        <div className="fixed inset-0 h-screen h-dvh w-screen max-w-full overflow-hidden bg-white z-30 flex flex-col justify-between">
          {/* Subtle jewel accent line at the very top edge */}
          <div className="w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 shrink-0" />

          {/* Full Page Slide Content Viewport */}
          <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex flex-col justify-between min-h-0 overflow-y-auto sm:overflow-hidden">
            {currentStep === 1 && (
              <Step1Welcome 
                onNext={handleNextStep}
              />
            )}

            {currentStep === 2 && (
              <Step2Guarantee 
                onBack={handlePrevStep}
                onNext={handleNextStep}
              />
            )}

            {currentStep === 3 && (
              <Step3Management 
                onBack={handlePrevStep}
                onNext={handleNextStep}
              />
            )}

            {currentStep === 4 && (
              <Step4Pricing 
                onBack={handlePrevStep}
                onComplete={() => {
                  setCurrentStep(5);
                  navigateTo('dashboard');
                }}
              />
            )}
          </main>

          {/* Bottom Integrated Indicator Bar */}
          <footer className="w-full py-3 sm:py-4 border-t border-slate-100 bg-white/95 backdrop-blur-md flex items-center justify-center shrink-0">
            {/* Micro Slide Deck Indicators - Sleek 4 Dots */}
            <div className="flex items-center gap-2 select-none">
              {[1, 2, 3, 4].map((stepNum) => (
                <button
                  key={stepNum}
                  onClick={() => setCurrentStep(stepNum as WizardStep)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    currentStep === stepNum 
                      ? 'w-7 h-2 bg-gradient-to-r from-indigo-600 to-blue-600 shadow-[0_2px_8px_rgba(79,70,229,0.35)]' 
                      : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to slide ${stepNum}`}
                />
              ))}
            </div>
          </footer>
        </div>
      )}

      {/* Page 2: Unified Main Preview Zone (Dashboard) */}
      {currentPage === 'dashboard' && (
        <MainPreviewZone 
          onBackToWizard={() => {
            setCurrentStep(1);
            navigateTo('wizard');
          }}
          onOpenLiveBrowser={() => navigateTo('live-browser')}
          onOpenPhotoShowcase={() => navigateTo('photo-showcase')}
          onOpenPackages={() => navigateTo('packages')}
          onOpenVideoFaq={() => navigateTo('video-faq')}
          onOpenOrderModal={handleOpenOrderWithDemo}
        />
      )}

      {/* Page 3: Full Standalone Live Browser Page */}
      {currentPage === 'live-browser' && (
        <LiveBrowserPage
          onBack={() => navigateTo('dashboard')}
          onSelectForOrder={(demo) => handleOpenOrderWithDemo(demo)}
          initialCategory={selectedCategory}
        />
      )}

      {/* Page 4: Full Standalone Photo Showcase Page */}
      {currentPage === 'photo-showcase' && (
        <PhotoShowcasePage
          onBack={() => navigateTo('dashboard')}
          onSelectForOrder={(title) => handleOpenOrderWithDemo(title)}
        />
      )}

      {/* Page 5: Full Standalone Packages Page */}
      {currentPage === 'packages' && (
        <PackagesPage
          onBack={() => navigateTo('dashboard')}
          onSelectPackage={(pkgName) => handleOpenOrderWithDemo(pkgName)}
        />
      )}

      {/* Page 6: Full Standalone Order & Consultation Page */}
      {currentPage === 'order' && (
        <OrderConsultPage
          onBack={() => navigateTo('dashboard')}
          selectedDemo={selectedDemoForOrder}
        />
      )}

      {/* Page 7: Full Standalone Video FAQ & Project Walkthrough Page */}
      {currentPage === 'video-faq' && (
        <VideoFaqPage
          onBack={() => navigateTo('dashboard')}
          onOpenOrder={(itemTitle) => handleOpenOrderWithDemo(itemTitle)}
          onOpenPackages={() => navigateTo('packages')}
        />
      )}
    </div>
  );
}
