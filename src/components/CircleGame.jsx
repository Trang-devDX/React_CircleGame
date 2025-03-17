import { useState, useEffect, useCallback } from "react";

export default function CircleGame() {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [circles, setCircles] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentIndex, setCurrentIndex] = useState(1);
  const [status, setStatus] = useState("LET'S PLAY");

  useEffect(() => {
    let timer; 
    if (isPlaying) {
      timer = setInterval(() => {
        setTime((previousTime) => previousTime + 1);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPlaying]); 

  const handleCircleClick = useCallback(
    (id) => {
      if (!isPlaying) return;
      if (id === currentIndex) {
        setCircles((prevCircles) => prevCircles.filter((c) => c.id !== id));
        if (id === count) {
          setStatus("ALL CLEARED!");
          setIsPlaying(false);
          setAutoPlay(false);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      } else {
        setStatus("GAME OVER!");
        setIsPlaying(false);
        setAutoPlay(false);
      }
    },
    [isPlaying, currentIndex, count]
  );

  useEffect(() => {
    let autoClick;
    if (autoPlay && isPlaying) {
      autoClick = setInterval(() => {
        handleCircleClick(currentIndex);
      }, 500);
    }
    return () => clearInterval(autoClick);
  }, [autoPlay, isPlaying, currentIndex, handleCircleClick]);

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
    setStatus("LET'S PLAY");
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div
        className={`text-3xl font-bold ${
          status === "ALL CLEARED!"
            ? "text-green-500"
            : status === "GAME OVER!"
            ? "text-red-500"
            : "text-black"
        }`}
      >
        {status}
      </div>
      <input
        type="number"
        className="border p-2"
        placeholder="Enter a number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        // disabled={isPlaying}
      />
      <div className="text-xl">Time: {time}s</div>
      <div className="flex space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={startGame}
        >
          {isPlaying ? "Restart" : "Play"}
        </button>
        <button
          className={`px-4 py-2 rounded ${
            autoPlay ? "bg-red-500" : "bg-green-500"
          } text-white`}
          onClick={() => setAutoPlay((prev) => !prev)}
          disabled={!isPlaying}
        >
          {autoPlay ? "Auto Play OFF" : "Auto Play ON"}
        </button>
      </div>
      <div className="relative w-[1200px] h-[400px] border bg-gray-100">
        {circles.map((circle) => (
          <div
            key={circle.id}
            className="absolute w-12 h-12 flex items-center justify-center rounded-full border-2 border-red-500 text-red-500 text-lg font-bold cursor-pointer"
            style={{ left: circle.left, top: circle.top }}
            onClick={() => handleCircleClick(circle.id)}
          >
            {circle.id}
          </div>
        ))}
      </div>
    </div>
  );
}
