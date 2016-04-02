// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 暂存数据,原始数据的初加工,每次渲染图表的数据都是从这个暂存数据中获取
var chartsData={};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}
//随机获取颜色
function randomColor(){
	return "#" +Math.random().toString(17).substring(2,5);
}
/**
 * 渲染图表
 */
function renderChart() {
   var aqichartWrap=document.getElementsByClassName('aqi-chart-wrap');
   var ul=document.createElement('ul');
   var lis=[];
   for(var data in chartData){
      var lists=document.createElement('li');
      lists.id=data;
      lists.title=data+'_空气污染指数：'+chartData[data];
      lists.style.height=chartData[data] +'px';
      lists.style.backgroundColor=randomColor(Math.floor(chartData[data]/100));
      switch(pageState.nowGraTime){
         case 'day':
         lists.style.width=15 +'px';
         lists.style.backgroundColor=randomColor(Math.floor(chartData[data]/100));
         break;
         case 'week':
         lists.style.width=45 +'px';
         lists.style.backgroundColor=randomColor(Math.floor(chartData[data]/80));
         break;
         case 'month':
         lists.style.width=60 +'px';
         lists.style.backgroundColor=randomColor(Math.floor(chartData[data]/70));
         break;
      }
      lis.push(lists);
   };
   for(var i=0;i<lis.length;i++){
      lis[i].style.left=(parseInt(lis[i].style.width,10)+2)*i+'px';
      ul.appendChild(lis[i]);
   };
   aqichartWrap[0].innerHTML='';
   aqichartWrap[0].appendChild(ul);
}
/**
 * 数据处理
 */
function renderDate(){
  var nowChartData=chartsData[pageState.nowSelectCity];
  switch(pageState.nowGraTime){
      case 'day':
      chartData=nowChartData;
      break;
      case 'week':
      var startOfWeek=[],weeks=[];
      for(var date in nowChartData){
         if(new Date(date).getDay()==1){
            startOfWeek.push(date);
         }
      }
      //第一周
      var firstWeek={};
      for(var first in nowChartData){
         if(new Date(startOfWeek[0]) > new Date(first)){
             firstWeek[first]=nowChartData[first];
         }
      }
      weeks[0]=firstWeek;
      //中间的每周
      for(var i=0;i<startOfWeek.length;i++){
          weeks[i+1] = function(i) {
            var week = {};
            for (var date in nowChartData) {
               if(new Date(startOfWeek[i]) <= new Date(date) && 
               	new Date(date) < new Date(startOfWeek[i + 1])) {
                week[date] = nowChartData[date];
              }
            }
            return week;
          }(i);
      }
      //最后一周
      var lastWeek={};
      for(var last in nowChartData){
         if(new Date(startOfWeek[startOfWeek.length-1]) < new Date(last)){
             lastWeek[last]=nowChartData[last];
         }
      };
      weeks[startOfWeek.length]=lastWeek;
      //计算平均值和设置对应的key的名称
      var chartArr=[];
      for(var j=0;j<weeks.length;j++){
        chartArr[j] = function(index) {
          var weekArr = [],keyArr = [],
              sum = 0,aver = null,key = null;
          for (var x in weeks[index]) {
            keyArr.push(x);
            weekArr.push(weeks[index][x]);
          };
          for (var k = 0; k < weekArr.length; k++) {
            sum = sum + weekArr[k];
          };
          key=keyArr[0]+'—'+keyArr[keyArr.length-1];
          aver = Math.round(sum / weekArr.length);
          return [key,aver];
        }(j);
      }
      chartData={};
      for(var l=0;l<chartArr.length;l++){
        chartData[chartArr[l][0]]=chartArr[l][1]
      }
      // console.log(chartData);
      break;
      case 'month':
      var startMonth=null,endMonth=null,monthArr=[];
      for(var date in nowChartData){
         monthArr.push(date);
      };
      //按月份分组
      startMonth=(new Date(monthArr[0])).getMonth();
      endMonth=(new Date(monthArr[monthArr.length-1])).getMonth();
      var months=[];
      for(var i=startMonth;i<=endMonth;i++){
        months[i]=function(i){
          var month={};
          for(var date in nowChartData){
            if( (new Date(date)).getMonth() ==i ){
              month[date]=nowChartData[date]
            };
          };
          return month;
        }(i);
      };
      // console.log(months);
      //计算平均值和设置对应的key的名称
      var chartArr=[];
      for(var j=0;j<months.length;j++){
        chartArr[j] = function(index) {
          var monthDateArr = [],monthKeyArr = [],
              sum = 0,aver = null,key = null;
          for (var x in months[index]) {
            monthKeyArr.push(x);
            monthDateArr.push(months[index][x]);
          };
          for (var k = 0; k < monthDateArr.length; k++) {
            sum = sum + monthDateArr[k];
          };
          key=monthKeyArr[0]+'—'+monthKeyArr[monthKeyArr.length-1];
          aver = Math.round(sum / monthDateArr.length);
          return [key,aver];
        }(j);
      };
      chartData={};
      for(var l=0;l<chartArr.length;l++){
        chartData[chartArr[l][0]]=chartArr[l][1]
      }
      break;
    };
}
/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  if(event.target.value != pageState.nowGraTime){
    // 设置对应数据
    pageState.nowGraTime=event.target.value;
    // 调用图表渲染函数
    renderDate();
    renderChart();
  }; 
}
/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var citySelect=document.getElementById('city-select');
  var index=citySelect.selectedIndex;
  if(citySelect[index].value != pageState.nowSelectCity){
    // 设置对应数据
    pageState.nowSelectCity=citySelect[index].value;    
    chartData=chartsData[pageState.nowSelectCity];
    // 调用图表渲染函数
    renderDate();
    renderChart();
  }  
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var formGraTime=document.getElementById('form-gra-time');
  var graTimeRadios=formGraTime.elements['gra-time'];
  for(var i=0,len=graTimeRadios.length;i<len;i++){
      graTimeRadios[i].onclick=function(){
        graTimeChange();
      };
  };
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var citys=[];
  for(var city in aqiSourceData){
    citys.push(city);
  };
  var citySelect=document.getElementById('city-select');
  var options=[];
  for(var i=0;i<citys.length;i++){
      options[i]=document.createElement('option');
      options[i].value=i;
      options[i].innerHTML=citys[i];
      citySelect.appendChild(options[i]);
  };
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  citySelect.onchange=function(){
    citySelectChange();
  }
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var arr=[];
  for(name in aqiSourceData){
   arr.push(aqiSourceData[name]);
  };
  chartsData=arr;
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}
window.onload=function(){
  init();
};