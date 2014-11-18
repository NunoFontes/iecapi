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
	}


	cb(series)
}