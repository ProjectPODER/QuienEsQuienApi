const should = require('should');
const request = require('supertest');
const server = require('../../../app');
const db = require('../../../api/db');
const collection = db.get('memberships', { castIds: false });
const cName = collection.name;
const testDataJson = require('./test-data.json');
const testData = testDataJson[cName];
const PATH = `/v1/${cName}`;

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
          .query({ person_id: 'gonzalo hinojosa fernandez de angulo' })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.eql('success');
            res.body.data[0].person_id.should.eql('gonzalo hinojosa fernandez de angulo');

            done();
          });
      });

      it('should accept a regex query parameter', function(done) {
        request(server)
          .get(PATH)
          .query({ department: '/Unidad De Admon/i' })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.eql('success');
            res.body.data[0].department.should.eql('Unidad De Admon. De Rec. Mat. Y Servs. Grales. 00');

            done();
          });
      });

      it('should accept query for $exists', function(done) {
        request(server)
          .get(`${PATH}?shares`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.eql('success');
            res.body.data.length.should.eql(1);

            done();
          });
      });
    });
  });
});
