import React, { FC, useState, useEffect } from 'react';
import { Modal } from 'components';

interface ErrorMessageModalProps {
  errorTitle?: string;
  errorMessage?: string;
}

const ErrorMessageModal: FC<ErrorMessageModalProps> = ({ errorTitle, errorMessage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setIsModalOpen(true);
    }
  }, [errorMessage]);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <Modal title={errorTitle} onClose={handleCloseModal}>
          <p>{errorMessage}</p>
        </Modal>
      )}
    </>
  );
};

export default ErrorMessageModal;
