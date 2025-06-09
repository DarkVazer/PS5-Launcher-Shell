import { useEffect, useRef, useCallback } from 'react';

const useGamepad = (onInput) => {
  const gamepadRef = useRef(null);
  const lastInputRef = useRef({});
  const animationFrameRef = useRef(null);

  // Gamepad button mappings (standard gamepad layout)
  const BUTTONS = {
    A: 0,           // Cross on PlayStation, A on Xbox
    B: 1,           // Circle on PlayStation, B on Xbox  
    X: 2,           // Square on PlayStation, X on Xbox
    Y: 3,           // Triangle on PlayStation, Y on Xbox
    LB: 4,          // L1 on PlayStation, LB on Xbox
    RB: 5,          // R1 on PlayStation, RB on Xbox
    LT: 6,          // L2 on PlayStation, LT on Xbox
    RT: 7,          // R2 on PlayStation, RT on Xbox
    SELECT: 8,      // Share on PlayStation, View on Xbox
    START: 9,       // Options on PlayStation, Menu on Xbox
    L3: 10,         // L3 on PlayStation, LS on Xbox
    R3: 11,         // R3 on PlayStation, RS on Xbox
    DPAD_UP: 12,    // D-Pad Up
    DPAD_DOWN: 13,  // D-Pad Down
    DPAD_LEFT: 14,  // D-Pad Left
    DPAD_RIGHT: 15, // D-Pad Right
    HOME: 16        // PS button on PlayStation, Xbox button on Xbox
  };

  // Analog stick thresholds
  const STICK_THRESHOLD = 0.5;
  const INPUT_DELAY = 200; // ms between inputs to prevent spam

  const checkGamepadInput = useCallback(() => {
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];
    
    if (!gamepad) {
      gamepadRef.current = null;
      return;
    }

    gamepadRef.current = gamepad;
    const now = Date.now();

    // Check D-Pad and analog stick for navigation
    const leftStickX = gamepad.axes[0];
    const leftStickY = gamepad.axes[1];
    
    // D-Pad buttons
    const dpadUp = gamepad.buttons[BUTTONS.DPAD_UP]?.pressed;
    const dpadDown = gamepad.buttons[BUTTONS.DPAD_DOWN]?.pressed;
    const dpadLeft = gamepad.buttons[BUTTONS.DPAD_LEFT]?.pressed;
    const dpadRight = gamepad.buttons[BUTTONS.DPAD_RIGHT]?.pressed;

    // Action buttons
    const aButton = gamepad.buttons[BUTTONS.A]?.pressed; // Confirm/Enter
    const bButton = gamepad.buttons[BUTTONS.B]?.pressed; // Back/Cancel
    const xButton = gamepad.buttons[BUTTONS.X]?.pressed; // Alternative action
    const yButton = gamepad.buttons[BUTTONS.Y]?.pressed; // Alternative action
    
    // Shoulder buttons
    const lbButton = gamepad.buttons[BUTTONS.LB]?.pressed; // L1/LB
    const rbButton = gamepad.buttons[BUTTONS.RB]?.pressed; // R1/RB

    // Navigation inputs
    let direction = null;
    let action = null;

    // Check for directional input (D-Pad has priority over analog stick)
    if (dpadUp || leftStickY < -STICK_THRESHOLD) {
      direction = 'up';
    } else if (dpadDown || leftStickY > STICK_THRESHOLD) {
      direction = 'down';
    } else if (dpadLeft || leftStickX < -STICK_THRESHOLD) {
      direction = 'left';
    } else if (dpadRight || leftStickX > STICK_THRESHOLD) {
      direction = 'right';
    }

    // Check for action buttons
    if (aButton) {
      action = 'confirm';
    } else if (bButton) {
      action = 'back';
    } else if (xButton) {
      action = 'action_x';
    } else if (yButton) {
      action = 'action_y';
    } else if (lbButton) {
      action = 'shoulder_left';
    } else if (rbButton) {
      action = 'shoulder_right';
    }

    // Prevent input spam
    const inputKey = direction || action;
    if (inputKey && (!lastInputRef.current[inputKey] || now - lastInputRef.current[inputKey] > INPUT_DELAY)) {
      lastInputRef.current[inputKey] = now;
      
      if (direction) {
        onInput({ type: 'direction', direction });
      } else if (action) {
        onInput({ type: 'action', action });
      }
    }

    // Clear old inputs that are no longer pressed
    Object.keys(lastInputRef.current).forEach(key => {
      const isPressed = (key === 'up' && (dpadUp || leftStickY < -STICK_THRESHOLD)) ||
                       (key === 'down' && (dpadDown || leftStickY > STICK_THRESHOLD)) ||
                       (key === 'left' && (dpadLeft || leftStickX < -STICK_THRESHOLD)) ||
                       (key === 'right' && (dpadRight || leftStickX > STICK_THRESHOLD)) ||
                       (key === 'confirm' && aButton) ||
                       (key === 'back' && bButton) ||
                       (key === 'action_x' && xButton) ||
                       (key === 'action_y' && yButton) ||
                       (key === 'shoulder_left' && lbButton) ||
                       (key === 'shoulder_right' && rbButton);
      
      if (!isPressed) {
        delete lastInputRef.current[key];
      }
    });
  }, [onInput]);

  const gamepadLoop = useCallback(() => {
    checkGamepadInput();
    animationFrameRef.current = requestAnimationFrame(gamepadLoop);
  }, [checkGamepadInput]);

  useEffect(() => {
    // Start gamepad polling
    animationFrameRef.current = requestAnimationFrame(gamepadLoop);

    // Gamepad connection events
    const handleGamepadConnected = (e) => {
      console.log('Gamepad connected:', e.gamepad.id);
    };

    const handleGamepadDisconnected = (e) => {
      console.log('Gamepad disconnected:', e.gamepad.id);
      gamepadRef.current = null;
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, [gamepadLoop]);

  return {
    gamepad: gamepadRef.current,
    isConnected: !!gamepadRef.current
  };
};

export default useGamepad; 