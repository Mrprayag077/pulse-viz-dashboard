"use client"

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Page: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Mock city suggestions
  const mockCities = [
    "New York",
    "London",
    "Paris",
    "Tokyo",
    "Berlin",
    "Mumbai",
  ];

  // Mock weather data
  const mockWeatherData = {
    name: "New York",
    main: {
      temp: 22,
      humidity: 65,
      pressure: 1012,
    },
    weather: [{ description: "Clear sky", icon: "01d" }],
    wind: {
      speed: 5.5,
    },
    visibility: 10000,
    sys: {
      sunrise: 1633042800,
      sunset: 1633086000,
    },
  };

  // Mock forecast data
  const mockForecastData = [
    { dt_txt: "2023-10-01", main: { temp: 22, humidity: 65 } },
    { dt_txt: "2023-10-02", main: { temp: 21, humidity: 70 } },
    { dt_txt: "2023-10-03", main: { temp: 20, humidity: 75 } },
    { dt_txt: "2023-10-04", main: { temp: 19, humidity: 80 } },
    { dt_txt: "2023-10-05", main: { temp: 18, humidity: 85 } },
    { dt_txt: "2023-10-06", main: { temp: 17, humidity: 90 } },
    { dt_txt: "2023-10-07", main: { temp: 16, humidity: 95 } },
  ];

  // Fetch city suggestions (mock)
  const fetchCitySuggestions = (query: string) => {
    const filteredCities = mockCities.filter((city) =>
      city.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filteredCities);
  };

  // Fetch weather data (mock)
  const fetchWeatherData = (cityName: string) => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (mockCities.includes(cityName)) {
        setWeatherData(mockWeatherData);
        setForecastData(mockForecastData);
      } else {
        setError("City not found. Please try again.");
      }
      setLoading(false);
    }, 1000); // Simulate network delay
  };

  // Handle city search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city) {
      fetchWeatherData(city);
    }
  };

  // Auto-detect user location (mock)
  useEffect(() => {
    setCity("New York"); // Default city
    fetchWeatherData("New York");
  }, []);

  // Format sunrise/sunset time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Weather Forecast
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              fetchCitySuggestions(e.target.value);
            }}
            placeholder="Enter city name"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setCity(suggestion);
                    setSuggestions([]);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="ml-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Loading and Error States */}
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Current Weather */}
      {weatherData && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Current Weather in {weatherData.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Temperature:</span>{" "}
                {weatherData.main.temp}°C
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Humidity:</span>{" "}
                {weatherData.main.humidity}%
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Pressure:</span>{" "}
                {weatherData.main.pressure} hPa
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Wind Speed:</span>{" "}
                {weatherData.wind.speed} m/s
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Weather:</span>{" "}
                {weatherData.weather[0].description}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Visibility:</span>{" "}
                {weatherData.visibility / 1000} km
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Sunrise:</span>{" "}
                {formatTime(weatherData.sys.sunrise)}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Sunset:</span>{" "}
                {formatTime(weatherData.sys.sunset)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Forecast Chart */}
      {forecastData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            7-Day Forecast
          </h2>
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={forecastData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dt_txt" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="main.temp"
                  stroke="#8884d8"
                  name="Temperature (°C)"
                />
                <Line
                  type="monotone"
                  dataKey="main.humidity"
                  stroke="#82ca9d"
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;