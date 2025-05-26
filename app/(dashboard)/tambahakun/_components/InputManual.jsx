// components/TambahAkunForm.jsx
import { useState } from "react";
import { FaTimes, FaCalendarAlt } from "react-icons/fa";
import addUser from "@/hooks/use-register";

export default function TambahAkunForm() {
  const { user, loading, error, data } = addUser();

  const [formData, setFormData] = useState({
    nisn: "",
    nama: "",
    kelas: "",
    tanggal_lahir: "",
    nomor_hp: "",
    jenis_kelamin: "",
    agama: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...formData,
    role: "siswa",
    nip: "",
  };

  await user(payload);
};

  return (
    <div className="relative">
      {/* Judul */}
      <h2 className="text-center text-xl font-bold mb-2">Tambah Akun</h2>

      {/* Form */}
      <form className="grid grid-cols-2 gap-3" onSubmit={handleSubmit}>
        {/* NISN */}
        <div>
          <label className="block font-medium mb-1">NISN</label>
          <input
            type="text"
            name="nisn"
            value={formData.nisn}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-blue-400 bg-gray-100"
          />
        </div>

        {/* Agama */}
        <div>
          <label className="block font-medium mb-1">Agama</label>
          <select
            name="agama"
            value={formData.agama}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-blue-400 bg-gray-100"
          >
            <option value="">Pilih Agama</option>
            <option value="islam">Islam</option>
            <option value="kristen">Kristen</option>
            <option value="katolik">Katolik</option>
            <option value="hindu">Hindu</option>
            <option value="buddha">Buddha</option>
            <option value="konghucu">Konghucu</option>
          </select>
        </div>

        {/* Nama */}
        <div>
          <label className="block font-medium mb-1">Nama</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-blue-400 bg-gray-100"
          />
        </div>

        {/* Kelas */}
        <div>
          <label className="block font-medium mb-1">Kelas</label>
          <select
            name="kelas"
            value={formData.kelas}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-blue-400 bg-gray-100"
          >
            <option value="">Pilih Kelas</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
        </div>

        {/* Tanggal Lahir */}
        <div>
          <label className="block font-medium mb-1">Tanggal Lahir</label>
          <input
            type="date"
            name="tanggal_lahir"
            value={formData.tanggal_lahir}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-blue-400 bg-gray-100"
          />
        </div>

        {/* No HP */}
        <div>
          <label className="block font-medium mb-1">No HP</label>
          <input
            type="text"
            name="nomor_hp"
            value={formData.nomor_hp}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-blue-400 bg-gray-100"
          />
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className="block font-medium mb-1">Jenis Kelamin</label>
          <select
            name="jenis_kelamin"
            value={formData.jenis_kelamin}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-blue-400 bg-gray-100"
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-blue-400 bg-gray-100"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-blue-400 bg-gray-100"
          />
        </div>
      </form>

      {/* Tombol Buat Akun */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-500 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-600 transition"
        >
          {loading ? "Menyimpan..." : "Buat Akun"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {data && <p className="text-green-500 mt-2">Akun berhasil dibuat!</p>}
      </div>
    </div>
  );
}
