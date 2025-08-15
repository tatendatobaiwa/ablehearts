import { Routes, Route } from "react-router-dom"; 
import Header from './components/Header/Header.jsx';
import Footer from "./components/Footer/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import MobileOptimizer from "./components/MobileOptimizer.jsx";
import SecurityProvider from "./components/SecurityProvider.jsx";
import CookieConsent from "./components/CookieConsent.jsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.jsx";
import ProgramsAndInitiatives from "./pages/ProgramsAndInitiatives/ProgramsAndInitiatives.jsx";
import GetInvolved from "./pages/GetInvolved/GetInvolved.jsx";
import Shop from "./pages/Shop/Shop.jsx";
import AboutUs from "./pages/AboutUs/AboutUs.jsx";
import TermsOfUse from "./pages/TermsOfUse/TermsOfUse.jsx";
import Home from "./pages/Home/Home.jsx";
import Gallery from "./pages/Gallery/Gallery.jsx";
import UBApp from "./pages/UBApp/UBApp.jsx";
import BIUSTApp from "./pages/BIUSTApp/BIUSTApp.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy.jsx";
import './App.css';



/**
 * Main App component with error boundary protection
 * Handles routing and provides global context providers
 */
function App() {
  return (
    <ErrorBoundary>
      <SecurityProvider>
        <MobileOptimizer>
          <div className="app-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <ScrollToTop />
            <ErrorBoundary fallback={<div>Header failed to load</div>}>
              <Header />
            </ErrorBoundary>
            
            <main role="main" style={{ flex: '1 0 auto' }}>
              <ErrorBoundary fallback={<div>Page failed to load</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/programs-and-initiatives" element={<ProgramsAndInitiatives />} />
                  <Route path="/get-involved" element={<GetInvolved />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/terms-of-use" element={<TermsOfUse />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/ablehearts-ub" element={<UBApp />} />
                  <Route path="/ablehearts-biust" element={<BIUSTApp />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                </Routes>
              </ErrorBoundary>
            </main>
            
            <ErrorBoundary fallback={<div>Footer failed to load</div>}>
              <Footer />
            </ErrorBoundary>
            <CookieConsent />
          </div>
        </MobileOptimizer>
      </SecurityProvider>
    </ErrorBoundary>
  );
}

export default App;
