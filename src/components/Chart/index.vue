<template>
    <!-- 图区域 -->
    <div class="chart-layout">
        <!-- 时间选择器 -->
        <div class="date-picker-chart-type-layout">
            <el-date-picker
                v-model="selectedDate"
                @change="changeDatePicker()"
                :clearable="clearable"
                value-format="yyyy-MM-dd"
                type="daterange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="datePickerOptions"
            ></el-date-picker>
            <div>
                <el-radio-group v-model="chartType" @change="clickChartType($event)" >
                    <el-radio-button label="趋势图"></el-radio-button>
                    <el-radio-button label="汇总图"></el-radio-button>
                    <el-tooltip class="item" effect="dark" content="只适用于属性细分"
                    placement="top" :disabled="!isPieChartDisable">
                        <el-radio-button label="占比图" :disabled="isPieChartDisable">
                        </el-radio-button>
                    </el-tooltip>
                </el-radio-group>
            </div>
        </div>
        <div class="chart-box">
            <div id="chart" style="width: 100%;height:400px;" ></div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts';
import { mapState } from 'vuex';
// 日期选择器快捷方法
import shortcuts from './utils/datePickerShortcuts';
// 三种图表基本设置
import chartOptionMap from './utils/chartOptionMap';
// 三种图表绘制方法
import chartDrawFuncMap from './utils/chartDrawFuncMap';

export default {
    name: 'Chart',
    props: {
        belong: String,
    },
    data() {
        return {
            // 日期选择器
            selectedDate: [new Date(new Date() * 1 - 1000 * 60 * 60 * 24 * 6), new Date()],
            clearable: false,
            // 趋势图 汇总图 占比图
            chartType: '趋势图',
            // 自定义日期选项
            datePickerOptions: {
                disabledDate(time) {
                    return time.getTime() > new Date();
                },
                shortcuts,
            },
            isPieChartDisable: true,
        };
    },
    created() { },
    mounted() {
        this.setChartResize();
    },
    methods: {
        // 绘制图表
        drawChart(chartData, chartType = '趋势图') {
            const myChart = echarts.getInstanceByDom(document.getElementById('chart'));
            const defaultOption = Object.assign({}, chartOptionMap.get(chartType));
            const chartDrawFunc = chartDrawFuncMap.get(chartType);
            chartDrawFunc(myChart, chartData, defaultOption);
        },
        clickChartType(e) {
            // 改变图表类型
            this.chartType = e;
            this.$store.commit('changeChartType', {
                page: this.belong,
                value: e,
            });
            switch (e) {
            case '汇总图':
                this.drawChart(this.chartData, '汇总图');
                break;
            case '占比图':
                this.drawChart(this.chartData, '占比图');
                break;
            default:
                this.drawChart(this.chartData, '趋势图');
                break;
            }
        },
        // 图表resize
        setChartResize() {
            const myChart = echarts.init(document.getElementById('chart'));
            window.onresize = () => {
                myChart.resize();
            };
        },
        changeDatePicker() {
            // 改变日期选择器事件
            if (this.belong) {
                this.$store.commit('changeDate', {
                    page: this.belong,
                    value: this.selectedDate,
                });
            }
            console.log(this.selectedDate);
        },
    },
    computed: {
        ...mapState({
            attribute(state) {
                return state[this.belong].attribute;
            },
            // 实时获取vuex中的图表数据
            chartData(state) {
                return state[this.belong].chartData;
            },
        }),
    },
    watch: {
        attribute(newVal) {
            this.isPieChartDisable = (Boolean(newVal) !== true);
        },
        // 监听图表数据变化  触发图表绘制事件
        chartData(newVal) {
            this.drawChart(newVal, this.chartType);
        },
    },
    components: {},
};

</script>

<style lang='scss' scoped>
@mixin layout-base {
    height: fit-content;
    margin: auto;
    margin-bottom: 15px;
    padding: 15px 20px;
    background: white;
    box-shadow: $shadow-border-light;
    border-radius: 3px;
}
.chart-layout {
    @include layout-base;
    padding: 0;
    .date-picker-chart-type-layout {
        padding: 10px 20px 10px 20px;
        background: #f3f3f3;
        @include displayCenter($justify-content: space-between);
    }
    .chart-box {
        padding: 10px 0 20px 0;
    }
}
</style>
