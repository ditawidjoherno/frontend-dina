"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import AddUserForm from "./_components/tambahuser";
import AccountTabs from "./_components/Tombol2";
import AdminTable from "./_components/tambahadmin";
import GenderChart from "./_components/jeniskelamin";

export default function Beranda() {
  const [activeTab, setActiveTab] = useState("user");
  const [userGenderData, setUserGenderData] = useState({ male: 0, female: 0 });
  const [adminGenderData, setAdminGenderData] = useState({ male: 0, female: 0 });

  useEffect(() => {
    // Fetch data untuk siswa (user)
    const fetchSiswa = async () => {
      const res = await fetch("http://localhost:8000/api/jumlah-siswa");
      const data = await res.json();
      const total = data.laki_laki + data.perempuan;
      setUserGenderData({
        male: Math.round((data.laki_laki / total) * 100),
        female: Math.round((data.perempuan / total) * 100),
      });
    };

    // Fetch data untuk guru (admin)
    const fetchGuru = async () => {
      const res = await fetch("http://localhost:8000/api/jumlah-guru");
      const data = await res.json();
      const total = data.laki_laki + data.perempuan;
      setAdminGenderData({
        male: Math.round((data.laki_laki / total) * 100),
        female: Math.round((data.perempuan / total) * 100),
      });
    };

    fetchSiswa();
    fetchGuru();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Header */}
      <Header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md" />
      <Sidebar />

      <main className="flex-1 bg-gray-200 p-4 flex flex-col items-center justify-start w-full overflow-y-auto">
        <h1 className="text-3xl text-black font-bold w-full max-w-6xl mb-4 mt-14 mr-auto">Tambah Akun</h1>

        <AccountTabs onTabChange={setActiveTab} />

        {/* USER = siswa */}
        {activeTab === "user" && (
          <>
            <GenderChart role="siswa" malePercentage={userGenderData.male} femalePercentage={userGenderData.female} />
            <AddUserForm />
          </>
        )}

        {/* ADMIN = guru */}
        {activeTab === "admin" && (
          <>
            <GenderChart role="guru" malePercentage={adminGenderData.male} femalePercentage={adminGenderData.female} />
            <AdminTable />
          </>
        )}
      </main>
    </div>
  );
}
