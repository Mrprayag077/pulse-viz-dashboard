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

interface MetricCardProps {
  title: string;
  value: string | number | undefined;
  change?: number;
  prefix?: string;
  suffix?: string;
  colorClass?: string;
  icon?: React.ReactNode;
}

const FinanceDashboard: React.FC = () => {
  const [symbol, setSymbol] = useState<string>("AAPL");
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [timeRange, setTimeRange] = useState<string>("1month");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [metrics, setMetrics] = useState<{
    currentPrice?: number;
    high?: number;
    low?: number;
    volume?: number;
    changePercent?: number;
    previousClose?: number;
    open?: number;
    marketCap?: number;
  }>({});
  const [companyInfo, setCompanyInfo] = useState<{
    name?: string;
    sector?: string;
    industry?: string;
    description?: string;
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
      const interval = timeIntervals[timeRange];
      let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`;

      if (timeRange === "1month") {
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
      } else if (timeRange === "1year") {
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${API_KEY}`;
      }

      const response = await axios.get(url);

      let timeSeries: any;
      if (timeRange === "1day") {
        timeSeries = response.data["Time Series (5min)"];
      } else if (timeRange === "1week") {
        timeSeries = response.data["Time Series (60min)"];
      } else if (timeRange === "1month") {
        timeSeries = response.data["Time Series (Daily)"];
      } else if (timeRange === "1year") {
        timeSeries = response.data["Weekly Time Series"];
      }

      if (!timeSeries) {
        throw new Error("No data available");
      }

      const data = Object.entries(timeSeries)
        .slice(0, timeRange === "1year" ? 52 : 30)
        .map(([date, values]: [string, any]) => ({
          date,
          open: values["1. open"],
          high: values["2. high"],
          low: values["3. low"],
          close: values["4. close"],
          volume: values["5. volume"],
        }))
        .reverse();

      setStockData(data);
      calculateMetrics(data);

      // Fetch company overview
      const overviewResponse = await axios.get(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
      );

      if (overviewResponse.data) {
        setCompanyInfo({
          name: overviewResponse.data.Name,
          sector: overviewResponse.data.Sector,
          industry: overviewResponse.data.Industry,
          description: overviewResponse.data.Description,
        });
      }
    } catch (err) {
      setError("Failed to fetch stock data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (data: StockData[]) => {
    if (data.length < 2) return;

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
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
      previousClose: parseFloat(previous.close),
      open: parseFloat(latest.open),
      marketCap: parseFloat(latest.close) * 1000000000, // Placeholder for market cap calculation
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
    labels: stockData.map((entry) => {
      const date = new Date(entry.date);
      if (timeRange === "1day") {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (timeRange === "1week") {
        return `${date.toLocaleDateString([], {
          month: "short",
          day: "numeric",
        })} ${date.toLocaleTimeString([], { hour: "2-digit" })}`;
      } else if (timeRange === "1month") {
        return date.toLocaleDateString([], { month: "short", day: "numeric" });
      } else {
        return date.toLocaleDateString([], {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    }),
    datasets: [
      {
        label: "Price",
        data: stockData.map((entry) => parseFloat(entry.close)),
        borderColor:
          metrics.changePercent && metrics.changePercent >= 0
            ? "#10B981"
            : "#EF4444",
        backgroundColor:
          metrics.changePercent && metrics.changePercent >= 0
            ? "rgba(16, 185, 129, 0.1)"
            : "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor:
          metrics.changePercent && metrics.changePercent >= 0
            ? "#10B981"
            : "#EF4444",
        pointHoverBorderColor: "#fff",
        fill: true,
      },
    ],
  };

  const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    change,
    prefix = "",
    suffix = "",
    colorClass = "",
    icon,
  }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <span className="text-gray-500 text-sm font-medium">{title}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="flex items-end">
        <div className={`text-2xl font-bold ${colorClass}`}>
          {prefix}
          {typeof value === "number"
            ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
            : value}
          {suffix}
        </div>
        {change !== undefined && (
          <div
            className={`ml-2 text-sm font-medium ${
              change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {change >= 0 ? "+" : ""}
            {change.toFixed(2)}%
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Financial Dashboard
            </h1>
            <p className="text-gray-500">
              Real-time stock market data and analytics
            </p>
          </div>

          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative w-full md:w-96" ref={searchRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search stocks (e.g., AAPL, MSFT)..."
                className="pl-10 w-full p-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="absolute mt-1 w-full bg-white rounded-xl shadow-lg z-50 border border-gray-100 overflow-hidden">
                  {searchResults.map((result) => (
                    <div
                      key={result.symbol}
                      onClick={() => {
                        setSymbol(result.symbol);
                        setSearchResults([]);
                        setSearchQuery("");
                      }}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-semibold text-indigo-600">
                          {result.symbol}
                        </div>
                        <div className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-1">
                          Stock
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm truncate">
                        {result.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stock Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">{symbol}</h2>
                {companyInfo.name && (
                  <span className="text-lg text-gray-500">
                    {companyInfo.name}
                  </span>
                )}
              </div>
              {companyInfo.sector && (
                <div className="text-sm text-gray-500 mb-4">
                  {companyInfo.sector} • {companyInfo.industry}
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">
                  ${metrics.currentPrice?.toFixed(2)}
                </div>
                <div
                  className={`text-lg font-medium ${
                    metrics.changePercent && metrics.changePercent >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {metrics.changePercent && metrics.changePercent >= 0
                    ? "+"
                    : ""}
                  {metrics.changePercent?.toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-start">
              <div className="text-gray-500 text-sm">
                <div>
                  Market Cap: $
                  {(metrics.marketCap
                    ? metrics.marketCap / 1000000000
                    : 0
                  ).toFixed(2)}
                  B
                </div>
                <div>Volume: {metrics.volume?.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm w-fit">
          {["1day", "1week", "1month", "1year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg transition-all ${
                timeRange === range
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {range === "1day"
                ? "1D"
                : range === "1week"
                ? "1W"
                : range === "1month"
                ? "1M"
                : "1Y"}
            </button>
          ))}
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Open"
            value={metrics.open}
            prefix="$"
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <MetricCard
            title="Day High"
            value={metrics.high}
            prefix="$"
            colorClass="text-green-600"
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
          />
          <MetricCard
            title="Day Low"
            value={metrics.low}
            prefix="$"
            colorClass="text-red-600"
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                />
              </svg>
            }
          />
          <MetricCard
            title="Previous Close"
            value={metrics.previousClose}
            prefix="$"
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            }
          />
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-900">Price Chart</h3>
            <div className="text-sm text-gray-500">
              {stockData.length > 0
                ? `Last updated: ${new Date().toLocaleString()}`
                : ""}
            </div>
          </div>

          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center text-gray-500">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <div>Loading chart data...</div>
            </div>
          ) : stockData.length === 0 ? (
            <div className="h-96 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="mt-2">No chart data available</p>
              </div>
            </div>
          ) : (
            <div className="h-96">
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
                      ticks: {
                        color: "#6B7280",
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 8,
                      },
                    },
                    y: {
                      grid: { color: "#F3F4F6" },
                      ticks: {
                        color: "#6B7280",
                        callback: function (value) {
                          return "$" + value;
                        },
                      },
                      position: "right",
                    },
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: "#1F2937",
                      titleColor: "#F9FAFB",
                      bodyColor: "#F9FAFB",
                      bodyFont: { size: 13 },
                      titleFont: { size: 13 },
                      padding: 12,
                      displayColors: false,
                      callbacks: {
                        label: function (context) {
                          return `Price: $${context.parsed.y.toFixed(2)}`;
                        },
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Company Overview */}
        {companyInfo.description && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">
              Company Overview
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {companyInfo.description}
            </p>
          </div>
        )}

        {/* Volume Chart */}
        {stockData.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="font-semibold text-gray-900 mb-6">Trading Volume</h3>
            <div className="h-64">
              <Line
                data={{
                  labels: chartData.labels,
                  datasets: [
                    {
                      label: "Volume",
                      data: stockData.map((entry) => parseInt(entry.volume)),
                      backgroundColor: "rgba(99, 102, 241, 0.2)",
                      borderColor: "rgba(99, 102, 241, 1)",
                      borderWidth: 2,
                      tension: 0.4,
                      pointRadius: 0,
                      pointHoverRadius: 5,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      grid: { color: "#F3F4F6" },
                      ticks: {
                        color: "#6B7280",
                        callback: function (value) {
                          return Number(value).toLocaleString();
                        },
                      },
                      position: "right",
                    },
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: "#1F2937",
                      titleColor: "#F9FAFB",
                      bodyColor: "#F9FAFB",
                      callbacks: {
                        label: function (context) {
                          return `Volume: ${Number(
                            context.parsed.y
                          ).toLocaleString()}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Recent News - Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-900">Recent News</h3>
            <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
              View all
            </button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-gray-900">
                    {symbol} announces{" "}
                    {item === 1
                      ? "quarterly earnings"
                      : item === 2
                      ? "new product launch"
                      : "strategic partnership"}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {item === 1
                    ? `${
                        companyInfo.name || symbol
                      } reported better-than-expected earnings for the latest quarter, driven by strong growth in its core business segments.`
                    : item === 2
                    ? `The company unveiled its latest innovation, aiming to strengthen its market position and drive future growth.`
                    : `A new strategic alliance was announced today that could expand the company's market reach.`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center">
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceDashboard;
