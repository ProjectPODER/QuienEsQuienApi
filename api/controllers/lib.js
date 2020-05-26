const flow = require('lodash/fp/flow');
const omitBy = require('lodash/fp/omitBy');
const isArray = require('lodash/fp/isArray');
const isEmpty = require('lodash/fp/isEmpty');
const isDate = require('lodash/fp/isDate');
const isObject = require('lodash/fp/isObject');
const isString = require('lodash/fp/isString');
const clone = require('lodash/fp/clone');
const orderBy = require('lodash/fp/orderBy');
const slice = require('lodash/fp/slice');
const isNil = require('lodash/fp/isNil');
const extend = require('lodash/extend');
const omit = require('lodash/omit');
const find = require('lodash/find');
const q2m = require('query-to-mongo');
const qs = require('qs');
const pickBy = require('lodash/pickBy');
const mapValues = require('lodash/mapValues');
const removeDiacritics = require('diacritics').remove;
const sanitize = require('mongo-sanitize');
const parser = require('mongo-parse');
const moment = require('moment');
// FIXME we should modify or replace `swagger_params_parser`
// fitting instead of reparsing params here

// https://www.npmjs.com/package/query-to-mongo#field-selection

function parseDates(string) {
  if (typeof string === 'number' || typeof string === 'object' || typeof string === 'boolean'  ) {
    return string;
  }

  //TODO: Some contract IDs look like dates to nodejs and they fail

  // console.log('parseDates',string);
  const object = new Date(string);
  const isValidDate = moment(object).isValid();

  if (isValidDate) {
    return object.toISOString();
  }
  return string;
}

function getQuery(req, debug) {
  const params = pickBy(req.swagger.params, p => (p.value));
  const sane = sanitize(req.query);

  const mapped = mapValues(params, p => (p.value));

  extend(sane, mapped);


  if (debug) {
    // console.log('DEBUG getQuery req.swagger.params',req.swagger.params);
    console.log('DEBUG getQuery sane',sane);
  }

  // const string =  decodeURIComponent(decodeURIComponent(clone(qs.stringify(sane))));
  //Fix values with commas
  for (s in sane) {
    if (typeof sane[s] != "object") {
    // console.log("non-decoded",typeof sane[s],sane[s]);
      sane[s] = decodeURIComponent(decodeURIComponent(clone(sane[s])));
    // console.log("decoded", typeof sane[s],sane[s]);
    }

  }
  const string = qs.stringify(sane);


  // console.log(string);
  const query = q2m(string, { ignore: 'embed' });
  // console.log('getQuery',query);

  if (debug) {
    console.log('DEBUG getQuery q2m',query);
  }

  // Fix criteria
  for (const criteria in query.criteria) {

    // Fix array criteria
    if (criteria.indexOf('[') > -1) {
      const cleanCriteria = criteria.substr(0, criteria.indexOf('['));
      const obj = {};

      if (!query.criteria.$and) {
        query.criteria.$and = [];
      }
      obj[cleanCriteria] = clone(query.criteria[criteria]);
      query.criteria.$and.push(obj);
      // console.log("a2",query.criteria.$and);
      // Object.assign(query.criteria,and);
      delete query.criteria[criteria];
    }

    // Fix text search
    if (criteria == "compiledRelease.contracts.title") {
      query.criteria.$text = { $search: clone(query.criteria[criteria]) };
      delete query.criteria[criteria];

      //Contract search with title do not sort -- because of mongo memory restrictions
      delete query.options.sort;
    }

    //Fix name search (on two fields)
    if (criteria == "compiledRelease.name") {
      if (!query.criteria.$or) {
        query.criteria.$or = [];
      }
      query.criteria.$or.push({ "compiledRelease.name": clone(query.criteria[criteria]) });
      query.criteria.$or.push({ "compiledRelease.other_names.name": clone(query.criteria[criteria]) });

      delete query.criteria[criteria];
    }

  }
  delete query.criteria.debug;
  delete query.criteria.mujeres_embed;

  // console.log("getQuery",JSON.stringify(query));

  const parsed = parser.parse(query.criteria);

  if (debug) {
    console.log('DEBUG getQuery parsed',JSON.stringify(parsed,null,4));
  }

  // console.log("getQuery parsed",);

  query.criteria = parsed.mapValues((field, value) => ( parseDates(value)));

  if (debug) {
    console.log('DEBUG getQuery criteria',JSON.stringify(query.criteria,null,4));
  }


  // console.log("getQuery criteria",query.criteria);
  query.embed = (isString(sane.embed));
  return query;
}

