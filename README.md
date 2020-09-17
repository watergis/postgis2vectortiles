# postgis2vectortiles
![](https://github.com/watergis/postgis2vectortiles/workflows/Node.js%20Package/badge.svg)
![GitHub](https://img.shields.io/github/license/watergis/postgis2vectortiles)

This is a simple tool to create Mapbox Vectortiles under particular directory from PostGIS database

## Installation
### tippecanoe
This module uses [`tippecanoe`](https://github.com/mapbox/tippecanoe) to convert geojson files to mbtiles. Please make sure to install it before running.

for MacOS
```
$ brew install tippecanoe
```

for Ubuntu
```
$ git clone https://github.com/mapbox/tippecanoe.git
$ cd tippecanoe
$ make -j
$ make install
```

### main module
```
npm install @watergis/postgis2vectortiles
```

## Usage
See also [test.js](./test/test.js)
```js
const {postgis2vectortiles} = require('@watergis/postgis2vectortiles');
const config = require('./config');

const pg2vt = new postgis2vectortiles(config);
pg2vt.create('./tiles', '.mvt')
.then(res=>{
    console.log(res);
}).catch(err=>{
    console.log(err);
})
```
This module will create vectortiles (.mvt or .pbf) under specific directory from your PostGIS database.

## Configuration

### Dababase Connection
Please put your PostGIS database settings as follow under `config.js`.
```js
db: {
    user:'postgres',
    password:'Your password',
    host:'localhost',
    port:5432,
    database:'Your database name',
},
```

### mbtiles's Setting
```js
mbtiles: __dirname + '/narok.mbtiles',
```

### Layers' Setting
```js
layers: [
    //Put your layer definition here.
    ]
```

Each layer definition should include the following information.
The below is just an example of Pipeline Layer.
```js
    name: 'pipeline', //Layer Name
    geojsonFileName: __dirname + '/pipeline.geojson', //Temporary working file path
    //The following SQL is the most important one which is able to extract PostGIS data as GeoJSON format.
    select: `
    SELECT row_to_json(featurecollection) AS json FROM (
        SELECT
            'FeatureCollection' AS type,
            array_to_json(array_agg(feature)) AS features
        FROM (
            SELECT
            'Feature' AS type,
            ST_AsGeoJSON(ST_TRANSFORM(ST_MakeValid(x.geom),4326))::json AS geometry,
            row_to_json((
                SELECT p FROM (
                SELECT
                    x.pipeid as fid,
                    a.name as pipetype,
                    x.pipesize,
                    b.name as material,
                    x.constructiondate,
                    x.insertdate,
                    x.updatedate,
                    x.isjica
                ) AS p
            )) AS properties
            FROM pipenet x
            INNER JOIN pipetype a
            ON x.pipetypeid = a.pipetypeid
            INNER JOIN material b
            ON x.materialid = b.materialid
            WHERE NOT ST_IsEmpty(x.geom)
        ) AS feature
        ) AS featurecollection
    `
},
```

```
copyright (c) 2020 Jin IGARASHI
```
