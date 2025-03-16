"use client"
import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { Loading } from "@/components";


const FinanceDashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      const response = await fetch(
        "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=H2VPF6TJRCBJIKPO"
      );
      const data = await response.json();
      const timeSeries = data["Time Series (5min)"] || {};

      const formattedData = Object.keys(timeSeries).map((timestamp) => ({
        time: timestamp,
        price: parseFloat(timeSeries[timestamp]["1. open"]),
      }));

      setStockData(formattedData);
      setLoading(false);
    };

    fetchStockData();
  }, []);

  const chartData = {
    labels: stockData.map((item) => item.time),
    datasets: [
      {
        label: "Stock Price",
        data: stockData.map((item) => item.price),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: { display: true },
      y: { display: true },
    },
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-6">Stock Market Data</h1>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default FinanceDashboard;
