import { useState } from 'react';
import { db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Improved email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Clear message after delay
  const clearMessageAfterDelay = () => {
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    // Improved email validation
    if (!isValidEmail(email)) {
      setMessage('Please enter a valid email address.');
      clearMessageAfterDelay();
      return;
    }

    setLoading(true);
    
    try {
      // Check if email already exists - this query should use your index
      const q = query(collection(db, 'newsletter_subscribers'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setMessage('You are already subscribed!');
        clearMessageAfterDelay();
        return;
      }

      // Add new subscriber
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: email.toLowerCase().trim(), // Normalize email
        subscribedAt: serverTimestamp(),
        status: 'active' // Add status field for better management
      });

      setEmail('');
      setMessage('Thanks for subscribing!');
      clearMessageAfterDelay();

    } catch (error) {
      console.error("Newsletter subscription error: ", error);
      
      // More specific error handling
      if (error.code === 'permission-denied') {
        setMessage('Permission denied. Please check your connection.');
      } else if (error.code === 'unavailable') {
        setMessage('Service temporarily unavailable. Please try again.');
      } else {
        setMessage('Failed to subscribe. Please try again.');
      }
      
      clearMessageAfterDelay();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newsletter-text">
      <h3>Stay Updated!</h3>
      <p>
        Sign up for our newsletter to receive the latest news and updates directly to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="newsletter-input"
          required
          disabled={loading}
        />
        <button type="submit" className="newsletter-button" disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p style={{ 
          marginTop: '10px', 
          color: message.includes('Thanks') ? '#2ecc71' : '#e74c3c',
          fontSize: '14px'
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default NewsletterSignup;