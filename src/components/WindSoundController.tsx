import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const STRONG_WIND_URL = "https://assets.mixkit.co/sfx/preview/mixkit-wind-blowing-swoosh-1159.mp3";
const CHILL_WIND_URL = "https://assets.mixkit.co/sfx/preview/mixkit-cold-winter-wind-1168.mp3";

const WindSoundController: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const strongWindRef = useRef<HTMLAudioElement | null>(null);
  const chillWindRef = useRef<HTMLAudioElement | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    strongWindRef.current = new Audio(STRONG_WIND_URL);
    strongWindRef.current.loop = false;
    strongWindRef.current.volume = 0.4;

    chillWindRef.current = new Audio(CHILL_WIND_URL);
    chillWindRef.current.loop = true;
    chillWindRef.current.volume = 0; // Start silent

    return () => {
      strongWindRef.current?.pause();
      chillWindRef.current?.pause();
    };
  }, []);

  const startAudio = () => {
    if (isMuted) {
      setIsMuted(false);
      setHasInteracted(true);
      
      // Play strong wind on entry
      if (strongWindRef.current) {
        strongWindRef.current.currentTime = 0;
        strongWindRef.current.play().catch(e => console.log("Audio play blocked", e));
      }
      
      // Start chill wind loop in background
      if (chillWindRef.current) {
        chillWindRef.current.volume = 0.1; // Base ambient volume
        chillWindRef.current.play().catch(e => console.log("Audio play blocked", e));
      }
    } else {
      setIsMuted(true);
      strongWindRef.current?.pause();
      chillWindRef.current?.pause();
    }
  };

  useEffect(() => {
    if (isMuted || !hasInteracted) return;

    const handleScroll = () => {
      if (chillWindRef.current) {
        // Increase chill wind on scroll
        chillWindRef.current.volume = 0.3;
        
        // Clear previous timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Fade back to base volume after scrolling stops
        scrollTimeoutRef.current = setTimeout(() => {
          if (chillWindRef.current) {
            const fadeToAmbient = setInterval(() => {
              if (chillWindRef.current && chillWindRef.current.volume > 0.12) {
                chillWindRef.current.volume -= 0.02;
              } else {
                if (chillWindRef.current) chillWindRef.current.volume = 0.1;
                clearInterval(fadeToAmbient);
              }
            }, 50);
          }
        }, 150);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMuted, hasInteracted]);

  return (
    <div className="fixed bottom-6 left-6 z-[60]">
      <button
        onClick={startAudio}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg transition-all hover:scale-110 active:scale-95"
        title={isMuted ? "Unmute Wind Sounds" : "Mute Wind Sounds"}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default WindSoundController;
