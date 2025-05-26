'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const DiagramBulan = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([
    { name: 'Berkontribusi', jumlah: 0, color: "#640D5F", hoverColor: "#4AA62D" },
    { name: 'Tidak Berkontribusi', jumlah: 0, color: "#D91656", hoverColor: "#D93636" }
  ]);
  const [hoverIndex, setHoverIndex] = useState(null);

  const searchParams = useSearchParams();
  const kelas = searchParams.get('kelas');

  useEffect(() => {
    const fetchData = async () => {
      const bulan = selectedDate.getMonth() + 1; // Januari = 0
      const tahun = selectedDate.getFullYear();

      try {
        const response = await axios.get(`http://localhost:8000/api/kontribusi-piket`, {
          params: {
            bulan,
            tahun
          }
        });

        const rekapPerKelas = response.data.data.find(item => item.kelas === kelas);

        if (rekapPerKelas) {
          const berkontribusi = Number(rekapPerKelas.jumlah_berkontribusi);
          const tidakBerkontribusi = Number(rekapPerKelas.jumlah_tidak_berkontribusi);

          const total = berkontribusi + tidakBerkontribusi;
          const totalValue = total > 0 ? total : 1;

          const persenBerkontribusi = (berkontribusi / totalValue) * 100;
          const persenTidakBerkontribusi = (tidakBerkontribusi / totalValue) * 100;

          setData([
            {
              name: 'Berkontribusi',
              jumlah: persenBerkontribusi,
              color: "#640D5F",
              hoverColor: "#4AA62D"
            },
            {
              name: 'Tidak Berkontribusi',
              jumlah: persenTidakBerkontribusi,
              color: "#D91656",
              hoverColor: "#D93636"
            }
          ]);
        } else {
          setData([
            { name: 'Berkontribusi', jumlah: 0, color: "#640D5F", hoverColor: "#4AA62D" },
            { name: 'Tidak Berkontribusi', jumlah: 0, color: "#D91656", hoverColor: "#D93636" }
          ]);
        }

      } catch (error) {
        console.error('Gagal mengambil data:', error);
      }
    };

    fetchData();
  }, [selectedDate, kelas]);

  return (
    <div className="p-4 mt-5">
      <h2 className="text-xl font-bold text-center mb-4 mt-5">Capaian Kontribusi</h2>

      <div className="flex items-center space-x-4 mb-4 ml-5">
        <p className="font-semibold">Pilih Bulan & Tahun:</p>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          className="border px-3 py-2 rounded-lg shadow-sm"
        />
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart layout="vertical" data={data} margin={{ left: 20, right: 40 }} barGap={8}>
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(tick) => `${tick.toFixed(0)}%`}
          />
          <YAxis dataKey="name" type="category" width={120} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value) => `${value.toFixed(1)}%`} cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
          <Bar dataKey="jumlah" barSize={45} radius={[0, 10, 10, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={hoverIndex === index ? entry.hoverColor : entry.color}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            ))}
            <LabelList
              dataKey="jumlah"
              position="right"
              formatter={(value) => `${value.toFixed(1)}%`}
              fill="#333"
              fontSize={14}
              fontWeight="bold"
              offset={10}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-5 h-5" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm font-medium">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiagramBulan;
