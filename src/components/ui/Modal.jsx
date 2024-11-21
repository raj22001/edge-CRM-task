import { CircleX  } from "lucide-react";
import React from "react";

const Modal = ({ children, title, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button onClick={onClose}><CircleX  /></button>
      </div>
      <div>{children}</div>
    </div>
  </div>
);

export default Modal;
