const should = require('should');
const request = require('supertest');
const server = require('../../../app');
const db = require('../../../api/db');
const collection = db.get('contracts', { castIds: false });
const cName = collection.name;
const PATH = `/v1/${cName}`;
const testDataJson = require('./test-data.json');
const testData = testDataJson[cName];

describe('controllers', function() {

  describe(cName, function() {

    describe(`GET ${PATH}`, function() {

      before(function(done) {
        collection.insert(testData).then((docs) => done());
      });

      after(function(done) {
        collection.drop(() => (done()))
      });

      it('should accept a query parameter', function(done) {
        request(server)
          .get(PATH)
          .query({ ocid: 'OCDS-0UD2Q6-LO-020000018-N3-2015'})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.eql('success');
            res.body.data[0].ocid.should.eql('OCDS-0UD2Q6-LO-020000018-N3-2015');

            done();
          });
      });

      it('should accept a regex query parameter', function(done) {
        request(server)
          .get(PATH)
          .query({ title: '/LLANTAS PARA DICONSA/i' })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.eql('success');
            res.body.data[0].ocid.should.eql('OCDS-0UD2Q6-AA-020VSS013-N13-2015');

            done();
          });
      });

      it('should accept query for $exists', function(done) {
        request(server)
          .get(`${PATH}?currency`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.eql('success');
            res.body.data.length.should.eql(4);

            done();
          });
      });
    });


  });


});
