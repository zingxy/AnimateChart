/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {*} data
 */
import { animationLoop } from "../animation";
import { drawHelp, getOrderOfMagnitude } from "../helper";
import * as d3scale from "d3-scale";
window.d3 = d3scale;
export const line = (chart, data, options = {}) => {
  const { ctx, viewport } = chart;
  const defaultConfig = {
    padding: 30,
    fill: true,
    stroke: true,
    tickLabelFontSize: 10,
    bezier: true,
  };
  const config = { ...defaultConfig, ...options };
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;

  for (let i = 0; i < data.datasets.length; i++) {
    for (let j = 0; j < data.datasets[i].data.length; j++) {
      min = Math.min(min, data.datasets[i].data[j]);
      max = Math.max(max, data.datasets[i].data[j]);
    }
  }
  console.log("minmax", min, max);
  // 估算一下最长的标签
  ctx.save();
  ctx.font = `${config.tickLabelFontSize}px Arial`;
  ctx.restore();

  let xAxisMaxLen = viewport.width - 2 * config.padding;
  let yAxisMaxLen = viewport.height - 2 * config.padding;

  const xAxisIntervals = data.labels.length;
  const xScale = d3scale.scalePoint(data.labels, [0, xAxisMaxLen]);
  const yScale = d3scale.scaleLinear([min, max], [0, yAxisMaxLen]);
  window.xxx = xScale;
  window.yyy = yScale;
  console.log(xAxisIntervals, xAxisMaxLen);
  const drawFrame = (animationFactor) => {
    ctx.transform(
      1,
      0,
      0,
      -1,
      config.padding,
      viewport.height - config.padding
    );
    drawAxis(animationFactor);
    drawLine(animationFactor);
  };
  const drawLine = (animationFactor) => {
    ctx.beginPath();

    data.datasets.forEach((dataset) => {
      const xPos = (i) => xScale(data.labels[i]);
      const yPos = (i) => animationFactor * yScale(dataset.data[i]);
      ctx.strokeStyle = dataset.strokeColor;

      ctx.beginPath();
      xScale.domain().forEach((_, j) => {
        if (j === 0) {
          const x = xPos(j);
          const y = yPos(j);
          ctx.moveTo(x, y);
          return;
        }
        const x = xPos(j);
        const y = yPos(j);
        if (j >= xScale.domain().length) return;
        const preX = xPos(j - 1);
        const preY = yPos(j - 1);
        const midX = (x + preX) / 2;
        const midY = (y + preY) / 2;
        ctx.bezierCurveTo(midX, preY, midX, y, x, y);
      });
      ctx.stroke();
      ctx.lineTo(xAxisMaxLen, 0);
      ctx.lineTo(0, 0);
      ctx.lineTo(0, yAxisMaxLen);
      ctx.closePath();
      ctx.fillStyle = dataset.fillColor;
      ctx.fill();
    });
  };
  const drawAxis = (animationFactor) => {
    ctx.strokeStyle = "rgba(0,0,0,.1)";
    const drawXAxis = () => {
      for (const label of data.labels) {
        const x = xScale(label);
        ctx.beginPath();
        ctx.moveTo(x, -5);
        ctx.lineTo(x, yAxisMaxLen + 5);
        ctx.stroke();
        ctx.save();
        ctx.scale(1, -1);
        ctx.textBaseline = "top";
        ctx.textAlign = "center";
        ctx.fillText(label, x, 5);
        ctx.restore();
      }
    };

    const drawYAxis = () => {
      for (const t of yScale.ticks()) {
        const y = yScale(t);

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(xAxisMaxLen + 5, y);
        ctx.stroke();
        ctx.save();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.translate(-10, y);
        ctx.scale(1, -1);
        ctx.fillText(t, 0, 0);
        ctx.restore();
      }
    };
    drawXAxis();
    drawYAxis();
  };

  animationLoop(chart, drawFrame, {
    duration: 1000,
    timingFunction: "easeOutBounce",
    viewport,
  });
};
