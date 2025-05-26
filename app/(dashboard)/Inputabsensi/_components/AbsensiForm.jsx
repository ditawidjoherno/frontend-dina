"use client";

import { useState, useEffect } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

export default function AttendanceForm() {
  const [attendance, setAttendance] = useState({});
  const [lastEdit, setLastEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [students, setStudents] = useState([]);
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const [absensiFetched, setAbsensiFetched] = useState(false);
  const searchParams = useSearchParams();
  const kelas = searchParams.get("kelas") || "";
const [hasAttendanceData, setHasAttendanceData] = useState(false);
  const [lastDate, setLastDate] = useState(new Date().toISOString().slice(0, 10));

  // Fetch siswa dari API
  useEffect(() => {
    if (!kelas) return;

    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/api/siswa-kelas?kelas=${encodeURIComponent(kelas)}`
        );
        if (!response.ok) throw new Error("Gagal mengambil data siswa");

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

  // Fetch data absensi jika ada
useEffect(() => {
  const today = new Date().toISOString().slice(0, 10);

  const fetchAbsensi = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/absensi?kelas=${kelas}&tanggal=${today}`);
      if (!res.ok) throw new Error("Gagal mengambil data absensi");

      const data = await res.json();

      if (!data.data || data.data.length === 0) {
        // Jika data absensi kosong
        setHasAttendanceData(false);
        setAttendance({});
        setDay("");
        setStartTime("");
        setEndTime("");
        setIsEditing(true); // supaya tombol jadi Save
        setIsEditable(true);
      } else {
        // Jika ada data absensi
        setHasAttendanceData(true);

        setDay(data.hari || "");
        setStartTime(data.mulai || "");
        setEndTime(data.selesai || "");

        const absensiMap = {};
        data.data.forEach(item => {
          if (item.nisn) {
            absensiMap[item.nisn] = {
              status: item.status,
              time: item.waktu_absen,
            };
          }
        });

        setAttendance(absensiMap);
        setIsEditing(false);
        setIsEditable(false);
      }

      setAbsensiFetched(true);
    } catch (error) {
      console.error("Error fetching absensi:", error.message);
      setHasAttendanceData(false);
      setIsEditing(true);
      setIsEditable(true);
    }
  };

  if (kelas) fetchAbsensi();
}, [kelas]);

