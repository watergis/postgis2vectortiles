import { postgis2mbtiles } from '@watergis/postgis2mbtiles';
import { Mbtiles2Pbf, FileExtension } from '@watergis/mbtiles2pbf';

type Config = {
  db: any; //DB Settings
  mbtiles: string; //File path for mbtiles of vectortiles
  minzoom: number; //Min zoom level given to tippecanoe
  maxzoom: number; //Max zoom level given to tippecanoe
  layers: Layer[]; //List of layer to define SQL for GeoJSON
};

type Layer = {
  name: string;
  geojsonFileName: string; //File path for GeoJSON
  select: string; //SQL for PostGIS
};

type Result = {
  output: string;
  no_tiles: number;
};

class postgis2vectortiles {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  /**
   * To extract the data from PostGIS and create vectortiles under specific directory.
   * @param dest output directory path for vectortiles
   * @param extension file extension for vectortiles. default is ".mvt", you may choose ".pbf"
   */
  create(dest: string, extension = FileExtension.MVT) {
    return new Promise<Result>(
      (resolve: (value?: Result) => void, reject: (reason?: any) => void) => {
        const pg2mbtiles = new postgis2mbtiles(this.config);
        pg2mbtiles
          .run()
          .then((mbtiles: string) => {
            const mbtiles2pbf = new Mbtiles2Pbf(mbtiles, dest, extension);
            return mbtiles2pbf.run();
          })
          .then((no_tiles: number) => {
            resolve({
              output: dest,
              no_tiles: no_tiles,
            });
          })
          .catch((err: any) => {
            reject(err);
          });
      }
    );
  }
}

export default postgis2vectortiles;
