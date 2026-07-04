import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import api from "../services/api";
import { AuthContext } from "../store/AuthContext";
import { toast } from "react-toastify";
import { ShieldCheck, Lock, Mail } from "lucide-react";

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
      toast.error(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="w-full max-w-md space-y-6">
        {/* Portal Platform Branding */}
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

        {/* Core Credentials Input Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-100 border border-slate-200/60">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Identity Identification Input Block */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Institutional Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="name@university.edu"
                  {...register("email", {
                    required: "Email address is required",
                  })}
                  className={`block w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm transition-all duration-200 outline-none shadow-sm placeholder:text-slate-400/80 ${
                    errors.email
                      ? "border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-rose-900"
                      : "border-slate-300 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-1 pl-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Cryptographic Key Field Input Block */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Account Password
                </label>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password verification is required",
                  })}
                  className={`block w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm transition-all duration-200 outline-none shadow-sm placeholder:text-slate-400/80 ${
                    errors.password
                      ? "border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-rose-900"
                      : "border-slate-300 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-1 pl-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Verification Authorization Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/10 transition-all duration-200 ease-in-out hover:bg-blue-500 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:pointer-events-none disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
              >
                {isSubmitting ? "Authenticating Session..." : "Secure Login"}
              </button>
            </div>
          </form>
        </div>

        {/* Support Footer Note */}
        <p className="text-center text-xs text-slate-400 font-medium">
          Protected by institutional multi-role security boundaries.
        </p>
      </div>
    </div>
  );
};

export default Login;
