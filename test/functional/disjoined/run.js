
var fs = require('fs'),
    path = require('path'),
    sqlite3 = require('../sqlite3'),
    action = require('../action');

var paths = {
  reports: path.resolve( __dirname, './reports/' ),
  fixture: {
    oa: path.resolve( __dirname, './oa.csv' ),
    polyline: path.resolve( __dirname, './osm.polylines' )
  },
  db: {
    address: path.resolve( __dirname, './address.db' ),
    street: path.resolve( __dirname, './street.db' )
  }
};

module.exports.functional = {};

// import data
module.exports.functional.import = function(test) {
  action.import(test, paths);
};

// perform conflation
module.exports.functional.conflate = function(test) {
  action.conflate(test, paths);
};

// check table schemas
module.exports.functional.schema = function(test) {
  action.check.schema(test, paths);
};

// check table indexes
module.exports.functional.indexes = function(test) {
  action.check.indexes(test, paths);
};

module.exports.functional.street_counts = function(test) {
  test('street db table counts', function(t) {

    // count polyline table
    var polylines = sqlite3.count( paths.db.street, 'polyline' );
    t.equal(polylines, 4, 'count(polyline)');

    // count names table
    var names = sqlite3.count( paths.db.street, 'names' );
    t.equal(names, 8, 'count(names)');

    // count rtree table
    var rtree = sqlite3.count( paths.db.street, 'rtree' );
    t.equal(rtree, 4, 'count(rtree)');

    t.end();
  });
};

module.exports.functional.address_counts = function(test) {
  test('address db table counts', function(t) {

    // count address table
    var addresses = sqlite3.count( paths.db.address, 'address' );
    t.equal(addresses, 52, 'count(address)');

    t.end();
  });
};

module.exports.functional.spotcheck_north = function(test) {
  test('spot check: north side', function(t) {

    // counts for a specific street
    var count1 = sqlite3.count( paths.db.address, 'address', 'WHERE id=1' );
    t.equal(count1, 32);

    // counts for a specific street (open addresses)
    var count2 = sqlite3.count( paths.db.address, 'address', 'WHERE id=1 AND source="OA"' );
    t.equal(count2, 22);

    // counts for a specific street (vertexes)
    var count3 = sqlite3.count( paths.db.address, 'address', 'WHERE id=1 AND source="VERTEX"' );
    t.equal(count3, 10);

    t.end();
  });
};

module.exports.functional.end_to_end_north = function(test) {
  test('end to end: north side', function(t) {

    // full interpolation for a single street
    var rows = sqlite3.exec( paths.db.address, 'SELECT * FROM address WHERE id=1 ORDER BY housenumber' );
    t.deepEqual(rows, [
      '1|1|OA|14.0|52.5087751|13.3197845|L|52.5088529|13.3200419',
      '51|1|VERTEX|14.064||||52.508762|13.320116',
      '2|1|OA|14.1|52.5086354|13.3198981|L|52.5087112|13.3201563',
      '3|1|OA|15.0|52.5084885|13.3200177|L|52.5085636|13.3202733',
      '4|1|OA|16.0|52.5081581|13.3198748|L|52.5083296|13.3204588',
      '5|1|OA|16.1|52.5082819|13.3201859|L|52.5083559|13.3204379',
      '49|1|VERTEX|16.58||||52.50827|13.320506',
      '6|1|OA|17.0|52.5081537|13.3202902|L|52.5082269|13.3205401',
      '7|1|OA|18.0|52.5079936|13.3204206|L|52.5080659|13.3206674',
      '8|1|OA|19.0|52.5078514|13.3205362|L|52.5079229|13.3207804',
      '9|1|OA|20.0|52.5076588|13.3206779|L|52.5077328|13.3209307',
      '47|1|VERTEX|20.258||||52.507606|13.321031',
      '45|1|VERTEX|20.614||||52.507431|13.321167',
      '43|1|VERTEX|20.787||||52.507347|13.321237',
      '10|1|OA|21.0|52.5071733|13.3210882|L|52.5072425|13.3213209',
      '11|1|OA|22.0|52.5069494|13.3212704|L|52.5070181|13.3215012',
      '12|1|OA|23.0|52.5067409|13.32144|L|52.506809|13.321669',
      '31|1|OA|50.0|52.5067516|13.3219716|R|52.5066896|13.3217657',
      '42|1|VERTEX|50.281||||52.506763|13.321706',
      '32|1|OA|51.0|52.5070123|13.3217595|R|52.5069514|13.3215547',
      '33|1|OA|52.0|52.5072582|13.3215594|R|52.5071979|13.3213567',
      '44|1|VERTEX|52.606||||52.507347|13.321237',
      '46|1|VERTEX|52.95||||52.507431|13.321167',
      '34|1|OA|53.0|52.5075021|13.3213608|R|52.5074435|13.3211573',
      '35|1|OA|54.0|52.5075497|13.3213222|R|52.5074915|13.32112',
      '48|1|VERTEX|54.491||||52.507606|13.321031',
      '36|1|OA|55.0|52.5077825|13.3211361|R|52.5077243|13.3209375',
      '37|1|OA|56.0|52.5080292|13.3209319|R|52.5079732|13.3207407',
      '38|1|OA|57.0|52.5082468|13.3207726|R|52.5081878|13.320571',
      '50|1|VERTEX|57.422||||52.50827|13.320506',
      '39|1|OA|58.0|52.5084363|13.3206005|R|52.5083824|13.3204169',
      '40|1|OA|59.0|52.5086452|13.3204313|R|52.5085921|13.3202506'
    ]);

    t.end();
  });
};


