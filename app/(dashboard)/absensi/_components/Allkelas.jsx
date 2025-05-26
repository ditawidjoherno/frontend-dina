"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import { FaBook } from "react-icons/fa";

const initialClasses = [
  "X A", "X B", "X C", "X D",
  "XI A", "XI B", "XI C", "XI D",
  "XII A", "XII B", "XII C", "XII D", "XII IBBU"
];

const romanToNumber = {
  "X": "10",
  "XI": "11",
  "XII": "12"
};

const ClassCards = () => {
  const [classes, setClasses] = useState(initialClasses);
  const router = useRouter();

  const handleClassClick = (className) => {
    const [roman, subClass] = className.split(" ");
    const kelasAngka = romanToNumber[roman] || roman;
    const kelasFinal = `${kelasAngka}${subClass}`;

    router.push(`/Inputabsensi?kelas=${encodeURIComponent(kelasFinal)}`);
  };

  return (
    <div className="p-8 w-full min-h-screen mb-10 mt-5">
      <div className="grid grid-cols-3 gap-6 mt-6">
        {classes.map((className, index) => (
          <button
            key={index}
            className="flex items-center bg-[#9ba2b9] p-6 rounded-xl w-full h-24 shadow-md cursor-pointer hover:bg-[#7f869e] transition"
            onClick={() => handleClassClick(className)}
          >
            <FaBook className="text-black mr-4 text-3xl" />
            <p className="font-bold text-black text-xl">{className}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClassCards;
