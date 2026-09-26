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

      {/* Background Website Dashboard Screen */}
      {(currentPage === 'dashboard' || currentPage === 'wizard') && (
        <div className={currentPage === 'wizard' ? 'filter blur-[2.5px] brightness-90 pointer-events-none select-none transition-all duration-300' : ''}>
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
        </div>
      )}

      {/* Floating Hover Screen for Slides (Coming Up from Background) */}
      {currentPage === 'wizard' && (
        <div 
          id="slides-hover-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-gradient-to-br from-sky-200/60 via-blue-100/50 to-indigo-100/60 backdrop-blur-md animate-fadeIn"
        >
          {/* Ambient Chroma Light Orb behind the Slide Card with Luminous Light Blue Glow */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="w-[780px] h-[520px] bg-gradient-to-tr from-sky-400/35 via-blue-400/25 to-cyan-300/30 rounded-full blur-3xl opacity-90" />
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl" />
          </div>

          {/* Elevated Presentation Slide Card Coming Up */}
          <div className="relative w-full max-w-2xl sm:max-w-3xl lg:max-w-[820px] bg-gradient-to-b from-white via-[#FCFDFE] to-[#F8FAFC] backdrop-blur-2xl rounded-3xl sm:rounded-[2rem] border border-white/90 shadow-[0_25px_70px_-10px_rgba(14,116,144,0.18),0_12px_36px_rgba(30,58,138,0.12),0_0_0_1px_rgba(255,255,255,0.9)_inset,0_0_50px_rgba(56,189,248,0.15)] ring-1 ring-sky-900/[0.06] p-5 sm:p-7 md:p-8 animate-slideUpModal overflow-hidden flex flex-col justify-between max-h-[92vh] sm:max-h-[88vh]">
            {/* Jewel accent bar across top of card */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

            {/* Subtle inner ambient light reflections */}
            <div className="absolute -top-20 -left-20 w-52 h-52 bg-indigo-500/6 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-emerald-500/6 rounded-full blur-2xl pointer-events-none" />

            {/* Quick Skip to Website button in top corner */}
            <button
              onClick={() => {
                setCurrentStep(5);
                navigateTo('dashboard');
              }}
              className="absolute top-3.5 right-4 text-[11px] font-semibold text-slate-400 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-slate-100 z-10"
              title="Skip directly to website"
            >
              <span>ক্যাটালগে যান</span>
              <span className="text-sm leading-none">×</span>
            </button>

            <div className="w-full flex-1 flex flex-col justify-between pt-1">
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
            </div>

            {/* Micro Slide Deck Indicators - Sleek 4 Dots */}
            <div className="w-full flex items-center justify-center gap-2 pt-3 border-t border-slate-100/80 mt-2 select-none shrink-0">
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
          </div>
        </div>
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
