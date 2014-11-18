exports.geoMapify = function(data,cb){
  var distance_to_mean = 2.2
  var array_of_the_values = []
  var treated_data = []
  data = _.sortBy(data,'LatestValue')
 _.each(data,function(item){
  treated_data.push({country:item.Country,category:item.Category,latestvalue:item.LatestValue,scale:item.LatestValue})
  array_of_the_values.push(Number(item.LatestValue))
 })


 var stats = average(array_of_the_values)
 console.log(stats)
 var can_stop = true
 for(var j = 0; can_stop && j<treated_data.length;j++){
  if(withinStd(stats.mean, treated_data[j].scale, distance_to_mean*stats.deviation)){
   can_stop = false
  }else{
   treated_data[j].scale = stats.mean-distance_to_mean*stats.deviation
  }
 }
 
 can_stop = true
 for(var j = treated_data.length-1; can_stop && j>0;j--){
  if(withinStd(stats.mean, treated_data[j].scale, distance_to_mean*stats.deviation)){
   can_stop = false
  }else{
   treated_data[j].scale = stats.mean+distance_to_mean*stats.deviation
  }
 }
 treated_data.unshift({min_scale: treated_data[0].scale,max_scale: treated_data[treated_data.length-1].scale})
 cb(treated_data)
}


exports.adjustify = function(data,cb){
 
}

exports.forecastify = function(data,cb){
  var series = []

  for(var i = 0; i< data.length; i++){
    series.push({serie:{}})
    series[i].serie.name = data[i].Country + ' - ' +data[i].Category
    series[i].serie.shortname = "."//data[i].Country + ' - ' +data[i].Category
    series[i].serie.data = []
  
  fields = [{field:"q1",date:false},
    {field:"q2",date:false},
    {field:"q3",date:false},
    {field:"q4",date:false},
    {field:"YearEnd",date:new Date("2015/12/31")},
    {field:"YearEnd2",date:new Date("2020/12/31")},
    {field:"YearEnd3",date:new Date("2050/12/31")}]
    
    for(var f = 0; f<fields.length; f++){
      if(!data[i][fields[f].field]) continue;
      series[i].serie.data.push({x: new Date((fields[f].date?fields[f].date:data[i][fields[f].field+'date'])).getTime(),
                                 y: data[i][fields[f].field],
                                 ttvalue: data[i][fields[f].field],
                                 ttunit: ""})
    }
    series[i].serie.data = interpolateMonthly(series[i].serie.data)
  }
  cb(series)
}

var interpolateMonthly = function(series){
 if(series.length < 2) return series;

 for(var i = 0; i< series.length -1 ; i++){
  var diff_in_months = (series[1+i].x - series[i].x)/(1000*60*60*24*31)

  if(diff_in_months > 2){
   series.splice(i+1, 0, {x: addMonths(series[i].x),
                        y: series[i].y,
                        ttvalue: series[i].y,
                        ttunit: ""})
  }
  //console.log(diff_in_months)
  //console.log(new Date(addMonths(series[i].x)),new Date(series[i].x))
  //console.log(i, series[i])
 }
 return series
}


function addMonths(dateObj, num) {
 if(!num) num = 1
 if(typeof dateObj == 'number') dateObj = new Date(dateObj)
 var currentMonth = dateObj.getMonth() + dateObj.getFullYear() * 12;
 dateObj.setMonth(dateObj.getMonth() + num);
 var diff = dateObj.getMonth() + dateObj.getFullYear() * 12 - currentMonth;

 // If don't get the right number, set date to 
 // last day of previous month
 if (diff != num) dateObj.setDate(0); 
 return dateObj.getTime();
} 


var average = function(a) {
  if(!a) return 1;
  var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
  for(var m, s = 0, l = t; l--; s += a[l]);
  for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
  return r.deviation = Math.sqrt(r.variance = s / t), r;
}
    
var withinStd = function(mean, val, stdev) {
   var low = mean-(stdev);
   var hi = mean+(stdev);
   return (val > low) && (val < hi);
}
