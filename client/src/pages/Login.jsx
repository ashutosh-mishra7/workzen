import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, Zap } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  /* ================= VALIDATION ================= */

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  /* ================= HANDLE SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await login(
        form.email.trim(),
        form.password
      );

      toast.success("Welcome back to WorkZen!");

      navigate("/dashboard");

    } catch (err) {

      console.log("LOGIN ERROR:", err.response);

      let message =
        err.response?.data?.message ||
        "Wrong email or password. Please check and try again.";

      // Show toast
      toast.error(message);

      // Show inline error
      setErrors({
        email: "",
        password: message,
        general: message,
      });

    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

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
        <div className="rounded-2xl border border-[#374151] bg-[#111827] p-8 shadow-2xl">

          <h1 className="text-2xl font-bold text-[#F9FAFB] mb-1">
            Welcome back
          </h1>

          <p className="text-sm text-[#9CA3AF] mb-6">
            Sign in to your account
          </p>

          {/* General Error */}
          {errors.general && (
            <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

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
                  errors.email || errors.general
                    ? "border-red-500"
                    : "border-[#374151]"
                }`}
              />

              {errors.email && (
                <p className={errorClass}>
                  {errors.email}
                </p>
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
                  placeholder="••••••••"
                  className={`${inputClass} pr-10 ${
                    errors.password || errors.general
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
                  {showPass
                    ? <EyeOff size={16} />
                    : <Eye size={16} />}
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
              className="
                w-full py-3 rounded-lg font-semibold text-sm
                bg-[#F9FAFB]
                text-[#111827]
                hover:bg-[#E5E7EB]
                transition
                disabled:opacity-60
              "
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

          <p className="text-center text-sm text-[#9CA3AF] mt-8">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-[#F9FAFB] font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;