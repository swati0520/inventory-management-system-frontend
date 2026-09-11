
import { Eye, EyeOff, Lock, Mail, User, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../services/authService";
import { saveAuthToken } from "../utils/auth";
import { validateRegistration } from "../utils/validation";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const updateField = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
      submit: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateRegistration(formData);
    if (Object.keys(errors).length) return setErrors(errors);

    setIsSubmitting(true);
    setErrors({});

    try {
      const details = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      await register(details);
      const response = await login(details);

      saveAuthToken(response);
      navigate("/login", { replace: true });
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "Unable to create your account. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#160b2a] px-5 py-10 font-sans text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#8b263d_0%,transparent_42%),radial-gradient(circle_at_85%_86%,#4767c8_0%,transparent_36%),radial-gradient(circle_at_5%_90%,#763a51_0%,transparent_40%)]" />

      <div className="relative w-full max-w-sm">
        <div className="rounded-[3.5rem_3.5rem_5rem_5rem] border border-white/10 bg-gradient-to-br from-white/15 via-rose-300/15 to-indigo-300/45 p-8 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-9">
          <div className="mb-7 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/25 bg-white/30 text-slate-800 shadow-inner shadow-white/20">
              <UserRound className="h-14 w-14 stroke-[1.25]" />
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-1 text-center">
              <h1 className="text-xl font-semibold tracking-wide text-white">
                Create account
              </h1>

              <p className="text-sm text-white/60">
                Set up your inventory portal access
              </p>
            </div>

            <form
              className="space-y-4"
              onSubmit={handleSubmit}
              noValidate
            >
              <div>
                <div
                  className={`relative border-b ${errors.name ? "border-red-400" : "border-white/70"
                    }`}
                >
                  <User className="pointer-events-none absolute inset-y-0 left-1.5 my-auto h-4 w-4 text-slate-800" />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={updateField}
                    placeholder="Full name"
                    className="block w-full bg-transparent py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/85 focus:outline-none"
                  />
                </div>

                {errors.name && (
                  <p className="mt-1 text-xs text-red-300">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <div
                  className={`relative border-b ${errors.email ? "border-red-400" : "border-white/70"
                    }`}
                >
                  <Mail className="pointer-events-none absolute inset-y-0 left-1.5 my-auto h-4 w-4 text-slate-800" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={updateField}
                    placeholder="Email ID"
                    className="block w-full bg-transparent py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/85 focus:outline-none"
                  />
                </div>

                {errors.email && (
                  <p className="mt-1 text-xs text-red-300">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div
                  className={`relative border-b ${errors.password ? "border-red-400" : "border-white/70"
                    }`}
                >
                  <Lock className="pointer-events-none absolute inset-y-0 left-1.5 my-auto h-4 w-4 text-slate-800" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={updateField}
                    placeholder="Password"
                    className="block w-full bg-transparent py-3 pl-12 pr-12 text-sm text-white placeholder:text-white/85 focus:outline-none"
                  />

                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-1 text-slate-700 hover:text-slate-950"
                    onClick={() => setShowPassword((isVisible) => !isVisible)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-xs text-red-300">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <div
                  className={`relative border-b ${errors.confirmPassword
                      ? "border-red-400"
                      : "border-white/70"
                    }`}
                >
                  <Lock className="pointer-events-none absolute inset-y-0 left-1.5 my-auto h-4 w-4 text-slate-800" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={updateField}
                    placeholder="Confirm password"
                    className="block w-full bg-transparent py-3 pl-12 pr-12 text-sm text-white placeholder:text-white/85 focus:outline-none"
                  />

                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-1 text-slate-700 hover:text-slate-950"
                    onClick={() =>
                      setShowConfirmPassword((isVisible) => !isVisible)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-300">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {errors.submit && (
                <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-center text-sm text-red-300">
                  {errors.submit}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#56052e] via-[#61285e] to-[#5d75dc] px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-indigo-950/30 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/70 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="pt-1 text-center text-sm text-white/75">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-white underline underline-offset-4 hover:opacity-75"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
