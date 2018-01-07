'use strict';

const lambda = require('./lambda');
const skill = require('../custom/index');
const chai = require('chai');
chai.use(require('chai-string'));

const should = chai.should();
const assert = chai.assert;

const languageStrings = require('../custom/translation/languageStrings');

describe('Game Test : ChooseGameIntent', () => {
  before((done) => {
    const event = require('./testRequest/chooseGameIntent.json');
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

  it('it responses with output speech and reprompt', (done) => {
    lambda.response.should.have.property('response');
    const r = lambda.response.response;

    r.should.have.property('outputSpeech');
    r.should.have.property('reprompt');
    r.outputSpeech.should.have.property('type');
    r.outputSpeech.type.should.equal('SSML');
    r.outputSpeech.should.have.property('ssml');
    r.outputSpeech.ssml.should.startWith('<speak>');
    r.outputSpeech.ssml.should.endWith('</speak>');

    done();
  });
});
