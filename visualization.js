let chartInstances = {};

// helper para maiwasan canvas reuse error
function destroyChart(canvasId) {
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
    }
}

// 1. BAR CHART — Study Hours vs Final Score
function drawBarChart(canvasId, data) {
    destroyChart(canvasId);

    const ctx = document.getElementById(canvasId);

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(row => row.name),
            datasets: [{
                label: 'Final Score',
                data: data.map(row => row.score),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Study Hours vs Final Score'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Students'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Final Score'
                    }
                }
            }
        }
    });
}

// 2. SCATTER PLOT — Attendance vs Score
function drawScatterPlot(canvasId, data) {
    destroyChart(canvasId);

    const ctx = document.getElementById(canvasId);

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Attendance vs Score',
                data: data.map(row => ({
                    x: row.attendance,
                    y: row.score
                })),
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Attendance %'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Final Score'
                    }
                }
            }
        }
    });
}

// 3. HISTOGRAM — Final Score Distribution
function drawHistogram(canvasId, data) {
    destroyChart(canvasId);

    const ctx = document.getElementById(canvasId);

    const bins = {
        "60-69": 0,
        "70-79": 0,
        "80-89": 0,
        "90-100": 0
    };

    data.forEach(row => {
        const score = row.score;

        if (score < 70) bins["60-69"]++;
        else if (score < 80) bins["70-79"]++;
        else if (score < 90) bins["80-89"]++;
        else bins["90-100"]++;
    });

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(bins),
            datasets: [{
                label: 'Frequency',
                data: Object.values(bins),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// 4. PIE CHART — Grade Distribution
function drawPieChart(canvasId, data) {
    destroyChart(canvasId);

    const ctx = document.getElementById(canvasId);

    const grades = { A: 0, B: 0, C: 0, D: 0 };

    data.forEach(row => {
        grades[row.grade]++;
    });

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(grades),
            datasets: [{
                data: Object.values(grades)
            }]
        },
        options: {
            responsive: true
        }
    });
}

// call all charts
function initCharts() {
    const data = window.DS;

    drawBarChart('barChart', data);
    drawScatterPlot('scatterChart', data);
    drawHistogram('histogramChart', data);
    drawPieChart('pieChart', data);
}