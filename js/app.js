var map = L.map('map', {scrollWheelZoom: false}).setView([60.389444, 5.33], 11);
var topoUrl = 'http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}';
L.tileLayer(topoUrl, {
  maxZoom: 16,
  attribution: '<a href="http://www.statkart.no/">Statens kartverk</a>'
}).addTo(map);

var bydeler = {
  'Åsane'         : new L.FeatureGroup().addTo(map).bindPopup('Åsane'),
  'Arna'          : new L.FeatureGroup().addTo(map).bindPopup('Arna'),
  'Bergenhus'     : new L.FeatureGroup().addTo(map).bindPopup('Bergenhus'),
  'Laksevåg'      : new L.FeatureGroup().addTo(map).bindPopup('Laksevåg'),
  'Årstad'        : new L.FeatureGroup().addTo(map).bindPopup('Årstad'),
  'Fyllingsdalen' : new L.FeatureGroup().addTo(map).bindPopup('Fyllingsdalen'),
  'Fana'          : new L.FeatureGroup().addTo(map).bindPopup('Fana'),
  'Ytrebygda'     : new L.FeatureGroup().addTo(map).bindPopup('Ytrebygda')
}


request1 = new XMLHttpRequest();
request1.open('GET', 'http://starefossen.github.io/bergis/data/skoler.geojson', true);
request1.onload = function() {
  if (!request1.responseText) {
    return alert('skoler.geojson failed');
  }

  L.geoJson(JSON.parse(request1.responseText), {
    style: function (feature) {
      //return {color: feature.properties.color};
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.navn);
    }
  }).addTo(map);
};
request1.onerror = function() { alert('Could not resolve skoler.geojson'); };
request1.send();



request = new XMLHttpRequest();
request.open('GET', 'http://starefossen.github.io/bergis/data/bergen.geojson', true);

request.onload = function() {
  var cnt = 0;
  if (request.responseText) {

    var geojson = JSON.parse(request.responseText);
    for (var i = 0; i < geojson.features.length; i++) {
      switch (parseInt((geojson.features[i].properties.grunnkrets + '').substring(4,6))) {
        case 2: case 3: case 4:
          geojson.features[i].properties.bydel = 'Årstad';
          break;
        case 1: case 5: case 6:
          geojson.features[i].properties.bydel = 'Bergenhus';
          break;
        case 7: case 8: case 9:
          geojson.features[i].properties.bydel = 'Åsane';
          break;
        case 10: case 11: case 12:
          geojson.features[i].properties.bydel = 'Arna';
          break;
        case 13: case 14: case 15: case 17:
          geojson.features[i].properties.bydel = 'Fana';
          break;
        case 16:
          geojson.features[i].properties.bydel = 'Ytrebygda';
          break;
        case 18:
          geojson.features[i].properties.bydel = 'Fyllingsdalen';
          break;
        case 19: case 20:
          geojson.features[i].properties.bydel = 'Laksevåg';
          break;
      }
      //console.log(geojson.features[i].properties.grunnkrets, geojson.features[i].properties.bydel);
      bydeler[geojson.features[i].properties.bydel].addLayer(L.GeoJSON.geometryToLayer(geojson.features[i]));
    }
    bydeler.Åsane.setStyle({          color: '#0074D9', stroke: false, fillOpacity: 0.6});
    bydeler.Arna.setStyle({           color: '#7FDBFF', stroke: false, fillOpacity: 0.6});
    bydeler.Bergenhus.setStyle({      color: '#39CCCC', stroke: false, fillOpacity: 0.6});
    bydeler.Laksevåg.setStyle({       color: '#3D9970', stroke: false, fillOpacity: 0.6});
    bydeler.Årstad.setStyle({         color: '#2ECC40', stroke: false, fillOpacity: 0.6});
    bydeler.Fyllingsdalen.setStyle({  color: '#FFDC00', stroke: false, fillOpacity: 0.6});
    bydeler.Fana.setStyle({           color: '#FF851B', stroke: false, fillOpacity: 0.6});
    bydeler.Ytrebygda.setStyle({      color: '#FF4136', stroke: false, fillOpacity: 0.6});
  } else {
    alert('Could not find geojson');
  }
};

var colors = [
  '#001F3F',
  '#0074D9',
  '#7FDBFF',
  '#39CCCC',
  '#3D9970',
  '#2ECC40',
  '#01FF70',
  '#FFDC00',
  '#FF851B',
  '#FF4136',
  '#85144B',
  '#F012BE',
  '#B10DC9'
];

request.onerror = function() {
  alert('Could not resolve');
};

request.send();

