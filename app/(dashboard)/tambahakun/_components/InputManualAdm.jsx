import { useState, useEffect } from "react";
import { FaTimes, FaCalendarAlt } from "react-icons/fa";
import addUser from "@/hooks/use-register";

export default function TambahAkunForm() {
 const { user, loading, error, data } = addUser();
  const [kelas, setKelas] = useState("");
  const [kelasList, setKelasList] = useState(["10", "11", "12", "Non-Kelas"]);
  const [newKelas, setNewKelas] = useState("");
  const [showInput, setShowInput] = useState(false);
  
    const handleKelasChange = (e) => {
    const value = e.target.value;
    if (value === "tambah-kelas") {
      setShowInput(true);
    } else {
      setKelas(value);
      setShowInput(false);
    }
  };

  const handleTambahKelas = () => {
    if (newKelas.trim() !== "" && !kelasList.includes(newKelas)) {
      setKelasList([...kelasList, newKelas]);
      setKelas(newKelas);
      setNewKelas("");
      setShowInput(false);
    }
  };

  useEffect(() => {
  setFormData((prev) => ({
    ...prev,
    kelas: kelas,
  }));
}, [kelas]);
  
  const [formData, setFormData] = useState({
    nip: "",
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
    role: "guru",
    nisn: "",
  };

  await user(payload);
};


  return (
    <div className="relative">
      {/* Judul */}
      <h2 className="text-center text-xl font-bold mb-4">Tambah Akun</h2>

      {/* Form */}
      <form className="grid grid-cols-2 gap-6">
        {/* NIP */}
        <div>
          <label className="block font-medium mb-1">NIP</label>
          <input
            type="text"
            name="nip"
            value={formData.nip}
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
          <label className="block font-medium mb-1">Jabatan</label>
          <select
  value={formData.kelas}
            onChange={handleKelasChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-400 bg-gray-100"
          >
            <option value="">Pilih Opsi</option>
            {kelasList.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
            <option value="tambah-kelas">Tambah Kelas</option>
          </select>
          {showInput && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={newKelas}
                onChange={(e) => setNewKelas(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-400 bg-gray-100"
                placeholder="Masukkan nama kelas"
              />
              <button
                type="button"
                onClick={handleTambahKelas}
                className="bg-green-500 text-white font-medium py-2 px-4 rounded-md hover:bg-green-600 transition"
              >
                Tambah
              </button>
            </div>
          )}
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
  className="bg-blue-500 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-600 transition"
>
  Buat Akun
</button>

      </div>
    </div>
  );
}
