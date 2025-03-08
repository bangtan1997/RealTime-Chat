import axios from "axios";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const AuthPage = ({ onAuth }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      setError("Username is required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/authenticate", {
        username,
      });
      onAuth({ ...response.data, secret: username });
    } catch (error) {
      console.error("Auth Error", error);
      setError("Authentication failed. Please try again.");
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="background">
      <form onSubmit={onSubmit} className="form-card">
        <div className="form-title">Welcome 👋</div>
        <div className="form-subtitle">Set a username to get started</div>
        <div className="auth">
          <div className="auth-label">Username</div>
          <input
            className="auth-input"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="auth-button" type="submit">
            Enter
          </button>
        </div>
      </form>
      {error && <div className={`notification ${error ? '' : 'hidden'}`}>{error}</div>}
    </div>
  );
};

AuthPage.propTypes = {
  onAuth: PropTypes.func.isRequired,
};

export default AuthPage;