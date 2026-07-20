import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TranslationProvider } from './hooks/useTranslation';
import { GlobalLanguageProvider, useGlobalLanguage } from './contexts/GlobalLanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ConsultationRequestProvider } from './contexts/ConsultationRequestContext';
import { fetchContent } from './services/api';
import useScrollReveal from './hooks/useScrollReveal';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import LegalCompanion from './sections/LegalCompanion';
import KnowYourRights from './sections/KnowYourRights';
import LegalAidServices from './sections/LegalAidServices';
import SuccessStories from './sections/SuccessStories';
import Footer from './sections/Footer';
import Chatbot from './components/Chatbot';
import LanguageModal from './components/LanguageModal';
import AuthModal from './components/auth/AuthModal';
import PageLayout from './components/PageLayout';
import GoogleTranslateAPI from './components/GoogleTranslateAPI';
import PropertyRights from './pages/PropertyRights';
import LegalHelplineDirectory from './components/LegalHelplineDirectory';
import LawyerDashboard from './pages/dashboards/LawyerDashboard';
import UserDashboard from './pages/dashboards/UserDashboard_Professional';
import AdminDashboard from './pages/dashboards/AdminDashboard';

function HomePage({ content, onLanguageClick, currentLanguage, onOpenAuth, assistantOpen, setAssistantOpen, isAuthModalOpen, setIsAuthModalOpen, isModalOpen, setIsModalOpen, handleLanguageSelect }) {
  useScrollReveal();

  return (
    <main className="app-main">
      <Navbar
        onLanguageClick={onLanguageClick}
        currentLanguage={currentLanguage}
        onOpenAssistant={() => setAssistantOpen(true)}
        onOpenAuth={onOpenAuth}
      />
      <Hero />
      <LegalCompanion />
      <KnowYourRights topics={content?.topics} />
      <LegalAidServices services={content?.services} />
      <SuccessStories testimonials={content?.testimonials} />
      <Footer />
      <Chatbot
        isOpen={assistantOpen}
        onOpen={() => setAssistantOpen(true)}
        onClose={() => setAssistantOpen(false)}
      />
      <LanguageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLanguageSelect={handleLanguageSelect}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </main>
  );
}

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const { currentLanguage, changeLanguage } = useGlobalLanguage();

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const data = await fetchContent(currentLanguage);
        setContent(data);
      } catch (error) {
        console.error('Failed to load page content:', error);
        setContent({ topics: [], services: [], testimonials: [] });
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [currentLanguage]);

  const handleLanguageSelect = (languageCode) => {
    changeLanguage(languageCode);
    setIsModalOpen(false);
  };

  const handleOpenAuth = () => setIsAuthModalOpen(true);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-card">
          <div className="loading-chip" aria-hidden="true" />
          <div>Loading LegalAid India</div>
          <div className="loading-bar" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <TranslationProvider initialLanguage={currentLanguage}>
      <Router>
        <div className="App app-shell">
          <Routes>
            <Route path="/" element={
              <HomePage
                content={content}
                onLanguageClick={() => setIsModalOpen(true)}
                currentLanguage={currentLanguage}
                onOpenAuth={handleOpenAuth}
                assistantOpen={assistantOpen}
                setAssistantOpen={setAssistantOpen}
                isAuthModalOpen={isAuthModalOpen}
                setIsAuthModalOpen={setIsAuthModalOpen}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                handleLanguageSelect={handleLanguageSelect}
              />
            } />
            <Route path="/property-rights" element={
              <PageLayout><PropertyRights /></PageLayout>
            } />
            <Route path="/legal-helpline" element={
              <PageLayout showChatbot={false}><LegalHelplineDirectory /></PageLayout>
            } />
            <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
          <GoogleTranslateAPI />
        </div>
      </Router>
    </TranslationProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <GlobalLanguageProvider>
        <ConsultationRequestProvider>
          <AppContent />
        </ConsultationRequestProvider>
      </GlobalLanguageProvider>
    </AuthProvider>
  );
}

export default App;
