import * as console from 'console';
import { browser, element, by, ExpectedConditions, protractor } from 'protractor';
import { CarePlannerSchedulerPage } from '../pages/carePlanner/cpScheduler.page';
import { CarePlannerPetDetails } from '../pages/carePlanner/cpPetdetails.page';
var request = require('request');
import { WWApiCalls } from '../lib/woofwareApi';
let cpSchedulerPage, cpPetDetailsPage;

describe('Verify the Careplanner Scheduler Page', () => {

  // beforeAll( () =>{
  //   cpPetDetailsPage = new CarePlannerPetDetails();
  //   cpSchedulerPage = new CarePlannerSchedulerPage();
  //   // cpPetDetailsPage.navigateTo();   // comments
  //   console.log("***********URL Launched***********");
  // });
  beforeAll(function () {

  });
  it("test", function () {
    let token: String = 'TEpdV-u6cquITUixTODkZ9t-7ZG8luIvHV3ekb1UlvZz5QwXu7Ux4Hrlg3_YK4lAif_uoJKPplPWhr_gvGViujJT3k51Hqjav88nwTv8pJ5aPxO7aPlKOGruYqhuDd3pU8e81RT71eQAeucODnQjpLuGFjyu50EPPrEWA0HL6tesT2dTuHozfpOjWF43OM-QpHlUM4-XSrMrLlnV8KJn2wz7e_DwyAwp9z1ISpLwf0IW1DCTtTtntqPrQh0wF82FBRMLIw';
    let api = new WWApiCalls();
    var flow = protractor.promise.controlFlow();

    flow.execute(api.getAuthToken).then(function (response) {
      var responseObj = response;
      // console.log(responseObj['access_token']);
      token = responseObj['access_token'];

      console.log("*************new token*******************: " + token);


    });
    ///-----------------------------------------------------------------------
    flow.execute(api.createClient).then(function (response) {
      //var responseObj = response;
      
      console.log("************ frist client response" + response);
    }).then(() => {
      flow.execute(api.createClient).then(function (response) {
        var responseObj = response;
        console.log("************Second client response ***************" + responseObj);
      });
    });
  });
});



    // }).then( ()=> {
    //   console.log('*******************launching browser*************************');
    //   console.log("token: "+token);
    //   var url = browser.baseUrl+token;
    //   console.log("URL: "+url);
    //   browser.get(url);
    //   browser.sleep(4000);
    // });



  // it('Should have the title as VCA Charge Capture', () => {
  //   // console.log("***********Verifying Page Title***********");
  //   console.log('TEST 1')
  //   expect(cpPetDetailsPage.pageTitle).toEqual('VCA Charge Capture');
  // });


