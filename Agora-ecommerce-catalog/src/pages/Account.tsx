import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import ProfileSection from '../components/account/ProfileSection';
import AddressBookSection from '../components/account/AddressBookSection';
import PaymentOptionsSection from '../components/account/PaymentOptionsSection';
import ReturnsSection from '../components/account/ReturnsSection';
import CancellationsSection from '../components/account/CancellationsSection';

type SectionKey = 'profile' | 'address' | 'payment' | 'returns' | 'cancellations';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SectionKey>('profile');
  
  // Get logged-in user from Redux
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const sidebarItems = [
    {
      title: 'Manage My Account',
      items: [
        { label: 'My Profile', key: 'profile' as SectionKey },
        { label: 'Address Book', key: 'address' as SectionKey },
        { label: 'My Payment Options', key: 'payment' as SectionKey },
      ],
    },
    {
      title: 'My Orders',
      items: [
        { label: 'My Returns', key: 'returns' as SectionKey },
        { label: 'My Cancellations', key: 'cancellations' as SectionKey },
      ],
    },
    {
      title: 'My WishList',
      items: [
        { label: 'View Wishlist', key: 'wishlist' as const },
      ],
    },
  ];

  const handleSidebarClick = (key: string) => {
    if (key === 'wishlist') {
      navigate('/wishlist');
    } else {
      setActiveSection(key as SectionKey);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'address':
        return <AddressBookSection />;
      case 'payment':
        return <PaymentOptionsSection />;
      case 'returns':
        return <ReturnsSection />;
      case 'cancellations':
        return <CancellationsSection />;
      default:
        return <ProfileSection />;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'profile':
        return 'My Profile';
      case 'address':
        return 'Address Book';
      case 'payment':
        return 'Payment Options';
      case 'returns':
        return 'My Returns';
      case 'cancellations':
        return 'My Cancellations';
      default:
        return 'My Account';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1170px] mx-auto px-4 py-10 md:py-20">
        {/* Breadcrumb & Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 md:mb-20 gap-4">
          <div className="text-sm text-gray-400">
            <Link to="/" className="hover:text-secondary-2 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-text-2">My Account</span>
            {activeSection !== 'profile' && (
              <>
                <span className="mx-2">/</span>
                <span className="text-text-2">{getSectionTitle()}</span>
              </>
            )}
          </div>
          {isAuthenticated && user && (
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-secondary-2"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-secondary-2 flex items-center justify-center text-white text-sm font-medium border-2 border-secondary-2">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Welcome back,</span>
                <span className="text-sm text-text-2 font-semibold">{user.name}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-[100px]">
          {/* Left Sidebar */}
          <aside className="w-full lg:w-[250px] flex-shrink-0">
            <nav className="flex flex-col gap-6">
              {sidebarItems.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h3 className="font-poppins font-medium text-base text-text-2 mb-4">
                    {section.title}
                  </h3>
                  <ul className="flex flex-col gap-2 pl-4 md:pl-[35px]">
                    {section.items.map((item) => (
                      <li key={item.key}>
                        <button
                          onClick={() => handleSidebarClick(item.key)}
                          className={`text-base font-poppins transition-all duration-200 text-left ${
                            activeSection === item.key
                              ? 'text-secondary-2 font-medium'
                              : 'text-gray-500 hover:text-secondary-2 hover:translate-x-1'
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 transition-all duration-300">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Account;
