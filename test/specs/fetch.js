import fetch from '../../src';

describe('fetch', () => {

  it('get', (done) => {
    fetch.get('/').then(res => {
      res.should.eql('hello world');
      done();
    });
  });

  it('get cache', (done) => {
    let tm;
    fetch.get('/cache', null, { cache: 0.1, responseType: 'json' }).then(res => {
      tm = res.time;
    }).then(() => {
      fetch.get('/cache', null, { cache: 500 }).then(res => {
        res.time.should.eql(tm);
      });
    }).then(() => {
      setTimeout(() => {
        fetch.get('/cache', null, { cache: 500 }).then(res => {
          res.time.should.not.eql(tm);
          done();
        });
      }, 600);
    });
  });

});
