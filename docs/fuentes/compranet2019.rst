Compranet (2018-2019)
=====================

CompraNet es el sistema electrónico de información pública gubernamental
sobre adquisiciones, arrendamientos y servicios, así como obras públicas
y servicios relacionados con las mismas. Los datos de contratos del año
2018 en adelante tienen una estructura ligeramente diferente de los años
anteriores.

Origen de los datos: https://sites.google.com/site/cnetuc/descargas

Mapeo de campos
~~~~~~~~~~~~~~~

+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| COLUMNA                         | TIPO/VALORES                                                   | OCDS                                                      |
+=================================+================================================================+===========================================================+
| Orden de gobierno               | | **string**                                                   | | parties.govLevel = "country"                            |
|                                 | | "APF"                                                        | | parties.govLevel = "region"                             |
|                                 | | "GE"                                                         | | parties.govLevel = "city"                               |
|                                 | | "GM"                                                         |                                                           |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Siglas de la Institución        | **string**                                                     | parties.memberOf.initials                                 |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Institución                     | **string**                                                     | | *Para parties.role = "buyer":*                          |
|                                 |                                                                | | parties.memberOf.id                                     |
|                                 |                                                                | | parties.memberOf.name                                   |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Clave de la UC                  | **string**                                                     | *(no se usa)*                                             |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Nombre de la UC                 | | **string**                                                   | | tender.procuringEntity.id                               |
|                                 | | "SIGLAS-Nombre\_UC Clave\_UC"                                | | tender.procuringEntity.name                             |
|                                 | | "Iniciales Estado-Nombre Dependencia-Nombre\_UC Clave\_UC"   | | buyer.id                                                |
|                                 | | "Iniciales\_Estado-Nombre\_Municipio-Nombre\_UC Clave\_UC"   | | buyer.name                                              |
|                                 |                                                                | | *Para parties.role = "buyer":*                          |
|                                 |                                                                | | parties.id                                              |
|                                 |                                                                | | parties.name                                            |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Responsable de la UC            | **string**                                                     | | *Para parties.role = "buyer":*                          |
|                                 |                                                                | | parties.contactPoint.id                                 |
|                                 |                                                                | | parties.contactPoint.name                               |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Código del expediente           | **number**                                                     | tender.id                                                 |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Referencia del expediente       | **string**                                                     | *(no se usa)*                                             |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Clave CUCOP                     | **string**                                                     | *(no se usa)*                                             |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Título del expediente           | **string**                                                     | tender.title                                              |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Plantilla del expediente        | **string**                                                     | tender.procurementMethodDetailsTemplateMxCnet             |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Fundamento legal                | **string**                                                     | tender.procurementMethodRationale                         |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Número del procedimiento        | **string**                                                     | | id                                                      |
|                                 |                                                                | | ocid                                                    |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Fecha de fallo                  | **date**                                                       | awards.date                                               |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Fecha de publicación            | **datetime**                                                   | contracts.tenderPeriod.startDate                          |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Fecha de apertura               | **datetime**                                                   | contracts.tenderPeriod.endDate                            |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Carácter del procedimiento      | | **string**                                                   | tender.procurementMethodCharacterMxCnet                   |
|                                 | | "Nacional"                                                   |                                                           |
|                                 | | "Internacional"                                              |                                                           |
|                                 | | "Internacional bajo TLC"                                     |                                                           |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Tipo de contratación            | | **string**                                                   | | tender.additionalProcurementCategories                  |
|                                 | | "Servicios"                                                  | | tender.mainProcurementCategory *(mapeado a codelist)*   |
|                                 | | "Adquisiciones"                                              |                                                           |
|                                 | | "Arrendamientos"                                             |                                                           |
|                                 | | "Obra Pública"                                               |                                                           |
|                                 | | "Servicios Relacionados con la OP"                           |                                                           |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Tipo de procedimiento           | | **string**                                                   | | tender.procurementMethod *(mapeado a codelist)*         |
|                                 | | "Adjudicación directa"                                       | | tender.procurementMethodMxCnet                          |
|                                 | | "Adjudicación Directa Federal"                               |                                                           |
|                                 | | "Invitación a Cuando Menos 3 Personas"                       |                                                           |
|                                 | | "Licitación Pública"                                         |                                                           |
|                                 | | "Otro"                                                       |                                                           |
|                                 | | "Proyecto de Convocatoria"                                   |                                                           |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Forma de participación          | | **string**                                                   | | tender.submissionMethod *(mapeado a codelist)*          |
|                                 | | "Electrónica"                                                | | tender.submissionMethodDetails                          |
|                                 | | "Mixta"                                                      |                                                           |
|                                 | | "Presencial"                                                 |                                                           |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Código del contrato             | **number**                                                     | | awards.id                                               |
|                                 |                                                                | | contracts.id                                            |
|                                 |                                                                | | contracts.awardID                                       |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Núm. de control del contrato    | **string**                                                     | *(no se usa)*                                             |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Título del contrato             | **string**                                                     | | awards.title                                            |
|                                 |                                                                | | contracts.title                                         |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Descripción del contrato        | **string**                                                     | | contracts.description                                   |
|                                 |                                                                | | awards.description                                      |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Fecha de inicio del contrato    | **date**                                                       | contracts.period.startDate                                |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Fecha de fin del contrato       | **date**                                                       | contracts.period.endDate                                  |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Importe del contrato            | **number**                                                     | | contracts.value.amount                                  |
|                                 |                                                                | | awards.value.amount                                     |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Moneda del contrato             | **string**                                                     | | planning.budget.budgetBreakdown.amount.currency         |
|                                 |                                                                | | awards.value.currencycontracts.value.currency           |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Estatus del contrato            | | **string**                                                   | | contracts.status *(mapeado a codelist)*                 |
|                                 | | "Activo"                                                     | | contracts.statusMxCnet                                  |
|                                 | | "Expirado"                                                   | | tag *(mapeado a codelist)*                              |
|                                 | | "Terminado"                                                  |                                                           |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Convenio modificatorio          | | **number**                                                   | contracts.amendments.id                                   |
|                                 | | 01                                                           |                                                           |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Clave del programa federal      | **string**                                                     | | planning.budget.project                                 |
|                                 |                                                                | | planning.budget.projectID                               |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Fecha de firma del contrato     | **date**                                                       | contracts.dateSigned                                      |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Contrato marco                  | **???**                                                        | contracts.hasFramework                                    |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Compra consolidada              | | **number**                                                   | buyer.consolidatedProcessMxCnet                           |
|                                 | | 01                                                           |                                                           |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Contrato plurianual             | | **number**                                                   | | contracts.period.multiyearContractMxCnet                |
|                                 | | 01                                                           | | tender.contractPeriod.multiyearContractMxCnet           |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Clave de cartera SHCP           | **string**                                                     | *(no se usa)*                                             |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Folio en el RUPC                | **number**                                                     | | *Para parties.role = "supplier":*                       |
|                                 |                                                                | | parties.identifier.id                                   |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| RFC                             | **string**                                                     | | *Para parties.role = "supplier":*                       |
|                                 |                                                                | | parties.additionalIdentifiers.id                        |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Proveedor o contratista         | **string**                                                     | | awards.suppliers.name                                   |
|                                 |                                                                | | awards.suppliers.id                                     |
|                                 |                                                                | | *Para parties.role = "supplier":*                       |
|                                 |                                                                | | parties.name                                            |
|                                 |                                                                | | parties.id                                              |
|                                 |                                                                | | parties.identifier.legalName                            |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Estratificación de la empresa   | | **string**                                                   | | *Para parties.role = "supplier":*                       |
|                                 | | "Mediana"                                                    | | parties.details.scaleReportedBySupplierMxCnet           |
|                                 | | "Micro"                                                      |                                                           |
|                                 | | "No MIPYME"                                                  |                                                           |
|                                 | | "Pequeña"                                                    |                                                           |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Clave del país de la empresa    | **string**                                                     | | *Para parties.role = "supplier":*                       |
|                                 |                                                                | | parties.address.countryName                             |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| RFC verificado en el SAT        | | **number**                                                   | | *Para parties.role = "supplier":*                       |
|                                 | | 01                                                           | | parties.additionalIdentifiers.verified                  |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Crédito externo                 | | **number**                                                   | *(no se usa)*                                             |
|                                 | | 01                                                           |                                                           |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Organismo financiero            | **string**                                                     | | *Para parties.role = "funder":*                         |
|                                 |                                                                | | parties.id                                              |
|                                 |                                                                | | parties.name                                            |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+
| Dirección del anuncio           | **string**                                                     | awards.documents.url                                      |
+---------------------------------+----------------------------------------------------------------+-----------------------------------------------------------+

