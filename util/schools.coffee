fs = require 'fs'
async = require 'async'
request = require 'request'
proj4 = require 'proj4'

utm = "+proj=utm +zone=32"
wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"

baseUrl  = "https://www.bergen.kommune.no"
bydelUrl = "/omkommunen/avdelinger/skoler?valgtbydel="
bydeler  = ['Arna', 'Bergenhus', 'Fana', 'Fyllingsdalen', 'Laksevåg', 'Ytrebygda', 'Årstad', 'Åsane']

getSchoolsForBydel = (n, cb) ->
  n = n + 1

  request baseUrl + bydelUrl + n, (err, res, body) ->
    return cb err if err
    matches = body.match /<li>\s+<a href="([^"]+)" title="([^"]+)">[^<]+<\/a>\s+<span class="alternativtNavn">- ([^<]+)/gi

    res = []
    for match in matches
      r = match.match /<li>\s+<a href="([^"]+)" title="([^"]+)">[^<]+<\/a>\s+<span class="alternativtNavn">- ([^<]+)/i
      res.push url: baseUrl + r[1], navn: r[2], type: r[3]

    console.log n, res.length
    return cb null, res

getGeometryForSchool = (school, cb) ->
  request school.properties.url, (err, res, body) ->
    return cb err if err
    match = body.match /<a href ="([^"]+)" target="_blank">Vis i kart<\/a>/i

    return cb null, null if match is null or not match[1]
    request match[1].replace(/&amp;/ig, '&'), (err, res, body) ->
      return cb err if err

      match = body.match /&ycoords=(\d+);&xcoords=(\d+)/
      school.geometry = type: 'Point', coordinates: proj4(utm,wgs84,[parseInt(match[2]), parseInt(match[1])])

      cb null, school

async.timesSeries 8, getSchoolsForBydel, (err, list) ->
  return console.log err if err

  schools = []
  for bydel, id in list
    for details in bydel
      details.bydel = bydeler[id]
      details.bydelId = id + 1
      schools.push type: 'Feature', properties: details
  console.log schools.length

  async.map schools, getGeometryForSchool, (err, schools) ->
    geojson = JSON.stringify({type: "FeatureCollection", features: schools})
    fs.writeFileSync 'data/skoler.geojson', geojson