function getDistinct(req, res, collection) {
  const field = req.swagger.params.field.value;
  console.log("Distinct",field);

  const debug = req.query.debug;
  const query = getQuery(req,debug);

  // const sane = sanitize(req.query);
  // const string = qs.stringify(sane);
  // const query = q2m(string, { ignore: 'embed' });


  res.set('Content-Type', 'application/json; charset=utf-8');
  return collection.distinct(field, query.criteria)
    .then(data => {
      const size = data.length;

      res.json({
        status: 'success',
        data,
        size,
      });
    }).catch(err => {
      console.error("getDistinct error",err);
      if (err) {
        return `error: ${err}`;
      }
      return err;
    });;
}

function queryToPipeline(query, JOINS) {
  // console.log("queryToPipeline",query,JOINS);
  JOINS.unshift({
    $match: query.criteria,
  });
  return JOINS;
}

function arrayResultsOptions(query, pipeline) {
  // console.log("arrayResultsOptions",query.options.sort,query.options.sort);
  if (query.options.sort) {
    pipeline.push({ $sort: query.options.sort });
  }
  if (query.options.skip) {
    pipeline.push({ $skip: query.options.skip });
  }
  if (query.options.limit) {
    pipeline.push({ $limit: query.options.limit });
  }

  return pipeline;
}

function allDocuments(query, collection, JOINS, debug=false) {
  // console.log("q",query.criteria);
  if (query.criteria.debug || debug) {
    debug = true;
    delete query.criteria.debug;
    console.log("DEBUG allDocuments",collection.name);
    console.log("DEBUG allDocuments query 1",JSON.stringify(query,null,4));
  }
  const maxTime = 1000*30;

  query.options.maxTimeMS = maxTime;
  const countP = collection.count(query.criteria,{maxTimeMS: query.options.maxTimeMS}).catch(err => {
    console.error("allDocuments count error",err);
    if (err) {
      return `error: ${err}`;
    }
    return err;
  });

  if (query.embed) {
    const p = queryToPipeline(query, clone(JOINS));
    const pipeline = arrayResultsOptions(query, p);

    const pipelineOptions = {
    //   allowDiskUse: true,
      maxTimeMS: maxTime
    }

    if (debug) {
      console.log("DEBUG allDocuments query 2",JSON.stringify(query,null,4));
      console.log("DEBUG allDocuments pipeline",JSON.stringify(pipeline,null,4));
    }

    const resultsP = collection.aggregate(pipeline, pipelineOptions);

    return Promise.all([countP, resultsP]);
  }

  if (debug) {
    console.log("DEBUG allDocuments query",JSON.stringify(query,null,4));
  }

  const resultsP = collection.find(query.criteria, query.options).catch(err => {
    console.error("allDocuments error",err);
    if (err) {
      return `error: ${err}`;
    }
    return err;
  });

  return Promise.all([countP, resultsP]);
}

function omitEmpty(object) {
  return flow(
    omitBy(isNil),
    omitBy(v => (isArray(v) && isEmpty(v))),
    omitBy(v => (isString(v) && isEmpty(v))),
    omitBy(v => (!isDate(v) && isObject(v) && isEmpty(v)))
  )(object);
}

function dataReturn(res, array, offset, limit, embed, objectFormat, debug) {
  let data = array[1];
  let status = "success";
  let size = 0;

  // Contracts have a different structure and their length comes in the third item in the array
  // console.log("dataReturn",array);
  if (array[2] || (array[1] && typeof array[1] == "object")) {
    size = array[2] || array[1].length;
    if (embed) {
      data = array[1].map(o => (objectFormat(o)));
    }
  }
  else {
    console.error("dataReturn error",array);
    status = "error";
  }

  if (debug) {
    console.log("dataReturn",size);
  }

  const pageSize = limit || size;
  const pagesNum = Math.ceil((array[0] / pageSize));


  res.set('Content-Type', 'application/json; charset=utf-8');
  res.json({
    status: status,
    size,
    limit,
    offset,
    pages: pagesNum,
    count: array[0],
    data,
  });
}