module.exports.functional.spotcheck_south = function(test) {
  test('spot check: south side', function(t) {

    // counts for a specific street
    var count1 = sqlite3.count( paths.db.address, 'address', 'WHERE id=2' );
    t.equal(count1, 20);

    // counts for a specific street (open addresses)
    var count2 = sqlite3.count( paths.db.address, 'address', 'WHERE id=2 AND source="OA"' );
    t.equal(count2, 19);

    // counts for a specific street (vertexes)
    var count3 = sqlite3.count( paths.db.address, 'address', 'WHERE id=2 AND source="VERTEX"' );
    t.equal(count3, 1);

    t.end();
  });
};

module.exports.functional.end_to_end_south = function(test) {
  test('end to end: south side', function(t) {

    // full interpolation for a single street
    var rows = sqlite3.exec( paths.db.address, 'SELECT * FROM address WHERE id=2 ORDER BY housenumber' );
    t.deepEqual(rows, [
      '13|2|OA|27.0|52.5046393|13.3231349|R|52.5047163|13.3233904',
      '14|2|OA|28.0|52.5044741|13.3232845|R|52.5045474|13.3235277',
      '15|2|OA|29.0|52.5042391|13.3234757|R|52.5043124|13.3237189',
      '16|2|OA|30.0|52.504004|13.3236668|R|52.5040773|13.32391',
      '17|2|OA|31.0|52.5039014|13.3237503|R|52.5039747|13.3239935',
      '18|2|OA|32.0|52.5037822|13.3238472|R|52.5038555|13.3240904',
      '19|2|OA|33.0|52.5037196|13.3238982|R|52.5037929|13.3241414',
      '20|2|OA|35.0|52.5034993|13.3240774|R|52.5035726|13.3243205',
      '41|2|OA|36.0|52.5032985|13.3242406|R|52.5033718|13.3244838',
      '21|2|OA|39.0|52.5035259|13.324596|L|52.5034684|13.3244052',
      '22|2|OA|40.0|52.5037368|13.3244426|L|52.5036749|13.3242373',
      '23|2|OA|41.0|52.5039756|13.3242319|L|52.5039177|13.3240398',
      '24|2|OA|42.0|52.5041548|13.3240857|L|52.504097|13.323894',
      '25|2|OA|43.0|52.5042048|13.324045|L|52.504147|13.3238533',
      '26|2|OA|44.0|52.5043478|13.3239275|L|52.5042903|13.3237368',
      '27|2|OA|45.0|52.5044245|13.3238652|L|52.504367|13.3236744',
      '28|2|OA|46.0|52.5045378|13.323773|L|52.5044803|13.3235823',
      '29|2|OA|47.0|52.5046793|13.3236578|L|52.5046219|13.3234672',
      '52|2|VERTEX|47.408||||52.504745|13.323367',
      '30|2|OA|48.0|52.5050013|13.3234623|L|52.5049211|13.3232137'
    ]);

    t.end();
  });
};

// write geojson to disk
module.exports.functional.geojson = function(test) {
  action.geojson(test, paths, '(id=1 OR id=2)');
};

// write tsv to disk
module.exports.functional.tsv = function(test) {
  action.tsv(test, paths, '(id=1 OR id=2)');
};

module.exports.all = function (tape) {

  function test(name, testFunction) {
    return tape('functional: disjoined: ' + name, testFunction);
  }

  for( var testCase in module.exports.functional ){
    module.exports.functional[testCase](test);
  }
};
