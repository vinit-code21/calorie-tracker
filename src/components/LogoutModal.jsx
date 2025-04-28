import React from 'react';

const LogoutModal = ({ isOpen, onClose, onLogout, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 max-w-md w-full mx-4 relative shadow-xl">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="bg-white w-24 h-24 rounded-full shadow-lg flex items-center justify-center">
            {userName?.photoURL ? (
              <img
                src={userName.photoURL}
                alt={userName?.displayName || 'User'}
                className="w-20 h-20 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {userName?.displayName?.charAt(0)?.toUpperCase() || userName?.email?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center mt-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Leaving So Soon?</h2>
          <p className="text-gray-600">
            {userName?.displayName ? `Goodbye, ${userName.displayName.split(' ')[0]}!` : 'Are you sure you want to logout?'}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onLogout}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Your progress is saved automatically
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal; 