export const drawHelp = (ctx) => {
  ctx.save();
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(100, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = "blue";
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 100);
  ctx.stroke();
  ctx.restore();
};
export const getOrderOfMagnitude = (x) =>
  x > 0 ? Math.floor(Math.log10(x)) : null;
