import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const GenerateForm = ({ isOpen, onClose, onSave }) => {
  const [date, setDate] = useState("");
  const [destination, setDestination] = useState("");
  const [cost, setCost] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ date, destination, cost, start, end });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-center w-full">GENERATE FORM</h2>
          <button onClick={onClose} className="text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center">
            <FaTimes />
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Hari/Tanggal</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 bg-gray-200 rounded-md mb-3" />

          <label className="block text-sm font-medium">Tujuan</label>
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full p-2 bg-gray-200 rounded-md mb-3" />

          <label className="block text-sm font-medium">Biaya</label>
          <input type="text" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full p-2 bg-gray-200 rounded-md mb-3" />

          <label className="block text-sm font-medium">Mulai</label>
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="w-full p-2 bg-gray-200 rounded-md mb-3" />

          <label className="block text-sm font-medium">Selesai</label>
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full p-2 bg-gray-200 rounded-md mb-3" />

          <button onClick={handleSave} className="bg-green-500 text-white py-2 px-4 w-full rounded-md hover:bg-green-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateForm;
