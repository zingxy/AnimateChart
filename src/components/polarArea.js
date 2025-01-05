/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {*} data
 */
import { animationLoop } from "../animation";
import { getOrderOfMagnitude } from "../helper";
import * as d3scale from "d3-scale";
export const polarArea = (chart, data, options = {}) => {
  const { ctx, viewport } = chart;
  const defaultConfig = {
    padding: 0,
    counterClockwise: false,
    fill: true,
    stroke: true,
    strokeWidth: 4,
    // tick
    tickLabelFont: 10,
  };
  const config = { ...defaultConfig, ...options };

  let min = Math.min(...data.map((i) => i.value));
  let max = Math.max(...data.map((i) => i.value));
  const rangeOrderOfMagnitude = getOrderOfMagnitude(max - min);

  min =
    Math.floor(min / (1 * Math.pow(10, rangeOrderOfMagnitude))) *
    Math.pow(10, rangeOrderOfMagnitude);

  max =
    Math.ceil(max / (1 * Math.pow(10, rangeOrderOfMagnitude))) *
    Math.pow(10, rangeOrderOfMagnitude);
  if (min === Math.min(...data.map((i) => i.value))) {
    min = min - Math.pow(10, rangeOrderOfMagnitude);
  }

  // 估算一下最长的标签
  ctx.save();
  ctx.font = `${config.tickLabelFont}px Arial`;
  let labelWidth = ctx.measureText("M".repeat(max.toString().length)).width * 2;
  let radius = Math.min(viewport.width, viewport.height) / 2;
  ctx.restore();

  if (config.stroke) {
    radius = radius - Math.max(config.strokeWidth / 2, labelWidth / 2);
  } else {
    radius = radius - Math.max(0, labelWidth / 2);
  }
  const scale = d3scale.scaleLinear([min, max], [0, radius]);

  const segementAngle = (1 / data.length) * Math.PI * 2;
  const drawFrame = (animationFactor) => {
    ctx.transform(1, 0, 0, -1, viewport.width * 0.5, viewport.height * 0.5);
    drawPie(animationFactor);
    drawAxis(animationFactor);
  };
  const drawPie = (animationFactor) => {
    let startAngle = Math.PI / 4;
    for (const { value, color } of data) {
      const computedSegementAngle =
        segementAngle * animationFactor * (config.counterClockwise ? 1 : -1);
      const computedRadius = scale(value) * animationFactor;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(
        0,
        0,
        computedRadius,
        startAngle,
        startAngle + computedSegementAngle,
        !config.counterClockwise
      );
      ctx.closePath();
      if (config.fill) {
        ctx.fillStyle = color;
        ctx.fill();
      }
      if (config.stroke) {
        ctx.lineWidth = config.strokeWidth;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
      }

      startAngle += computedSegementAngle;
    }
  };
  const drawAxis = (animationFactor) => {
    let maxTicks = Math.floor(radius / labelWidth);
    if (scale.ticks().length - 1 > maxTicks) {
      while (scale.ticks(maxTicks).length - 1 > maxTicks) {
        maxTicks--;
      }
    }
    scale.ticks(maxTicks).forEach((t) => {
      const pos = scale(t);
      ctx.strokeStyle = "rgba(0,0,0,.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, pos, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();
      ctx.save();
      ctx.translate(pos, 0);
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.scale(1, -1);
      ctx.fillText(t, 0, 0);
      ctx.restore();
    });
  };

  animationLoop(chart, drawFrame, {
    duration: 1000,
    timingFunction: "easeOutBounce",
    viewport,
  });
};
