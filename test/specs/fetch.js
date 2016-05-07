import fetch from '../../src';

describe('fetch', () => {

  it('get', (done) => {
    fetch.get('/').then(res => {
      res.should.eql('hello world');
      done();
    });
  });

  it('get cache delay', (done) => {
    let tm;
    fetch.get('/cache', null, { cache: 0.1, responseType: 'json' }).then(res => {
      tm = res.time;
    }).then(() => {
      fetch.get('/cache', null, { cache: 500 }).then(res => {
        res.time.should.eql(tm);
      });
    }).then(() => {
      fetch.get('/cache', null, { cache: 0, delay: 500 }).then(res => {
        (res.time - tm > 300).should.be.true;
        done();
      });
      fetch.get('/cache', null, { cache: 0, delay: 100 }).then(res => {
        res.time.should.not.eql(tm);
        tm = res.time;
      });
    });
  });

  it('jsonp cache delay', (done) => {
    let tm;
    fetch.jsonp('/jsonp-delay', null, { cache: 0.1 }).then(res => {
      tm = res.time;
    }).then(() => {
      fetch.jsonp('/jsonp-delay', null, { cache: 500 }).then(res => {
        res.time.should.eql(tm);
      });
    }).then(() => {
      fetch.jsonp('/jsonp-delay', null, { cache: 0, delay: 500 }).then(res => {
        (res.time - tm > 300).should.be.true;
        done();
      });
      fetch.jsonp('/jsonp-delay', null, { cache: 0, delay: 100 }).then(res => {
        res.time.should.not.eql(tm);
        tm = res.time;
      });
    });
  });

  it('fetch create 1', (done) => {
    fetch.create({
      data: { a: 1 },
      options: { dataType: 'json', responseType: 'json' }
    }).post('/post').then(res => {
      res.success.should.be.true;
      done();
    });
  })

  it('fetch create 2', (done) => {
    fetch.create({
      data: { a: 1 },
    }).post('/post', null, { dataType: 'json', responseType: 'json' }).then(res => {
      res.success.should.be.true;
      done();
    })
  })

  it('fetch create 3', (done) => {
    fetch.create({
      options: { dataType: 'json', responseType: 'json' }
    }).post('/post', { a: 1 }).then(res => {
      res.success.should.be.true;
      done();
    })
  })

  it('fetch create merge', (done) => {
    fetch.create({
      data: { a: 1, b: 2 },
      options: { dataType: 'json', responseType: 'text' }
    }).post('/post/two', { b: 4 }, { responseType: 'json'}).then(res => {
      res.success.should.be.true;
      done();
    })
  })

  it('fetch create promise', (done) => {
    let refetch = fetch.create({
      promise: (f) => f.then((res) => {
        if (res.success) {
          return true;
        } else {
          return new Error(res.msg);
        }
      })
      .catch((res) => {
        res.message.should.eql('timeout');
        done();
      })
    });

    refetch.jsonp('/jsonp-data', {q: 1234}).then(res => {
      res.message.should.eql("expect q === '123'");
    }).then(() => {
      return refetch.jsonp('/jsonp-data', {q: 123});
    }).then(res => {
      res.should.be.true;
      return refetch.jsonp('/404', null, {timeout: 50});
    });

  })

  // deprecated
  it('custom peer success', (done) => {
    fetch.setPeer(
      (promise) => promise.then((res) => {
        if (res.success) {
          return true;
        } else {
          return new Error(res.msg);
        }
      })
      .catch((res) => {
        res.message.should.eql('timeout');
        done();
      })
    );

    fetch.jsonp('/jsonp-data', {q: 1234}).then(res => {
      res.message.should.eql("expect q === '123'");
    }).then(() => {
      return fetch.jsonp('/jsonp-data', {q: 123});
    }).then(res => {
      res.should.be.true;
      return fetch.jsonp('/404', null, {timeout: 50});
    });
  });
});
