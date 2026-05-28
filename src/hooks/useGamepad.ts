import { useEffect, useState, useRef } from 'react';

export function useGamepad(onButtonPress?: (buttonIndex: number) => void) {
  const [connected, setConnected] = useState(false);
  const [gamepadName, setGamepadName] = useState('');
  const requestRef = useRef<number>();
  const previousButtonsRef = useRef<boolean[]>([]);
  
  // Use a ref for the callback so we don't need to re-bind the requestAnimationFrame on every render
  const callbackRef = useRef(onButtonPress);
  useEffect(() => {
    callbackRef.current = onButtonPress;
  }, [onButtonPress]);

  useEffect(() => {
    const handleConnect = (e: GamepadEvent) => {
      setConnected(true);
      setGamepadName(e.gamepad.id);
    };
    
    const handleDisconnect = () => {
      const gamepads = navigator.getGamepads();
      const hasAnother = Array.from(gamepads).some(gp => gp !== null);
      if (!hasAnother) {
        setConnected(false);
        setGamepadName('');
      }
    };

    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);

    const pollGamepad = () => {
      const gps = navigator.getGamepads();
      // Grab the first connected gamepad
      const gp = gps[0] || gps[1] || gps[2] || gps[3];
      
      if (gp) {
        if (!connected) {
           setConnected(true);
           setGamepadName(gp.id);
        }
        gp.buttons.forEach((button, index) => {
          const wasPressed = previousButtonsRef.current[index];
          if (button.pressed && !wasPressed) {
            callbackRef.current?.(index);
          }
          previousButtonsRef.current[index] = button.pressed;
        });
      }
      requestRef.current = requestAnimationFrame(pollGamepad);
    };

    requestRef.current = requestAnimationFrame(pollGamepad);

    return () => {
      window.removeEventListener('gamepadconnected', handleConnect);
      window.removeEventListener('gamepaddisconnected', handleDisconnect);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [connected]);

  return { connected, gamepadName };
}
