import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Mail, Lock, User, Sparkles, Key } from "lucide-react";

export const AuthPage: React.FC = () => {
  const { login, register, user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "ADMIN">("CUSTOMER");
  const [isLoading, setIsLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || (user?.role === "ADMIN" ? "/admin" : "/menu");

  // Handle immediate navigation if already logged in
  React.useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (activeTab === "login") {
      const success = await login(email, password);
      if (success) {
        navigate(redirectPath, { replace: true });
      }
    } else {
      if (!name) {
        setIsLoading(false);
        return;
      }
      const success = await register(name, email, password, role);
      if (success) {
        navigate(redirectPath, { replace: true });
      }
    }
    setIsLoading(false);
  };

  const fillQuickCredentials = (userEmail: string, pass: string) => {
    setEmail(userEmail);
    setPassword(pass);
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-[#F3F2ED] flex flex-col justify-center items-center">
      <div className="max-w-md w-full">
        {/* Short Header */}
        <div className="text-center mb-8 space-y-1">
          <h2 className="font-serif text-3xl font-extrabold text-[#01311F] tracking-tight">
            MANGIA RISTORANTE
          </h2>
          <p className="text-xs uppercase tracking-widest text-[#C6AA58] font-semibold">
            Tavola e Cantina d'Autore
          </p>
        </div>

        {/* Card Frame */}
        <div className="bg-white border border-[#01311F]/15 rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs header */}
          <div className="flex border-b border-[#01311F]/10 bg-[#F3F2ED]/45">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-4 text-center text-sm font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "login"
                  ? "bg-white text-[#01311F] border-b-2 border-[#C6AA58] font-bold"
                  : "text-[#01311F]/55 hover:bg-white/50"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-4 text-center text-sm font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "register"
                  ? "bg-white text-[#01311F] border-b-2 border-[#C6AA58] font-bold"
                  : "text-[#01311F]/55 hover:bg-white/50"
              }`}
            >
              Register
            </button>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {activeTab === "register" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-[#01311F]/70 block" htmlFor="reg-name">
                    Full Name
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="reg-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sarah Jenkins"
                      className="block w-full pl-10 pr-3 py-2.5 border border-[#01311F]/15 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#01311F] focus:border-[#01311F] text-sm bg-[#F3F2ED]/30 text-[#01311F]"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-[#01311F]/70 block" htmlFor="auth-email">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="auth-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@mangia.com"
                    className="block w-full pl-10 pr-3 py-2.5 border border-[#01311F]/15 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#01311F] focus:border-[#01311F] text-sm bg-[#F3F2ED]/30 text-[#01311F]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-[#01311F]/70 block" htmlFor="auth-password">
                  Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="auth-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-2.5 border border-[#01311F]/15 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#01311F] focus:border-[#01311F] text-sm bg-[#F3F2ED]/30 text-[#01311F]"
                  />
                </div>
              </div>

              {activeTab === "register" && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold uppercase text-[#01311F]/70 block mb-2">
                    Select Account Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("CUSTOMER")}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all uppercase tracking-wider ${
                        role === "CUSTOMER"
                          ? "bg-[#01311F] text-[#F3F2ED] border-transparent shadow-sm"
                          : "bg-transparent text-[#01311F] border-[#01311F]/15 hover:bg-[#F3F2ED]/40"
                      }`}
                    >
                      Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("ADMIN")}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all uppercase tracking-wider ${
                        role === "ADMIN"
                          ? "bg-[#01311F] text-[#F3F2ED] border-transparent shadow-sm"
                          : "bg-transparent text-[#01311F] border-[#01311F]/15 hover:bg-[#F3F2ED]/40"
                      }`}
                    >
                      Administrator
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-[#01311F] hover:bg-[#C6AA58] hover:text-[#01311F] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01311F] disabled:opacity-50 uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : activeTab === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Quick Testing Accounts Assist Block */}
        <div className="mt-8 bg-white border border-[#01311F]/15 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-[#01311F]">
            <Key className="w-4 h-4 text-[#C6AA58]" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Demo / Sandbox Accounts</h4>
          </div>
          <p className="text-xs text-[#01311F]/70 mb-4 leading-relaxed">
            Quickly authenticate without manually registering. Select an account profile below to auto-fill details instantly:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => fillQuickCredentials("customer@mangia.com", "customer123")}
              className="py-2.5 px-3 bg-[#F3F2ED]/40 hover:bg-[#F3F2ED]/85 border border-[#01311F]/10 rounded-xl text-left transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-xs font-bold text-[#01311F]">Sarah (Customer)</span>
                <span className="text-[9px] bg-[#01311F]/10 text-[#01311F] px-1 font-mono uppercase rounded">Demo Client</span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono">customer@mangia.com</p>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">Password: customer123</p>
            </button>

            <button
              onClick={() => fillQuickCredentials("admin@mangia.com", "admin123")}
              className="py-2.5 px-3 bg-[#F3F2ED]/40 hover:bg-[#F3F2ED]/85 border border-[#01311F]/10 rounded-xl text-left transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-xs font-bold text-[#01311F]">Chef Vito (Admin)</span>
                <span className="text-[9px] bg-[#C6AA58]/20 text-[#01311F] px-1 font-mono uppercase rounded">Demo Admin</span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono">admin@mangia.com</p>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">Password: admin123</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
