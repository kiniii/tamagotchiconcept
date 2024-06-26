import { useEffect, useState, useRef } from "react";
import "./App.css";
import { Button } from "@material-tailwind/react";
import HardwareInput from "./hardwareInput";
import { motion } from 'framer-motion';

function App() {
    // States and timer
    const [expressionIndex, setExpressionIndex] = useState(0);
    const [dataPackage, setDataPackage] = useState(null); // Set initial state to null or a valid default
    const timerRef = useRef(null);
    const [passScanned, setPassScanned] = useState(true);

    // Storing expressions (images)
    const expressions = [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18",
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

    // this data will be received out of the database eventually
    const buttons = [
        { index: 1, name: 'No', emotion: 'positive' },
        { index: 2, name: 'Neutral', emotion: 'neutral' },
        { index: 3, name: 'Yes', emotion: 'negative' },
    ];

    const penguinState = [
        'hungry',
        'sleepy',
        'sad',
        'bored',
        'thirsty'
    ]

    // Sound
    const playFeedbackSound = (emotion) => {
        const sounds = {
            positive: "/src/sounds/positive-feedback-ding.mp3",
            neutral: "/src/sounds/neutral-feedback-ding.mp3",
            negative: "/src/sounds/negative-feedback-ding.mp3"
        };

        const soundUrl = sounds[emotion];
        if (soundUrl) {
            const audio = new Audio(soundUrl);
            audio.currentTime = 0;
            audio.play();
        }
    };

    const makeRipple = (e, answer, emotion) => {
        let x, y;
        const numericAnswer = Number(answer);

        if (e && e.clientX !== undefined && e.clientY !== undefined) {
            const button = e.currentTarget || e.target;

            // Get the bounding rectangle of the button
            const rect = button.getBoundingClientRect();

            // Calculate the x and y position of the click relative to the button
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        } else {
            switch (numericAnswer) {
                case 1:
                    x = 55;
                    y = 25;
                    break;
                case 2:
                    x = 75;
                    y = 25;
                    break;
                case 3:
                    x = 45;
                    y = 25;
                    break;
                default:
                    x = 0;
                    y = 0;
            }
        }

        let ripples = document.createElement('span');
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';

        switch (emotion) {
            case 'positive':
                ripples.style.borderColor = 'green';
                break;
            case 'neutral':
                ripples.style.borderColor = 'orange';
                break;
            case 'negative':
                ripples.style.borderColor = 'red';
                break;
            default:
                ripples.style.borderColor = 'white';
        }

        // Append the ripple to the button
        if (e && e.target) {
            e.target.appendChild(ripples);
        } else {
            // Fallback in case event is not passed
            const button = document.querySelector(`#button-${numericAnswer}`);
            button.appendChild(ripples);
        }

        setTimeout(() => {
            ripples.remove();
        }, 2000);
    };


    // Shared function to handle expression update and animation
    const handleExpressionUpdate = (e, answer, emotion) => {
        playFeedbackSound(emotion);

        makeRipple(e, answer, emotion);

        setExpressionIndex((prevIndex) =>
            prevIndex < expressions.length - 1 ? prevIndex + 1 : prevIndex
        );

        setPassScanned(false)
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

    const getEmotionFromIndex = (index) => {
        const button = buttons.find((b) => b.index === Number(index));
        return button ? button.emotion : null;
    };

    // Update expressionIndex based on dataPackage
    useEffect(() => {
        if (dataPackage) {
            const emotion = getEmotionFromIndex(dataPackage);
            handleExpressionUpdate(null, dataPackage, emotion);
        }
    }, [dataPackage]);

    return (
        <HardwareInput dataPackage={dataPackage} setDataPackage={setDataPackage}>
            <div className="min-h-screen h-full bg-gradient overflow-hidden flex flex-col gap-10 py-20">
                <div className="text-4xl text-center text-[#2c2756]">
                    <h1>Your feedback is valuable.</h1>
                    <h1>Thank you for your time!</h1>
                </div>

                <div className="flex items-end justify-center w-full mx-auto max-w-xl h-60 relative">
                    <img
                        src={imagePaths[expressions[expressionIndex]]}
                        alt="mascot"
                        className="max-h-md"
                    />

                    {passScanned && (
                        <p className={'absolute top-0 right-0 max-w-40 text-right'}>Your answer helps me that i become less {penguinState[0]}</p>
                    )}
                </div>

                <div className="text-4xl text-center text-[#2c2756]">
                    <h1>Work makes me feel stressed</h1>
                </div>

                <div id="rippleDiv" className="flex justify-center gap-64">
                    {buttons?.map((button, buttonIdx) => (
                        <motion.button
                            key={buttonIdx}
                            id={`button-${button.index}`}
                            className={`btn ${passScanned ? 'bg-[#49437C]' : 'bg-[#49437C] opacity-80'} text-white px-8 py-2 rounded-xl font-light text-xl`}
                            onClick={(e) => {
                                handleExpressionUpdate(e, button.index, button.emotion);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={passScanned === false}
                        >
                            {button.name}
                        </motion.button>
                    ))}
                </div>

                <div className={'flex justify-center'}>
                    <motion.button
                        className="btn bg-[#49437C] text-white px-8 py-2 rounded-xl font-light text-xl"
                        onClick={() => {
                            setPassScanned(true);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Scan pass
                    </motion.button>
                </div>
            </div>
        </HardwareInput>
    );
}

export default App;