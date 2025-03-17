import { useState, useEffect } from "react";

export default function CircleGame() {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [circles, setCircles] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentIndex, setCurrentIndex] = useState(1);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const startGame = () => {
    const num = parseInt(inputValue, 10);
    if (!num || num < 1) return;
    setCircles(
      Array.from({ length: num }, (_, i) => ({
        id: i + 1,
        left: Math.random() * 80 + "%",
        top: Math.random() * 80 + "%",
      }))
    );
    setCount(num);
    setTime(0);
    setIsPlaying(true);
    setCurrentIndex(1);
    setStatus("");
  };

  const handleCircleClick = (id) => {
    if (!isPlaying) return;
    if (id === currentIndex) {
      if (id === count) {
        setStatus("All Cleared!");
        setIsPlaying(false);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      setStatus("Game Over!");
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <input
        type="number"
        className="border p-2"
        placeholder="Enter a number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isPlaying}
      />
      <div className="text-xl font-bold">Time: {time}s</div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={startGame}
        disabled={isPlaying}
      >
        Play
      </button>
      <div className="relative w-[400px] h-[400px] border bg-gray-100">
        {circles.map((circle) => (
          <div
            key={circle.id}
            className="absolute w-12 h-12 flex items-center justify-center rounded-full bg-red-500 text-white text-lg font-bold cursor-pointer"
            style={{ left: circle.left, top: circle.top }}
            onClick={() => handleCircleClick(circle.id)}
          >
            {circle.id}
          </div>
        ))}
      </div>
      {status && <div className="text-2xl font-bold mt-4">{status}</div>}
    </div>
  );
}