import { animationLoop } from "../animation";
/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {*} data
 */
export const doughnut = (chart, data, options = {}) => {
  const { ctx, viewport } = chart;
  const defaultConfig = {
    padding: 10,
    counterClockwise: false,
    fill: true,
    stroke: true,
  };
  const config = { ...defaultConfig, ...options };
  const maxRadius =
    (Math.min(viewport.width, viewport.height) - 2 * config.padding) / 2;

  const minRadius =
    (0.4 * (Math.min(viewport.width, viewport.height) - 2 * config.padding)) /
    2;

  const sum = data.map((i) => i.value).reduce((acc, value) => acc + value, 0);
  const drawFrame = (animationFactor) => {
    ctx.transform(1, 0, 0, 1, viewport.width * 0.5, viewport.height * 0.5);
    let startAngle = Math.PI / 4;
    for (const { value, color } of data) {
      const segementAngle =
        (value / sum) *
        Math.PI *
        2 *
        animationFactor *
        (config.counterClockwise ? 1 : -1);
      ctx.beginPath();

      ctx.arc(
        0,
        0,
        maxRadius * animationFactor,
        startAngle,
        startAngle + segementAngle,
        !config.counterClockwise
      );

      ctx.arc(
        0,
        0,
        minRadius * animationFactor,
        startAngle + segementAngle,
        startAngle,
        config.counterClockwise
      );
      ctx.closePath();
      ctx.moveTo(0, 0);

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

  animationLoop(chart, drawFrame, {
    duration: 1000,
    timingFunction: "easeOutBounce",
    viewport,
  });
};
