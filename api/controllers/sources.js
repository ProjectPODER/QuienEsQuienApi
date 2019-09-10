const db = require('../db');
const collection = db.get('records', { castIds: false });
// const omit = require('lodash/omit');
// const omitEmpty = require('./lib').omitEmpty;
const queryToPipeline = require('./lib').queryToPipeline;
const getQuery = require('./lib').getQuery;
const allDocuments = require('./lib').allDocuments;
const getDistinct = require('./lib').getDistinct;
const dataReturn = require('./lib').dataReturn;



function aggregateSources(array) {
  // console.log("aggregateSources",array);

  let sources = {};
  let collections = {};
  for (c in array) {
    let collectionName = "";
    try {
    switch (c) {
      // 0: organizations sources count
      case "0":
        collectionName = "organizationsa";
        break;
      // 1: persons sources count
      case "1":
        collectionName = "persons";
        break;
      // 2: organizations type count
      case "2":
        for (e in array[c]) {
          collections[array[c][e]._id] = {
            count: array[c][e].count,
            lastModified: null,
          }
        }
        break;
      // 3: persons count
      case "3":
        collections.persons = {
          count: array[c],
          lastModified: null,
        }
        break;
      // 4: records count
      case "4":
        collections.contracts = {
          count: array[c],
          lastModified: null,
        }
        break;
      // 5: organizations lastModified
      case "5": //orgs date
        for (d in array[c]) {
          lastModified = array[c][d].lastModified;
          collections[array[c][d]._id].lastModified = lastModified;
        }
        // console.log(c,array[c]);
        break;
      // 6: persons lastModified
      case "6": //persons date
        // console.log(c,array[c][0].date);
        collectionName = "persons";
        lastModified = array[c][0].date;
        collections[collectionName].lastModified = lastModified;
        break;
      // 7: records lastModified
      case "7": //contract date
        // console.log("contract date",c,array[c][0].compiledRelease.date);
        collectionName = "contracts";
        lastModified = array[c][0].compiledRelease.date;
        collections[collectionName].lastModified = lastModified;
        break;
      default:
        console.log("Unhandled query",c);
        collectionName = c;
    }
    // console.log("aggregateSources 1");

    for (s in array[c]) {
      // console.log("aggregateSources 2",c,s,array[c][s]._id);
      let sourceName = "";
      if (c < 2) {
        if (array[c][s]._id.hasOwnProperty("source")) {
          sourceName = array[c][s]._id.source;
          collectionName =  array[c][s]._id.classification;
        }
        else {
          sourceName = array[c][s]._id;
        }
        // console.log("aggregateSources",s,c,parseInt(array[c][s].count));

        if (!sources[sourceName]) {
          sources[sourceName] = {};
        }
        if (!sources[sourceName][collectionName]) {
          sources[sourceName][collectionName] = {
            count: 0,
          };
        }

        sources[sourceName][collectionName].count += parseInt(array[c][s].count);
      }
    }
    }
    catch (e) {
      console.error("Porcessing error:",e);
    }
  }
  // console.log("aggregateSources s",sources);
  return [sources.length, [{sources: sources, collections: collections}]];
}

function allSources(req, res) {

  const queries = [
    // 0: organizations sources count
    db.get("organizations").aggregate([{$unwind: "$source"},{$group: {_id: {source:"$source",classification:"$classification"}, count: {$sum:1}}}]),
    // 1: persons sources count
    db.get("persons").aggregate([{$unwind: "$source"},{$group: {_id: "$source", count: {$sum:1}}}]),
    // 2: organizations type count
    db.get("organizations").aggregate([{$unwind: "$classification"},{$group: {_id: "$classification", count: {$sum:1}}}]),
    // 3: persons count
    db.get("persons").count(),
    // 4: records count
    db.get("records").count({hidden: false}),
    // 5: organizations lastModified
    db.get("organizations").aggregate([{$unwind: "$classification"},{$group: {_id: "$classification", lastModified: {$max:"$date"}}}]),
    // 6: persons lastModified
    db.get("persons").find({},{projection: {date: 1}, sort: {date: -1}, limit: 1}),
    // 7: records lastModified
    db.get("records").find({},{projection: {"compiledRelease.date": 1}, sort: {"compiledRelease.date": -1}, limit: 1}),
  ];

  // console.log("allSources")

  Promise.all(queries)
    .then(array => {
      // console.log("allSources",array);

      return dataReturn(res, aggregateSources(array), 0, 0, false, (a)=>a, false);
    })
    .catch(err => {
      // console.error('allContracts', err);
      if (err) {
        return err;
      }
      return false;
    });
}

module.exports = {
  allSources,
};
