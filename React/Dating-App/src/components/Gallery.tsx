import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryProps {
  images: string[];
}

export const Gallery = ({ images }: GalleryProps) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <Box className="relative w-full h-[400px] bg-gray-900 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <div className="absolute inset-y-0 left-0 flex items-center p-2">
            <IconButton onClick={prev} className="bg-black/20 text-white backdrop-blur">
              <ChevronLeft />
            </IconButton>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center p-2">
            <IconButton onClick={next} className="bg-black/20 text-white backdrop-blur">
              <ChevronRight />
            </IconButton>
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-white w-4' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </Box>
  );
};
