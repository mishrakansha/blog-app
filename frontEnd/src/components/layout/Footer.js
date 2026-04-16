import { Link } from "react-router-dom";

const Footer = () => {
  const categories = ["Technology", "Lifestyle", "Travel", "Food", "Health", "Business"];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">✍️ InkWell</Link>
            <p className="footer-tagline">
              A place for curious minds to share ideas, stories, and knowledge with the world.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Twitter">🐦</a>
              <a href="#" className="social-link" aria-label="GitHub">💻</a>
              <a href="#" className="social-link" aria-label="LinkedIn">💼</a>
            </div>
          </div>

          {/* Explore */}
          <div className="footer-col">
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li><Link to="/explore">All Posts</Link></li>
              <li><Link to="/explore?sort=-views">Trending</Link></li>
              <li><Link to="/explore?sort=-createdAt">Latest</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link to={`/explore?category=${cat}`}>{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} InkWell. Built with ❤️ using React & Node.js</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
