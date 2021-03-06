/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const { compareCommentsSize, getUserAge } = require('../services/helpers');

chai.use(chaiHttp);
const { expect } = chai;

describe('Test APIs', () => {
  it('Should return top 10 stories', (done) => {
    chai.request(app).get('/top-stories').end((err, res) => {
      expect(res.status).to.eq(200);
      expect(res.body.stories.length).to.eq(10);
      done();
    });
  }).timeout(5000);
  it('Should return past stories', (done) => {
    chai.request(app).get('/past-stories').end((err, res) => {
      expect(res.status).to.eq(200);
      expect(res.body.stories).to.exist;
      expect(res.body.stories.length).to.be.gte(10);
      done();
    });
  });
  it('Should return comments for a given story id', (done) => {
    chai.request(app).get('/comments').query({ storyId: '24488224' }).end((err, res) => {
      expect(res.status).to.eq(200);
      expect(res.body.comments.length).to.eq(10);
      done();
    });
  });
  it('Should return Item not found error if incorrect story id given', (done) => {
    chai.request(app).get('/comments').query({ storyId: '24488224aaaaa' }).end((err, res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('News Item not found');
      done();
    });
  });
  it('Should return 400 status if story id not passed in get comments api', (done) => {
    chai.request(app).get('/comments').end((err, res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('StoryId required in params');
      done();
    });
  });
});

describe('Test functions', () => {
  it('Should test compare function', (done) => {
    const comments = [{ id: 1, kids: [1, 2, 3] },
      { id: 2, kids: [1, 2, 3, 5] }, { id: 3, kids: [1, 2] }, { id: 4, kids: [1, 2, 3, 4, 5, 6] }];
    comments.sort(compareCommentsSize);
    expect(comments[0].id).to.eq(4);
    expect(comments[1].id).to.eq(2);
    expect(comments[2].id).to.eq(1);
    done();
  });
  it('Should test getUserAge function', (done) => {
    const userAge = getUserAge(1396953043);
    expect(userAge).to.eq(6);
    done();
  });
});
