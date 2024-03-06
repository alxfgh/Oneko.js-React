import React, { useEffect, useRef } from "react";

const Oneko = () => {
  const nekoElRef = useRef(null);
  const timeoutIdRef = useRef(null);

  useEffect(() => {
    const isReduced =
      window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
      window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
    if (isReduced) return;

    const nekoEl = document.createElement("div");
    nekoEl.id = "oneko";
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "fixed";
    nekoEl.style.pointerEvents = "none";
    nekoEl.style.backgroundImage = "url('oneko.gif')";
    nekoEl.style.imageRendering = "pixelated";
    document.body.appendChild(nekoEl);
    nekoElRef.current = nekoEl;

    const getRandomInt = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    };

    const oneko = () => {
      let nekoPosX = getRandomInt(32, window.innerWidth - 63);
      let nekoPosY = getRandomInt(32, window.innerHeight - 63);
      let mousePosX = nekoPosX - 32;
      let mousePosY = nekoPosY - 32;
      let frameCount = 0;
      let idleTime = 0;
      let idleAnimation = null;
      let idleAnimationFrame = 0;
      const nekoSpeed = 10;
      const spriteSets = {
        idle: [[-3, -3]],
        alert: [[-7, -3]],
        scratchSelf: [
          [-5, 0],
          [-6, 0],
          [-7, 0],
        ],
        scratchWallN: [
          [0, 0],
          [0, -1],
        ],
        scratchWallS: [
          [-7, -1],
          [-6, -2],
        ],
        scratchWallE: [
          [-2, -2],
          [-2, -3],
        ],
        scratchWallW: [
          [-4, 0],
          [-4, -1],
        ],
        tired: [[-3, -2]],
        sleeping: [
          [-2, 0],
          [-2, -1],
        ],
        N: [
          [-1, -2],
          [-1, -3],
        ],
        NE: [
          [0, -2],
          [0, -3],
        ],
        E: [
          [-3, 0],
          [-3, -1],
        ],
        SE: [
          [-5, -1],
          [-5, -2],
        ],
        S: [
          [-6, -3],
          [-7, -2],
        ],
        SW: [
          [-5, -3],
          [-6, -1],
        ],
        W: [
          [-4, -2],
          [-4, -3],
        ],
        NW: [
          [-1, 0],
          [-1, -1],
        ],
      };

      const setSprite = (name, frame) => {
        const sprite = spriteSets[name][frame % spriteSets[name].length];
        nekoElRef.current.style.backgroundPosition = `${sprite[0] * 32}px ${
          sprite[1] * 32
        }px`;
      };

      const resetIdleAnimation = () => {
        idleAnimation = null;
        idleAnimationFrame = 0;
      };

      const idle = () => {
        idleTime += 1;

        // every ~ 20 seconds
        if (idleTime > 10 && true && idleAnimation === null) {
          let availableIdleAnimations = ["sleeping", "scratchSelf"];
          if (nekoPosX < 32) {
            availableIdleAnimations.push("scratchWallW");
          }
          if (nekoPosY < 32) {
            availableIdleAnimations.push("scratchWallN");
          }
          if (nekoPosX > window.innerWidth - 32) {
            availableIdleAnimations.push("scratchWallE");
          }
          if (nekoPosY > window.innerHeight - 32) {
            availableIdleAnimations.push("scratchWallS");
          }
          idleAnimation =
            availableIdleAnimations[
              Math.floor(Math.random() * availableIdleAnimations.length)
            ];
        }

        switch (idleAnimation) {
          case "sleeping":
            if (idleAnimationFrame < 8) {
              setSprite("tired", 0);
              break;
            }
            setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
            if (idleAnimationFrame > 192) {
              resetIdleAnimation();
            }
            break;
          case "scratchWallN":
          case "scratchWallS":
          case "scratchWallE":
          case "scratchWallW":
          case "scratchSelf":
            setSprite(idleAnimation, idleAnimationFrame);
            if (idleAnimationFrame > 9) {
              resetIdleAnimation();
            }
            break;
          default:
            setSprite("idle", 0);
            return;
        }
        idleAnimationFrame += 1;
      };

      const frame = () => {
        frameCount += 1;
        const diffX = nekoPosX - mousePosX;
        const diffY = nekoPosY - mousePosY;
        const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

        if (distance < nekoSpeed || distance < 48) {
          idle();
          return;
        }

        idleAnimation = null;
        idleAnimationFrame = 0;

        if (idleTime > 1) {
          setSprite("alert", 0);
          // count down after being alerted before moving
          idleTime = Math.min(idleTime, 7);
          idleTime -= 1;
          return;
        }

        let direction = diffY / distance > 0.5 ? "N" : "";
        direction += diffY / distance < -0.5 ? "S" : "";
        direction += diffX / distance > 0.5 ? "W" : "";
        direction += diffX / distance < -0.5 ? "E" : "";
        setSprite(direction, frameCount);

        nekoPosX -= (diffX / distance) * nekoSpeed;
        nekoPosY -= (diffY / distance) * nekoSpeed;

        nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
        nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

        nekoElRef.current.style.left = `${nekoPosX - 16}px`;
        nekoElRef.current.style.top = `${nekoPosY - 16}px`;
      };

      document.onmousemove = (event) => {
        mousePosX = event.clientX;
        mousePosY = event.clientY;
      };

      timeoutIdRef.current = setInterval(frame, 100);
    };

    oneko();

    return () => {
      clearInterval(timeoutIdRef.current);
      document.body.removeChild(nekoElRef.current);
    };
  }, []);

  return null;
};

export default Oneko;
