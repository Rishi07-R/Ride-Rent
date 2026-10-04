import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Rent Your Ride</h1>
          <p>Choose your vehicle, pick your dates, and start your journey.</p>
          <Link to="/vehicles" className="hero-button">
            Explore Vehicles
          </Link>
        </div>
      </section>

      <section className="categories">
        <h2>Choose Your Vehicle</h2>
        <div className="category-container">
          <div className="category-card">
            <div className="category-icon">🚗</div>
            <h3>Cars</h3>
            <p>Comfortable cars for your everyday journeys.</p>
            <Link to="/vehicles">View Cars</Link>
          </div>

          <div className="category-card">
            <div className="category-icon">🏍️️</div>
            <h3>Bikes</h3>
            <p>Quick and affordable bikes for city travel.</p>
            <Link to="/vehicles">View Bikes</Link>
          </div>

          <div className="category-card">
            <div className="category-icon">🛵</div>
            <h3>Scooters</h3>
            <p>Easy and convenient scooters for short trips.</p>
            <Link to="/vehicles">View Scooters</Link>
          </div>
        </div>
      </section>

      <section className="why-us">
        <h2>Why Choose Us?</h2>
        <div className="features">
          <div className="feature">
            <h3>Wide Range</h3>
            <p>Choose from cars, bikes, and scooters according to your needs.</p>
          </div>
          <div className="feature">
            <h3>Affordable Prices</h3>
            <p>Get reliable vehicles at reasonable daily rental prices.</p>
          </div>
          <div className="feature">
            <h3>Easy Booking</h3>
            <p>Select your vehicle and dates and complete your booking easily.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;