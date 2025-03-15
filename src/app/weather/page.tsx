"use client"
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const Page: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const mockCities = [
    "New York",
    "London",
    "Paris",
    "Tokyo",
    "Berlin",
    "Mumbai",
  ];

  const mockWeatherData = {
    name: "New York",
    main: { temp: 22, humidity: 65 },
    weather: [{ description: "Clear sky" }],
    wind: { speed: 5.5 },
  };

  const mockForecastData = [
    { dt_txt: "2023-10-01", main: { temp: 22, humidity: 65 } },
    { dt_txt: "2023-10-02", main: { temp: 21, humidity: 70 } },
    { dt_txt: "2023-10-03", main: { temp: 20, humidity: 75 } },
    { dt_txt: "2023-10-04", main: { temp: 19, humidity: 80 } },
    { dt_txt: "2023-10-05", main: { temp: 18, humidity: 85 } },
    { dt_txt: "2023-10-06", main: { temp: 17, humidity: 90 } },
    { dt_txt: "2023-10-07", main: { temp: 16, humidity: 95 } },
  ];

  const fetchCitySuggestions = (query: string) => {
    const filteredCities = mockCities.filter((city) =>
      city.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filteredCities);
  };

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
    }, 1000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city) fetchWeatherData(city);
  };

  useEffect(() => {
    setCity("New York");
    fetchWeatherData("New York");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8 font-sans">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-10">
        Weather Forecast
      </h1>

      <form onSubmit={handleSearch} className="flex justify-center mb-10">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              fetchCitySuggestions(e.target.value);
            }}
            placeholder="Enter city name"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
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
          className="ml-4 px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-md"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {weatherData && (
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Current Weather
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <p className="text-gray-600">City: {weatherData.name}</p>
            <p className="text-gray-600">
              Temperature: {weatherData.main.temp}°C
            </p>
            <p className="text-gray-600">
              Humidity: {weatherData.main.humidity}%
            </p>
            <p className="text-gray-600">
              Weather: {weatherData.weather[0].description}
            </p>
            <p className="text-gray-600">
              Wind Speed: {weatherData.wind.speed} m/s
            </p>
          </div>
        </div>
      )}

      {forecastData.length > 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            7-Day Forecast
          </h2>
          <LineChart
            width={800}
            height={400}
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
        </div>
      )}
    </div>
  );
};

export default Page;
