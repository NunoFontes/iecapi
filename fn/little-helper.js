exports.countriesInGroup = function(groups,cb){
	var the_countries = []
 var find_query = {"g":groups.toLowerCase()}
 if(groups[0] == 'world') find_query = {"country":{$exists:true}}
 
 //console.log('find_query',find_query)
	
 local_database.collection('groups').find(find_query).sort({"n":-1}).limit(1000).toArray(function(e, results){
	 if(e) console.log(e)
  //console.log('countriesInGroupresults',results)
  if(results[0])
  for(var i = 0;i<results.length;i++){
   the_countries.push(results[i].country)
  }
  //console.log('the_countries',the_countries)
  if(cb) cb(the_countries)
 }) 
}

exports.getLatestFromTE = function(countries,indicators,opts,cb){
 var response = []
 var hit = ''
 var getCountries = ''
 if(typeof countries == 'string'){
  get__countries = countries
  hit = '/country/'+encodeURIComponent(get__countries)+'/'+encodeURIComponent(indicators)+'/'
  return get_TE_API(hit,cb);
 }else if(typeof countries == 'object'){
  var objective = Math.max(Math.round(countries.length/10))
  var contador = 0
  for(var chunks = 0; chunks < countries.length; chunks = chunks+10){
   get__countries = countries.slice(chunks,chunks+10).join(',')
   hit = '/country/'+encodeURIComponent(get__countries)+'/'+encodeURIComponent(indicators)+'/'
   get_TE_API(hit,function(te_list){
    if(te_list.length > 0) response = _.union(response,te_list)
    contador++
    if(contador > objective) cb(response)
   })
  }
 }
}

exports.getForecastsFromTE = function(pairs,cb){
 var uri = '/forecast/country/'
 var countries = []
 var indicators = []

 _.each(pairs.split(','),function(pair){
  countries.push(pair.split(':')[0])
  indicators.push(pair.split(':')[1])
 })
  
 countries = _.unique(countries)
 indicators = _.unique(indicators)

 uri += countries.join(',')
 uri += '/indicator/'
 uri += indicators.join(',')
 console.log(uri)
 get_TE_API(uri,function(forecasts){
  cb(forecasts)
 })

}


var get_TE_API = function(uri,cb){
 var options = {
   host: 'api.tradingeconomics.com',
   port: 80,
   headers: SQL_AUTH_KEY, 
   path: uri
  }
  //console.log(options)
  var buffer = ''
  callback = function(response) {
   response.on('data', function (chunk) {
    buffer += chunk;
   });
   response.on('end', function () {
    //console.log('response',buffer)
    cb(JSON.parse(buffer))
   });
  }
  var req = http.get(options, callback ).end()
}