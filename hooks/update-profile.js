import axios from "axios";
import { useState } from "react";
import { getCookie } from "@/lib/cookieFunction";

const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const getToken = () => {
    const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME;
    const token = getCookie(cookieName);
    return `Bearer ${token}`;
  };

  const updateData = async (body) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await axios.put(
        "http://localhost:8000/api/update-profile",
        body,
        {
          headers: {
            Authorization: getToken(),
            ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Gagal memperbarui profil");
      }

      setData(response.data);
      console.log("Update Success:", response.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.error("Update Failed:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (body) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await axios.put(
        "http://localhost:8000/api/password/change",
        body,
        {
          headers: {
            Authorization: getToken(),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Gagal memperbarui password");
      }

      setData(response.data);
      console.log("Password Update Success:", response.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.error("Password Update Failed:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileImage = async (imageFile) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const formData = new FormData();
      formData.append("foto_profil", imageFile);

      const response = await axios.post(
        "http://localhost:8000/api/update-profile-image",
        formData,
        {
          headers: {
            Authorization: getToken(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Gagal mengunggah foto profil");
      }

      setData(response.data);
      console.log("Foto Profil Update Success:", response.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.error("Foto Profil Update Failed:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    updateData,
    updatePassword,
    updateProfileImage,
  };
};

export default useUpdateProfile;