Mapeos a codelists OCDS
~~~~~~~~~~~~~~~~~~~~~~~

Tipos de Contratación (tender.mainProcurementCategory)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

+------------------------------------+--------------+
| VALOR ORIGINAL                     | VALOR OCDS   |
+====================================+==============+
| Servicios                          | services     |
+------------------------------------+--------------+
| Adquisiciones                      | goods        |
+------------------------------------+--------------+
| Arrendamientos                     | goods        |
+------------------------------------+--------------+
| Obra Pública                       | works        |
+------------------------------------+--------------+
| Servicios Relacionados con la OP   | works        |
+------------------------------------+--------------+

Tipos de Procedimiento (tender.procurementMethod)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

+----------------------------------------+------------------------------------------------------------------+
| VALOR ORIGINAL                         | VALOR OCDS                                                       |
+========================================+==================================================================+
| Licitacion Publica                     | open                                                             |
+----------------------------------------+------------------------------------------------------------------+
| Licitacion Publica Con Osd             | open                                                             |
+----------------------------------------+------------------------------------------------------------------+
| Licitacion Publica Estatal             | open                                                             |
+----------------------------------------+------------------------------------------------------------------+
| Invitacion A Cuando Menos 3 Personas   | limited                                                          |
+----------------------------------------+------------------------------------------------------------------+
| Adjudicacion Directa                   | direct                                                           |
+----------------------------------------+------------------------------------------------------------------+
| Adjudicacion Directa Federal           | direct                                                           |
+----------------------------------------+------------------------------------------------------------------+
| Convenio                               | direct                                                           |
+----------------------------------------+------------------------------------------------------------------+
| Proyecto de Convocatoria               | Determinado por el valor de PLANTILLA\_EXPEDIENTE:               |
|                                        | *07. Proyecto de Convocatoria a la Licitación Pública* = open    |
|                                        | *05. Adjudicación Directa LAASSP* = direct                       |
|                                        | *01. Licitación Pública LAASSP* = direct                         |
|                                        | *02. Licitación Pública LOPSRM = direct                          |
|                                        | *04. Invitación a Cuando Menos Tres Personas LOPSRM* = limited   |
|                                        | *03. Invitación a Cuando Menos Tres Personas LAASSP* = limited   |
+----------------------------------------+------------------------------------------------------------------+

Formas de Procedimiento (tender.submissionMethod)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

+------------------+------------------------+
| VALOR ORIGINAL   | VALOR OCDS             |
+==================+========================+
| Electrónica      | electronicSubmission   |
+------------------+------------------------+
| Mixta            | electronicSubmission   |
+------------------+------------------------+
| Presencial       | inPerson               |
+------------------+------------------------+

Estatus y Etiqueta de Contrato (tag, contracts.status)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

+------------------+-----------------------+
| VALOR ORIGINAL   | VALOR OCDS            |
+==================+=======================+
| Activo           | contract              |
+------------------+-----------------------+
| Expirado         | contractTermination   |
+------------------+-----------------------+
| Terminado        | contractTermination   |
+------------------+-----------------------+
