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

      {/* Floating Hover Screen for Slides (Solid Gallery Off-White Canvas) */}
      {currentPage === 'wizard' && (
        <div 
          id="slides-hover-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#F5F6F9] animate-fadeIn"
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[540px] bg-gradient-to-tr from-[#FF9D14]/6 via-[#FEB74F]/4 to-transparent rounded-full blur-3xl" />
          </div>

          {/* Elevated Pure Snow-White Presentation Slide Card (#FFFFFF) */}
          <div className="relative w-full max-w-2xl sm:max-w-3xl lg:max-w-[820px] bg-white rounded-3xl sm:rounded-[2rem] border border-[#EDEDEF] shadow-[0_25px_65px_-12px_rgba(0,0,0,0.08),0_8px_24px_-6px_rgba(0,0,0,0.04),0_0_0_1px_rgba(255,255,255,1)_inset] ring-1 ring-black/[0.04] p-5 sm:p-7 md:p-8 animate-slideUpModal overflow-hidden flex flex-col justify-between max-h-[92vh] sm:max-h-[88vh] z-10">
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

            {/* Micro Slide Deck Indicators - Sleek 4 Dots */}
            <div className="w-full flex items-center justify-center gap-2 pt-3 border-t border-[#EDEDEF] mt-2 select-none shrink-0">
              {[1, 2, 3, 4].map((stepNum) => (
                <button
                  key={stepNum}
                  onClick={() => setCurrentStep(stepNum as WizardStep)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    currentStep === stepNum 
                      ? 'w-7 h-2 bg-gradient-to-r from-[#FF9D14] to-[#FEB74F] shadow-[0_2px_8px_rgba(255,157,20,0.4)]' 
                      : 'w-2 h-2 bg-[#EDEDEF] hover:bg-[#888888]/40'
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