async function getContracts(type, id, db, limit) {
  const records = db.get('records', { castIds: false });
  const options = { limit: `-${limit}`, sort: { 'compiledRelease.total_amount': -1 } };
  let filter = {};

  switch (type) {
    case "buyer":
      filter = { $or: [
        { 'compiledRelease.buyer.id': id },
        { 'compiledRelease.parties.memberOf.id': id },
        { 'compiledRelease.parties.contactPoint.id': id },
      ] };

      break;
    case "supplier":
      filter = {
        'compiledRelease.awards.suppliers.id': id,
      };
      break;
    case "funder":
      filter = {
        'compiledRelease.parties.id': id,
        'compiledRelease.parties.roles': "funder",
      };
      break;
  }
  // console.log('getContracts query', `db.records.find(${JSON.stringify(filter)},${JSON.stringify(options)})`);

  const contractsP = records.find(filter, options).catch(err => {
    // console.error("getContracts error",err);
    if (err) {
      return 'error: {err}';
    }
    return err;
  });

  return contractsP;
}

function addLink(relationSummary, link) {
  if (relationSummary.links.length > 1000) {
    // console.log("skipping link", link)

    //addNode(relationSummary, {id: "other"})
    // link.target=other
    return false;
  }

  const source = find(relationSummary.nodes, { id: link.source });
  const target = find(relationSummary.nodes, { id: link.target });

  if (source && target) {

    // console.log('addLink',link,source.id,target.id);
    const existentLink = find(relationSummary.links, { source: source.id, target: target.id });

    if (!existentLink) {
      const newLink = {
        id: relationSummary.links.length,
        source: source.id,
        target: target.id,
        weight: link.weight || 1,
        type: link.type || "undefined"
      };
      // console.log('addLink',newLink);
      relationSummary.links.push(newLink);
    } else {
      existentLink.weight += link.weight || 1;
    }

    if (!target.fixedWeight){
      target.weight = parseFloat(target.weight) + (link.weight || 1);
    }
    if (!source.fixedWeight){
      source.weight = parseFloat(source.weight) + (link.weight || 1);
    }

  }
  // else {
  //   console.error('Faltó agregar algún nodo', link);
  // }
  return true;
}
function addNode(relationSummary, node) {
  if (relationSummary.nodes.length > 400 && node.id != "other") {
    // addNode(relationSummary, {id: "other"})
    return false;
  }

  if (!find(relationSummary.nodes, { id: node.id })) {
    // console.log('addNode',node);

    if (!node.weight) {
      node.weight = 1;
    }
    relationSummary.nodes.push(node);
  }
  return true;
}

function getMaxContractAmount(records) {
  let maxContractAmount = 0;
  for (const r in records) {
    if (Object.prototype.hasOwnProperty.call(records, r)) {
      const compiledRelease = records[r].compiledRelease;
      for (const c in compiledRelease.contracts) {
        if (Object.prototype.hasOwnProperty.call(compiledRelease.contracts, c)) {
          const contract = compiledRelease.contracts[c];
          const amount = parseFloat(contract.value.amount);
          if (amount > maxContractAmount) {
            maxContractAmount = amount;
          }
        }
      }
    }
  }
  return maxContractAmount;
}

