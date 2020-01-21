import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Draw from 'ol/interaction/Draw';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {transform} from 'ol/proj';
import './index.css';

var raster = new TileLayer({
  source: new OSM()
});

var source = new VectorSource({wrapX: false});

var vector = new VectorLayer({
  source: source
});

var map = new Map({
  layers: [raster, vector],
  target: 'map',
  view: new View({
    projection: 'EPSG:3857',
    center: [0, 0],
    zoom: 2
  })
});

var typeSelect = document.getElementById('type');

var draw; 
function addInteraction() {
  var value = typeSelect.value;
  if (value !== 'None') {
    draw = new Draw({
      source: source,
      type: typeSelect.value
    });
    map.addInteraction(draw);
  }
}

var info = document.getElementById('info');
map.on('click', function(evt){
  var transCoord = transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');

  createTable();
  addPointToTable(evt.coordinate, transCoord);

});


function createTable() {
  var coordTable = document.getElementById('coordTable');
  if (typeof coordTable == "undefined" || coordTable == null) {
    info.innerHTML = '<table id="coordTable"></table>';
    var newcoordTable = document.getElementById('coordTable');
    var header = newcoordTable.createTHead();
    var row = header.insertRow(-1);
    var cell = row.insertCell(-1);
    cell.innerHTML = 'EPSG:3857';
    cell.colSpan = 2;
    var cell2 = row.insertCell(-1);
    cell2.innerHTML = 'EPSG:4326';
    cell2.colSpan = 2;
    var row2 = header.insertRow(-1);
    row2.insertCell(-1).innerHTML = 'lan';
    row2.insertCell(-1).innerHTML = 'lat';
    row2.insertCell(-1).innerHTML = 'lan';
    row2.insertCell(-1).innerHTML = 'lat';
    newcoordTable.createTBody();
  } 
}


function addPointToTable(coordinate, transCoord) {
  var coordTable = document.getElementById('coordTable');
  var coordTableBody = coordTable.tBodies[0];
  var row = coordTableBody.insertRow(-1);
  row.insertCell(-1).innerHTML = coordinate[0].toFixed(2);
  row.insertCell(-1).innerHTML = coordinate[1].toFixed(2);
  row.insertCell(-1).innerHTML = transCoord[0].toFixed(2);
  row.insertCell(-1).innerHTML = transCoord[1].toFixed(2);
}
  

/**
 * Handle change event.
 */
typeSelect.onchange = function() {
  map.removeInteraction(draw);
  addInteraction();
};

addInteraction();