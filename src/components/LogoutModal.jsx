import React from "react";

const LogoutModal = ({ isOpen, onClose, onLogout, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50">
      <div
        className="relative max-w-md w-full mx-4 p-8 rounded-2xl
        backdrop-blur-2xl bg-white/10 border border-white/20 
        shadow-[0_0_25px_rgba(255,255,255,0.15)]
        animate-fadeIn"
      >
        {/* Profile Image */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <div
            className="w-28 h-28 rounded-full border-4 border-white/20 backdrop-blur-xl
            bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.25)]
            flex items-center justify-center overflow-hidden"
          >
            {userName?.photoURL ? (
              <img
                src={userName.photoURL}
                alt={userName?.displayName || "User"}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="w-full h-full rounded-full bg-gradient-to-br 
                from-blue-500 to-purple-600 flex items-center justify-center"
              >
                <span className="text-4xl font-bold text-white">
                  {userName?.displayName?.charAt(0)?.toUpperCase() ||
                    userName?.email?.charAt(0)?.toUpperCase() ||
                    "?"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Text */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">
            Leaving so soon?
          </h2>
          <p className="text-gray-300 text-sm">
            {userName?.displayName
              ? `Goodbye, ${userName.displayName.split(" ")[0]}!`
              : "Are you sure you want to logout?"}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl 
            bg-white/10 border border-white/20 text-white
            hover:bg-white/20 transition-all duration-300 
            hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]
            backdrop-blur-xl"
          >
            Cancel
          </button>

          <button
            onClick={onLogout}
            className="flex-1 px-4 py-3 rounded-xl 
            bg-gradient-to-r from-red-500 to-red-600 
            hover:from-red-600 hover:to-red-700
            shadow-[0_0_15px_rgba(255,0,0,0.3)]
            text-white font-semibold transition-all duration-300"
          >
            Logout
          </button>
        </div>

        {/* Bottom Note */}
        <p className="mt-6 text-center text-gray-400 text-xs tracking-wide">
          Your progress is saved automatically
        </p>
      </div>
    </div>
  );
};

export default LogoutModal;
