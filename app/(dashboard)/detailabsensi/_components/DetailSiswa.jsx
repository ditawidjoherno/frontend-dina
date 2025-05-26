"use client"; // pastikan ini komponen client untuk bisa pakai hooks

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const StudentCard = () => {
  const searchParams = useSearchParams();
  const nisn = searchParams.get("nisn");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!nisn) {
      setError("NISN tidak ditemukan di URL");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/detail-siswa?nisn=${nisn}`);
        if (!res.ok) {
          throw new Error("Gagal mengambil data siswa");
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nisn]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return null;

  return (
    <div className="bg-white border rounded-2xl p-4 flex gap-6 items-center shadow-md w-full h-80 mt-8 py-4">

      {/* Foto Profil */}
      <div className="w-48 h-56 overflow-hidden rounded-lg ml-10">
        <Image
          src={data.foto || "/images/profilsiswa.jpg"}
          alt="Profile Picture"
          width={192} // sesuaikan dengan container supaya full
          height={224}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Informasi + Statistik */}
      <div className="flex-1 ml-10">
        {/* Informasi Siswa */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="font-bold text-gray-700">Nama</p>
            <p className="text-gray-800">{data.nama}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">Kelas</p>
            <p className="text-gray-800">{data.kelas}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">NISN</p>
            <p className="text-gray-800">{data.nisn}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">Jenis Kelamin</p>
            <p className="text-gray-800">{data.jenis_kelamin}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">Agama</p>
            <p className="text-gray-800">{data.agama}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">Tanggal Lahir</p>
            <p className="text-gray-800">{data.tanggal_lahir}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">No HP</p>
            <p className="text-gray-800">{data.no_hp}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">Email</p>
            <p className="text-gray-800">{data.email}</p>
          </div>
        </div>

        {/* Statistik */}
        <div className="flex gap-6 mt-4">
          <div className="w-48 h-16 bg-[#5CB338] text-white flex items-center justify-center rounded-full text-xl font-bold shadow-md">
            {data.statistik?.hadir ?? 0}
          </div>
          <div className="w-48 h-16 bg-[#FB4141] text-white flex items-center justify-center rounded-full text-xl font-bold shadow-md">
            {data.statistik?.terlambat ?? 0}
          </div>
          <div className="w-48 h-16 bg-[#FFBB03] text-white flex items-center justify-center rounded-full text-xl font-bold shadow-md">
            {data.statistik?.tidak_hadir ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