function calculateSummaries(orgID, records) {
  // console.log('calculateSummaries',records.length);

  //  Generar los objetos para cada gráfico
  const yearSummary = {};
  const typeSummary = {};
  const allBuyers = {};
  const allSuppliers = {};
  const allFundees = {};
  const relationSummary = { nodes: [], links: [] };
  const maxContractAmount = getMaxContractAmount(records);

  for (const r in records) {
    if (Object.prototype.hasOwnProperty.call(records, r)) {
      const compiledRelease = records[r].compiledRelease;

      const buyerParty = find(compiledRelease.parties, { id: compiledRelease.buyer.id });
      const funderParty = find(compiledRelease.parties, { roles: ["funder"] });
      // console.log("funderParty",funderParty,compiledRelease.parties);
      const memberOfParty = find(compiledRelease.parties, 'memberOf');
      // console.log('calculateSummaries memberOfParty', memberOfParty.memberOf[0].id === orgID, buyerParty.id === orgID || memberOfParty.memberOf[0].id === orgID);
      const procurementMethod = compiledRelease.tender.procurementMethod;

      const isFunderContract = funderParty ? (funderParty.id === orgID) : false;

      const isBuyerContract =
        buyerParty.id === orgID || (buyerParty.contactPoint && buyerParty.contactPoint.id === orgID) || memberOfParty && memberOfParty.memberOf[0].id === orgID;

      for (const c in compiledRelease.contracts) {
        if (Object.prototype.hasOwnProperty.call(compiledRelease.contracts, c)) {
          const contract = compiledRelease.contracts[c];
          const award = find(compiledRelease.awards, { id: contract.awardID });
          const isSupplierContract = find(award.suppliers, { id: orgID }) || false;
          // console.log("compiledRelease.buyer.id",compiledRelease.buyer.id);
          //console.log("contract.period",contract.period,compiledRelease.ocid);

          let year = "undefined";
          if (contract.period) {
            year = new Date(contract.period.startDate).getFullYear();
          }

          if (isFunderContract) {
            if (!allFundees[memberOfParty.id]) {
              allFundees[memberOfParty.id] = memberOfParty;
              allFundees[memberOfParty.id].contract_amount_top_funder = 0;
              allFundees[memberOfParty.id].type = buyerParty.type;
            }
            allFundees[memberOfParty.id].contract_amount_top_funder += award.value.amount;
          }

          // To calculate top3buyers
          if (isSupplierContract) {
            if (memberOfParty) {
              if (!allBuyers[memberOfParty.id]) {
                allBuyers[memberOfParty.id] = memberOfParty;
                allBuyers[memberOfParty.id].contract_amount_top_buyer = 0;
                allBuyers[memberOfParty.id].type = buyerParty.type;
              }
              allBuyers[memberOfParty.id].contract_amount_top_buyer += award.value.amount;
            }
          }

          if (year != "undefined") {
            if (!yearSummary[year]) {
              yearSummary[year] = {
                buyer: { value: 0, count: 0 },
                supplier: { value: 0, count: 0 },
                funder: { value: 0, count: 0 },
              };
            }

            // TODO: sumar los amounts en MXN siempre
            if (isSupplierContract) {
              yearSummary[year].supplier.value += parseInt(contract.value.amount, 10);
              yearSummary[year].supplier.count += 1;
            }
            if (isBuyerContract) {
              yearSummary[year].buyer.value += parseInt(contract.value.amount, 10);
              yearSummary[year].buyer.count += 1;
            }
            if (isFunderContract) {
              yearSummary[year].funder.value += parseInt(contract.value.amount, 10);
              yearSummary[year].funder.count += 1;
            }

          }

          if (!typeSummary[procurementMethod]) {
            typeSummary[procurementMethod] = {
              buyer: { value: 0, count: 0 },
              supplier: { value: 0, count: 0 },
              funder: { value: 0, count: 0 },
            };
          }

          if (isSupplierContract) {
            typeSummary[procurementMethod].supplier.value += parseInt(contract.value.amount, 10);
            typeSummary[procurementMethod].supplier.count += 1;
          }
          if (isBuyerContract) {
            typeSummary[procurementMethod].buyer.value += parseInt(contract.value.amount, 10);
            typeSummary[procurementMethod].buyer.count += 1;
          }
          if (isFunderContract) {
            typeSummary[procurementMethod].funder.value += parseInt(contract.value.amount, 10);
            typeSummary[procurementMethod].funder.count += 1;
          }



          // TODO: sumar los amounts en MXN siempre

          // UC
          addNode(relationSummary, { id: buyerParty.id,label: buyerParty.name, type: buyerParty.details.type });
          // addNode(relationSummary, { id: procurementMethod,label: procurementMethod, type: 'procurementMethod' });

          // addLink(relationSummary, { source: buyerParty.id, target: procurementMethod });

          const linkWeight = Math.round((parseFloat(contract.value.amount)/parseFloat(maxContractAmount))*10);



          for (const a in award.suppliers) {
            if (Object.prototype.hasOwnProperty.call(award.suppliers, a)) {
              const supplierParty = find(compiledRelease.parties, { id: award.suppliers[a].id });

              if (supplierParty) {
                addNode(relationSummary, { id: award.suppliers[a].id,label: award.suppliers[a].name, type: supplierParty.details.type });
                addLink(relationSummary, { source: buyerParty.id, target: award.suppliers[a].id, weight: linkWeight, type: procurementMethod || "supplier" });

                if (isBuyerContract) {
                  // To calculate top3suppliers
                  if (!allSuppliers[supplierParty.id]) {
                    allSuppliers[supplierParty.id] = supplierParty;
                    allSuppliers[supplierParty.id].contract_amount_top_supplier = 0;
                  }
                  allSuppliers[supplierParty.id].contract_amount_top_supplier += award.value.amount;
                }
              }
              // else {
              //   console.error('Party id error','award:',award,'parties:',compiledRelease.parties);
              // }
            }
          }

          // console.log("calculateSummaries buyerParty",buyerParty);
          if (buyerParty.memberOf) {

            if (buyerParty.memberOf[0].name) {
              addNode(relationSummary, { id: buyerParty.memberOf[0].id, label: buyerParty.memberOf[0].name, type: "dependency" });
              addLink(relationSummary, { source: buyerParty.id, target: buyerParty.memberOf[0].id, type: "buyer" });
            }
          }

          if (funderParty) {
            addNode(relationSummary, { id: funderParty.id,label: funderParty.name, type: funderParty.details.type });

            if (buyerParty.memberOf) {
              addLink(relationSummary, { source: buyerParty.memberOf[0].id, target: funderParty.id, weight: linkWeight, type: "funder" });
            }
            else {
              addLink(relationSummary, { source: buyerParty.id, target: funderParty.id, weight: linkWeight, type: "funder" });
            }
          }

        }
      }
    }
  }
  // console.log("allBuyers",sortBy('contract_amount_top_buyer', allBuyers))

  //Cut the top 3 of all ordered by contract amount, except the current org
  delete allBuyers[orgID];
  delete allSuppliers[orgID];
  delete allFundees[orgID];
  const top3buyers = slice(0, 3, orderBy('contract_amount_top_buyer', 'desc', allBuyers));
  const top3suppliers = slice(0, 3, orderBy('contract_amount_top_supplier', 'desc', allSuppliers));
  const top3fundees = slice(0, 3, orderBy('contract_amount_top_funder', 'desc', allFundees));

  const summary = {
    year: yearSummary,
    type: typeSummary,
    relation: relationSummary,
    top_buyers: top3buyers,
    top_suppliers: top3suppliers,
    top_fundees: top3fundees,
  };

  return summary;
}

