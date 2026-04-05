import { useEffect, useRef, useState } from 'react';

const WindSoundController = () => {
      const audioRef = useRef<HTMLAudioElement | null>(null);
      const [isPlaying, setIsPlaying] = useState(false);

      useEffect(() => {
              audioRef.current = new Audio('/wind.mp3');
              audioRef.current.loop = true;
              audioRef.current.volume = 0.2;

                    return () => {
                              if (audioRef.current) {
                                          audioRef.current.pause();
                                          audioRef.current = null;
                              }
                    };
      }, []);

      const toggle = () => {
              if (!audioRef.current) return;
              if (isPlaying) {
                        audioRef.current.pause();
                        setIsPlaying(false);
              } else {
                        audioRef.current.play().catch(() => {});
                        setIsPlaying(true);
              }
      };

      return (
              <button
                        onClick={toggle}
                        className="fixed bottom-4 left-4 z-50 bg-black/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm hover:bg-black/60 transition"
                        title={isPlaying ? 'Mute wind sound' : 'Play wind sound'}
                      >
                  {isPlaying ? 'Sound ON' : 'Sound OFF'}
              </button>button>
            );
};

export default WindSoundController;</button>
