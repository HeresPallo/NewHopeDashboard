import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SupportStatusGraph = ({ supportStatuses = [] }) => {
  // ✅ Ensure supportStatuses is always an array
  const counts = { supports: 0, opposes: 0, neutral: 0 };

  supportStatuses.forEach((status) => {
    if (status === "supports") counts.supports++;
    if (status === "opposes") counts.opposes++;
    if (status === "neutral") counts.neutral++;
  });

  const data = {
    labels: ["Supports", "Opposes", "Neutral"],
    datasets: [
      {
        label: "Support Status",
        data: [counts.supports, counts.opposes, counts.neutral],
        backgroundColor: ["#16a34a", "#dc2626", "#6b7280"], // ✅ Vibrant Modern Colors
        borderRadius: 12, // ✅ Softer Rounded Bars
        barThickness: 40, // ✅ Adjusted Bar Thickness for Sleek Look
        hoverBackgroundColor: ["#22c55e", "#ef4444", "#9ca3af"], // ✅ Hover Effect for Better UX
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // ✅ Allows Full Height Display
    plugins: {
      legend: { display: false }, // ✅ Minimalist Look without Legend
      tooltip: {
        backgroundColor: "#1f2937", // ✅ Dark Tooltip for Contrast
        titleColor: "#ffffff",
        bodyColor: "#f3f4f6",
        bodyFont: { size: 14, weight: "bold" },
        padding: 12,
        displayColors: false, // ✅ Removes Color Box in Tooltip
      },
    },
    scales: {
      x: {
        grid: { display: false }, // ✅ Removes X-Axis Gridlines for Clean Look
        ticks: { font: { size: 14, weight: "600" }, color: "#1f2937" }, // ✅ Bolder X-Axis Labels
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.08)", drawBorder: false }, // ✅ Softer Y-Axis Gridlines
        ticks: { font: { size: 14, weight: "600" }, color: "#1f2937" }, // ✅ Consistent Text Styling
      },
    },
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 w-full h-72 flex items-center justify-center mt-8 mb-8">
      <h2 className="absolute text-lg font-semibold text-gray-800 mb-64"></h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default SupportStatusGraph;
