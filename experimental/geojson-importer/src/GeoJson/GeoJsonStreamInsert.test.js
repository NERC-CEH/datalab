import GeoJsonStreamInsert from './GeoJsonStreamInsert';

const geoJsonProcessor = new GeoJsonStreamInsert('mongodb://192.168.99.100:27017/test', 'Gridt', '../../../../GIS/data/LCM1km_Gridt_Exploded.json');
geoJsonProcessor.process();
