"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const KehadiranChart = () => {
  const [chartData, setChartData] = useState(null);

  const tanggalHariIni = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/kehadiran-chart")
      .then((res) => res.json())
      .then((data) => {
        const labels = data.map((item) => item.kelas);
        const hadir = data.map((item) => item.hadir);
        const total = data.map((item) => item.total);

        setChartData({
          labels,
          datasets: [
            {
              label: "Jumlah Kehadiran",
              data: hadir,
              backgroundColor: "#B2A5FF",
              borderRadius: 20,
            },
            {
              label: "Jumlah Keseluruhan Siswa",
              data: total,
              backgroundColor: "#493D9E",
              borderRadius: 20,
            },
          ],
        });
      })
      .catch((err) => console.error("Gagal memuat data chart:", err));
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: `Kehadiran Siswa - ${tanggalHariIni}`,
        color: "#000",
      },
    },
    scales: {
      x: {
        ticks: { color: "#000" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#000" },
        grid: { color: "rgba(0, 0, 0, 0.2)" },
      },
    },
    layout: {
      padding: 0,
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-0 rounded-2xl shadow-lg bg-white mt-5" style={{ height: "450px" }}>
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p className="text-center p-10">Memuat data...</p>
      )}
    </div>
  );
};

export default KehadiranChart;
