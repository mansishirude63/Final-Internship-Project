import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Delicious Food Delivered To Your Door</h1>

        <p>
          Fresh, tasty and affordable meals delivered quickly to your home.
        </p>

        <div className="hero-buttons">
          <Link to="/menu">
            <button className="btn-order">Order Now</button>
          </Link>

          <Link to="/menu">
            <button className="btn-menu">View Menu</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;