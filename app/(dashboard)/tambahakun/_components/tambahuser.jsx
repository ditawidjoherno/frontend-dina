"use client";
import React, { useState, useEffect } from "react";
import { FaUserPlus, FaDownload } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TambahAkunForm from "./InputManual";
import { IoMdCloseCircle } from "react-icons/io";
import ProfileDetail from "./DetailProfil";

const UserTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showAddAccountPopup, setShowAddAccountPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/siswa') // Ganti dengan URL API Laravel sesuai server kamu
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data siswa');
        return res.json();
      })
      .then((data) => {
        setStudents(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // const formatName = (fullName) => {
  //   const nameParts = fullName.split(" ");
  //   if (nameParts.length <= 3) return fullName;
  //   return `${nameParts[0]} ${nameParts[1][0]}. ${nameParts[2][0]}. ${nameParts[nameParts.length - 1]}`;
  // };

  const filteredUsers = students.filter((students) =>
    students.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();
      if (fileType !== "xls" && fileType !== "xlsx") {
        alert("❌ Hanya file Excel (.xls, .xlsx) yang diperbolehkan!");
        return;
      }
      setFile(selectedFile);
      setShowPopup(true);
    }
  };

  const handleConfirmUpload = () => {
    alert("✅ File berhasil disiapkan untuk upload: " + file.name);
    setShowPopup(false);
  };

  const handleCloseAddAccountPopup = () => {
    setShowAddAccountPopup(false);
  };

  const handleOpenProfile = (user) => {
    setSelectedUser(user);
  };

  const handleCloseProfilePopup = () => {
    setSelectedUser(null);
  };

  return (
    <div className="p-4 mt-10 bg-white rounded-xl shadow-md w-full">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-4">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          {/* ✅ Upload file */}
          <input
            type="file"
            id="fileUpload"
            accept=".xls,.xlsx"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <Button
            variant="text"
            color="primary"
            onClick={() => document.getElementById("fileUpload").click()}
          >
            Upload Data Siswa
          </Button>

          {/* ✅ Tombol Tambah Akun */}
          <Button
            variant="contained"
            color="primary"
            className="flex items-center gap-2 rounded-xl"
            onClick={() => setShowAddAccountPopup(true)}
          >
            <FaUserPlus size={16} />
          </Button>

          {/* ✅ Tombol Download */}
          <Button
            variant="contained"
            color="success"
            className="flex items-center gap-2 rounded-xl"
          >
            <FaDownload size={16} />
          </Button>
        </div>
      </div>

      {/* ✅ Tabel Data User */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">NISN</th>
              <th className="border border-gray-300 p-2">Nama</th>
              <th className="border border-gray-300 p-2">Kelas</th>
              <th className="border border-gray-300 p-2">Tanggal Lahir</th>
              <th className="border border-gray-300 p-2">Jenis Kelamin</th>
              <th className="border border-gray-300 p-2">Agama</th>
              <th className="border border-gray-300 p-2">Phone</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Password</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((students, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 p-2">{students.nisn}</td>
                <td className="border border-gray-300 p-2">
                  <a
                    href="#"
                    className="text-blue-500 underline hover:text-blue-700"
                    onClick={() => handleOpenProfile(students)}
                  >
                    {students.nama || "-"}
                  </a>
                </td>
                <td className="border border-gray-300 p-2">{students.kelas || "-"}</td>
                <td className="border border-gray-300 p-2">
                  {students.tanggal_lahir
                    ? new Date(students.tanggal_lahir).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    : "-"}
                </td>
                <td className="border border-gray-300 p-2">{students.jenis_kelamin || "-"}</td>
                <td className="border border-gray-300 p-2">{students.agama || "-"}</td>
                <td className="border border-gray-300 p-2">{students.nomor_hp || "-"}</td>
                <td className="border border-gray-300 p-2">{students.email || "-"}</td>
                <td className="border border-gray-300 p-2">{students.password || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <ProfileDetail user={selectedUser} onClose={handleCloseProfilePopup} />
      )}

      {/* ✅ Popup Tambah Akun */}
      {showAddAccountPopup && (
        <div className="fixed mt-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white h-auto p-6 rounded-2xl shadow-lg max-w-4xl relative">
            <button
              className="absolute top-2 right-2 text-gray-600 text-xl"
              onClick={handleCloseAddAccountPopup}
            >
              <IoMdCloseCircle className="h-8 w-8 text-red-800" />
            </button>
            <TambahAkunForm onClose={handleCloseAddAccountPopup} />
          </div>
        </div>
      )}

      {/* ✅ Popup Konfirmasi Upload */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-2 rounded-2xl shadow-lg max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 text-xl"
              onClick={() => setShowPopup(false)}
            >
              ✖
            </button>
            <p className="text-center text-gray-700">
              Pastikan informasi sudah sesuai <br /> lanjutkan proses 'Submit'?
            </p>
            <div className="flex justify-center mt-4">
              <Button
                variant="contained"
                style={{ backgroundColor: "#3f51b5", color: "white" }}
                onClick={handleConfirmUpload}
              >
                YA
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
