import React from 'react';

const ReceiptModal = ({ visible, onClose, receiptContent }) => {
  const handlePrint = () => {
    window.print();
  };
console.log(receiptContent)
  return (
    <div>
      <div className="">
        <span className="close" onClick={onClose}>&times;</span>
      
        <div dangerouslySetInnerHTML={{ __html: receiptContent }} />
        <button onClick={handlePrint}>Print</button>
      </div>
    </div>
  );
};

export default ReceiptModal;
