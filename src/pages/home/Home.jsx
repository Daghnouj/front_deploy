import React from "react";
import HeroSection from "./HeroSection";
import ServicesSection from "./ServicesSection";
import TherapistSection from "./TherapistSection";
import EventsSection from "./EventsSection";
import GallerySection from "./GallerySection";
import FAQSection from "./FAQSection";
import ChatBot from "./ChatBot"; 
import Talk from "./Talk";

const Home = () => {
  return (
    <div className="home-container">
      <HeroSection />
      <ServicesSection />
      <TherapistSection />
      <EventsSection />
      <GallerySection />
      <Talk />
      <FAQSection />
      <ChatBot /> 
    </div>
  );
};

export default Home;
