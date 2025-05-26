"use client";
import React, { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import GenerateForm from "./formgen";

const GenerateButton = ({ onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (formData) => {
    onSave(formData);       // Teruskan data ke parent (ListForm)
    setIsModalOpen(false);  // Tutup modal setelah simpan
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center bg-blue-600 text-white font-bold px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        <FaExternalLinkAlt className="mr-2" />
        Generate Form
      </button>

      <GenerateForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
    </div>
  );
};

export default GenerateButton;
