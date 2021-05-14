# Api.QuienEsQuien.Wiki (deprecated)

## This version of the API has been deprecated. Check the new one: https://github.com/projectpoder/qqwapi-elastic

[![build status](http://gitlab.rindecuentas.org/equipo-qqw/QuienesQuienApi/badges/dev/build.svg)](http://gitlab.rindecuentas.org/equipo-qqw/QuienesQuienApi/commits/dev)

Built on [Swagger/OpenAPI](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md), [nodejs](https://nodejs.org/en/) and [express](https://expressjs.com/).

  * API: api.quienesquien.wiki/v1/{persons,organizations,contracts,memberships}
  * DOCS: [api.quienesquien.wiki/v1/docs](https://api.quienesquien.wiki/v1/docs)
  * SPECIFICATION: [api.quienesquien.wiki/v1/spec.json](https://api.quienesquien.wiki/v1/spec.json)

# query

Please see
[query-to-mongo](https://www.npmjs.com/package/query-to-mongo) for
[filtering](https://www.npmjs.com/package/query-to-mongo#filtering) and
[field
selection](https://www.npmjs.com/package/query-to-mongo#field-selection)
references with *GET* method.

# docker

## build
docker build . -t poder/quienesquienapi:0.3                        

## push
docker push poder/quienesquienapi:0.3

docker images are pushed automatically here:

https://hub.docker.com/r/poder/quienesquienapi/tags/

## run
docker run -p 8085:8080 --env MONGODB_URI=localhost:27017/dbname  poder/quienesquienapi:0.3 &

# staging

https://quienesquienapi.herokuapp.com/v1/docs
