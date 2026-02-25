import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, Zap } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(form.name.trim())) {
      newErrors.name = "Name can only contain letters";
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      newErrors.email = "Enter a valid email address";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    } else if (form.password.length > 50) {
      newErrors.password =
        "Password cannot exceed 50 characters";
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(form.password)) {
      newErrors.password =
        "Password must contain letters and numbers";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors");
      return;
    }

    setLoading(true);

    try {
      await register(
        form.name.trim(),
        form.email.trim(),
        form.password
      );

      toast.success(
        "Account created successfully! Welcome to WorkZen"
      );

      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    w-full px-4 py-3 rounded-lg text-sm
    bg-[#0B0F19]
    border
    text-[#F9FAFB]
    outline-none
    transition-colors
  `;

  const errorClass = "text-xs text-red-500 mt-1";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0B0F19]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1F2937]">
            <Zap size={20} color="#F9FAFB" />
          </div>

          <span className="text-2xl font-bold text-[#F9FAFB]">
            WorkZen
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#374151] bg-[#111827] p-8 shadow-2xl shadow-black/40">
          <h1 className="text-2xl font-bold text-[#F9FAFB] mb-1">
            Create account
          </h1>

          <p className="text-sm text-[#9CA3AF] mb-6">
            Get started with WorkZen for free
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-1.5">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`${inputClass} ${
                  errors.name
                    ? "border-red-500"
                    : "border-[#374151]"
                }`}
              />

              {errors.name && (
                <p className={errorClass}>{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-1.5">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`${inputClass} ${
                  errors.email
                    ? "border-red-500"
                    : "border-[#374151]"
                }`}
              />

              {errors.email && (
                <p className={errorClass}>{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-1.5">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`${inputClass} pr-10 ${
                    errors.password
                      ? "border-red-500"
                      : "border-[#374151]"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPass(!showPass)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                >
                  {showPass ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className={errorClass}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-sm bg-[#F9FAFB] text-[#111827] hover:bg-[#E5E7EB] transition disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-[#9CA3AF] mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#F9FAFB] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;