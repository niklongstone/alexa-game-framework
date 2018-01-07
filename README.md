# Alexa Game Framework

This framework can be used as a starting point for your Alexa Skill trivia game. You can setup the questions and answers in a config file and you are ready to go.
Has been inspired by many samples available at the [Alexa Github repository](https://github.com/alexa/).

## Usage

```text
Alexa, open YOUR_SKILL_NAME

Alexa, start YOUR_SKILL_NAME
```

## Installation

You will need to change a few configuration files before creating the skill and upload the lambda code.

### Pre-requisites

This is a NodeJS Lambda function and skill defintion to be used by [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html).

You need to initialize ASK CLI with

```bash
$ ask init
```

You need an [AWS account](https://aws.amazon.com) and an [Amazon developer account](https://developer.amazon.com) to create an Alexa Skill.

You need to download NodeJS dependencies:

```bash
$ (cd lambda && npm install)
$ (cd lambda/custom && npm install)
```

### Required changes before to deploy

1. ```./skill.json```

   Change the skill name, description, summary, example phrase, icons, testing instructions etc ...

   Remember than many information are locale-specific and must be changed for each locale (en-GB and en-US)

   Please refer to https://developer.amazon.com/docs/smapi/skill-manifest.html for details about manifest values.

2. ```./lambda/custom/data/gameList.js```

   Describe the games in the `gameList.js` as below:
   ```javascript
   exports.gameList = [{
     id: '1',
     name: 'Game 1 name',
   },
   {
     id: '2',
     name: 'Game 2 name',
   }];

   ```
3. ```./lambda/custom/data/gameData.js```   

   Each game should have multiple questions.  
   Each question must have a unique ID.  
   Each question is a single node of a binary tree. For a right answer,  you can prompt another question or end the game, for a wrong answer you can prompt same question or another one or end the game.

   Configure the questions for each game using the following format:  
    * id: unique numeric question id
    * gameId: the numeric id of the game as per `gameList.js`.
    * question: the question for the player, you can use [SSML](https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html) notation. The answer must be a number, so you should shape the question accordingly. For instance you can ask something like: In which year the Apollo 11 landed on the Moon, say 1 for 1969, 2, for 1973, 3, for 1965.
    * answer: the number of the correct answer
    * ifCorrectGoTo: the next question's id in case the player answer correctly. Use the reserved word 'END' to finish the game.
    * ifWrongGoTo: the next question's id in case the player answer wrongly, if you want to re prompt same question the number should be equeal to the current `id` value. Use the reserved word 'END' to finish the game.

    Example:  
   ```
   exports.gameData = [
   {
     id: 1,
     questId: '1',
     question: 'What does the word demure means? say 1 for angry, 2 for quiet, 3 for arrogant',
     answer: '2',
     ifCorrectGoTo: '2',
     ifWrongGoTo: '1', // will repeat this question in case of wrong answer
   },
   {
     id: 2,
     questId: '1',
     question: 'What does the word feral means? say 1 for savage, 2 for secretive, 3 for proud',
     answer: '1',
     ifCorrectGoTo: 'END', //if the answer is correct finishes the game
     ifWrongGoTo: '3',  //if wrong goes to question with id 3
   },
   .....
   ```


4. ```./models/*.json```

    Change the model definition to replace the invocation name (`your invocation name`) and the sample phrases for each intent.  

    Repeat the operation for each locale you are planning to support.

### Local Tests

This code is using [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/) to test the responses returned by your skill.  Before to deploy, be sure to have no test failures.

Execute your test by typing

```bash
$ (cd lambda && npm test)
```

### Code Style

The code uses eslint to enforce the code style. To check if the code conforms to the style declared in the `.eslintrc` file you can run:
```bash
$ (cd lambda && npm run lint)
```
### Deployment

ASK will create the skill and the lambda function for you.

Lambda function will be creadted in ```us-east-1``` (Northern Virginia) by default.

You deploy the skill and the lambda function in one step :

```bash
$ ask deploy
```

You can test your deployment by FIRST ENABLING the TEST switch on your skill in the Alexa Developer Console.

Then

```bash
 $ ask simulate -l en-GB -t "alexa, launch YOUR_SKILL_NAME"

 ✓ Simulation created for simulation id: 4b5d6we5-12s2-23v5-h5uh-ef24n2453we1
◡ Waiting for simulation response{
  "status": "SUCCESSFUL",
  ...
```

You should see the code of the skill's response after the SUCCESSFUL line.

#### Change the skillid in lambda code. (Optional but recommended)

Once the skill and lambda function is deployed, do not forget to add the skill id to ```lambda/src/constants.js``` to ensure your code is executed only for your skill.

Uncomment the ```AppId``` line and change it with your new skill id.  You can find the skill id by typing :

```bash
$ ask api list-skills
```
```json
{
  "skills": [
    {
      "lastUpdated": "2017-10-08T08:06:34.835Z",
      "nameByLocale": {
        "en-GB": "My Skill",
        "en-US": "My Skill"
      },
      "skillId": "amzn1.ask.skill.123",
      "stage": "development"
    }
  ]
}
```

Then copy/paste the skill id to ```lambda/src/constants.js```    

```javascript
module.exports = Object.freeze({

    //App-ID. TODO: set to your own Skill App ID from the developer portal.
    appId : "amzn1.ask.skill.123",

    // when true, the skill logs additional detail, including the full request received from Alexa
    debug : false

});
```

## On Device Tests

To be able to invoke the skill on your device, you need to login to Alexa Developer Console, and enable the "Test" switch on your skill.

See https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html#step-4-test-your-skill for more testing instructions.

Then, just say :

```text
Alexa, open YOUR_SKILL_NAME.
```


### Save the state

You can use DynamoDB to easily save the state of the game.
If you plan to do so:
  - first you should create a table in DynamoDB and setup the table name in the `lambda/custom/constants.js` file; The table must have a primary key defined, such as `id.
  - Then you should modify the Lambda IAM Policy to allow reading and writing to the table:

  See the [IAM Policies](../IAM_POLICIES.md) page for more details.

  ```
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "dynamodb:PutItem",
          "dynamodb:GetItem"
        ],
        "Resource":["arn:aws:dynamodb:eu-west-1:546823300000:table/myTable"],
      }
    ]
  }
  ```

   *You can learn more about DynamoDB from the [Getting Started with DynamoDB](http://docs.aws.amazon.com/amazondynamodb/latest/gettingstartedguide/Welcome.html) documentation.*
