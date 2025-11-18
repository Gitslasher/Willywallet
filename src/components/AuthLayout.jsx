import { useState } from "react";
import AuthHeader from "./AuthHeader";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import MarketingAside from "./MarketingAside";

export default function AuthLayout() {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="flex items-center">
            <div className="w-full">
              <AuthHeader />

              <div className="mt-8 rounded-2xl border bg-white/70 backdrop-blur shadow-sm p-6">
                {mode === "login" ? <LoginForm /> : <SignupForm />}

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  {mode === "login" ? (
                    <>
                      Don&apos;t have an account? {" "}
                      <button
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                        onClick={() => setMode("signup")}
                      >
                        Create one
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account? {" "}
                      <button
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                        onClick={() => setMode("login")}
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6 text-center text-xs text-gray-500">
                By continuing you agree to our <button className="underline">Terms</button> and <button className="underline">Privacy Policy</button>.
              </div>
            </div>
          </div>

          <MarketingAside />
        </div>
      </div>
    </div>
  );
}
