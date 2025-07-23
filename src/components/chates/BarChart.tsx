import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import styled from "styled-components";

const Container = styled.div`
  box-sizing: border-box;
  flex: 1;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
  margin: 0;
`;

const Title = styled.h2`
  font-size: 1rem;
`;

interface ChartDataItem {
  _id: string;
  count: number;
}

interface BarChartProps {
  data: ChartDataItem[];
  color?: boolean;
  title?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  color = false,
  title = "Bar Chart",
}) => {
  const [chartData, setChartData] = useState({
    labels: data.map((d) => d._id),
    datasets: [
      {
        label: "Purchase Count",
        data: data.map((d) => d.count),
        backgroundColor: color
          ? data.map((d) => d._id)
          : [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
        hoverBorderWidth: 1,
        hoverBorderColor: "#000",
      },
    ],
  });

  const options = {
    maintainAspectRatio: false,
  };

  return (
    <Container>
      <Title>{title}</Title>
      <Bar data={chartData} options={options} />
    </Container>
  );
};

export default BarChart;
