import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RotatingImages from './RotatingImages';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const Token = localStorage.getItem("Token");
      if (Token) {
        navigate("/home");
      }
    };
    verifyUser();
  }, [navigate]);

  return (
    <div className="landing-page">
      <header>
        <div className="logo">
        <img src="/favicon.ico" alt="FINWISE logo" />
          <h2>Finwise</h2>
        </div>
        <nav>
          <button onClick={() => navigate('/continue')} className="nav-link">Log In</button>
          <button onClick={() => navigate('/continue?to=signup')} className="nav-button">Sign up</button>
        </nav>
      </header>

      <main className='main-landing'>
        <div className="hero-content">
          <h1>Less stress when managing finances</h1>
          <h2>with <span className="highlight">FINWISE</span>.</h2>
          <p>
  Keep track of your expenses, set budgets, and achieve your saving goals
  with ease. Perfect for individuals, families, and small
  businesses.
</p>
          <button onClick={() => navigate('/continue')} className="cta-button">
            Get Started
          </button>
        </div>
        <div className="hero-image">
          <RotatingImages />
        </div>
      </main>

      <footer>
        <div className="feature">
          <h3>Track Expenses</h3>
          <p>Easily log and categorize your spending.</p>
        </div>
        <div className="feature">
          <h3>Set Budgets</h3>
          <p>Create and stick to personalized budgets.</p>
        </div>
        <div className="feature">
    <h3>Set Saving Goals</h3>
    <p>Set and track progress towards your financial goals.</p>
  </div>
      </footer>
    </div>
  );
};

export default LandingPage;