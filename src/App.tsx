import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Vision from './components/Vision';
import Features from './components/Features';
import GlobalScale from './components/GlobalScale';
import Traction from './components/Traction';
import Team from './components/Team';
import Investment from './components/Investment';
import SelectInvestors from './components/SelectInvestors';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Vision />
      <Features />
      <GlobalScale />
      <Traction />
      <Team />
      <Investment />
      <SelectInvestors />
      <Contact />
      <Footer />
    </div>
  );
}

export default App; 