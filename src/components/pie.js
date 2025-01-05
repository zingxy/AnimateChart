
import { animationLoop } from "../animation";
/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {*} data
 */
export const pie = (chart, data, options = {}) => {
  const { ctx, viewport } = chart;
  const defaultConfig = {
    padding: 10,
    counterClockwise: false,
    fill: true,
    stroke: true,
  };
  const config = { ...defaultConfig, ...options };
  const radius =
    (Math.min(viewport.width, viewport.height) - 2 * config.padding) / 2;

  const sum = data.map((i) => i.value).reduce((acc, value) => acc + value, 0);
  const drawPie = (animationFactor) => {
    ctx.transform(1, 0, 0, -1, viewport.width * 0.5, viewport.height * 0.5);
    let startAngle = Math.PI / 4;
    for (const { value, color } of data) {
      const segementAngle =
        (value / sum) *
        Math.PI *
        2 *
        animationFactor *
        (config.counterClockwise ? 1 : -1);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(
        0,
        0,
        radius * animationFactor,
        startAngle,
        startAngle + segementAngle,
        !config.counterClockwise
      );
      ctx.closePath();
      if (config.fill) {
        ctx.fillStyle = color;
        ctx.fill();
      }
      if (config.stroke) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
      }

      startAngle += segementAngle;
    }
  };
  // animation: <name> <duration> <timing-function> <delay> <iteration-count> <direction> <fill-mode> <play-state>;

  animationLoop(chart, drawPie, {
    duration: 1000,
    timingFunction: "easeOutBounce",
    viewport,
  });
};