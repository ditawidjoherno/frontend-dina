"use client";
import React from "react";
import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import { FaArrowLeft } from "react-icons/fa";
import AttendanceChart from "./_components/chartbulanan";
import AttendanceMonthTable from "./_components/tabelbulanan";

export default function Beranda() {
  return (

    <div className="flex h-screen">
      {/* Header */}
      <Header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md" />

      {/* Sidebar */}
      <Sidebar />


      {/* Konten Utama */}
      <main className="flex-1 bg-gray-200 p-4 flex flex-col items-center justify-start w-full overflow-y-auto ">
        <h1 className="text-3xl text-black font-bold w-full max-w-6xl mt-14 -mb-3 flex items-center justify-between">
          Ringkasan Absensi Bulanan
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition duration-300 mr-auto ml-2"
          >
            <FaArrowLeft className="text-1xl " />
          </button>
        </h1>
        <AttendanceChart />

        <AttendanceMonthTable />
      </main>
    </div>
  );
}
