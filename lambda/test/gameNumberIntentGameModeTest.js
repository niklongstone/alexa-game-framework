'use strict';

const lambda = require('./lambda');
const skill = require('../custom/index');
const chai = require('chai');
chai.use(require('chai-string'));

const should = chai.should();
const assert = chai.assert;

const languageStrings = require('../custom/translation/languageStrings');

describe('Game Test : GameNumberIntent within quest mode state', () => {
  before((done) => {
    const event = require('./testRequest/gameNumberIntentWithGameMode.json');
    const appId = require('../custom/constants').appId;
    event.session.application.applicationId = appId;
    event.context.System.application.applicationId = appId;
    skill.handler(event, lambda.context(), lambda.callback);

    done();
  });

  it('it responses with valid response structure ', (done) => {
    lambda.response.should.have.property('version');
    lambda.response.version.should.equal('1.0');

    done();
  }),

  it('it responses with output speech ', (done) => {
    lambda.response.should.have.property('response');
    const r = lambda.response.response;

    r.should.have.property('outputSpeech');
    r.outputSpeech.should.have.property('type');
    r.outputSpeech.type.should.equal('SSML');
    r.outputSpeech.should.have.property('ssml');
    r.outputSpeech.ssml.should.startWith('<speak>');
    r.outputSpeech.ssml.should.endWith('</speak>');

    done();
  });

  it('it responses without closing the session ', (done) => {
    const r = lambda.response.response;

    r.should.have.property('shouldEndSession');
    r.shouldEndSession.should.be.false;

    done();
  });
});
