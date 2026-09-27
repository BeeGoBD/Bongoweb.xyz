import { useState, useRef } from 'react';
import { 
  ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize2, 
  ChevronDown, Headphones, MessageCircle, Phone, ArrowRight, CheckCircle2, Film, Sparkles 
} from 'lucide-react';
import { VIDEO_FAQ_ITEMS } from '../data/videoFaqData';

interface VideoFaqPageProps {
  onBack: () => void;
  onOpenOrder?: (itemTitle?: string) => void;
  onOpenPackages?: () => void;
}

export default function VideoFaqPage({ onBack, onOpenOrder, onOpenPackages }: VideoFaqPageProps) {
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [durationSec, setDurationSec] = useState<number>(0);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  const explainerVideo = {
    title: 'Project Overview & Interactive Website Demo',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80'
  };

  const handleToggleFaq = (id: string) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSpeedChange = () => {
    if (!videoRef.current) return;
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    videoRef.current.playbackRate = nextSpeed;
    setPlaybackSpeed(nextSpeed);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 1;
    setCurrentTimeSec(current);
    setProgress((current / total) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDurationSec(videoRef.current.duration || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTo = (parseFloat(e.target.value) / 100) * (videoRef.current.duration || 1);
    videoRef.current.currentTime = seekTo;
    setProgress(parseFloat(e.target.value));
  };

  const handleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      playerContainerRef.current.requestFullscreen();
    }
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div 
      id="video-faq-page"
      className="min-h-screen w-full bg-[#0A0A0A] text-[#F5F5F5] flex flex-col font-sans transition-colors duration-300"
    >
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#2A2A2A] shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] text-[#F5F5F5] text-xs sm:text-sm font-semibold transition-all border border-[#2A2A2A] cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4 text-[#A0A0A0]" />
            <span>← Return to Dashboard</span>
          </button>

          <span className="text-xs font-semibold text-[#A0A0A0]">
            Video Explainer & Client Inquiries
          </span>
        </div>
      </header>

      {/* 2. Main Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 animate-fadeIn">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20 mb-2 shadow-2xs">
            <Film className="w-3.5 h-3.5 text-white" />
            <span>Knowledge Center</span>
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Video Guide & Project{' '}
            <span className="text-white underline decoration-white/40 underline-offset-8">
              Questions
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Watch our complete project walkthrough or read through common client questions.
          </p>
        </div>

        {/* Video Player Box */}
        <div 
          ref={playerContainerRef}
          className="relative w-full rounded-3xl bg-[#141414] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/10 ring-1 ring-white/5 mb-10 group"
        >
          <video
            ref={videoRef}
            src={explainerVideo.src}
            poster={explainerVideo.poster}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
            className="w-full aspect-16/9 object-cover cursor-pointer"
          />

          {/* Big Center Play Button Overlay (when paused) */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white hover:bg-neutral-200 text-black flex items-center justify-center shadow-2xl transition-all hover:scale-108 cursor-pointer backdrop-blur-sm ring-4 ring-black/40"
              aria-label="Play Video"
            >
              <Play className="w-6 h-6 fill-black ml-1 text-black" />
            </button>
          )}

          {/* Minimal Player Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2 opacity-95 transition-opacity">
            {/* Scrubber */}
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
            />

            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="hover:text-neutral-300 cursor-pointer transition-colors">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button onClick={toggleMute} className="hover:text-neutral-300 cursor-pointer transition-colors">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-[11px] font-mono text-neutral-400">
                  {formatTime(currentTimeSec)} / {formatTime(durationSec)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={handleSpeedChange} 
                  className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-[10px] font-mono font-semibold cursor-pointer transition-colors"
                >
                  {playbackSpeed}x
                </button>
                <button onClick={handleFullscreen} className="hover:text-neutral-300 cursor-pointer transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="space-y-3 mb-10">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <span>Frequently Asked Questions</span>
          </h2>

          {VIDEO_FAQ_ITEMS.map((item) => {
            const isExpanded = expandedFaqId === item.id;
            return (
              <div 
                key={item.id} 
                className="rounded-2xl border border-white/10 bg-[#141414] overflow-hidden shadow-xs transition-all hover:border-white/30"
              >
                <button
                  onClick={() => handleToggleFaq(item.id)}
                  className="w-full p-4 sm:p-5 text-left font-semibold text-xs sm:text-sm text-white flex items-center justify-between hover:bg-[#1A1A1A] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <span className="font-mono text-xs text-white font-bold bg-white/10 border border-white/20 px-2 py-0.5 rounded">
                      {item.code}
                    </span>
                    <span>{item.question}</span>
                  </div>
                  <div className="w-6 h-6 rounded-lg bg-[#1A1A1A] flex items-center justify-center shrink-0">
                    <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs text-neutral-400 border-t border-white/10 bg-[#0A0A0A] leading-relaxed space-y-3 animate-fadeIn">
                    <p className="font-semibold text-white">{item.headline}</p>
                    <p>{item.summary}</p>
                    {item.keyPoints && item.keyPoints.length > 0 && (
                      <ul className="space-y-1.5 pt-2 border-t border-white/10">
                        {item.keyPoints.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-white">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono pt-2">
                      <span>Duration: {item.duration}</span>
                      <span>·</span>
                      <span>Category: {item.categoryLabel}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Block */}
        <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white">Ready to launch your website?</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Explore our packages starting from ৳999 BDT or order directly.</p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onOpenPackages && (
              <button
                onClick={onOpenPackages}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-white/20 hover:bg-[#1A1A1A] text-xs font-bold text-white cursor-pointer transition-colors shadow-2xs"
              >
                View Packages
              </button>
            )}

            {onOpenOrder && (
              <button
                onClick={() => onOpenOrder('Standard Starter Website')}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Order Website</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
