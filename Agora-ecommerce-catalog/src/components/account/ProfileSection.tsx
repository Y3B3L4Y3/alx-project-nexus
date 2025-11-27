import React, { useState } from 'react';
import Button from '../common/Button';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileSection: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'Md',
    lastName: 'Rimel',
    email: 'rimel1111@gmail.com',
    address: 'Kingston, 5236, United State',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Profile changes saved successfully!');
  };

  const handleCancel = () => {
    setProfileData({
      firstName: 'Md',
      lastName: 'Rimel',
      email: 'rimel1111@gmail.com',
      address: 'Kingston, 5236, United State',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="bg-white rounded shadow-[0_1px_13px_rgba(0,0,0,0.05)] p-6 md:p-10 lg:p-20">
      <h2 className="text-xl font-poppins font-medium text-secondary-2 mb-6">
        Edit Your Profile
      </h2>

      <form onSubmit={handleSaveChanges}>
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[50px] mb-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="text-base text-text-2 font-poppins">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              onChange={handleInputChange}
              placeholder="Md"
              className="w-full h-[50px] bg-secondary rounded px-4 font-poppins text-base text-text-2 outline-none focus:ring-2 focus:ring-secondary-2/30 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="text-base text-text-2 font-poppins">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profileData.lastName}
              onChange={handleInputChange}
              placeholder="Rimel"
              className="w-full h-[50px] bg-secondary rounded px-4 font-poppins text-base text-text-2 outline-none focus:ring-2 focus:ring-secondary-2/30 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Email & Address Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[50px] mb-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-base text-text-2 font-poppins">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              placeholder="rimel1111@gmail.com"
              className="w-full h-[50px] bg-secondary rounded px-4 font-poppins text-base text-text-2 outline-none focus:ring-2 focus:ring-secondary-2/30 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="address" className="text-base text-text-2 font-poppins">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              placeholder="Kingston, 5236, United State"
              className="w-full h-[50px] bg-secondary rounded px-4 font-poppins text-base text-text-2 outline-none focus:ring-2 focus:ring-secondary-2/30 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Password Change Section */}
        <div className="flex flex-col gap-4 mb-6">
          <label className="text-base text-text-2 font-poppins">
            Password Changes
          </label>
          <input
            type="password"
            name="currentPassword"
            value={profileData.currentPassword}
            onChange={handleInputChange}
            placeholder="Current Password"
            className="w-full h-[50px] bg-secondary rounded px-4 font-poppins text-base text-text-2 outline-none focus:ring-2 focus:ring-secondary-2/30 transition-all placeholder:text-gray-400"
          />
          <input
            type="password"
            name="newPassword"
            value={profileData.newPassword}
            onChange={handleInputChange}
            placeholder="New Password"
            className="w-full h-[50px] bg-secondary rounded px-4 font-poppins text-base text-text-2 outline-none focus:ring-2 focus:ring-secondary-2/30 transition-all placeholder:text-gray-400"
          />
          <input
            type="password"
            name="confirmPassword"
            value={profileData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm New Password"
            className="w-full h-[50px] bg-secondary rounded px-4 font-poppins text-base text-text-2 outline-none focus:ring-2 focus:ring-secondary-2/30 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto px-8 py-4 font-poppins text-base text-text-2 hover:text-secondary-2 transition-colors"
          >
            Cancel
          </button>
          <Button type="submit" variant="primary" className="w-full sm:w-auto">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;

