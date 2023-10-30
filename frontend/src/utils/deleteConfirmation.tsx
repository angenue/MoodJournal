import React from 'react';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';

Modal.setAppElement('#root');

interface CustomModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#D2D0BA',
          border: 'none',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '400px',
          width: '100%',
          color: '#5e747f'
        },
      }}
    >
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this journal?</p>
      <div className="d-flex justify-content-between mt-4">
      <button className="btn btn-danger mr-2" onClick={onRequestClose}>Cancel</button>
      <button className="btn btn-primary" onClick={onConfirm}>Yes, Delete</button>    
      </div> 
    </Modal>
  );
};

export default CustomModal;
