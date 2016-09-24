
var path = require('path'),
    sqlite3 = require('../sqlite3'),
    action = require('../action');

var fixture = {
  oa: path.resolve( __dirname, './oa.csv' ),
  street: path.resolve( __dirname, './osm.polylines' )
};

var db = {
  address: path.resolve( __dirname, './address.db' ),
  street: path.resolve( __dirname, './street.db' )
};

module.exports.functional = {};

// import data
module.exports.functional.import = function(test) {
  action.import(test, db, fixture);
};

// perform conflation
module.exports.functional.conflate = function(test) {
  action.conflate(test, db, fixture);
};

// check table schemas
module.exports.functional.schema = function(test) {
  action.check.schema(test, db);
};

// check table indexes
module.exports.functional.indexes = function(test) {
  action.check.indexes(test, db);
};

module.exports.functional.street_counts = function(test) {
  test('street db table counts', function(t) {

    // count polyline table
    var polylines = sqlite3.count( db.street, 'polyline' );
    t.equal(polylines, 100, 'count(polyline)');

    // count names table
    var names = sqlite3.count( db.street, 'names' );
    t.equal(names, 106, 'count(names)');

    // count rtree table
    var rtree = sqlite3.count( db.street, 'rtree' );
    t.equal(rtree, 100, 'count(rtree)');

    t.end();
  });
};

module.exports.functional.address_counts = function(test) {
  test('address db table counts', function(t) {

    // count address table
    var addresses = sqlite3.count( db.address, 'address' );
    t.equal(addresses, 117, 'count(address)');

    t.end();
  });
};

module.exports.functional.spotcheck = function(test) {
  test('spot checks', function(t) {

    // counts for a specific street
    var count1 = sqlite3.count( db.address, 'address', 'WHERE id=85' );
    t.equal(count1, 117);

    // counts for a specific street (open addresses)
    var count2 = sqlite3.count( db.address, 'address', 'WHERE id=85 AND source="OA"' );
    t.equal(count2, 106);

    // counts for a specific street (vertexes)
    var count3 = sqlite3.count( db.address, 'address', 'WHERE id=85 AND source="VERTEX"' );
    t.equal(count3, 11);

    t.end();
  });
};

