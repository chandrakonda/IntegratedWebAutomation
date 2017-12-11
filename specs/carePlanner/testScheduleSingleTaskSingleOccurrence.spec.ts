import { browser, protractor } from 'protractor';
import { CarePlannerPetDetails } from '../../pages/carePlanner/cpPetdetails.page';
import { CarePlannerSchedulerPage } from '../../pages/carePlanner/cpScheduler.page';
import { CarePlannerEditSchedulePopup } from '../../pages/carePlanner/cpEditSchedulePopup.page';
import { CarePlannerEditOccuranceSeriesPopup } from '../../pages/carePlanner/cpEditOccurrenceSeriesPopup.page';
import { CarePlannerApiCalls } from '../../lib/apiServices/carePlannerApiCalls';

let cpSchedulerPage, cpPetDetailsPage,cpEditSchedulePopupPage, cpEditOccuranceSeriesPopup;
let startPosition:number, endPosition:number, taskOccurrenceCount:number;
let taskUpdateStatus:string[] = ["Planned","Completed","Skipped","Canceled"];

let scheduleStartTime = 9;
let scheduleEndTime = '';
let repeatEveryHour = '';
let scheduleInstructions = "Test instructions";
let expectedNumberOfTaskOccurrences = 1;
let actualOccurrenceStatus = ['Scheduled'];
let occurrenceIndex = 0;
let expectedOcurrenceStatus = ['Complete'];
let taskOccurrenceNotes = 'Test notes for completing task occurrence';

