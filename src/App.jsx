import { lazy } from "react";
import { Routes, Route } from "react-router-dom"; 
import Header from './components/Header/Header.jsx';
import Footer from "./components/Footer/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import MobileOptimizer from "./components/MobileOptimizer.jsx";
import SecurityProvider from "./components/SecurityProvider.jsx";
import CookieConsent from "./components/CookieConsent.jsx";
import CookieConsentDebug from "./components/ConsentDebug.jsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.jsx";
import LazyLoadWrapper from "./components/LoadingStates/LazyLoadWrapper.jsx";
import './App.css';

// Lazy load page components for code splitting
const Home = lazy(() => import("./pages/Home/Home.jsx"));
const ProgramsAndInitiatives = lazy(() => import("./pages/ProgramsAndInitiatives/ProgramsAndInitiatives.jsx"));
const GetInvolved = lazy(() => import("./pages/GetInvolved/GetInvolved.jsx"));
const Shop = lazy(() => import("./pages/Shop/Shop.jsx"));
const AboutUs = lazy(() => import("./pages/AboutUs/AboutUs.jsx"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse/TermsOfUse.jsx"));
const Gallery = lazy(() => import("./pages/Gallery/Gallery.jsx"));
const UBApp = lazy(() => import("./pages/UBApp/UBApp.jsx"));
const BIUSTApp = lazy(() => import("./pages/BIUSTApp/BIUSTApp.jsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy/PrivacyPolicy.jsx"));

function App() {
  return (
    <ErrorBoundary>
      <SecurityProvider>
        <MobileOptimizer>
          <div className="app-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            <ScrollToTop />
            <ErrorBoundary fallback={<div>Header failed to load</div>}>
              <Header />
            </ErrorBoundary>
            <main role="main" className="main-content">
              <ErrorBoundary fallback={<div>Page failed to load</div>}>
                <Routes>
                  <Route path="/" element={
                    <LazyLoadWrapper>
                      <Home />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/programs-and-initiatives" element={
                    <LazyLoadWrapper>
                      <ProgramsAndInitiatives />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/get-involved" element={
                    <LazyLoadWrapper>
                      <GetInvolved />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/shop" element={
                    <LazyLoadWrapper>
                      <Shop />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/about-us" element={
                    <LazyLoadWrapper>
                      <AboutUs />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/terms-of-use" element={
                    <LazyLoadWrapper>
                      <TermsOfUse />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/gallery" element={
                    <LazyLoadWrapper>
                      <Gallery />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/ablehearts-ub" element={
                    <LazyLoadWrapper>
                      <UBApp />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/ablehearts-biust" element={
                    <LazyLoadWrapper>
                      <BIUSTApp />
                    </LazyLoadWrapper>
                  } />
                  <Route path="/privacy-policy" element={
                    <LazyLoadWrapper>
                      <PrivacyPolicy />
                    </LazyLoadWrapper>
                  } />
                </Routes>
              </ErrorBoundary>
            </main>
            <ErrorBoundary fallback={<div>Footer failed to load</div>}>
              <Footer />
            </ErrorBoundary>
            <CookieConsent />
            {import.meta.env.DEV && <ErrorBoundary fallback={null}><CookieConsentDebug /></ErrorBoundary>}
          </div>
        </MobileOptimizer>
      </SecurityProvider>
    </ErrorBoundary>
  );
}

export default App;
