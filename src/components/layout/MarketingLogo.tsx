"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MarketingLogo() {
  const { scrollY } = useScroll();
  const [isClient, setIsClient] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setIsClient(true);
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const isMobile = windowWidth < 768;
  const paddingLeft = isMobile ? 16 : 32;
  const logoWidth = 140; 
  const targetScale = isMobile ? 1.5 : 2.2;
  
  const targetX = (windowWidth / 2) - (paddingLeft + (logoWidth * targetScale) / 2);
  const targetY = isMobile ? 60 : 80;

  const x = useTransform(scrollY, [0, 150], [targetX, 0]);
  const y = useTransform(scrollY, [0, 150], [targetY, 0]);
  const scale = useTransform(scrollY, [0, 150], [targetScale, 1]);

  if (!isClient) {
    return (
      <Link href="/" className="font-heading text-headline-md font-bold text-primary w-[140px] block">
        KeepsDSA
      </Link>
    );
  }

  return (
    <motion.div 
      style={{ x, y, scale }}
      className="origin-left z-50"
    >
      <Link href="/" className="font-heading text-headline-md font-bold text-primary w-[140px] block">
        KeepsDSA
      </Link>
    </motion.div>
  );
}
