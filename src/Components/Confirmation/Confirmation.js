import React, { useState } from 'react';
import CustomConfirmation from './confirmation.css';

const CustomConfirmations = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmation = () => {
    console.log('Confirmed');
    setShowConfirmation(false);
  };

  const handleCancellation = () => {
    console.log('Cancelled');
    setShowConfirmation(false);
  };

  const handleOpenConfirmation = () => {
    setShowConfirmation(true);
  };

  return (
    <div>
      <button onClick={handleOpenConfirmation}>Open Confirmation</button>

      {showConfirmation && (
        <CustomConfirmation
          message="Are you sure you want to proceed?"
          onConfirm={handleConfirmation}
          onCancel={handleCancellation}
        />
      )}
    </div>
  );
};

export default  CustomConfirmations;
