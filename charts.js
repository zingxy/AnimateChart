// 绘制柱状图
function drawBarChart() {
    const canvas = document.getElementById('barChart');
    const ctx = canvas.getContext('2d');
    const data = [10, 20, 30, 40, 50];
    const barWidth = 40;
    const barSpacing = 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';

    data.forEach((value, index) => {
        const x = index * (barWidth + barSpacing);
        const y = canvas.height - value;
        ctx.fillRect(x, y, barWidth, value);
    });
}

// 绘制饼图
function drawPieChart() {
    const canvas = document.getElementById('pieChart');
    const ctx = canvas.getContext('2d');
    const data = [10, 20, 30, 40];
    const colors = ['red', 'blue', 'green', 'yellow'];
    const total = data.reduce((sum, value) => sum + value, 0);
    let startAngle = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index];
        ctx.fill();
        startAngle += sliceAngle;
    });
}

// 绘制折线图
function drawLineChart() {
    const canvas = document.getElementById('lineChart');
    const ctx = canvas.getContext('2d');
    const data = [10, 20, 30, 20, 10];
    const pointSpacing = 50;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - data[0]);

    data.forEach((value, index) => {
        const x = index * pointSpacing;
        const y = canvas.height - value;
        ctx.lineTo(x, y);
    });

    ctx.strokeStyle = 'black';
    ctx.stroke();
}

// 调用绘图函数
drawBarChart();
drawPieChart();
drawLineChart();
