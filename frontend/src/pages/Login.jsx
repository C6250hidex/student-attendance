import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import api from "../services/api";
import { AuthContext } from "../store/AuthContext";
import { toast } from "react-toastify";
import { ShieldCheck, Lock, Mail } from "lucide-react";

// ... existing imports

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { login } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      login(res.data);
      toast.success("Welcome Back!");
    } catch (err) {
      // Professional tip: Check if the error is a 401 specifically
      const message =
        err.response?.status === 401
          ? "Invalid email or password"
          : "Connection failed. Please try again later.";
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-600/20 ring-4 ring-blue-50">
            <ShieldCheck size={28} className="stroke-[1.75]" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Attendance Portal
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1.5">
              Secure institutional validation and check-in system
            </p>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-100 border border-slate-200/60">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Institutional Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  {...register("email", {
                    required: "Email address is required",
                  })}
                  className={`block w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm transition-all duration-200 outline-none shadow-sm ${
                    errors.email
                      ? "border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-rose-900"
                      : "border-slate-300 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-semibold text-rose-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Account Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className={`block w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm transition-all duration-200 outline-none shadow-sm ${
                    errors.password
                      ? "border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-rose-900"
                      : "border-slate-300 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs font-semibold text-rose-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all active:scale-[0.98] disabled:bg-slate-200"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  "Secure Login"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
