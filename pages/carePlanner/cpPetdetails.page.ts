import { $, browser, element, by, By, ExpectedConditions } from "protractor";
import { LogHelper } from '../../support/logHelper';

export class CarePlannerPetDetails {

  // Page elements ////////////////////////
  //eletmp = browser.driver.findElement(by.xpath("test"));
  eleclientName = element(by.xpath(".//div[@class='petname']/following-sibling::span"));
  elepetName = element(by.xpath(".//div[@class='petname']"));
  eleprimarydrName = element(by.xpath(".//label[text()='PRIMARY']/following-sibling::span"));
  eledrshift = element(by.xpath(".//label[text()='DAY/SHIFT']/following-sibling::span"));
  eleWellness = element(by.xpath(".//li[@client_wellness cellinfo wellness']//span[@class='txt']"));
  eleAlert = element(by.xpath(".//li[@client_wellness cellinfo vcaAlert']//span[@class='txt']"));


  eleSpecies = element(by.xpath(".//div[@class='species']"));
  elePetGender = element(by.xpath(".//div[@class='bBox two']/div/div"));
  eleAge = element(by.xpath(".//div[@class='bBox one']/div/div"));
  eleWeight = element(by.xpath(".//div[@class='col-md-3 bBox']/div/div"));
  eleRecorded = element(by.xpath(".//div[@class='col-md-4 bBox']/div/div"));

  //eleTechnicianDropdown = element(by.xpath(".//div[normalize-space(text())='Choose technician']/following-sibling::div"));
  eleTechnicianValue = element(by.xpath(".//label[text()='TECHNICIAN']/following-sibling::div//i/following-sibling::div[contains(@class,'ng-tns')]"));
  //eleSelectLocationDropdown = element(by.xpath(".//div[normalize-space(text())='Select a location']/following-sibling::div"));
  eleLocationDropdownValue = element(by.xpath(".//div[@class='block navigation']/div[1]//i[@class='dropdown icon']/following-sibling::div[contains(@class,'ng-tns')]"));
  //eleSelectCageDropdown = element(by.xpath(".//div[normalize-space(text())='Select a cage']/following-sibling::div"));
  eleCageDropdownValue = element(by.xpath(".//div[@class='block navigation']/div[2]//i[@class='dropdown icon']/following-sibling::div[contains(@class,'ng-tns')]"));

  /////////////////////
  eleAddTaskButton = element(by.xpath(".//button[@id='addtask']"));
  eleCareNotesButton = element(by.xpath(".//button[@id='carenotes']"));
  eleEnterCareNotes = element(by.xpath(".//textarea[@placeholder='Add care note here.']"));
  eleAddCareNoteButton = element(by.xpath(".//button[text()='Add care note']"));

  // navigateTo() {
  //   browser.get(browser.baseUrl);
  //   //  browser.get(browser.baseUrl).then(() => {debugger});
  //   //console.log(browser.myname);
  // }

  get pageTitle(): any {
    try {

      return browser.getTitle().then(function (title) {
        LogHelper.Logger.info("Page title is "+title);
        return title;
      });
    }catch (error) {
      LogHelper.Logger.error(error);
    }
  }

  get clientName(): any {
    try {
      return this.eleclientName.getText().then(function(clientname){
        LogHelper.Logger.info("client name is "+clientname);
        return clientname;
      })
    } catch (error) {
      LogHelper.Logger.error(error);
    }
  }

  get petName(): any {
    try {
        return this.elepetName.getText().then(function(petname){
          LogHelper.Logger.info("pet name is "+petname);
        return petname; });
      } catch (error) {
        LogHelper.Logger.error(error);
      }
  }

  get petGender(): any {
    try {
      return this.elePetGender.getText().then(function(gender){
        return gender.toLowerCase();
      });
    } catch (error) {
      LogHelper.Logger.error(error);
    }
  }

  get speciesName(): any {
    try {
      return this.eleSpecies.getText().then(function(species1){
        LogHelper.Logger.info("species name is "+species1);
        return species1;
      })
    } catch (error) {
      LogHelper.Logger.error(error);
    }
  }

  get primaryDrName(): string {
    let doctorName: any;
    try {
      browser
        .wait(ExpectedConditions.presenceOf(this.eleprimarydrName), 5000)
        .then(() => {
          doctorName = this.eleprimarydrName.getText();
        });
      return doctorName;
    } catch (error) {
      LogHelper.Logger.error(error);
    }
  }

  get drShift(): any {
    try {
      return this.eledrshift.getText().then(function(drshift){
        LogHelper.Logger.info("Dr shift is "+drshift);
        return drshift;
      })
    } catch (error) {
      LogHelper.Logger.error(error);
    }
  }


  get wellness(): any {
    try {
      return this.eleWellness.getText().then(function(welness){
        LogHelper.Logger.info("wellness is "+welness);
        return welness;
      })
    } catch (error) {
      LogHelper.Logger.error(error);
    }
  }

}    