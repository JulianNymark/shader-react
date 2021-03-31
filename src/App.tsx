import React, { useEffect } from "react";
import "./App.css";
import { rotatingCube } from "./utils";

export const App = () => {
  useEffect(() => {
    const canvas = document.querySelector<HTMLCanvasElement>("#glcanvas");
    if (!canvas) {
      return;
    }

    rotatingCube(canvas);
  }, []);

  return <canvas id="glcanvas" width="640" height="480"></canvas>;
};
