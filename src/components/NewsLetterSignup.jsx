import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    if (!email.includes('@') || !email.includes('.')) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      // Check if email already exists
      const q = query(collection(db, 'newsletter_subscribers'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setMessage('You are already subscribed!');
        setLoading(false);
        setTimeout(() => setMessage(''), 3000);
        return;
      }

      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: email,
        subscribedAt: serverTimestamp(),
      });
      setEmail('');
      setMessage('Thanks for subscribing!');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error adding document: ", error);
      }
      setMessage('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
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
        <p style={{ marginTop: '10px', color: message.includes('Thanks') ? '#2ecc71' : '#e74c3c' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default NewsletterSignup;