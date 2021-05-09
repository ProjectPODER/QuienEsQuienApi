Esta version de la API está abandonada
==================================
 
Revisar la nueva documentación `qqwapi-elastic en readthedocs <https://qqwapi-elastic.readthedocs.io/es/latest/>`_

La API de QuienEsQuienWiki es un recurso de datos abiertos basado en estándares para facilitar el análisis corporativo y de relaciones de poder entre políticos y empresarios de latinoamérica, disponible para analistas, periodistas e investigadores de datos de todo el mundo.

La API (interfaz de programación de aplicaciones o Application Programming Interface) permite consultar datos de empresas, instituciones públicas, personas, relaciones, contratos y otros datos, principalmente de México y progresivamente incorporando datos de mercados estratégicos en américa latina para reutilizarlos en aplicaciones informáticas o sitios web, siempre y cuando se respeten los términos de la licencia CC-BY-SA.

Las respuestas son en JSON, basado en los estándares `Popolo Project <http://www.popoloproject.com/>`_ y `Open Contracting Data Standard <http://standard.open-contracting.org/>`_. El sistema es una API REST hecha con Swagger y la definición OpenAPIv2. El código fuente está disponible en `el Github del proyecto <https://github.com/ProjectPODER/QuienEsQuienApi>`_.

Nota: Esta documentación está en proceso de actualización. Por cualquier consulta por favor escribir a info@quienesquien.wiki.

.. toctree::
   :maxdepth: 2
   :caption: Primeros pasos

   intro/origen.md
   intro/como.md
   intro/licencia.md

.. toctree::
   :maxdepth: 2
   :caption: Descripción detallada

   detalle/endpoints.md
   detalle/tipos.md
   detalle/errores.md

.. toctree::
  :maxdepth: 2
  :caption: Fuentes

  fuentes/listado.md
  fuentes/compranet.rst
  fuentes/compranet2019.rst
  fuentes/compranet3.rst
  fuentes/pot.rst
  fuentes/tdc.rst

.. toctree::
   :maxdepth: 2
   :caption: Tutoriales

   tutoriales/consulta.md
   tutoriales/towerbuilder.md
