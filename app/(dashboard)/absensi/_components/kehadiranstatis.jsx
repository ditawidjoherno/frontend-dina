"use client";

import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaUserTimes, FaCalendarAlt } from "react-icons/fa";

const AttendanceCard = () => {
  const [data, setData] = useState({
    hadir: { jumlah: 0, persen: 0 },
    tidak_hadir: { jumlah: 0, persen: 0 },
    terlambat: { jumlah: 0, persen: 0 },
  });

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/statistik-hari-ini");
        const json = await response.json();
        setData(json.data);
      } catch (error) {
        console.error("Gagal memuat data absensi:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center w-full mt-10">
      <p className="text-xl font-bold text-gray-800 mb-10 -mt-8">{currentDate}</p>
      <div className="flex justify-center gap-8 p-6 w-full -mt-12">
        <div className="flex items-center bg-[#b9d8a9] p-6 rounded-xl w-full h-32">
          <FaCheckCircle className="text-green-600 mr-4 text-4xl" />
          <div>
            <p className="font-semibold text-green-900 text-xl">Hadir</p>
            <p className="text-gray-700 text-lg">
              {data.hadir.jumlah} ({data.hadir.persen}%)
            </p>
          </div>
        </div>

        <div className="flex items-center bg-[#e9b0aa] p-6 rounded-xl w-full h-32">
          <FaUserTimes className="text-red-600 mr-4 text-4xl" />
          <div>
            <p className="font-semibold text-red-900 text-xl">Tidak Hadir</p>
            <p className="text-gray-700 text-lg">
              {data.tidak_hadir.jumlah} ({data.tidak_hadir.persen}%)
            </p>
          </div>
        </div>

        <div className="flex items-center bg-[#EEF296] p-6 rounded-xl w-full h-32">
          <FaCalendarAlt className="text-yellow-600 mr-4 text-4xl" />
          <div>
            <p className="font-semibold text-yellow-900 text-xl">Terlambat</p>
            <p className="text-gray-700 text-lg">
              {data.terlambat.jumlah} ({data.terlambat.persen}%)
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => window.location.href = "/ringkasanabsensi"}
        className="mr-auto ml-6 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-[#324069] transition duration-300 mb-3"
      >
        Lihat Ringkasan Bulanan
      </button>
    </div>
  );
};

export default AttendanceCard;
