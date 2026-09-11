import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { saveAuthToken } from "../utils/auth";
import { validateLogin } from "../utils/validation";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateLogin({ email, password });

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login({ email: email.trim(), password });
      saveAuthToken(response);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      const errorMessage = requestError.response?.data?.message || "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#160b2a] px-5 py-10 font-sans text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#8b263d_0%,transparent_42%),radial-gradient(circle_at_85%_86%,#4767c8_0%,transparent_36%),radial-gradient(circle_at_5%_90%,#763a51_0%,transparent_40%)]" />

      <div className="relative w-full max-w-sm">
        <div className="rounded-[3.5rem_3.5rem_5rem_5rem] border border-white/10 bg-linear-to-br from-white/15 via-rose-300/15 to-indigo-300/45 p-8 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-9">
          <div className="mb-8 flex justify-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/25 bg-white/30 text-slate-800 shadow-inner shadow-white/20">
              <UserRound className="h-16 w-16 stroke-[1.25]" />
            </div>
          </div>

          <div className="w-full space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="text-xl font-semibold tracking-wide text-white">
                Welcome back
              </h2>

              <p className="text-sm text-white/60">
                Sign in to your inventory portal
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="relative border-b border-white/70">
                <div className="pointer-events-none absolute inset-y-0 left-1.5 flex items-center text-slate-800">
                  <Mail className="h-4 w-4" />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  placeholder="Email ID"
                  className="block w-full bg-transparent py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/85 focus:outline-none"
                />
              </div>

              <div className="relative border-b border-white/70">
                <div className="pointer-events-none absolute inset-y-0 left-1.5 flex items-center text-slate-800">
                  <Lock className="h-4 w-4" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Password"
                  className="block w-full bg-transparent py-3 pl-12 pr-12 text-sm text-white placeholder:text-white/85 focus:outline-none"
                />

                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-1 text-slate-700 hover:text-slate-950"
                  onClick={() => setShowPassword((isVisible) => !isVisible)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {error && <p className="text-center text-sm text-rose-100">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#56052e] via-[#61285e] to-[#5d75dc] px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-indigo-950/30 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/70"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="pt-2 text-center">
              <p className="text-sm text-white/75">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-white underline underline-offset-4 hover:opacity-75"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
