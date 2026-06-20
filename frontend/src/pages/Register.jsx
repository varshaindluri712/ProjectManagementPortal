import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

function Register() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.passwordConfirm) {
      setError("All fields are required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.passwordConfirm
      );

      if (response.data.success) {
        // Save token and user
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        alert("Registration successful!");
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">📝 Register</h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password (min 6 characters)"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>

              <p className="text-center mt-3">
                Already have an account?{" "}
                <a href="/login" className="text-primary">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
