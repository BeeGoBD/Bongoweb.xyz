import { useState, useEffect } from 'react';
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

  // Sync navigation with Browser & Android Hardware Back Button
  useEffect(() => {
    // Replace initial state
    window.history.replaceState({ page: 'wizard', step: 1 }, '');

    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        if (event.state.page) {
          setCurrentPage(event.state.page);
        }
        if (event.state.step) {
          setCurrentStep(event.state.step);
        }
      } else {
        // Fallback: If hardware back button is pressed without state, go back cleanly inside app
        setCurrentPage((prevPage) => {
          if (prevPage === 'order') return 'live-browser';
          if (prevPage === 'live-browser' || prevPage === 'photo-showcase' || prevPage === 'packages' || prevPage === 'video-faq') {
            return 'dashboard';
          }
          if (prevPage === 'wizard') {
            setCurrentStep((prevStep) => (prevStep > 1 ? ((prevStep - 1) as WizardStep) : 1));
            return 'wizard';
          }
          return 'dashboard';
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard navigation for Laptop / Desktop computers (Left/Right Arrows, Space, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (currentPage === 'wizard') {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          handleNextStep();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevStep();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          navigateTo('dashboard');
        }
      } else if (currentPage !== 'dashboard' && e.key === 'Escape') {
        navigateTo('dashboard');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, currentStep]);

  // Navigate with browser history synchronization (prevents phone exit on back button)
  const navigateTo = (page: AppPage, step: WizardStep = currentStep) => {
    if (page !== currentPage || (page === 'wizard' && step !== currentStep)) {
      window.history.pushState({ page, step }, '');
    }
    setCurrentPage(page);
    if (page === 'wizard') {
      setCurrentStep(step);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Handlers for wizard navigation
  const handleNextStep = () => {
    if (currentStep < 5) {
      const next = (currentStep + 1) as WizardStep;
      if (next === 5) {
        navigateTo('dashboard');
      } else {
        navigateTo('wizard', next);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      const prev = (currentStep - 1) as WizardStep;
      navigateTo('wizard', prev);
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
    <div className="relative min-h-screen bg-white text-[#111111] antialiased font-sans selection:bg-[#FF9D14] selection:text-white flex flex-col justify-between">
      {/* Quiet Luxury Ambient Lighting */}
      <BackgroundGlows />

      {/* Floating Live Support Widget - Visible on Every Screen */}
      <LiveSupportWidget />

      {/* Background Website Dashboard Screen */}
      {(currentPage === 'dashboard' || currentPage === 'wizard') && (
        <div className={currentPage === 'wizard' ? 'pointer-events-none select-none' : ''}>
          <MainPreviewZone 
            onBackToWizard={() => {
              navigateTo('wizard', 1);
            }}
            onOpenLiveBrowser={() => navigateTo('live-browser')}
            onOpenPhotoShowcase={() => navigateTo('photo-showcase')}
            onOpenPackages={() => navigateTo('packages')}
            onOpenVideoFaq={() => navigateTo('video-faq')}
            onOpenOrderModal={handleOpenOrderWithDemo}
          />
        </div>
      )}

      {/* Floating Hover Screen for Slides (Solid Gallery Off-White Canvas) */}
      {currentPage === 'wizard' && (
        <div 
          id="slides-hover-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-[#F5F6F9] animate-fadeIn"
        >
          {/* Subtle architectural depth accents on the solid white canvas */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {/* Soft architectural grid pattern in subtle warm tone */}
            <div 
              className="absolute inset-0 opacity-[0.4]" 
              style={{
                backgroundImage: 'radial-gradient(#D6D7DC 0.75px, transparent 0.75px)',
                backgroundSize: '24px 24px'
              }} 
            />
            {/* Subtle warm sunny halo centered behind the pure white slide */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] lg:w-[1000px] h-[540px] lg:h-[700px] bg-gradient-to-tr from-[#FF9D14]/6 via-[#FEB74F]/4 to-transparent rounded-full blur-3xl" />
          </div>

          {/* Elevated Pure Snow-White Presentation Slide Card (#FFFFFF) - Tailored for Mobile, Tablet, & Laptop/MacBook */}
          <div className="relative w-full max-w-2xl sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl bg-white rounded-3xl sm:rounded-[2rem] lg:rounded-[2.25rem] border border-[#EDEDEF] shadow-[0_25px_65px_-12px_rgba(0,0,0,0.08),0_8px_24px_-6px_rgba(0,0,0,0.04),0_0_0_1px_rgba(255,255,255,1)_inset] ring-1 ring-black/[0.04] p-5 sm:p-7 md:p-8 lg:p-10 xl:p-12 animate-slideUpModal overflow-hidden flex flex-col justify-between max-h-[94vh] sm:max-h-[90vh] lg:min-h-[580px] xl:min-h-[620px] z-10 transition-all duration-300">
            {/* Jewel accent bar across top of card */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9D14] via-[#FEB74F] to-[#E91311]" />

            {/* Subtle inner ambient light reflections */}
            <div className="absolute -top-20 -left-20 w-52 h-52 bg-[#FF9D14]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-[#FEB74F]/5 rounded-full blur-2xl pointer-events-none" />

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

            {/* Micro Slide Deck Indicators - Sleek 4 Dots + Desktop Keyboard hints */}
            <div className="w-full flex items-center justify-between pt-3 border-t border-[#EDEDEF] mt-2 select-none shrink-0">
              <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#888888] font-mono">
                <span>কীবোর্ড দিয়ে চালান:</span>
                <kbd className="px-1.5 py-0.5 bg-[#F5F5F7] border border-[#EDEDEF] rounded font-semibold text-[#111111] shadow-2xs">←</kbd>
                <kbd className="px-1.5 py-0.5 bg-[#F5F5F7] border border-[#EDEDEF] rounded font-semibold text-[#111111] shadow-2xs">→</kbd>
              </div>

              <div className="flex items-center justify-center gap-2 mx-auto lg:mx-0">
                {[1, 2, 3, 4].map((stepNum) => (
                  <button
                    key={stepNum}
                    onClick={() => navigateTo('wizard', stepNum as WizardStep)}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      currentStep === stepNum 
                        ? 'w-7 h-2 bg-gradient-to-r from-[#FF9D14] to-[#FEB74F] shadow-[0_2px_8px_rgba(255,157,20,0.4)]' 
                        : 'w-2 h-2 bg-[#EDEDEF] hover:bg-[#888888]/40'
                    }`}
                    aria-label={`Go to slide ${stepNum}`}
                  />
                ))}
              </div>

              <div className="hidden lg:flex items-center gap-2 text-[11px] text-[#888888]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                <span className="font-medium">Laptop Mode</span>
              </div>
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
