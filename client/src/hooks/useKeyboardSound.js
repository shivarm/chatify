const keyStrokeSound = [
  new Audio("/sounds/keystroke1.mp3"),
  new Audio("/sounds/keystroke2.mp3"),
  new Audio("/sounds/keystroke3.mp3"),
  new Audio("/sounds/keystroke4.mp3"),
];

function useKeyboardSound() {
  const playRandomKeySound = () => {
    const randomSound = keyStrokeSound[Math.floor(Math.random() * keyStrokeSound.length)];

    randomSound.currentTime = 0;
    randomSound.play().catch((error) => console.log("Audio play failed", error));
  };

  return { playRandomKeySound };
}

export default useKeyboardSound;