module.exports.functional.end_to_end = function(test) {
  test('end to end', function(t) {

    // full interpolation for a single street
    var rows = sqlite3.exec( db.address, 'SELECT * FROM address WHERE id=85 ORDER BY housenumber' );
    t.deepEqual(rows, [
      '31|85|OA|2.0|40.7435261|-73.9886446|R|40.7436228|-73.9886036',
      '117|85|VERTEX|5.644||||40.743755|-73.988915',
      '116|85|VERTEX|6.803||||40.743797|-73.989014',
      '115|85|VERTEX|7.875||||40.743835|-73.989106',
      '39|85|OA|9.0|40.7440243|-73.989311|L|40.7439362|-73.9893479',
      '36|85|OA|10.0|40.7438118|-73.9893296|R|40.7439112|-73.989288',
      '60|85|OA|13.0|40.744086|-73.9894501|L|40.743995|-73.9894882',
      '87|85|OA|15.0|40.7441065|-73.9894991|L|40.7440155|-73.9895372',
      '12|85|OA|16.0|40.7440144|-73.9898646|R|40.7441319|-73.9898154',
      '71|85|OA|17.0|40.7441277|-73.9895494|L|40.7440365|-73.9895876',
      '34|85|OA|19.0|40.744174|-73.9896595|L|40.7440826|-73.9896977',
      '1|85|OA|20.0|40.7440595|-73.9899511|R|40.7441694|-73.9899051',
      '29|85|OA|21.0|40.7442178|-73.9897307|L|40.7441145|-73.9897739',
      '67|85|OA|22.0|40.7440904|-73.9900235|R|40.7441998|-73.9899777',
      '8|85|OA|23.0|40.7442446|-73.9898152|L|40.7441486|-73.9898554',
      '91|85|OA|24.0|40.7441106|-73.990071|R|40.7442197|-73.9900253',
      '78|85|OA|25.0|40.7442835|-73.9899408|L|40.7441991|-73.9899761',
      '27|85|OA|28.0|40.7441933|-73.9902611|R|40.7442998|-73.9902165',
      '33|85|OA|29.0|40.7443326|-73.9900578|L|40.7442481|-73.9900932',
      '86|85|OA|30.0|40.74427|-73.9904095|R|40.744364|-73.9903701',
      '22|85|OA|31.0|40.7443699|-73.9901353|L|40.7442813|-73.9901724',
      '69|85|OA|33.0|40.7444036|-73.9902155|L|40.7443149|-73.9902526',
      '11|85|OA|35.0|40.7444364|-73.9902936|L|40.7443476|-73.9903308',
      '58|85|OA|37.0|40.744513|-73.9904912|L|40.7444294|-73.9905262',
      '93|85|OA|38.0|40.7443843|-73.9906741|R|40.7444753|-73.990636',
      '47|85|OA|43.0|40.7445503|-73.99058|L|40.7444665|-73.9906151',
      '104|85|OA|45.0|40.7447413|-73.9910188|L|40.7446511|-73.991056',
      '114|85|VERTEX|55.392||||40.744518|-73.990738',
      '113|85|VERTEX|59.957||||40.744564|-73.990845',
      '112|85|VERTEX|84.212||||40.7448|-73.991417',
      '55|85|OA|99.0|40.7449546|-73.9915342|L|40.7448654|-73.9915719',
      '43|85|OA|101.0|40.7450163|-73.9916791|L|40.7449267|-73.9917169',
      '62|85|OA|103.0|40.7450435|-73.9917429|L|40.7449537|-73.9917808',
      '100|85|OA|104.0|40.7444663|-73.9920505|R|40.7449765|-73.991835',
      '35|85|OA|107.0|40.7450997|-73.9918748|L|40.7450094|-73.9919129',
      '64|85|OA|109.0|40.7451497|-73.9919922|L|40.7450591|-73.9920305',
      '75|85|OA|110.0|40.7449881|-73.9921126|R|40.7450778|-73.9920747',
      '70|85|OA|114.0|40.7450728|-73.9923134|R|40.7451626|-73.9922755',
      '73|85|OA|117.0|40.7452165|-73.9921491|L|40.7451254|-73.9921876',
      '99|85|OA|121.0|40.7454118|-73.9922795|L|40.7452017|-73.9923682',
      '53|85|OA|122.0|40.7451749|-73.9925553|R|40.7452647|-73.9925174',
      '52|85|OA|127.0|40.7453957|-73.9925637|L|40.7453012|-73.9926036',
      '3|85|OA|128.0|40.7452372|-73.992703|R|40.7453271|-73.992665',
      '10|85|OA|130.0|40.7452714|-73.9927839|R|40.7453613|-73.9927459',
      '68|85|OA|134.0|40.7453659|-73.9930101|R|40.7454567|-73.9929718',
      '90|85|OA|135.0|40.7454881|-73.992784|L|40.7453941|-73.9928237',
      '48|85|OA|141.0|40.745542|-73.9929126|L|40.7454484|-73.9929521',
      '97|85|OA|142.0|40.7454504|-73.9932104|R|40.7455412|-73.993172',
      '24|85|OA|145.0|40.7455733|-73.9929899|L|40.7454808|-73.993029',
      '72|85|OA|147.0|40.7456074|-73.9930644|L|40.7455127|-73.9931044',
      '63|85|OA|150.0|40.7455264|-73.9933905|R|40.7456173|-73.9933521',
      '44|85|OA|151.0|40.7457268|-73.9933489|L|40.7456327|-73.9933886',
      '5|85|OA|152.0|40.7456356|-73.9936494|R|40.7457266|-73.993611',
      '84|85|OA|164.0|40.7457762|-73.9939826|R|40.7458673|-73.9939441',
      '56|85|OA|165.0|40.7458564|-73.9936574|L|40.7457629|-73.9936969',
      '57|85|OA|171.0|40.745927|-73.9938255|L|40.7458338|-73.9938648',
      '42|85|OA|177.0|40.7459998|-73.9939991|L|40.7459071|-73.9940383',
      '111|85|VERTEX|189.4||||40.746002|-73.994263',
      '9|85|OA|200.0|40.746085|-73.9947263|R|40.7461812|-73.9946855',
      '101|85|OA|206.0|40.7462685|-73.9951578|R|40.7463644|-73.9951171',
      '51|85|OA|221.0|40.7465322|-73.9952701|L|40.7464449|-73.9953071',
      '85|85|OA|226.0|40.7464492|-73.9955766|R|40.7465425|-73.995537',
      '17|85|OA|229.0|40.7466814|-73.9956266|L|40.7465959|-73.9956629',
      '18|85|OA|231.0|40.7467134|-73.995703|L|40.7466282|-73.9957391',
      '76|85|OA|233.0|40.7467632|-73.9958218|L|40.7466785|-73.9958577',
      '30|85|OA|234.0|40.7465239|-73.9957546|R|40.7466179|-73.9957147',
      '15|85|OA|236.0|40.7465919|-73.9959168|R|40.7466866|-73.9958766',
      '98|85|OA|237.0|40.7468092|-73.9959359|L|40.7467266|-73.995971',
      '40|85|OA|239.0|40.7468447|-73.9960166|L|40.746761|-73.9960521',
      '95|85|OA|245.0|40.7469032|-73.996156|L|40.74682|-73.9961913',
      '19|85|OA|247.0|40.7469615|-73.9962953|L|40.746879|-73.9963303',
      '105|85|OA|248.0|40.7466817|-73.9961388|R|40.7467801|-73.9960971',
      '26|85|OA|249.0|40.7470057|-73.9964008|L|40.7469237|-73.9964356',
      '92|85|OA|250.0|40.7467046|-73.9961853|R|40.7468003|-73.9961447',
      '37|85|OA|251.0|40.7470286|-73.9964545|L|40.7469465|-73.9964893',
      '106|85|OA|260.0|40.7469443|-73.9967622|R|40.7470443|-73.9967198',
      '110|85|VERTEX|273.498||||40.747203|-73.997094',
      '28|85|OA|300.0|40.7472023|-73.99762|R|40.7473907|-73.9975409',
      '38|85|OA|301.0|40.7474685|-73.9974137|L|40.7473569|-73.9974606',
      '25|85|OA|348.0|40.7479166|-73.9990561|R|40.7480105|-73.9990167',
      '13|85|OA|367.0|40.7483412|-73.9994435|L|40.7482125|-73.9994976',
      '109|85|VERTEX|372.976||||40.748363|-73.999856',
      '108|85|VERTEX|377.66||||40.74842|-73.999985',
      '14|85|OA|400.0|40.7484513|-74.0003033|R|40.7485377|-74.0002673',
      '107|85|VERTEX|410.616||||40.748802|-74.000901',
      '6|85|OA|420.0|40.7485596|-74.0009495|R|40.7487833|-74.0008562',
      '50|85|OA|427.0|40.749222|-74.0012189|L|40.7489771|-74.001321',
      '54|85|OA|428.0|40.7488434|-74.0014509|R|40.7490034|-74.0013842',
      '102|85|OA|430.0|40.7488737|-74.001528|R|40.7490352|-74.0014602',
      '46|85|OA|441.0|40.7495486|-74.0015106|L|40.74913|-74.0016862',
      '21|85|OA|446.0|40.7489735|-74.0020666|R|40.7492423|-74.0019538',
      '103|85|OA|455.0|40.7494834|-74.0022422|L|40.7493813|-74.002285',
      '2|85|OA|459.0|40.7495454|-74.0023976|L|40.749446|-74.0024393',
      '20|85|OA|466.0|40.7492158|-74.0026324|R|40.7494804|-74.0025214',
      '16|85|OA|500.0|40.7496425|-74.0031615|R|40.7497332|-74.0031234',
      '7|85|OA|501.0|40.7498547|-74.0029253|L|40.7496806|-74.0029984',
      '32|85|OA|505.0|40.7498973|-74.0030583|L|40.7497345|-74.0031267',
      '74|85|OA|508.0|40.7498521|-74.0036555|R|40.7499416|-74.0036176',
      '41|85|OA|513.0|40.7499851|-74.0034576|L|40.7498908|-74.0034975',
      '94|85|OA|515.0|40.7500429|-74.0035984|L|40.7499501|-74.0036376',
      '61|85|OA|521.0|40.7501122|-74.0037672|L|40.7500212|-74.0038057',
      '88|85|OA|524.0|40.7500905|-74.0042259|R|40.7501824|-74.004187',
      '77|85|OA|525.0|40.7501948|-74.0039684|L|40.7501059|-74.004006',
      '65|85|OA|526.0|40.7501667|-74.0044081|R|40.7502593|-74.0043689',
      '79|85|OA|528.0|40.7501929|-74.004471|R|40.7502859|-74.0044317',
      '81|85|OA|533.0|40.7502821|-74.0041812|L|40.7501954|-74.0042178',
      '66|85|OA|534.0|40.7502174|-74.0045296|R|40.7503106|-74.0044902',
      '4|85|OA|537.0|40.7504506|-74.0045915|L|40.7503682|-74.0046264',
      '80|85|OA|542.0|40.7503053|-74.0047397|R|40.7503993|-74.0047',
      '49|85|OA|544.0|40.750349|-74.0048444|R|40.7504435|-74.0048044',
      '23|85|OA|549.0|40.7505053|-74.0047247|L|40.7504243|-74.004759',
      '83|85|OA|551.0|40.7505707|-74.0048841|L|40.7504914|-74.0049177',
      '82|85|OA|559.0|40.7507249|-74.0052214|L|40.7506357|-74.0052591',
      '59|85|OA|601.0|40.7517344|-74.0076165|L|40.7516429|-74.0076549',
      '45|85|OA|620.0|40.7509502|-74.006275|R|40.7510465|-74.0062346',
      '89|85|OA|624.0|40.7508708|-74.0060857|R|40.750967|-74.0060453',
      '96|85|OA|640.0|40.7513326|-74.007187|R|40.7514293|-74.0071464',
    ]);

    t.end();
  });
};


// write geojson to disk
module.exports.functional.geojson = function(test) {

  // full interpolation for a single street
  var rows = sqlite3.exec( db.address, 'SELECT * FROM address WHERE id=85 ORDER BY housenumber' );

  // destination path
  var destination = path.resolve(__dirname, 'preview.geojson');

  action.geojson(test, rows, destination);
};

// write tsv to disk
module.exports.functional.tsv = function(test) {

  // full interpolation for a single street
  var rows = sqlite3.exec( db.address, 'SELECT * FROM address WHERE id=85 ORDER BY housenumber' );

  // destination path
  var destination = path.resolve(__dirname, 'preview.tsv');

  action.tsv(test, rows, destination);
};

module.exports.all = function (tape) {

  function test(name, testFunction) {
    return tape('functional: grid: ' + name, testFunction);
  }

  for( var testCase in module.exports.functional ){
    module.exports.functional[testCase](test);
  }
};
