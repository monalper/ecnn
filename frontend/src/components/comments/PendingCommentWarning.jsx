// frontend/src/components/comments/PendingCommentWarning.jsx
import React from 'react';
import { PiSealWarningFill } from 'react-icons/pi';

const PendingCommentWarning = () => {
  return (
    <div className="bg-red-500 rounded-lg p-4 mb-3">
      <div className="flex items-center space-x-3">
        {/* Warning Icon */}
        <div className="flex-shrink-0">
          <PiSealWarningFill className="text-white text-lg" />
        </div>
        
        {/* Warning Content */}
        <div className="flex-1">
          <p className="text-white text-sm font-medium">
            <span className="font-bold">The Openwall Bot:</span> Yorumunuz moderasyon sürecinden geçtikten sonra yayınlanacaktır.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingCommentWarning;
