"use client"
import React, { useState } from "react";

const mockWeatherData = {
  city: "Pune",
  temperature: 28,
  humidity: 60,
  windSpeed: 5,
  weather: "Clear",
};

const mockForecastData = [
  { day: "Mon", temp: 30 },
  { day: "Tue", temp: 32 },
  { day: "Wed", temp: 29 },
  { day: "Thu", temp: 31 },
  { day: "Fri", temp: 28 },
  { day: "Sat", temp: 27 },
  { day: "Sun", temp: 26 },
];

const Page: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<any>(mockWeatherData);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setWeatherData(mockWeatherData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-800 p-8 text-white">
      <h1 className="text-4xl font-bold text-center mb-8">Weather Forecast</h1>

      <form onSubmit={handleSearch} className="flex justify-center mb-8">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="px-4 py-2 rounded-lg text-gray-900 focus:outline-none"
        />
        <button
          type="submit"
          className="ml-4 bg-purple-500 px-6 py-2 rounded-lg hover:bg-purple-600"
        >
          Search
        </button>
      </form>

      <div className="bg-white/10 p-6 rounded-xl shadow-md text-center mb-8">
        <h2 className="text-2xl font-semibold">{weatherData.city}</h2>
        <p className="text-xl mt-2">{weatherData.temperature}°C</p>
        <p>Humidity: {weatherData.humidity}%</p>
        <p>Wind Speed: {weatherData.windSpeed} m/s</p>
        <p className="mt-2">{weatherData.weather}</p>
      </div>

      {/* 7-Day Forecast */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {mockForecastData.map((day, index) => (
          <div key={index} className="bg-white/10 p-4 rounded-lg text-center">
            <p className="text-lg font-medium">{day.day}</p>
            <p className="text-2xl font-bold">{day.temp}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
