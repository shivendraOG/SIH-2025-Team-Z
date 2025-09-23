'use client';

import { useEffect, useState } from 'react';
import { FaCheckCircle, FaUserPlus, FaGraduationCap } from 'react-icons/fa';

export default function SuccessPage() {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = '/user-details';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 text-center space-y-6">
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <FaCheckCircle className="text-5xl text-green-500" />
        </div>

        {/* Success Message */}
        <div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            🎉 OTP Verified Successfully!
          </h1>
          <p className="text-gray-600 text-lg">
            Your phone number has been verified. Now let's complete your profile!
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-white text-sm" />
              </div>
              <span className="font-semibold text-green-700">Phone Verified</span>
            </div>
            <span className="text-green-500 text-sm">✓</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <FaUserPlus className="text-white text-sm" />
              </div>
              <span className="font-semibold text-blue-700">Complete Profile</span>
            </div>
            <span className="text-blue-500 text-sm animate-pulse">⏳</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <FaGraduationCap className="text-white text-sm" />
              </div>
              <span className="font-semibold text-gray-500">Start Learning</span>
            </div>
            <span className="text-gray-400 text-sm">⏳</span>
          </div>
        </div>

        {/* Auto Redirect Message */}
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-blue-700 font-medium">
            Redirecting to profile setup in {countdown} seconds...
          </p>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((3 - countdown) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Manual Continue Button */}
        <button
          onClick={() => window.location.href = '/user-details'}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg py-4 rounded-xl hover:from-blue-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Complete Profile Now 🚀
        </button>
      </div>
    </div>
  );
}
