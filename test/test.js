const {postgis2vectortiles} = require('../dist/index');
const config = require('./config');

const test = () =>{
    console.time('postgis2vectortiles');
    const pg2vt = new postgis2vectortiles(config);
    pg2vt.create(config.ghpages.tiles)
    .then(res=>{
        console.log(res);
    }).catch(err=>{
        console.log(err);
    }).finally(()=>{
        console.timeEnd('postgis2vectortiles');
    })
};

module.exports = test();