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
        let pieDataMap = {};
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
            let hostName = getHostName(item.url);
            hostName = hostName.replace(".com","").replace(".cn","");
            pieDataMap[hostName] =  pieDataMap[hostName] || 0;
            pieDataMap[hostName] +=1;
        });

        let pieDataList = mapToSortList(pieDataMap);
        timeList = dateTempsToDateStrs(timeList);
        pieDataTransition(pieDataList);

        renderLineChart(timeList,dataList);
        renderPieChart(pieDataList);
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

function pieDataTransition(list){
    if(list.length<10){
        return;
    }
    let other = 0;
    for(let i=list.length-1;i>10;i--){
        other += list[i].value;
        list.splice(i,1);
    }
    list.push({value:other,name:"other"});
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

    /*    title: {
            text: 'Customized Pie',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#ccc'
            }
        },
*/
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
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
                //name:'访问来源',
                type:'pie',
                radius : '55%',
                center: ['50%', '50%'],
                data:data,
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


function getHostName(url){
  try {
      let reg = /\.+\w+\.+\w+/;
      if(url.match(reg)){
          url = url.match(reg)[0];
          return url.substring(1);
      }else {
          let reg = /\w+\.+\w+/;
          url = url.match(reg)[0];
          return url;
      }
  }catch (e) {
      let reg = /\/\/+\S+\//;
      url = url.match(reg)[0];
      return url.substring(2,url.length-1);
  }
}

function mapToSortList(map){
    let list = [];
    for(let key in map){
        list.push({
            value:map[key],
            name:key
        })
    }
    list.sort((a,b)=>b.value-a.value);
    return list;
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

