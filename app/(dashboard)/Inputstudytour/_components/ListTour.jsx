'use client';

import { useState, useEffect } from 'react';
import GenerateButton from './buttongen';
import { useSearchParams } from "next/navigation";

const students = [
  { id: 1, name: 'Akio Anak Baik Sekali' },
  { id: 2, name: 'Akio Anak Baik Sekali' },
  { id: 3, name: 'Akio Anak Baik Sekali' },
  { id: 4, name: 'Akio Anak Baik Sekali' },
  { id: 5, name: 'Akio Anak Baik Sekali' },
];

export default function ListForm( ) {
  const [list, setList] = useState({});
  const [startDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate] = useState(new Date().toISOString().split('T')[0]);
  const [destination] = useState("Museum Sejarah");
  const [cost] = useState("Rp 50.000");
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
    const [tourFetched, setTourFetched] = useState(false);
    const searchParams = useSearchParams();
    const kelas = searchParams.get("kelas") || "";
    const [hasAttendanceData, setHasAttendanceData] = useState(false);
    const [lastDate, setLastDate] = useState(new Date().toISOString().slice(0, 10));

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

          const filteredStudents = students
    .filter((student) => student.nisn)
    .filter((student) =>
      student.nama.toLowerCase().includes(search.toLowerCase())
    );

  const [formData, setFormData] = useState({
    date: "",
    destination: "",
    cost: "",
    start: "",
    end: "",
  });

const handleFormSave = (data) => {
  setFormData(data);
  setDay(data.date); // ambil hari dari form
  setStartTime(data.start);
  setEndTime(data.end);
};


useEffect(() => {
  const today = new Date().toISOString().slice(0, 10);

  const fetchTour = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/absensi-tour?kelas=${kelas}&tanggal=${today}`);
      if (!res.ok) throw new Error("Gagal mengambil data study tour");

      const data = await res.json();

      if (!data.data || data.data.length === 0) {
        // Data kosong, reset form dan absensi
        setHasAttendanceData(false);
        setAttendance({});
        setFormData({
          date: "",
          destination: "",
          cost: "",
          start: "",
          end: "",
        });
        setDay("");
        setStartTime("");
        setEndTime("");
        setIsEditing(true);
        setIsEditable(true);
      } else {
        // Ada data, isi formData sekaligus attendance
        setHasAttendanceData(true);

        setFormData({
          date: data.hari || "",
          destination: data.tujuan || "",
          cost: data.biaya ? `Rp ${data.biaya.toLocaleString('id-ID')}` : "",
          start: data.mulai || "",
          end: data.selesai || "",
        });

        setDay(data.hari || "");
        setStartTime(data.mulai || "");
        setEndTime(data.selesai || "");

        const formatDateWithDay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
        const tourMap = {};
        data.data.forEach(item => {
          if (item.nisn) {
            tourMap[item.nisn] = {
  status: item.status,
  time: item.waktu_daftar || item.waktu_absen || "",
  tanggal_daftar: formatDateWithDay(item.tanggal_daftar) || "",
};
          }
        });
        setAttendance(tourMap);

        setIsEditing(false);
        setIsEditable(false);
      }

      setTourFetched(true);
    } catch (error) {
      console.error("Error fetching study tour:", error.message);
      setHasAttendanceData(false);
      setIsEditing(true);
      setIsEditable(true);
      setFormData({
        date: "",
        destination: "",
        cost: "",
        start: "",
        end: "",
      });
    }
  };

  if (kelas) fetchTour();
}, [kelas]);

  useEffect(() => {
    const now = new Date();
    const deadline = new Date(endDate);
    
    if (now > deadline) {
      setList((prevList) => {
        const updatedList = { ...prevList };
        students.forEach(student => {
          if (!updatedList[student.id]) {
            updatedList[student.id] = { status: 'Tidak Berkontribusi', time: '-' };
          }
        });
        return updatedList;
      });
    }
  }, [endDate]);

  function formatDateWithDay(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long', // nama hari
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

  const handleListChange = (id, status) => {
    if (!isEditing) return;

    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toLocaleDateString('id-ID');
    const formattedTime = currentDateTime.toLocaleTimeString('id-ID');
    const dayName = currentDateTime.toLocaleDateString('id-ID', { weekday: 'long' });
    
    setList((prev) => ({
      ...prev,
      [id]: { status, time: formattedTime, date: `${dayName}, ${formattedDate}` },
    }));
    setLastEdit(`${dayName}, ${formattedDate} ${formattedTime}`);
  };

const handleSave = async () => {
  if (!day || !startTime || !endTime) {
    alert("Klik Generate dulu sebelum Save");
    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  const studyTourArray = Object.entries(attendance).map(([nisn, value]) => ({
    nisn,
    status: value.status,
    waktu_daftar: value.time,
    tanggal_daftar: today,
  }));

const payload = {
  kelas,
  tanggal: new Date().toISOString().slice(0, 10),
  hari: formData.date,
  mulai: formData.start,
  selesai: formData.end,
  tujuan: formData.destination,
  biaya: parseInt(formData.cost.replace(/[^\d]/g, '')),
  studyTour: studyTourArray,
};


try {
    const response = await fetch("http://localhost:8000/api/input-tour", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.get('content-type'));

    const text = await response.text();
    console.log('Response text:', text);

    if (!response.ok) {
      alert("Gagal menyimpan: " + text);
      return;
    }

    // parsing json setelah cek ok
    const data = JSON.parse(text);

    alert("Data study tour berhasil disimpan!");
    setIsEditing(false);
    setIsEditable(false);
  } catch (err) {
    alert("Gagal: " + err.message);
  }
};


const handleAttendanceChange = (nisn, status) => {
  if (!isEditing) return;

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;
  const formattedDate = now.toLocaleDateString('id-ID');
  const dayName = now.toLocaleDateString('id-ID', { weekday: 'long' });

  setAttendance((prev) => ({
    ...prev,
    [nisn]: {
      status,
      time: formattedTime,
      tanggal_daftar: `${dayName}, ${formattedDate}`, // simpan hari & tanggal
    },
  }));

  setLastEdit(now.toLocaleString());
};



  const handleEdit = () => {
    setIsEditing(true);
  };

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
      const intervalId = setInterval(() => {
        const today = new Date().toISOString().slice(0, 10);
        if (today !== lastDate) {
          resetForm();
          setLastDate(today);
        }
      }, 60000);
  
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
          setAttendance((prev) => {
            const updated = {};
            Object.keys(prev).forEach((nisn) => {
              updated[nisn] = {
                status: "Tidak Daftar",
                time: prev[nisn]?.time || "",
              };
            });
            return updated;
          });
          setIsEditing(false);
          setIsEditable(false);
        }
      };
      checkEndTime();
  
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

      <div className="mb-4 space-y-2 text-md">
        <div className="flex"><strong className="w-28">Kelas</strong> <span>: {kelas}</span>
</div>
        <div className="flex">
          <strong className="w-28">Hari</strong> <span>: {formatDateWithDay(formData.date) || "-"}</span>
        </div>
        <div className="flex">
          <strong className="w-28">Tujuan</strong> <span>: {formData.destination || "-"}</span>
        </div>
        <div className="flex">
          <strong className="w-28">Biaya</strong> <span>: {formData.cost || "-"}</span>
        </div>
        <div className="flex">
          <strong className="w-28">Mulai</strong> <span>: {formData.start || "-"}</span>
        </div>
        <div className="flex">
          <strong className="w-28">Selesai</strong> <span>: {formData.end || "-"}</span>
        </div>

        <div className="mb-2 flex justify-start">
          <GenerateButton onSave={handleFormSave} />
        </div>
      </div>
      <table className="w-full border-t border-gray-300">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-2">No</th>
            <th className="py-2">Nama</th>
            <th className="py-2">Daftar</th>
            <th className="py-2">Tidak Daftar</th>
            <th className="py-2">Waktu</th>
            <th className="py-2">Hari/Tanggal</th>
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

        {["Daftar", "Tidak Daftar"].map((status) => (
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
        <td className="py-2 px-2">
  {attendance[uniqueId]?.tanggal_daftar || "-"}
</td>

      </tr>
    );
  })}
</tbody>

      </table>

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