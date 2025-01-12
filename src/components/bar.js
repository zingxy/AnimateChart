/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {*} data
 */
import { animationLoop } from "../animation";
import { drawCoordinateSystem, drawHelp, getOrderOfMagnitude } from "../helper";
import * as d3scale from "d3-scale";
window.d3 = d3scale;
export const bar = (chart, data, options = {}) => {
  const { ctx, viewport } = chart;
  const defaultConfig = {
    padding: 30,
    barGap: 4,
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
  let barGroupWidth = Math.floor(xAxisMaxLen / xAxisIntervals);
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
    drawBar(animationFactor);
  };

  const drawBar = (animationFactor) => {
    const barWidth = Math.floor(
      (barGroupWidth - config.barGap * (data.datasets.length + 1)) /
        data.datasets.length
    );
    ctx.save();

    for (let i = 0; i < data.labels.length; i++) {
      for (let j = 0; j < data.datasets.length; j++) {
        ctx.beginPath();
        ctx.rect(
          (j + 1) * config.barGap + barWidth * j,
          0,
          barWidth,
          animationFactor * yScale(data.datasets[j].data[i])
        );
        ctx.fillStyle = data.datasets[j].fillColor;
        ctx.fill();

        ctx.strokeStyle = data.datasets[j].strokeColor;
        ctx.stroke();
      }
      ctx.translate(barGroupWidth, 0);
    }
    ctx.restore();
  };
  const drawAxis = (animationFactor) => {
    ctx.strokeStyle = "rgba(0,0,0,.1)";
    const drawXAxis = () => {
      ctx.moveTo(0, -5);
      ctx.lineTo(0, yAxisMaxLen);
      ctx.stroke();

      for (let i = 0; i < data.labels.length; i++) {
        ctx.beginPath();
        const label = data.labels[i];
        ctx.save();
        ctx.moveTo((i + 1) * barGroupWidth, -5);
        ctx.lineTo((i + 1) * barGroupWidth, yAxisMaxLen);
        ctx.stroke();
        ctx.scale(1, -1);
        ctx.translate(i * barGroupWidth + barGroupWidth / 2, 0);
        ctx.textBaseline = "top";
        ctx.textAlign = "center";
        ctx.fillText(label, 0, 5);
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
