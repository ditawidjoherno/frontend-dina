import { getCookie } from "@/lib/cookieFunction";
import axios from "axios";
import { useState } from "react";

const addUser = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const cookie = process.env.NEXT_PUBLIC_COOKIE_NAME;
  const token = getCookie(cookie);
  const bearerToken = `Bearer ${token}`;

const user = async (body) => {
  setLoading(true);
  setError(null);
  setData(null);

  try {
    console.log("Kirim data:", body);

    const response = await axios.post(
      "http://localhost:8000/api/addUser",
      body,
      {
        headers: {
          Authorization: bearerToken,
          "Content-Type": "application/json",
        },
      }
    );

    setData(response.data);
    console.log(response);
  } catch (error) {
    if (error.response) {
      // Response error dari server
      setError(error.response.data.message || "Terjadi kesalahan");
      console.error("Error response:", error.response.data);
    } else {
      setError(error.message);
      console.error("Error:", error.message);
    }
  } finally {
    setLoading(false);
  }
};


  return { loading, error, data, user };
};

export default addUser;

