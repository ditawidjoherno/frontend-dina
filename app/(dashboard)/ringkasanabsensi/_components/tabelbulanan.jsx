"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button } from "@mui/material";
import { FaDownload } from "react-icons/fa";
import FilterButton from "./tombolfilter";

const formatName = (fullName) => {
  const nameParts = fullName.split(" ");
  return nameParts.length <= 3
    ? fullName
    : `${nameParts[0]} ${nameParts[1][0]}. ${nameParts[2][0]}. ${nameParts[nameParts.length - 1]}`;
};

const AttendanceMonthTable = () => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("Semua Kelas");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Jika backend menggunakan filter bulan dan tahun, bisa tambahkan state disini
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());

  // Fungsi fetch data dari API backend Laravel
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      // Bangun query params sesuai filter dan search
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedClass && selectedClass !== "Semua Kelas") params.append("kelas", selectedClass);
      if (bulan) params.append("bulan", bulan);
      if (tahun) params.append("tahun", tahun);

      const res = await fetch(`http://localhost:8000/api/list-absensi-siswa?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setAttendanceData([]);
    }
    setLoading(false);
  };

  // Fetch ulang saat searchTerm, selectedClass, bulan, atau tahun berubah
  useEffect(() => {
    fetchAttendance();
  }, [searchTerm, selectedClass, bulan, tahun]);

  const handleDownload = () => {
    const csvContent = [
      ["No", "NISN", "Nama", "Kelas", "Hadir", "Terlambat", "Tidak Hadir"].join(","),
      ...attendanceData.map((student, index) => [
        index + 1,
        student.nisn,
        student.nama,
        student.kelas,
        student.hadir,
        student.terlambat,
        student.tidakHadir
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kehadiran_siswa.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDetailClick = (nisn) => {
    router.push(`/detailabsensi?nisn=${nisn}`);
  };

  return (
    <div className="w-full p-8 bg-white rounded-xl shadow-md mt-5">
      {/* Search & Filter */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-4">
          <TextField
            label="Search Nama"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterButton onSelect={setSelectedClass} />
        </div>
        <Button variant="contained" color="success" onClick={handleDownload} disabled={loading}>
          <FaDownload size={20} />
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading data...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black text-center bg-gray-100 text-sm">
                <th className="px-6 py-5">No</th>
                <th className="px-6 py-5">NISN</th>
                <th className="px-6 py-5">Nama</th>
                <th className="px-6 py-5 text-left pl-8">Kelas</th>
                <th className="px-6 py-5">Hadir</th>
                <th className="px-6 py-5">Tidak Hadir</th>
                <th className="px-6 py-5">Terlambat</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    Data tidak ditemukan.
                  </td>
                </tr>
              ) : (
                attendanceData.map((student, index) => (
                  <tr key={student.id} className="border-b border-gray-300 text-center text-sm">
                    <td className="px-6 py-5">{index + 1}.</td>
                    <td className="px-6 py-5">{student.nisn}</td>
                    <td className="px-4 py-5">
                      <a
                        href="#"
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => handleDetailClick(student.nisn)}
                      >
                        {formatName(student.nama)}
                      </a>
                    </td>
                    <td className="px-6 py-5 text-left pl-8">{student.kelas}</td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white font-medium">
                          {student.hadir}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-medium">
                          {student.tidakHadir}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500 text-white font-medium">
                          {student.terlambat}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AttendanceMonthTable;
