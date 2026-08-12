import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h2>🍽️ Restaurant</h2>
          <p>
            Fresh and delicious food delivered to your doorstep.
            Thank you for choosing us!
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <Link
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Home
              </Link>
            </li>

            <li>
              <Link to="/menu">Menu</Link>
            </li>

            <li>
              <Link to="/cart">Cart</Link>
            </li>

            <li>
              <Link to="/orders">Orders</Link>
            </li>

            <li>
              <Link to="/accounts/login">Login</Link>
            </li>
          </ul>

        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>📍 Pune, Maharashtra</p>
          <p>📞 +91 9876543210</p>
          <p>📧 restaurant@gmail.com</p>
        </div>

      </div>

      <hr />

      <p className="copyright">
        © 2026 Restaurant Ordering System. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;