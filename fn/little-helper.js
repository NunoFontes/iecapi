exports.countriesInGroup = function(groups,cb){
	var the_countries = []
 var find_query = {"g":groups[0].toLowerCase()}
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
  if(cb) cb(the_countries.join('\',\''))
 }) 
}