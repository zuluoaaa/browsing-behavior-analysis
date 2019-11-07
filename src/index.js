/**
 *
 */
function initAccessFrequancyLineChart({startTime=null,endTime=null}={}){
    const splitSize = 48;
    if(!endTime && !startTime){
        endTime = new Date().getTime();
        let hour24 = (1000*60*60*24);
        startTime = endTime-hour24;
    }

    chrome.history.search({
        text:"",
         startTime:startTime,
         endTime:endTime,
        maxResults:10000
    },(results)=>{
        console.log(results,"results");

        let duringTime = endTime-startTime;
        let timeInter = duringTime/splitSize;
        let timeList = getTimeInterGroup(startTime,timeInter,splitSize);
        let dataList = [];

        console.log(new Date(startTime),new Date(endTime),timeList,"timeLis1")
        results.forEach((item)=>{
            for(let i in timeList){
                if(typeof dataList[i] === "undefined"){
                    dataList[i] = 0;
                }
                if(item.lastVisitTime <= timeList[i]){
                    dataList[i-1] +=1;
                    break;
                }
            }
        });
        timeList = dateTempsToDateStrs(timeList)
        console.log(timeList,dataList,"dataList")
        renderLineChart(timeList,dataList);
    });
}

function getTimeInterGroup(startTime,timeInter,splitSize){
    let list = [startTime];
    let temp =startTime;
    for(let i=0;i<splitSize;i++){
        temp = temp+timeInter;
        list.push(temp);
    }
    return list;
}

function dateTempsToDateStrs(tempList){
    tempList = tempList.map(item=>{
        let date = new Date(item);
        return date.getHours()+":"+date.getMinutes()
    });
    return tempList;
}

function renderLineChart(date,data){
    let myChart = echarts.init(document.getElementById('main'));
    let option = {
        //backgroundColor: '#2c343c',
        xAxis: {
            type: 'category',
            data: date,
            color:"#ffffff",
        },
        /*tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '30%'];
            }
        },*/
        yAxis: {
            color:"#ffffff",
            type: 'value'
        },
        series: [{
            symbol: 'none',
            data: data,
            type: 'line',
        }]
    };

    myChart.setOption(option);
}

function renderPieChart(data){
    let option = {

        title: {
            text: 'Customized Pie',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#ccc'
            }
        },

        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
                colorLightness: [0, 1]
            }
        },
        series : [
            {
                name:'访问来源',
                type:'pie',
                radius : '55%',
                center: ['50%', '50%'],
                data:[
                    {value:335, name:'直接访问'},
                    {value:310, name:'邮件营销'},
                    {value:274, name:'联盟广告'},
                    {value:235, name:'视频广告'},
                    {value:400, name:'搜索引擎'}
                ].sort(function (a, b) { return a.value - b.value; }),
                roseType: 'radius',
                label: {
                    normal: {
                        textStyle: {
                            color: 'rgba(0, 0, 0, 0.3)'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        lineStyle: {
                            color: 'rgba(0, 0, 0, 0.3)'
                        },
                        smooth: 0.2,
                        length: 10,
                        length2: 20
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#c23531',
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },

                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };
    let myChart = echarts.init(document.getElementById('pieChart'));
    myChart.setOption(option);
}

initAccessFrequancyLineChart({startTime:new Date().getTime()-(1000*60*60*10),endTime:new Date().getTime()});
//renderPieChart();

/*

{
    id: "9509"
    lastVisitTime: 1573031768997.0688
    title: "ECharts Documentation"
    typedCount: 0
    url: "https://echarts.apache.org/zh/tutorial.html#5%20%E5%88%86%E9%92%9F%E4%B8%8A%E6%89%8B%20ECharts"
    visitCount: 1
}
*/

