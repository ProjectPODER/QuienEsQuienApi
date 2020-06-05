const SwaggerExpress = require('@chezearth/swagger-express-mw');
const app = require('express')();
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('api/swagger/swagger.yaml');
const customCss = '#header, .topbar { display: none }';
const dotenv = require('dotenv');
const csvRouter = require('./routes/csv');

dotenv.config();

const config = {
  appRoot: __dirname, // required config
};

const swaggerUIOptions = {
  url: `${swaggerDocument.host}/${swaggerDocument.basePath}/spec.json`,
};

if (process.env.NODE_ENV !== 'test' && !process.env.MONGODB_URI) {
  throw 'please configure MONGODB_URI\nwith "localhost:27017/foo" or similar';
}

module.exports = app; // for testing

app.use(`${swaggerDocument.basePath}/csv`, csvRouter);


app.use(`${swaggerDocument.basePath}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, false, swaggerUIOptions, customCss));

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) {
    throw err;
  }

  swaggerExpress.register(app);

  const port = process.env.PORT || 10010;

  const l = app.listen(port, () => {
    process.stdout.write(`listing on port ${l.address().port}\n`);


    var pjson = require('./package.json');

    process.stdout.write("QuienEsQuienApi v"+pjson.version+ " - Started: "+ new Date()+"\n");
  });

});

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  response.header('Access-Control-Allow-Methods', 'GET, OPTIONS');

  return next();
});
