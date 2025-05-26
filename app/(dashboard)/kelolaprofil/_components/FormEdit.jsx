"use client"
import Image from "next/image";
import { FaEdit, FaCamera, FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { useState, useEffect } from "react";
import getProfile from "@/hooks/get-profile";
import updateProfile from "@/hooks/update-profile";

export default function ProfileEditPopup({ isOpen, onClose }) {
  const { data, getProfileUser } = getProfile();
  const { loading, error, updateData } = updateProfile();

  const [updatedNama, setUpdatedNama] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedAgama, setUpdatedAgama] = useState('');
  const [updatedNomorHp, setUpdatedNomorHp] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorState, setError] = useState(null);

  useEffect(() => {
    getProfileUser(); // ambil data user saat komponen mount
  }, []);

  useEffect(() => {
    if (data) {
      setUpdatedNama(data.nama || '');
      setUpdatedEmail(data.email || '');
      setUpdatedAgama(data.agama || '');
      setUpdatedNomorHp(data.nomor_hp || '');
      setPreviewImage(data.foto_profil || "/images/profil.jpg");
    }
  }, [data]);

  if (!isOpen) return null;

  const handleImageUpload = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

const handleSave = async () => {
  setSuccessMessage('');
  setError(null);  // Reset error sebelum mencoba update

  const profileData = new FormData();
  profileData.append('nama', updatedNama);
  profileData.append('email', updatedEmail);
  profileData.append('agama', updatedAgama);
  profileData.append('nomor_hp', updatedNomorHp);

  // Tambahkan foto jika ada
  if (imageFile) {
    profileData.append('foto_profil', imageFile);
  }

  try {
    await updateData(profileData); // Kirim FormData
    setSuccessMessage("Berhasil memperbarui profil.");
    getProfileUser(); // refresh data
    onClose(); // tutup popup
  } catch (e) {
    console.error(e); // Untuk melihat error secara lebih detail di console
    setError(e.response?.data?.message || "Terjadi kesalahan saat memperbarui profil.");
  }
};


  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-[90%] max-w-[600px]">
        <h2 className="text-2xl font-bold text-center mb-6">Kelola Profil</h2>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 relative">
          <div className="flex justify-center relative mt-3">
            <Image
              src={previewImage}
              alt="Profile Picture"
              width={210}
              height={210}
              className="rounded-xl object-cover"
            />
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              className="absolute -bottom-3 -right-1 bg-yellow-500 text-white p-2 rounded-full shadow-md"
              onClick={handleImageUpload}
            >
              <FaCamera />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 w-full">
            <InputField
              label="Nama"
              value={updatedNama}
              onChange={setUpdatedNama}
            />
            <SelectField
              label="Agama"
              value={updatedAgama}
              onChange={setUpdatedAgama}
              options={["Kristen", "Islam", "Hindu", "Buddha", "Konghucu"]}
            />
            <InputField
              label="No HP"
              value={updatedNomorHp}
              onChange={setUpdatedNomorHp}
            />
            <InputField
              label="Email"
              value={updatedEmail}
              type="email"
              onChange={setUpdatedEmail}
            />
          </div>
        </div>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {successMessage && (
          <p className="text-green-600 mt-4 text-center">{successMessage}</p>
        )}

        <div className="flex justify-end gap-4 mt-10">
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md flex items-center gap-2 disabled:opacity-60"
            onClick={handleSave}
            disabled={loading}
          >
            <FaRegCheckCircle /> {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md flex items-center gap-2"
            onClick={onClose}
          >
            <MdOutlineCancel /> Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}

// Komponen tambahan untuk input field
function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <p className="font-semibold text-lg">{label}</p>
      <div className="flex items-center border p-2 rounded-md">
        <input
          type={type}
          className="w-full focus:outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <FaEdit className="text-gray-500" />
      </div>
    </div>
  );
}

// Komponen tambahan untuk select field
function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <p className="font-semibold text-lg">{label}</p>
      <select
        className="w-full border p-2 rounded-md"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Pilih {label} --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
