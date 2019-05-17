/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
function lineChart(myChart, chartData, defaultOption) {
    // 设置x轴坐标
    // console.log(chartData);
    defaultOption.xAxis = {
        ...defaultOption.xAxis,
        data: Object.keys(chartData[0].quota.list),
    };
    // 设置数据
    if (chartData[0].attribute) {
        // 处理属性数据
        defaultOption.series = [];
        let attributeClasscification = [];
        for (const j of chartData) {
            for (const date of Object.values(j.attribute.list)) {
                date.forEach((val, idx) => {
                    if (attributeClasscification.findIndex(v => v.name === val.name) !== -1) {
                        attributeClasscification[idx].list.push(val.number);
                    } else {
                        attributeClasscification[attributeClasscification.length] = {
                            name: val.name,
                            list: [val.number],
                        };
                    }
                });
            }
            // 在循环用户群数据的循环下 存入数据
            for (let i = 0; i < attributeClasscification.length; i += 1) {
                defaultOption.series.push({
                    name: `${j.userGroup}-${attributeClasscification[i].name}`,
                    type: 'line',
                    data: Object.values(attributeClasscification[i].list),
                });
            }
            attributeClasscification = [];
        }
    } else {
        for (let i = 0; i < chartData.length; i += 1) {
            defaultOption.series[i] = {
                name: `${chartData[i].userGroup}-${chartData[i].quota.name}`,
                type: 'line',
                data: Object.values(chartData[i].quota.list),
            };
        }
    }
    // 绘制图表
    // console.log(defaultOption.series);
    myChart.setOption(defaultOption, true);
}

function barChart(myChart, chartData, defaultOption) {
    console.log(chartData);
    // let xArray;
    // let x;
    defaultOption.xAxis = {
        ...defaultOption.xAxis,
        data: [],
    };
    let xArray;
    let x;
    if (chartData[0].attribute) {
        for (let i = 0; i < chartData.length; i += 1) {
            xArray = Object.keys(chartData[i].quota.list);
            x = `${xArray[0]}~${xArray[xArray.length - 1]}`;
            defaultOption.xAxis.data.push(x);
        }
    // 设置数据
    } else {
        xArray = Object.keys(chartData[0].quota.list);
        x = `${xArray[0]}~${xArray[xArray.length - 1]}`;
        defaultOption.xAxis.data.push(x);
        let sum;
        for (let i = 0; i < chartData.length; i += 1) {
            sum = Object.values(chartData[i].quota.list).reduce((acc, val) => acc + Number(val));
            defaultOption.series[i] = {
                name: `${chartData[i].userGroup}-${chartData[i].quota.name}`,
                type: 'bar',
                barWidth: '3%',
                data: [sum],
            };
        }
    }

    // 绘制图表
    // console.log(defaultOption);
    myChart.setOption(defaultOption, true);
}

function pieChart(myChart, chartData, defaultOption) {
    // 绘制图表
    myChart.setOption(defaultOption, true);
}

const chartDrawFuncMap = new Map();
chartDrawFuncMap
    .set('趋势图', lineChart)
    .set('汇总图', barChart)
    .set('占比图', pieChart);

export default chartDrawFuncMap;
