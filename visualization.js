// Load CSV data
async function loadCSVData() {
    try {
        const response = await fetch('dataset.csv');
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
        }
        const text = await response.text();
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',');
        
        const data = lines.slice(1).map(line => {
            const values = line.split(',');
            const obj = {};
            headers.forEach((header, i) => {
                obj[header] = values[i];
            });
            // Convert numeric fields
            obj.experience_years = parseInt(obj.experience_years);
            obj.skills_count = parseInt(obj.skills_count);
            obj.certifications = parseInt(obj.certifications);
            obj.salary = parseInt(obj.salary);
            return obj;
        });
        
        console.log('Parsed', data.length, 'rows from CSV');
        return data;
    } catch (error) {
        console.error('Error loading CSV:', error);
        return [];
    }
}

let chartInstances = {};

// helper para maiwasan canvas reuse error
function destroyChart(canvasId) {
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
    }
}

// 1. BAR CHART — Job Title vs Salary
function drawBarChart(canvasId, data) {
    destroyChart(canvasId);

    const ctx = document.getElementById(canvasId);

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(row => row.job_title),
            datasets: [{
                label: 'Salary',
                data: data.map(row => row.salary),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Job Title vs Salary'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Job Title'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Salary'
                    }
                }
            }
        }
    });
}

// 2. SCATTER PLOT — Experience vs Salary
function drawScatterPlot(canvasId, data) {
    destroyChart(canvasId);

    const ctx = document.getElementById(canvasId);

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Experience vs Salary',
                data: data.map(row => ({
                    x: row.experience_years,
                    y: row.salary
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
                        text: 'Experience Years'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Salary'
                    }
                }
            }
        }
    });
}

// 3. HISTOGRAM — Salary Distribution
function drawHistogram(canvasId, data) {
    destroyChart(canvasId);

    const ctx = document.getElementById(canvasId);

    const bins = {
        "50k-80k": 0,
        "80k-110k": 0,
        "110k-140k": 0,
        "140k-170k": 0,
        "170k-200k": 0,
        "200k+": 0
    };

    data.forEach(row => {
        const salary = row.salary;

        if (salary < 80000) bins["50k-80k"]++;
        else if (salary < 110000) bins["80k-110k"]++;
        else if (salary < 140000) bins["110k-140k"]++;
        else if (salary < 170000) bins["140k-170k"]++;
        else if (salary < 200000) bins["170k-200k"]++;
        else bins["200k+"]++;
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

// 4. PIE CHART — Industry Distribution
function drawPieChart(canvasId, data) {
    destroyChart(canvasId);

    const ctx = document.getElementById(canvasId);

    const industries = {};
    data.forEach(row => {
        industries[row.industry] = (industries[row.industry] || 0) + 1;
    });

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(industries),
            datasets: [{
                data: Object.values(industries),
                backgroundColor: [
                    '#36A2EB',
                    '#FF6384',
                    '#FF9F40',
                    '#FFCD56',
                    '#4BC0C0',
                    '#9966FF',
                    '#C9C9C9',
                    '#FF6384'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Call all charts with CSV data
async function initCharts() {
    try {
        const data = await loadCSVData();
        console.log('CSV Data loaded:', data.length, 'records');
        window.DS = data;

        drawBarChart('barChart', data);
        drawScatterPlot('scatterChart', data);
        drawHistogram('histogramChart', data);
        drawPieChart('pieChart', data);
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}