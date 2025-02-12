import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from "axios";

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarGraph = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Engaged',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color for the "Engaged" bars
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Target',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Color for the "Target" bars
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    // Fetch data from the backend API
    axios.get('http://localhost:5001/monthlydelegates')
      .then(response => {
        const data = response.data;
        
        // Prepare data for the chart
        const labels = data.map(item => item.month);
        const engagedData = data.map(item => item.engaged);
        const targetData = data.map(item => item.target);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Engaged',
              data: engagedData,
              backgroundColor: 'rgba(107, 194, 93, 1)',
              borderColor: 'rgba(107, 194, 93, 1)',
              borderWidth: 1,
            },
            {
              label: 'Target',
              data: targetData,
              backgroundColor: 'rgba(207, 81, 81, 1)',
              borderColor: 'rgba(207, 81, 81, 10)',
              borderWidth: 1,
            },
          ],
        });
      })
      .catch(error => {
        console.error('There was an error fetching the data:', error);
      });
  }, []);

  return (
    <div className="pr-8 bg-white rounded-xl">
      <h2 className="p-8 bg-white rounded-xl font-extrabold">Delegates Insight</h2>
      <div className="p-8 bg-white rounded-xl">
      <Bar data={chartData} options={{
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: ''
          },
          tooltip: {
            enabled: true,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Delegates'
            }
          },
        },
      }} />
      </div>
    </div>
  );
};

export default BarGraph;