
import React from 'react';

interface TabNavigationProps {
  activeTab: 'professionals' | 'meetings';
  onTabChange: (tab: 'professionals' | 'meetings') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-1 mb-6 inline-flex">
      <button
        onClick={() => onTabChange('meetings')}
        className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
          activeTab === 'meetings'
            ? 'bg-blue-500 text-white shadow-sm'
            : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
        }`}
      >
        📅 Réunions
      </button>
      <button
        onClick={() => onTabChange('professionals')}
        className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
          activeTab === 'professionals'
            ? 'bg-blue-500 text-white shadow-sm'
            : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
        }`}
      >
        👥 Professionnels
      </button>
    </div>
  );
};

export default TabNavigation;
