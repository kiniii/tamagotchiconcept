import { useEffect, useState, useRef } from "react";
import "./App.css";
import { Button } from "@material-tailwind/react";
import HardwareInput from "./hardwareInput";

function App() {
  // States and timer
  const [expressionIndex, setExpressionIndex] = useState(0);
  const [dataPackage, setDataPackage] = useState({ 1: 0, 2: 0, 3: 0 });
  const [animationFeedback, setAnimationFeedback] = useState("");
  const [animationInProgress, setAnimationInProgress] = useState(false);
  const timerRef = useRef(null);

  // Storing expressions (images)
  const expressions = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
  ];

  const imagePaths = {
    1: "/src/images/em1.png",
    2: "/src/images/em2.png",
    3: "/src/images/em3.png",
    4: "/src/images/em4.png",
    5: "/src/images/em5.png",
    6: "/src/images/em6.png",
    7: "/src/images/em7.png",
    8: "/src/images/em8.png",
    9: "/src/images/em9.png",
    10: "/src/images/em10.png",
    11: "/src/images/em11.png",
    12: "/src/images/em12.png",
    13: "/src/images/em13.png",
    14: "/src/images/em14.png",
    15: "/src/images/em15.png",
    16: "/src/images/em16.png",
    17: "/src/images/em17.png",
    18: "/src/images/em18.png",
  };

  // Sound
  const [audio] = useState(new Audio("/src/sounds/feedback-sound.mp3"));

  const playFeedbackSound = () => {
    audio.currentTime = 0;
    audio.play();
  };

  // Shared function to handle expression update and animation
  const handleExpressionUpdate = (answer) => {
    if (animationInProgress) return;
    setAnimationInProgress(true);
    playFeedbackSound();

    setExpressionIndex((prevIndex) =>
      prevIndex < expressions.length - 1 ? prevIndex + 1 : prevIndex
    );
    setAnimationFeedback(answer);

    setTimeout(() => {
      setAnimationFeedback("");
      setAnimationInProgress(false);
    }, 2000);
  };

  // Button to update the expression
  const handleClick = (answer) => {
    handleExpressionUpdate(answer);
  };

  // Reset the timer whenever the expression changes
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Gradually lower the expression
    timerRef.current = setInterval(() => {
      setExpressionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    }, 5000); // Time
    return () => clearInterval(timerRef.current);
  }, [expressionIndex]);

  // Update expressionIndex based on dataPackage
  useEffect(() => {
    if (dataPackage) {
      handleExpressionUpdate(); // Or any other logic based on dataPackage
      console.log(dataPackage);
    }
  }, [dataPackage]);

  return (
    <HardwareInput dataPackage={dataPackage} setDataPackage={setDataPackage}>
      <div
        className={`min-h-screen h-full bg-gradient ${animationFeedback}`}
      >
        <div className="text-4xl text-center pt-16 text-[#2c2756]">
          <h1>Every answer makes me feel better.</h1>
          <h1>Help me be joyful!</h1>
        </div>

        <div className="flex items-end justify-center my-16 w-full mx-auto max-w-xl h-60">
          <img
            src={imagePaths[expressions[expressionIndex]]}
            alt="mascot"
            className="max-h-md"
          />
        </div>
        
        <div className="text-4xl text-center pb-10 text-[#2c2756]">
          <h1>Work makes me feel stressed</h1>
        </div>

        <div className="flex justify-center gap-28">
          <Button
            className="bg-[#49437C] text-white px-8 py-2 rounded-xl font-light text-xl"
            onClick={() => {
              handleClick("animate-feedback-red");
            }}
          >
            No
          </Button>
          <Button
            className="bg-[#49437C] text-white px-8 py-2 rounded-xl font-light text-xl"
            onClick={() => {
              handleClick("animate-feedback-orange");
            }}
          >
            Neutral
          </Button>
          <Button
            className="bg-[#49437C] text-white px-8 py-2 rounded-xl font-light text-xl"
            onClick={() => {
              handleClick("animate-feedback-green");
            }}
          >
            Yes
          </Button>
        </div>
      </div>
    </HardwareInput>
  );
}

export default App;