describe('Scheduling a Single Task Occurrence for a Product in Care Planner Page', () =>{

    beforeAll(() => {
        cpPetDetailsPage = new CarePlannerPetDetails();
        cpSchedulerPage = new CarePlannerSchedulerPage();
        cpEditSchedulePopupPage = new CarePlannerEditSchedulePopup();
        cpEditOccuranceSeriesPopup = new CarePlannerEditOccuranceSeriesPopup();
        //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        
       
    });

    it('Data set up and client pet details' , async () => {
        let __apiCalls = new CarePlannerApiCalls();
        await __apiCalls.CreateClientPetAddProduct();

    });
    
    it('should display the client & pet details matched', async () => {
        
        //Verify the page Title
        let pageTitle = await cpPetDetailsPage.pageTitle;
        await expect(pageTitle).toEqual('VCA Charge Capture');

        //Verify the Client Last Name
        let _clientLastName = browser.clientLastName.length >= 12 ? browser.clientLastName.slice(0, 12) + '…' : browser.clientLastName;
        await expect(cpPetDetailsPage.clientName).toEqual(_clientLastName);
    
        //Veify the Patient Name & Species Name
        let _patientName = browser.patientName.length >= 12 ? browser.patientName.slice(0, 12) + '…' : browser.patientName;
        await expect(cpPetDetailsPage.petName).toEqual(_patientName);
        await expect(cpPetDetailsPage.speciesName).toEqual('Canine');
    });


    it('should validate the product category and list of tasks for the category', async () => {
        
        //Verify the Category Count
        let _categoryCount = await cpSchedulerPage.categoryCount; 
        browser.logger.info('No.of category displayed in scheduler : '+_categoryCount);
        await expect(_categoryCount).toEqual(1);

        //Verify the Task Count
        let _taskListCount = await cpSchedulerPage.productTaskListCount;
        browser.logger.info('No.of task displayed in scheduler : ' + _taskListCount);
        await expect(_taskListCount).toEqual(1);
    });



    it('should successfuly click on a task name toschedule for single occurrence', async () => {
        //Click on a task name under a category
        let taskSeriesName = await cpSchedulerPage.productTaskList; 
        browser.taskSeriesName = taskSeriesName[0];
        browser.logger.info('Product Task List : ' + browser.taskSeriesName);
        await cpSchedulerPage.clickOnTaskByName(browser.taskSeriesName);
        await browser.sleep(1000);

        //Verify the Popup is displayed
        let displayStatus:boolean = await cpEditSchedulePopupPage.isPopupDisplayed;
        browser.logger.info("Popup displayed status : "+ displayStatus );
        await expect(displayStatus).toBe(true);
        await browser.sleep(1000);

        //Set the Frequency toggle as Once for single occurrence
        browser.logger.info("Task Occurrence frequency is selected as Once");
        await cpEditSchedulePopupPage.toggleFrequency("Once");
        await browser.sleep(1000);

        //Entering Start Time
        browser.logger.info("Entering task scheduler start time as : " + scheduleStartTime);
        await cpEditSchedulePopupPage.enterTimeForSingleOccurrence(scheduleStartTime);
        await browser.sleep(1000);

        //Selecting Start Date
        browser.logger.info("Selecting task scheduler start date");
        await cpEditSchedulePopupPage.selectDateForSingleOccurrence();
        await browser.sleep(1000);

        //Enter the instructions
        browser.logger.info("Entering task occurrence instruction as : " + scheduleInstructions);
        await cpEditSchedulePopupPage.enterInstructions(scheduleInstructions);
        await browser.sleep(1000);

        //Click on Schedule button
        browser.logger.info("Clicking on the schedule button of task scheduler popup");
        await cpEditSchedulePopupPage.clickScheduleButton();
        await browser.sleep(2000);
   
        //Get the Product List
        var _productList = await cpSchedulerPage.productTaskList;
        
        //Get the order index of the task name independent of category
        var taskIndex = _productList.indexOf(browser.taskSeriesName);

        //Set the Start & End Position for the task series (row range) per task
        if(taskIndex == 0){
            startPosition = 1 ;
            endPosition = 24;
        } else if(taskIndex >= 1){
            startPosition =  taskIndex * 24 + 1;
            endPosition = startPosition + 23; 
        }

        //Get the task occurrence count for a single task series
        taskOccurrenceCount = await cpSchedulerPage.getNumberOfTaskOccurrence(startPosition, endPosition);
        browser.logger.info("Task occurrence count is : " + taskOccurrenceCount);
        expect(taskOccurrenceCount).toBe(expectedNumberOfTaskOccurrences);
        await browser.sleep(1000);

        //Get the status of the single occurrence of the task series
        let taskOccurrenceStatus = await cpSchedulerPage.getTaskOccurrenceStatus(startPosition, endPosition);
        for (let index = 0; index < taskOccurrenceStatus.length; index++) {
            browser.logger.info("Status of the occurrence " + index + " is : " + taskOccurrenceStatus[index].split(' ')[0]);
            expect(taskOccurrenceStatus[index].split(' ')[0]).toEqual(actualOccurrenceStatus[index]);
        }
    });


    it('should display the edit task occurrence popup by click on the single task occurrence', async () => {

        //Click on the task occurrence to bring up the edit task occurrence popup
        browser.logger.info("Click on the task occurrence by index : " + occurrenceIndex);
        await cpSchedulerPage.clickOnOccurrenceByIndex(startPosition, endPosition, occurrenceIndex);
        await browser.sleep(1000);

        //Verify the Occurrence Popup display status
        let popupDisplayStatus = await cpEditOccuranceSeriesPopup.isPopupDisplayed;
        browser.logger.info("Occurrence series popup display status : " + popupDisplayStatus)
        expect(popupDisplayStatus).toBe(true);
        await browser.sleep(1000);
    
        //Entering Task Notes in Occurrence Popup
        browser.logger.info("Entering task notes as : " + taskOccurrenceNotes);
        await cpEditOccuranceSeriesPopup.enterTaskNotes(taskOccurrenceNotes);
        await browser.sleep(1000);

        //Select the Task occurrence status
        browser.logger.info("Status Completed selected");
        await cpEditOccuranceSeriesPopup.selectStatusInToggleButton(taskUpdateStatus[1]);
        await browser.sleep(1000);
        
        //Getting Scheduled Time from Occurrence popup & Entering Occurrence Complete time
        let occurrenceCompletedTime  = await cpEditOccuranceSeriesPopup.getScheduledTime;
        browser.logger.info("Entering task occurrence completed time as : " + occurrenceCompletedTime);
        await cpEditOccuranceSeriesPopup.enterCompletedTime(occurrenceCompletedTime);
        await browser.sleep(1000);
        
        //Selecting Occurrence Completed Date
        browser.logger.info("Selecting task occurrence completed date");
        await cpEditOccuranceSeriesPopup.selectCompletedDate();
        await browser.sleep(1000);
    
        // Click on the Save button at Task Occurrence Popup
        browser.logger.info("Save task occurrence details entered by click on save button");
        await cpEditOccuranceSeriesPopup.clickOnSave();
        await browser.sleep(3000);   
        
        //Verify the task occurrence status after completing
        let taskOccurrenceStatus = await cpSchedulerPage.getTaskOccurrenceStatus(startPosition, endPosition);
        browser.logger.info("Status of the occurrence " + occurrenceIndex + " is : " + taskOccurrenceStatus[occurrenceIndex].split(' ')[0]);
        expect(taskOccurrenceStatus[occurrenceIndex].split(' ')[0]).toEqual(expectedOcurrenceStatus[occurrenceIndex]);
    });
});