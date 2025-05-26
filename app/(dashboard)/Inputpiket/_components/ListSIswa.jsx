"use client";

import Image from "next/image";
import Link from "next/link";
import { FaUsers, FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function StudentList() {
  const searchParams = useSearchParams();
  const kelas = searchParams.get("kelas") || "";

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data siswa dari backend ketika kelas berubah
  useEffect(() => {
    if (!kelas) return; // kalau kelas kosong, skip fetch

    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/api/siswa-kelas?kelas=${encodeURIComponent(kelas)}`
        );
        if (!response.ok) {
          throw new Error("Gagal mengambil data siswa");
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [kelas]);

  // Filter siswa berdasarkan pencarian
  const filteredStudents = students
    .filter(student => student.nisn !== null && student.nisn !== "")
    .filter(student => student.nama.toLowerCase().includes(search.toLowerCase()));


  if (!kelas) return <p>Mohon pilih kelas terlebih dahulu.</p>;
  if (loading) return <p>Memuat data siswa...</p>;
  if (error) return <p>Error: {error}</p>;
  if (students.length === 0) return <p>Tidak ada siswa di kelas {kelas}</p>;



  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaUsers /> Daftar Siswa Kelas {kelas}
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari siswa..."
            className="px-4 py-2 border rounded-lg pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 pl-20">No</th>
              <th className="text-left p-4 pl-10">Nama</th>
              <th className="text-left p-4 pl-9">NISN</th>
              <th className="text-left p-4 pl-4">Jenis Kelamin</th>
              <th className="text-left p-4">Tanggal Lahir</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={`${student.nisn}-${index}`} className="border-b">
                <td className="p-4 pl-20">{index + 1}.</td>
                <td className="p-4 flex items-center gap-2">
                  <Image
                    src={student.avatar || "/avatar.png"}
                    alt="Avatar"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <Link
                    href={`/detail-profil/${student.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {student.nama}
                  </Link>
                </td>
                <td className="p-4 pr-7">{student.nisn}</td>
                <td className="p-4 pr-2">
                  <span
                    className={`px-3 py-1 text-sm rounded-full text-white ${student.jenis_kelamin === 'P' ? 'bg-pink-400' : 'bg-purple-500 ml-2'
                      }`}
                  >
                    {student.jenis_kelamin === 'P' ? 'Perempuan' : 'Laki-laki'}
                  </span>

                </td>
                <td className="border border-gray-300 p-2">
                  {student.tanggal_lahir
                    ? new Date(student.tanggal_lahir).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
