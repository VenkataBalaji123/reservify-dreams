
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SectionBanner from '@/components/ui/section-banner';
import PremiumServiceCards from '@/components/services/PremiumServiceCards';

const PremiumServices = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionBanner
          title="Exclusive Premium Services"
          subtitle="Discover extraordinary experiences and personalized assistance that elevate your journey"
          image="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80"
          height="large"
        />

        <div className="text-center mb-12 animate-fade-in section-bg rounded-xl py-8 mt-8" 
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518770660439-4636190af475?q=80)' }}>
          <div className="px-6 py-12">
            <h1 className="text-3xl font-bold text-white mb-4">Our Premium Offerings</h1>
            <p className="text-white/90 max-w-3xl mx-auto">
              Take advantage of our exclusive services designed to make your travel and entertainment
              experiences extraordinary and hassle-free.
            </p>
          </div>
        </div>

        <PremiumServiceCards />
      </div>
    </div>
  );
};

export default PremiumServices;
