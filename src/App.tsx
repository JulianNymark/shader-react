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

  return <canvas id="glcanvas" width="1024" height="1024"></canvas>;
};
