import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const options = {
  responsive: false,
  maintainAspectRatio: false,
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

export const LineChart = ({ data, titles }) => {
  return (
    <div>
      <Line
        height={140}
        data={{
          labels: Array.from(Array(data[0].length).keys()).map(
            (val) => 'Round ' + val
          ),
          datasets: [
            {
              data: data[0],
              label: titles[0],
              borderColor: '#7F95D1',
              fill: true,
            },
            {
              data: data[1],
              label: titles[1],
              borderColor: '#68B0AB',
              fill: true,
            },
          ],
          options,
        }}
      />
    </div>
  );
};
