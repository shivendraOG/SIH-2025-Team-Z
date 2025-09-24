"use client";

import { useState, useEffect } from "react";
import {
  signInWithCredential,
  PhoneAuthProvider,
  RecaptchaVerifier,
} from "firebase/auth";
import { getAuthInstance } from "@/lib/firebase";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export default function StudentLoginPage() {
  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("firebaseToken")
    ) {
      window.location.replace("/dashboard");
    }
  }, []);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [otpComplete, setOtpComplete] = useState(false);
  const [shake, setShake] = useState(false);
  const [resetTimer, setResetTimer] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    };
    checkDarkMode();
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", checkDarkMode);
    return () =>
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", checkDarkMode);
  }, []);

  useEffect(() => {
    const auth = getAuthInstance();
    if (!auth) return;

    if (!window.recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => console.log("Recaptcha verified.."),
      });

      verifier.render().then(() => {
        window.recaptchaVerifier = verifier;
      });
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (resetTimer <= 0) return;
    const timer = setInterval(() => setResetTimer((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [resetTimer]);

  useEffect(() => {
    setOtpComplete(otp.length === 6);
  }, [otp]);

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length > 0 && !value.startsWith("+91")) {
      setPhone(`+91${digits}`);
    } else if (value.startsWith("+91")) {
      setPhone(`+91${digits.slice(2)}`);
    } else {
      setPhone(value);
    }
  };

  const handleSendOTP = async () => {
    const auth = getAuthInstance();
    const verifier = window.recaptchaVerifier;

    if (!auth || !verifier) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (!phone) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const id = await phoneProvider.verifyPhoneNumber(phone, verifier);
      setVerificationId(id);
      setOtpSent(true);
      setCooldown(60);
      setResetTimer(60);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      console.error("Firebase Phone Auth Error:", err);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const auth = getAuthInstance();
    if (!auth || !verificationId || !otp) return;

    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const result = await signInWithCredential(auth, credential);

      const token = await result.user.getIdToken();
      localStorage.setItem("firebaseToken", token);

      const userResponse = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firebaseToken: token }),
      });

      const userResult = await userResponse.json();

      if (userResult.success) {
        setShowSuccess(true);
        setTimeout(() => {
          if (userResult.user.isProfileComplete) {
            window.location.href = "/dashboard";
          } else {
            window.location.href = "/success";
          }
        }, 2000);
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (err: any) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtp("");
    setOtpSent(false);
    setVerificationId(null);
    setResetTimer(0);

    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined;
    }
  };

  const handleReset = () => {
    setPhone("");
    setOtp("");
    setOtpSent(false);
    setVerificationId(null);
    setCooldown(0);
    setResetTimer(0);
    setShowSuccess(false);
    setInputFocused(false);
    setOtpComplete(false);

    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined;
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-all duration-1000 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-pulse delay-1000"></div>
            <div
              className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full animate-bounce"
              style={{ animationDuration: "3s" }}
            ></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full animate-bounce delay-500"
              style={{ animationDuration: "4s" }}
            ></div>
            <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-blue-400/30 rounded-full animate-ping"></div>
            <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-purple-400/30 rounded-full animate-ping delay-1000"></div>
            <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-cyan-400/30 rounded-full animate-ping delay-2000"></div>
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full animate-spin"
              style={{ animationDuration: "25s" }}
            ></div>
          </>
        ) : (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-10 animate-spin"
              style={{ animationDuration: "20s" }}
            ></div>
          </>
        )}
      </div>

      <button
        onClick={() => (window.location.href = "/")}
        className={`absolute top-6 left-6 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 z-10 ${
          isDarkMode
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500"
            : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-400 hover:to-purple-400"
        }`}
      >
        <span className="text-lg">←</span>
        <span>Back to Home</span>
      </button>

      {otpSent && resetTimer === 0 && (
        <button
          onClick={handleReset}
          className={`absolute top-6 right-6 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 z-10 animate-fade-in ${
            isDarkMode
              ? "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-500 hover:to-pink-500"
              : "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-400 hover:to-pink-400"
          }`}
        >
          <span className="text-lg">🔄</span>
          <span>Reset</span>
        </button>
      )}

      <div
        className={`max-w-md w-full backdrop-blur-sm rounded-3xl shadow-2xl border p-8 space-y-6 transform transition-all duration-500 ${
          isDarkMode
            ? "bg-gray-800/90 border-gray-700/20 text-white"
            : "bg-white/90 border-white/20 text-gray-900"
        } ${shake ? "animate-pulse scale-105" : "scale-100"} ${
          showSuccess ? "ring-4 ring-green-300" : ""
        }`}
      >
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="text-6xl animate-bounce">🎓</div>
            <div
              className="absolute -top-2 -right-2 text-2xl animate-spin"
              style={{ animationDuration: "3s" }}
            >
              ✨
            </div>
          </div>
          <h1
            className={`text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
              isDarkMode
                ? "from-blue-400 via-purple-400 to-cyan-400"
                : "from-blue-600 via-purple-600 to-indigo-600"
            }`}
          >
            Student Portal
          </h1>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            🚀 Ready to start your learning journey?
          </p>
        </div>

        <div className="flex justify-center space-x-2 mb-6">
          <div
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              !otpSent ? "bg-blue-500 scale-125" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              otpSent && !showSuccess ? "bg-blue-500 scale-125" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              showSuccess ? "bg-green-500 scale-125" : "bg-gray-300"
            }`}
          ></div>
        </div>

        {!otpSent ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                className={`block text-left text-sm font-semibold flex items-center gap-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                📱 Phone Number
              </label>
              <div
                className={`relative transition-all duration-300 ${
                  inputFocused ? "transform scale-105" : ""
                }`}
              >
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  disabled={loading}
                  className={`w-full px-6 py-4 border-2 rounded-2xl text-lg font-medium transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-700/50 text-white border-gray-600 placeholder-gray-400"
                      : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
                  } ${
                    inputFocused
                      ? "border-blue-400 ring-4 ring-blue-100 shadow-lg"
                      : isDarkMode
                      ? "hover:border-gray-500"
                      : "hover:border-gray-400"
                  } ${loading ? "opacity-50" : ""}`}
                  maxLength={15}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl">
                  {phone ? "✅" : "📞"}
                </div>
              </div>
              <p
                className={`text-sm flex items-center gap-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <span>🌍</span>
                Auto +91 added for India
              </p>
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading || !phone || cooldown > 0}
              className={`w-full py-4 text-lg font-bold rounded-2xl transition-all duration-300 transform ${
                loading || cooldown > 0
                  ? isDarkMode
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-400 hover:to-purple-400 hover:scale-105 hover:shadow-xl active:scale-95"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending Magic Code...</span>
                  </>
                ) : cooldown > 0 ? (
                  <>
                    <span>⏰</span>
                    <span>Wait {cooldown}s</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>Send Login Code</span>
                  </>
                )}
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-4xl animate-bounce">📨</div>
              <p
                className={`font-semibold text-lg ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Check your phone for the magic code!
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-blue-600">{phone}</span>
              </p>
              {resetTimer > 0 && (
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Reset available in {resetTimer}s
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-center gap-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <input
                    key={i}
                    maxLength={1}
                    value={otp[i] || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/, "");
                      const newOtp =
                        otp.substring(0, i) + value + otp.substring(i + 1);
                      setOtp(newOtp);

                      if (value && e.target.nextSibling) {
                        (e.target.nextSibling as HTMLElement).focus();
                      }
                    }}
                    className={`w-14 h-16 text-center text-2xl font-bold border-2 rounded-xl transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-700/50 text-white border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    } ${
                      otp[i]
                        ? "border-green-400 bg-green-50 text-green-700 scale-110"
                        : isDarkMode
                        ? "hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        : "hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    }`}
                  />
                ))}
              </div>

              {otpComplete && (
                <div className="text-center text-green-600 font-semibold animate-pulse">
                  ✅ Code Complete!
                </div>
              )}
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length < 6}
              className={`w-full py-4 text-lg font-bold rounded-2xl transition-all duration-300 transform ${
                loading || otp.length < 6
                  ? isDarkMode
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-400 hover:to-blue-400 hover:scale-105 hover:shadow-xl active:scale-95"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>🎯</span>
                    <span>Start Learning Journey</span>
                  </>
                )}
              </div>
            </button>

            <button
              onClick={handleResendOTP}
              disabled={loading}
              className={`w-full py-3 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                isDarkMode
                  ? "bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-gray-300 hover:from-yellow-500/30 hover:to-orange-500/30"
                  : "bg-gradient-to-r from-yellow-100 to-orange-100 text-gray-700 hover:from-yellow-200 hover:to-orange-200"
              }`}
            >
              <span>🔄</span>
              <span>Change Number</span>
            </button>
          </div>
        )}

        {showSuccess && (
          <div className="absolute inset-0 bg-green-500/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
            <div className="text-center space-y-4 animate-bounce">
              <div className="text-6xl">🎉</div>
              <p className="text-2xl font-bold text-green-600">Success!</p>
            </div>
          </div>
        )}

        <div id="recaptcha-container" className="hidden"></div>
      </div>
    </div>
  );
}
