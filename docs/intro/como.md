# Cómo consultar
La API está disponible vía HTTPS en https://api.quienesquien.wiki/v2/docs

## Filtros
Consultar cada endpoint (extremo, o punto de consulta de la API) sin parámetros hará que se devuelva el total de las entradas, utilizando los límites por defecto (25 entradas). Si quieres modificar la consulta, limitándola a aquellas entradas que coincidan con ciertos criterios, ordeńandolas o expandiendo las referencias de cada entrada, debes usar los filtros.

Hay algunos filtros genéricos que aplican a todos los endpoints, y otros que aplican a cada endpoint en particular. Listaremos aquí los genéricos.

## limit
La cantidad de registros que se incluyen en cada página de resultados. Default: 25 registros. Tipo: 1000 >= entero > 0.

## offset
El número de registros a omitir desde el principio. Default: 0 registros (página inicial). Tipo: entero >= 0. Si el offset es mayor al número total de registros devuelve una respuesta vacía.

## embed
Bandera que indica si se incluyen referencias a otras colecciones dentro de cada documento en la respuesta. Esto inclurá las memberships, flags y summaries para cada entidad que lo tenga disponible. Default: false. Tipo: boolean.

## omit
Excluir de la respuesta los campos indicados, es un listado de campos separados por coma. Tipo: array.

## fields
Incluir sólo los campos indicados en la respuesta, es un listado de campos separados por coma. Tipo: array.


## updated_since (no implementado)
Limitar el conjunto de resultados a aquellos cuya fecha de última actualización sea posterior al valor del filtro. Tipo: date. Default: 0000-00-00T00:00:00Z.

## include_custom_fields (no implementado)
Bandera que indica los campos adicionales que se desea incluir dentro de cada documento en la respuesta. Default: none. Valores posibles: all, none, listado de campos. Tipo: array. Si algún campo solicitado no existe, no incluye información adicional en la respuesta.

En las bases de datos de QQW existen muchos datos adicionales a los estándares utilizados para cada tipo de dato. TODO: hacer el listado de los fields disponibles para cada tipo de dato.
