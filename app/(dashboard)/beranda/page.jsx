// pages/beranda.js
"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import BoxWelcome from "./_components/BoxWelcome";
import WelcomeBox from "./_components/WelcomeBox";
import BoxTiga from "./_components/BoxTiga";
import RecentActivity from "./_components/AktivitasTerkini";
import InformasiListGuru from "./_components/Informasidata";
import InformasiListSiswa from "./_components/InformasiUmum";
import Reminder from "./_components/Reminder";
import EventCalendarGuru from "./_components/Kalender";
import EventCalendarSiswa from "./_components/KalenderSiswa";
import dynamic from "next/dynamic";

// Load grafik kehadiran hanya di client
const KehadiranChartGuru = dynamic(() => import("./_components/KehadiranChart"), {
  ssr: false,
});
const AttendanceChartSiswa = dynamic(() => import("./_components/GrafikKehadiran"), {
  ssr: false,
});

export default function Beranda() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.role) {
      setRole(userData.role);
    }
  }, []);

  return (
    <div className="flex h-screen">
      <Header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md" />
      <Sidebar />

      <main className="flex-1 p-4 bg-gray-200 overflow-y-auto">
        <h1 className="text-3xl text-black font-bold w-full max-w-6xl mt-14 -mb-4">
          Dashboard
        </h1>

        {role === "guru" ? (
          <>
            <WelcomeBox />
            <BoxTiga />
            <div className="w-full max-w-6xl mx-auto">
              <RecentActivity />
            </div>
            <div className="flex max-w-6xl mx-auto gap-4 mt-4">
              <div className="w-1/2"><InformasiListGuru /></div>
              <div className="w-1/2"><EventCalendarGuru /></div>
            </div>
            <KehadiranChartGuru />
          </>
        ) : role === "siswa" ? (
          <>
            <BoxWelcome />
            <div className="flex max-w-6xl mx-auto gap-4 mt-4">
              <div className="w-1/2"><InformasiListSiswa /></div>
              <div className="w-1/2"><Reminder /></div>
            </div>
            <div className="flex max-w-6xl mx-auto gap-4 mt-4">
              <div className="w-1/2"><AttendanceChartSiswa /></div>
              <div className="w-1/2"><EventCalendarSiswa /></div>
            </div>
          </>
        ) : (
          <p className="text-center mt-10 text-red-500">Memuat data pengguna...</p>
        )}
      </main>
    </div>
  );
}