const handleAttendanceChange = (nisn, status) => {
  if (!isEditing) return;
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`; // pasti H:i tanpa detik

  setAttendance((prev) => ({
    ...prev,
    [nisn]: {
      status,
      time: formattedTime,
    },
  }));
  setLastEdit(new Date().toLocaleString());
};


const handleGenerate = () => {
  const now = new Date();
  const dayName = now.toLocaleDateString("id-ID", { weekday: "long" });
  const date = now.toLocaleDateString("id-ID"); // contoh: 22/05/2025
  const fullDay = `${dayName}, ${date}`;
  setDay(fullDay); // <-- Ini penting

  const start = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const endTimeObj = new Date(now.getTime() + 30 * 60000);
  const end = `${endTimeObj.getHours().toString().padStart(2, "0")}:${endTimeObj
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  setStartTime(start);
  setEndTime(end);

  setIsEditable(true);
};


  const handleSave = async () => {
    if (!day || !startTime || !endTime) {
      alert("Klik Generate dulu sebelum Save");
      return;
    }

    const absensiArray = Object.entries(attendance).map(([nisn, value]) => ({
      nisn,
      status: value.status,
      waktu_absen: value.time,
    }));

    const payload = {
      kelas,
      tanggal: new Date().toISOString().slice(0, 10),
      hari: day,
      mulai: startTime,
      selesai: endTime,
      absensi: absensiArray,
    };

    try {
      const response = await fetch("http://localhost:8000/api/input-absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        alert("Gagal menyimpan: " + JSON.stringify(err));
        return;
      }

      alert("Absensi berhasil disimpan!");
      setIsEditing(false);
      setIsEditable(false);
    } catch (err) {
      alert("Gagal: " + err.message);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const filteredStudents = students
    .filter((student) => student.nisn)
    .filter((student) =>
      student.nama.toLowerCase().includes(search.toLowerCase())
    );

  // Fungsi reset form
  const resetForm = () => {
    setAttendance({});
    setDay("");
    setStartTime("");
    setEndTime("");
    setIsEditing(true);
    setIsEditable(false);
    setLastEdit(null);
    setHasAttendanceData(false);
  };

  useEffect(() => {
    // Cek tanggal sekarang tiap menit
    const intervalId = setInterval(() => {
      const today = new Date().toISOString().slice(0, 10);
      if (today !== lastDate) {
        resetForm();
        setLastDate(today);
      }
    }, 60000); // 60 detik

    // Cek sekali saat mount
    const today = new Date().toISOString().slice(0, 10);
    if (today !== lastDate) {
      resetForm();
      setLastDate(today);
    }

    return () => clearInterval(intervalId);
  }, [lastDate]);



  useEffect(() => {
  if (!endTime) return;

  const checkEndTime = () => {
    const now = new Date();
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const endDateTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      endHour,
      endMinute,
      0
    );

    if (now >= endDateTime) {
      // Jika waktu sudah lewat endTime, set semua jadi "Tidak Hadir"
      setAttendance((prev) => {
        const updated = {};
        Object.keys(prev).forEach((nisn) => {
          updated[nisn] = {
            status: "Tidak Hadir",
            time: prev[nisn]?.time || "",
          };
        });
        return updated;
      });

      // Disable editing
      setIsEditing(false);
      setIsEditable(false);
    }
  };

  // Cek segera saat endTime berubah
  checkEndTime();

  // Set interval cek tiap menit (60000 ms)
  const intervalId = setInterval(checkEndTime, 60000);

  return () => clearInterval(intervalId);
}, [endTime]);

  return (
    <div className="max-w-7xl mx-auto p-5 border rounded-2xl shadow-md bg-white">
      <style>
        {`
          input[type="radio"]:disabled {
            accent-color: black;
            cursor: not-allowed;
          }
        `}
      </style>

      <div className="mb-4 ml-5 gap-4">
        <div className="flex">
          <strong className="w-28">Kelas</strong> <span>: {kelas}</span>
        </div>
  <div className="flex">
    <strong className="w-28">Hari</strong> <span>:</span>
        {day && (
   <span> {` ${day}`}</span>

  )}
  </div>


<div className="flex">
  <strong className="w-28">Mulai</strong>
    <span>: {startTime}</span>
</div>
<div className="flex">
  <strong className="w-28">Selesai</strong>
    <span>: {endTime}</span>
</div>

      </div>

      <div className="py-4 text-center ml-5 -mt-5">
        <button
          className="px-4 py-2 bg-blue-700 text-white rounded-md flex items-center justify-center"
          onClick={handleGenerate}
        >
          <FaExternalLinkAlt className="mr-2" />
          Generate Absensi
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari nama siswa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full max-w-md"
        />
      </div>

      {loading && <p>Loading data siswa...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <table className="w-full border-t border-gray-300">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2">No</th>
              <th className="py-2">Nama</th>
              <th className="py-2">Hadir</th>
              <th className="py-2">Tidak Hadir</th>
              <th className="py-2">Terlambat</th>
              <th className="py-2">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => {
              const uniqueId = student.nisn;
              return (
                <tr
                  key={`${student.id ?? index}-${index}`}
                  className="border-b border-gray-300 text-center"
                >
                  <td className="py-2">{index + 1}.</td>
                  <td className="py-6 pl-3 text-left">{student.nama}</td>
                  {["Hadir", "Tidak Hadir", "Terlambat"].map((status) => (
  <td key={status} className="py-2 px-10">
    <input
      type="radio"
      id={`attendance-${uniqueId}-${status}`}
      name={`attendance-${uniqueId}`}
      value={status}
      checked={attendance[uniqueId]?.status === status}
      onChange={() => handleAttendanceChange(uniqueId, status)}
      disabled={!isEditing}
      className="accent-blue-600"
    />
    <label htmlFor={`attendance-${uniqueId}-${status}`} className="sr-only">
      {status}
    </label>
  </td>
))}


                  <td className="py-2">{attendance[uniqueId]?.time || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

     <div className="mt-4 flex space-x-2">
  {(isEditing || !hasAttendanceData) ? (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-md"
      onClick={handleSave}
    >
      Save
    </button>
  ) : (
    <button
      className="px-4 py-2 bg-green-500 text-white rounded-md"
      onClick={handleEdit}
    >
      Edit
    </button>
  )}
</div>


      {lastEdit && <p className="mt-2 text-gray-600">Last Edit: {lastEdit}</p>}
    </div>
  );
}
