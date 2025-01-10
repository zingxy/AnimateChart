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

// 设定坐标系的中心
const centerX = 0;
const centerY = 0;

// 坐标轴长度
const axisLength = 200;

// 绘制坐标系函数
export function drawCoordinateSystem(ctx) {
  // 绘制箭头函数
  function drawArrow(x, y, axis) {
    const arrowSize = 10; // 箭头大小
    ctx.beginPath();

    if (axis === "x") {
      // X 轴箭头：右侧箭头
      ctx.moveTo(x - arrowSize, y - arrowSize / 2); // 左侧箭头
      ctx.lineTo(x, y);
      ctx.lineTo(x - arrowSize, y + arrowSize / 2); // 右侧箭头
    } else if (axis === "y") {
      // Y 轴箭头：下侧箭头
      ctx.moveTo(x - arrowSize / 2, y - arrowSize); // 上侧箭头
      ctx.lineTo(x, y);
      ctx.lineTo(x + arrowSize / 2, y - arrowSize); // 下侧箭头
    }

    ctx.stroke();
  }
  // 设置样式
  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.lineWidth = 2; // 设置线条宽度
  ctx.strokeStyle = "red"; // 坐标轴颜色
  ctx.fillStyle = "red"; // 文本颜色
  ctx.font = "16px Arial";

  // 绘制 X 轴（水平）
  ctx.beginPath();
  ctx.moveTo(centerX - 10, centerY); // 从左边开始
  ctx.lineTo(centerX + axisLength, centerY); // 到右边结束
  ctx.stroke();
  // 绘制 X 轴箭头（指向右侧）
  drawArrow(centerX + axisLength, centerY, "x");
  ctx.fillText("X", centerX + axisLength + 10, centerY - 10);

  ctx.strokeStyle = "blue"; // 坐标轴颜色
  ctx.fillStyle = "blue"; // 文本颜色
  // 绘制 Y 轴（垂直）
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 10); // 从上面开始
  ctx.lineTo(centerX, centerY + axisLength); // 到下面结束
  ctx.stroke();
  // 绘制 Y 轴箭头（指向下方）
  drawArrow(centerX, centerY + axisLength, "y");

  // 添加轴标签
  ctx.fillText("Y", centerX - 10, centerY + axisLength + 20);
  ctx.restore();
}
