import React from 'react';
import Modal from 'react-modal';
import './InventoryTable.css';

export default function FileViewerModal({ isOpen, onRequestClose, fileUrl, fileType }) {
  if (!fileUrl) return null;

  console.log("File URL:", fileUrl);
  console.log("File Type:", fileType);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="File Viewer"
      className="modal-contrato"
      overlayClassName="modal-overlay-contrato"
    >
      <h2>Ver Archivo</h2>
      <div>
        {fileType === 'application/pdf' ? (
          <iframe src={fileUrl} width="100%" height="600px" title="PDF Viewer" />
        ) : fileType.startsWith('image/') ? (
          <img src={fileUrl} alt="File" style={{ maxWidth: '100%' }} />
        ) : (
          <p>Tipo de archivo no compatible para vista previa.</p>
        )}
      </div>
      <button type='button' onClick={onRequestClose}>Cerrar</button>
    </Modal>
  );
}
