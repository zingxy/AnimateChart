/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {*} data
 */
import { animationLoop } from "../animation";
import { drawCoordinateSystem, drawHelp, getOrderOfMagnitude } from "../helper";
import * as d3scale from "d3-scale";
window.d3 = d3scale;
export const radar = (chart, data, options = {}) => {
  const { ctx, viewport } = chart;
  const defaultConfig = {
    padding: 50,
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

  const maxLen = Math.min(viewport.width, viewport.height) - 2 * config.padding;
  const maxRadius = maxLen / 2;
  const scale = d3scale.scaleLinear([min, max], [0, maxRadius]);
  const segementAngle = (2 * Math.PI) / data.labels.length;

  const drawFrame = (animationFactor) => {
    ctx.transform(1, 0, 0, 1, viewport.width / 2, viewport.height / 2);
    ctx.save();
    drawLine();
    ctx.restore();
    drawData(animationFactor);
  };
  const drawLine = (animationFactor) => {
    // drawCoordinateSystem(ctx);
    ctx.strokeStyle = "rgba(0,0,0,.1)";
    ctx.lineWidth = 1;
    scale.ticks().forEach((t, i) => {
      const r = scale(t);
      ctx.save();
      for (let j = 0; j <= data.labels.length; j++) {
        if (j === 0) {
          ctx.beginPath();
          ctx.moveTo(0, r);
          continue;
        }
        ctx.rotate(segementAngle);
        ctx.lineTo(0, r);
        if (i === scale.ticks().length - 1) {
          ctx.lineTo(0, 0);
          ctx.stroke();
        } else {
          ctx.stroke();
        }

        ctx.beginPath();
        // drawCoordinateSystem(ctx);
        ctx.beginPath();
        ctx.moveTo(0, r);
      }
      ctx.restore();
      // ctx.save();
      if (i === scale.ticks().length - 1) {
        ctx.textBaseline = "top";
        ctx.textAlign = "center";
        const stdVec = [0, 1];
        for (let j = 0; j < data.labels.length; j++) {
          const curVec = [
            r * Math.sin(j * segementAngle),
            r * Math.cos(j * segementAngle),
          ];
          const crossProduct = stdVec[0] * curVec[1] - curVec[0] * stdVec[1];

          ctx.save();
          const label = data.labels[j];
          ctx.rotate(segementAngle * j);
          ctx.translate(0, r + 10);
          ctx.textAlign = "right";
          if (crossProduct < 0) {
            ctx.textAlign = "right";
          } else if (crossProduct > 0) {
            ctx.textAlign = "left";
          } else {
            ctx.textAlign = "center";
          }
          ctx.rotate(-segementAngle * j);
          ctx.fillText(label, 0, 0);
          ctx.restore();
        }
      }
      // ctx.restore();
    });
  };
  const drawData = (animationFactor) => {
    for (let i = 0; i < data.datasets.length; i++) {
      ctx.save();
      ctx.beginPath();
      for (let j = 0; j <= data.datasets[i].data.length; j++) {
        const r = scale(data.datasets[i].data[j]) * animationFactor;
        if (j === 0) {
          ctx.moveTo(0, r);
          continue;
        }
        ctx.rotate(segementAngle);
        ctx.lineTo(0, r);
      }
      ctx.strokeStyle = data.datasets[i].strokeColor;
      ctx.fillStyle = data.datasets[i].fillColor;
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      ctx.restore();
      continue;
    }
  };

  animationLoop(chart, drawFrame, {
    duration: 1000,
    timingFunction: "easeOutBounce",
    viewport,
  });
};