async function addGraphs(collection, array, db) {
  // This is too slow fow more than one item
  if (array[1].length > 1) {
    return array;
  }
  for (const index in array[1]) {
    if (Object.prototype.hasOwnProperty.call(array[1], index)) {
      const item = array[1][index];

      // console.log('addContracts 2', index);
      const buyerContracts = await getContracts('buyer', item.id, db, 100);
      const supplierContracts = await getContracts('supplier', item.id, db, 100);
      const funderContracts = await getContracts('funder', item.id, db, 100);
      const allContracts = [...buyerContracts, ...supplierContracts, ...funderContracts];

      // extend(allContracts, supplierContracts);
      // extend(allContracts, buyerContracts);
      // console.log('addGraphs',allContracts.length);

      item.summaries = calculateSummaries(item.id, allContracts);
      item.top3contracts = {
        funder: funderContracts.slice(0, 3),
        buyer: buyerContracts.slice(0, 3),
        supplier: supplierContracts.slice(0, 3),
      };

      // console.log('addContracts',index,array[1][index].contracts.buyer.length,array[1][index].contracts.seller.length);
    }
  }
  return array;
}

module.exports = {
  omitEmpty,
  queryToPipeline,
  arrayResultsOptions,
  getQuery,
  allDocuments,
  addGraphs,
  getDistinct,
  dataReturn,
};
