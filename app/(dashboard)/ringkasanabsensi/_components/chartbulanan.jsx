import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AttendanceChart = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoverIndex, setHoverIndex] = useState(null);
  const [data, setData] = useState([
    { name: 'Hadir', jumlah: 0, color: "#5CB338", hoverColor: "#4AA62D" },
    { name: 'Tidak Hadir', jumlah: 0, color: "#FB4141", hoverColor: "#D93636" },
    { name: 'Terlambat', jumlah: 0, color: "#FFBB03", hoverColor: "#E6A800" },
  ]);

  useEffect(() => {
    const bulan = selectedDate.getMonth() + 1;
    const tahun = selectedDate.getFullYear();

    fetch(`http://localhost:8000/api/statistik-bulanan?bulan=${bulan}&tahun=${tahun}`)
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          setData(res.data);
        }
      })
      .catch(() => {
        // fallback jika API gagal
        setData([
          { name: 'Hadir', jumlah: 0, color: "#5CB338", hoverColor: "#4AA62D" },
          { name: 'Tidak Hadir', jumlah: 0, color: "#FB4141", hoverColor: "#D93636" },
          { name: 'Terlambat', jumlah: 0, color: "#FFBB03", hoverColor: "#E6A800" },
        ]);
      });
  }, [selectedDate]);

  return (
    <div className="w-full h-auto p-4 bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-xl font-bold text-center mb-4">Statistik Kehadiran</h2>

      {/* Pilihan Bulan & Tahun */}
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
            tick={false} 
            axisLine={false}
            tickLine={false} 
          />
          <YAxis
            dataKey="name"
            type="category"
            width={0} 
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <Tooltip formatter={(value) => `${value}%`} />
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
              formatter={(value) => `${value}%`}
              fill="#333"
              fontSize={14}
              fontWeight="bold"
              offset={10}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
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

export default AttendanceChart;
