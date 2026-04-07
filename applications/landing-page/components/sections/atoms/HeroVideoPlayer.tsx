'use client';

import { Play } from 'lucide-react';
import { useState } from 'react';

import { useLazyVideo } from '@/hooks/use-lazy-video';
import { cn } from '@/lib/utils';

export function HeroVideoPlayer() {
  // Video state
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Lazy video hook - loads when 10% visible with 200px margin
  const { containerRef, videoRef, shouldLoad, hasLoaded } = useLazyVideo({
    threshold: 0.1,
    rootMargin: '200px',
    eager: false,
  });

  const toggleMute = () => setIsMuted(!isMuted);
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex w-full justify-center lg:w-5/12"
    >
      <div
        className={cn(
          'relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl lg:max-h-[70vh]',
          'bg-transparent',
          'border border-white/[0.04] shadow-xl shadow-black/20',
          'transition-all duration-700',
          !shouldLoad && 'animate-pulse bg-white/[0.03]',
          hasLoaded && 'shadow-black/30'
        )}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Loading placeholder */}
        {!shouldLoad && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground/40">
              <Play className="h-12 w-12" />
              <span className="text-xs uppercase tracking-widest">
                Loading Video
              </span>
            </div>
          </div>
        )}

        {/* Video element with lazy loading */}
        {shouldLoad && (
          <>
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              onLoadedData={() => {}}
              poster="/videos/hero-poster.jpg"
            >
              {/* Multiple sources for browser compatibility */}
              <source src="/videos/output-blurred.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video overlay controls */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20',
                'transition-opacity duration-300',
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
              )}
            >
              {/* Top right controls */}
              <div className="absolute right-4 top-4 flex gap-2">
                <button
                  onClick={toggleMute}
                  className="rounded-full bg-black/40 p-2 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={togglePlay}
                  className="rounded-full bg-black/40 p-2 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? (
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Play button overlay (center, when paused) */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={togglePlay}
                  className="group rounded-full bg-white/20 p-5 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/30"
                  aria-label="Play video"
                >
                  <Play className="h-8 w-8 fill-white transition-transform duration-300 group-hover:scale-110" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Decorative border glow */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 rounded-2xl',
            'border border-white/[0.04]',
            'transition-opacity duration-700',
            hasLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      </div>
    </div>
  );
}
