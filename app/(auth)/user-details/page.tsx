'use client';

import { useState } from 'react';
import { FaUser, FaSchool, FaMapMarkerAlt, FaUsers, FaCheck, FaArrowRight } from 'react-icons/fa';
// Use the App Router navigation hook (next/navigation) instead of legacy next/router
import { useRouter } from 'next/navigation';

interface UserDetails {
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  schoolName: string;
  className: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  fatherName: string;
  motherName: string;
}

export default function UserDetailsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    schoolName: '',
    className: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    fatherName: '',
    motherName: ''
  });

  const router = useRouter(); // For routing

  const steps = [
    { id: 1, title: 'Personal Info', icon: FaUser },
    { id: 2, title: 'School Details', icon: FaSchool },
    { id: 3, title: 'Address', icon: FaMapMarkerAlt },
    { id: 4, title: 'Family Info', icon: FaUsers }
  ];

  const handleInputChange = (field: keyof UserDetails, value: string) => {
    setUserDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const firebaseToken = localStorage.getItem('firebaseToken');
      if (!firebaseToken) {
        alert('Authentication token not found. Please login again.');
        router.push('/phone'); // Use router.push for navigation
        return;
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firebaseToken}`
        },
        body: JSON.stringify(userDetails)
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('userProfile', JSON.stringify(result.user));
        alert('🎉 Profile completed successfully! Welcome to your learning journey!');
        router.push('/dashboard'); // Use router.push for navigation
      } else {
        alert(result.error || 'Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return userDetails.fullName && userDetails.email && userDetails.dateOfBirth && userDetails.gender;
      case 2:
        return userDetails.schoolName && userDetails.className;
      case 3:
        return userDetails.address && userDetails.city && userDetails.state && userDetails.pincode;
      case 4:
        return userDetails.fatherName && userDetails.motherName;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={userDetails.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  value={userDetails.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                  value={userDetails.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">School Information</h2>
              <p className="text-gray-600">Tell us about your school</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">School Name *</label>
                <input
                  type="text"
                  value={userDetails.schoolName}
                  onChange={(e) => handleInputChange('schoolName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg"
                  placeholder="Enter your school name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class/Grade *</label>
                <select
                  value={userDetails.className}
                  onChange={(e) => handleInputChange('className', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg"
                >
                  <option value="">Select Class</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Address Information</h2>
              <p className="text-gray-600">Where do you live?</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                <textarea
                  value={userDetails.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg h-20 resize-none"
                  placeholder="Enter your complete address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={userDetails.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    value={userDetails.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg"
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                <input
                  type="text"
                  value={userDetails.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg"
                  placeholder="Enter pincode"
                  maxLength={6}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Family Information</h2>
              <p className="text-gray-600">Tell us about your parents</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Father&apos;s Name*</label>
                <input
                  type="text"
                  value={userDetails.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg"
                  placeholder="Enter father&apos;s name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mother&apos;s Name *</label>
                <input
                  type="text"
                  value={userDetails.motherName}
                  onChange={(e) => handleInputChange('motherName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg"
                  placeholder="Enter mother&apos;s name"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600 text-lg">Help us personalize your learning experience</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <FaCheck className="text-lg" /> : <Icon className="text-lg" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              currentStep === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                isStepValid(currentStep)
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !isStepValid(currentStep)}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                loading || !isStepValid(currentStep)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-400 hover:to-blue-500'
              }`}
            >
              {loading ? 'Saving...' : 'Complete Profile'} {!loading && <FaCheck />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
