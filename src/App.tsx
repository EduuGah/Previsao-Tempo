import { useState, useEffect } from "react";
import "./App.css";
import foto from "../src/assets/react.svg";

interface WeatherData {
  temp: number;
  temp_min: number;
  temp_max: number;
  description: string;
  humidity: number;
  wind: number;
  icon: string;
}

function App() {
  const [city, setCity] = useState(""); // valor do input
  const [cities, setCities] = useState<string[]>([]); // lista de cidades do IBGE
  const [filteredCities, setFilteredCities] = useState<string[]>([]); // cidades filtradas
  const [weather, setWeather] = useState<WeatherData | null>(null); // dados do clima
  const APIKEY = "8a60b2de14f7a17c7a11706b2cfcd87c";

  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios")
      .then((res) => res.json())
      .then((data) => {
        const cityNames = data.map((c: any) => c.nome).sort((a: string, b: string) =>
          a.localeCompare(b, "pt-BR")
        );
        setCities(cityNames);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!city) {
      alert("Nenhuma cidade selecionada");
      return;
    }

    if (filteredCities.length === 1) {
      setCity(filteredCities[0]);
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )},BR&appid=${APIKEY}&units=metric&lang=pt_br`;

    try {
      const result = await fetch(apiUrl);
      const json = await result.json();

      if (json.cod === 200 || json.cod === "200") {
        setWeather({
          temp: json.main.temp,
          temp_min: json.main.temp_min,
          temp_max: json.main.temp_max,
          description: json.weather[0].description,
          humidity: json.main.humidity,
          wind: json.wind.speed,
          icon: `https://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`,
        });
        setFilteredCities([]);
      } else {
        alert(`Não foi possível localizar a cidade: ${city}`);
      }
    } catch (error) {
      alert("Erro ao buscar dados da cidade");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);

    if (value.length > 0) {
      const filtered = cities.filter((c) =>
        c.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  };

  const date = new Date();
  const day = date.getDate();
  const dayNumber = date.getDay();
  const daysOfWeek = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  const dayName = daysOfWeek[dayNumber];

  const monthNumber = date.getMonth();
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const monthName = months[monthNumber];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 p-4">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-6 w-full max-w-md text-white relative">
        <div className="text-center mb-4 relative">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 relative">
            <input
              type="search"
              value={city}
              onChange={handleChange}
              className="text-2xl font-bold border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              placeholder="Buscar Cidade"
            />

            {city && filteredCities.length > 0 && (
              <ul className="absolute bg-white text-black w-full mt-10 rounded-lg shadow-lg max-h-40 overflow-auto z-20">
                {filteredCities.map((c) => (
                  <li
                    key={c}
                    className="px-2 py-1 cursor-pointer hover:bg-blue-500 hover:text-white"
                    onClick={() => {
                      setCity(c);
                      setFilteredCities([]);
                    }}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            )}

            <button
              type="submit"
              className="cursor-pointer bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mt-2"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>

          <p className="text-sm mt-2">
            {dayName}, {day} de {monthName}
          </p>
        </div>

        <div className="flex items-center justify-center mb-6 gap-4">
          <img
            src={weather?.icon || foto}
            alt=""
            className="w-24 h-24 object-contain"
          />
          <div className="flex flex-col justify-center">
            <h1 className="text-6xl font-extrabold text-center">
              {weather ? `${Math.round(weather.temp)}°C` : "27°C"}
            </h1>
            <p className="text-lg capitalize text-center">
              {weather ? weather.description : "Ensolarado"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/10 p-3 rounded-xl flex flex-col items-center gap-1">
            <i className="fa-solid fa-droplet text-blue-400 text-2xl"></i>
            <p className="text-sm">Umidade</p>
            <p className="text-lg font-semibold">{weather?.humidity ?? "60"}%</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl flex flex-col items-center gap-1">
            <i className="fa-solid fa-wind text-gray-400 text-2xl"></i>
            <p className="text-sm">Vento</p>
            <p className="text-lg font-semibold">{weather?.wind ?? "14"} km/h</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl flex flex-col items-center gap-1">
            <i className="fa-solid fa-temperature-arrow-down text-cyan-500 text-2xl"></i>
            <p className="text-sm">Mínima</p>
            <p className="text-lg font-semibold">{weather ? Math.round(weather.temp_min) : 21}°C</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl flex flex-col items-center gap-1">
            <i className="fa-solid fa-temperature-arrow-up text-red-500 text-2xl"></i>
            <p className="text-sm">Máxima</p>
            <p className="text-lg font-semibold">{weather ? Math.round(weather.temp_max) : 30}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
