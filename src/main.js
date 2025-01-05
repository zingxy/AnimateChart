import "./main.css";
import { polarArea } from "./components/polarArea";
import { doughnut } from "./components/doughnut";
import { pie } from "./components/pie";

const draw = (canvas, fn) => {
  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext("2d");

  let viewport = {
    width: 0,
    height: 0,
  };
  initCtx();
  function initCtx() {
    const dpr = window.devicePixelRatio || 1;
    const { width: cssWidth, height: cssHeight } =
      canvas.getBoundingClientRect();
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    ctx.scale(dpr, dpr);

    viewport.width = cssWidth;
    viewport.height = cssHeight;
  }

  ctx.save();
  fn({ ctx: canvas.getContext("2d"), viewport });
  ctx.restore();
};

draw(document.querySelector(".pie"), (chart) =>
  pie(
    chart,
    [
      {
        label: "A",
        value: 10,
        color: "#0267c1",
      },
      {
        label: "B",
        value: 20,
        color: "#d65108",
      },
      {
        label: "C",
        value: 30,
        color: "#efa00b",
      },
      {
        label: "D",
        value: 40,
        color: "#591f0a",
      },
    ],
    { padding: 20, stroke: false }
  )
);

draw(document.querySelector(".polarArea"), (chart) =>
  polarArea(chart, [
    {
      label: "A",
      value: 10,
      color: "#0267c1",
    },
    {
      label: "B",
      value: 20,
      color: "#d65108",
    },
    {
      label: "C",
      value: 30,
      color: "#efa00b",
    },
    {
      label: "D",
      value: 40,
      color: "#591f0a",
    },
  ])
);

draw(document.querySelector(".doughnut"), (chart) =>
  doughnut(chart, [
    {
      label: "A",
      value: 10,
      color: "#0267c1",
    },
    {
      label: "B",
      value: 20,
      color: "#d65108",
    },
    {
      label: "C",
      value: 30,
      color: "#efa00b",
    },
    {
      label: "D",
      value: 40,
      color: "#591f0a",
    },
  ])
);
