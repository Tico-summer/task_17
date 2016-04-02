// �������������������ģ�����ɲ�������
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
  "����": randomBuildData(500),
  "�Ϻ�": randomBuildData(300),
  "����": randomBuildData(200),
  "����": randomBuildData(100),
  "�ɶ�": randomBuildData(300),
  "����": randomBuildData(500),
  "����": randomBuildData(100),
  "����": randomBuildData(100),
  "����": randomBuildData(500)
};

// �ݴ�����,ԭʼ���ݵĳ��ӹ�,ÿ����Ⱦͼ������ݶ��Ǵ�����ݴ������л�ȡ
var chartsData={};

// ������Ⱦͼ�������
var chartData = {};

// ��¼��ǰҳ��ı�ѡ��
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}
//�����ȡ��ɫ
function randomColor(){
	return "#" +Math.random().toString(17).substring(2,5);
}
/**
 * ��Ⱦͼ��
 */
function renderChart() {
   var aqichartWrap=document.getElementsByClassName('aqi-chart-wrap');
   var ul=document.createElement('ul');
   var lis=[];
   for(var data in chartData){
      var lists=document.createElement('li');
      lists.id=data;
      lists.title=data+'_������Ⱦָ����'+chartData[data];
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
 * ���ݴ���
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
      //��һ��
      var firstWeek={};
      for(var first in nowChartData){
         if(new Date(startOfWeek[0]) > new Date(first)){
             firstWeek[first]=nowChartData[first];
         }
      }
      weeks[0]=firstWeek;
      //�м��ÿ��
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
      //���һ��
      var lastWeek={};
      for(var last in nowChartData){
         if(new Date(startOfWeek[startOfWeek.length-1]) < new Date(last)){
             lastWeek[last]=nowChartData[last];
         }
      };
      weeks[startOfWeek.length]=lastWeek;
      //����ƽ��ֵ�����ö�Ӧ��key������
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
          key=keyArr[0]+'��'+keyArr[keyArr.length-1];
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
      //���·ݷ���
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
      //����ƽ��ֵ�����ö�Ӧ��key������
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
          key=monthKeyArr[0]+'��'+monthKeyArr[monthKeyArr.length-1];
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
 * �ա��ܡ��µ�radio�¼����ʱ�Ĵ�����
 */
function graTimeChange() {
  // ȷ���Ƿ�ѡ����˱仯 
  if(event.target.value != pageState.nowGraTime){
    // ���ö�Ӧ����
    pageState.nowGraTime=event.target.value;
    // ����ͼ����Ⱦ����
    renderDate();
    renderChart();
  }; 
}
/**
 * select�����仯ʱ�Ĵ�����
 */
function citySelectChange() {
  // ȷ���Ƿ�ѡ����˱仯 
  var citySelect=document.getElementById('city-select');
  var index=citySelect.selectedIndex;
  if(citySelect[index].value != pageState.nowSelectCity){
    // ���ö�Ӧ����
    pageState.nowSelectCity=citySelect[index].value;    
    chartData=chartsData[pageState.nowSelectCity];
    // ����ͼ����Ⱦ����
    renderDate();
    renderChart();
  }  
}

/**
 * ��ʼ���ա��ܡ��µ�radio�¼��������ʱ�����ú���graTimeChange
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
 * ��ʼ������Select����ѡ����е�ѡ��
 */
function initCitySelector() {
  // ��ȡaqiSourceData�еĳ��У�Ȼ������idΪcity-select�������б��е�ѡ��
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
  // ��select�����¼�����ѡ����仯ʱ���ú���citySelectChange
  citySelect.onchange=function(){
    citySelectChange();
  }
}

/**
 * ��ʼ��ͼ����Ҫ�����ݸ�ʽ
 */
function initAqiChartData() {
  // ��ԭʼ��Դ���ݴ����ͼ����Ҫ�����ݸ�ʽ
  // ����õ����ݴ浽 chartData ��
  var arr=[];
  for(name in aqiSourceData){
   arr.push(aqiSourceData[name]);
  };
  chartsData=arr;
}

/**
 * ��ʼ������
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}
window.onload=function(){
  init();
};