"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockData {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

interface SearchResult {
  symbol: string;
  name: string;
}

const FinanceDashboard = () => {
  const [symbol, setSymbol] = useState("AAPL");
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [timeRange, setTimeRange] = useState("1month");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState<{
    currentPrice?: number;
    high?: number;
    low?: number;
    volume?: number;
    changePercent?: number;
  }>({});
  const searchRef = useRef<HTMLDivElement>(null);

  const API_KEY = "H2VPF6TJRCBJIKPO";

  const timeIntervals: { [key: string]: string } = {
    "1day": "5min",
    "1week": "60min",
    "1month": "daily",
    "1year": "weekly",
  };

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`
      );

      const timeSeries = response.data["Time Series (5min)"];
      const data = Object.entries(timeSeries).map(([date, values]: any) => ({
        date,
        open: values["1. open"],
        high: values["2. high"],
        low: values["3. low"],
        close: values["4. close"],
        volume: values["5. volume"],
      }));

      setStockData(data);
      calculateMetrics(data);
    } catch (err) {
      setError("Failed to fetch stock data");
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (data: StockData[]) => {
    if (data.length < 2) return;

    const latest = data[0];
    const previous = data[1];
    const changePercent =
      ((parseFloat(latest.close) - parseFloat(previous.close)) /
        parseFloat(previous.close)) *
      100;

    setMetrics({
      currentPrice: parseFloat(latest.close),
      high: parseFloat(latest.high),
      low: parseFloat(latest.low),
      volume: parseInt(latest.volume),
      changePercent: changePercent,
    });
  };

  const handleSearch = async (query: string) => {
    if (!query) return;
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`
      );
      setSearchResults(
        response.data.bestMatches?.map((match: any) => ({
          symbol: match["1. symbol"],
          name: match["2. name"],
        })) || []
      );
    } catch (err) {
      setError("Failed to search symbols");
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) handleSearch(searchQuery);
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    if (symbol) fetchStockData();
  }, [symbol, timeRange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const chartData = {
    labels: stockData.map((entry) => entry.date),
    datasets: [
      {
        label: "Price",
        data: stockData.map((entry) => parseFloat(entry.close)),
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Search Header */}
        <div className="relative mb-8" ref={searchRef}>
          <input
            type="text"
            placeholder="Search stock symbol..."
            className="w-full p-4 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchResults.length > 0 && (
            <div className="absolute top-20 w-full bg-white rounded-xl shadow-lg z-50">
              {searchResults.map((result) => (
                <div
                  key={result.symbol}
                  onClick={() => {
                    setSymbol(result.symbol);
                    setSearchResults([]);
                    setSearchQuery("");
                  }}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                >
                  <div className="font-medium">{result.symbol}</div>
                  <div className="text-gray-500 text-sm">{result.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-gray-500 text-sm">Current Price</div>
            <div className="text-2xl font-bold">
              ${metrics.currentPrice?.toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-gray-500 text-sm">24h High</div>
            <div className="text-2xl font-bold text-green-600">
              ${metrics.high?.toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-gray-500 text-sm">24h Low</div>
            <div className="text-2xl font-bold text-red-600">
              ${metrics.low?.toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-gray-500 text-sm">Volume</div>
            <div className="text-2xl font-bold">
              {metrics.volume?.toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-gray-500 text-sm">24h Change</div>
            <div
              className={`text-2xl font-bold ${
                metrics.changePercent && metrics.changePercent >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {metrics.changePercent?.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {["1day", "1week", "1month", "1year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg ${
                timeRange === range
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          {loading ? (
            <div className="h-96 flex items-center justify-center text-gray-500">
              Loading chart...
            </div>
          ) : (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: "index",
                  intersect: false,
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { color: "#6B7280" },
                  },
                  y: {
                    grid: { color: "#F3F4F6" },
                    ticks: { color: "#6B7280" },
                  },
                },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: "#1F2937",
                    titleColor: "#F9FAFB",
                    bodyColor: "#F9FAFB",
                  },
                },
              }}
            />
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceDashboard;
