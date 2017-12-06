import { browser, protractor } from 'protractor';
import { CarePlannerPetDetails } from '../../pages/carePlanner/cpPetdetails.page';
import { CarePlannerSchedulerPage } from '../../pages/carePlanner/cpScheduler.page';
import { AuthController } from '../../lib/apiControllers/authController';
import { ClientAndPatientController } from '../../lib/apiControllers/clientAndPatientController';
import { AppointmentController } from '../../lib/apiControllers/appointmentController';
import { VisitController } from '../../lib/apiControllers/visitController';
import { OrderController } from '../../lib/apiControllers/orderController';
import { CarePlannerEditSchedulePopup } from '../../pages/carePlanner/cpEditSchedulePopup.page';
import { CarePlannerEditOccuranceSeriesPopup } from '../../pages/carePlanner/cpEditOccurrenceSeriesPopup.page';

let cpSchedulerPage, cpPetDetailsPage,cpEditSchedulePopupPage, cpEditOccuranceSeriesPopup;
let startPosition:number, endPosition:number, taskOccurrenceCount:number;
let taskUpdateStatus:string[] = ["Planned","Completed","Skipped","Canceled"];

let scheduleStartTime = 9;
let scheduleEndTime = '';
let repeatEveryHour = '';
let scheduleInstructions = "Test instructions";
let expectedNumberOfTaskOccurrences = 1;
let actualOccurrenceStatus = ['Overdue'];
let occurrenceIndex = 0;
let expectedOcurrenceStatus = ['Complete'];
let taskOccurrenceNotes = 'Test notes for completing task occurrence';

describe('Scheduling a Single Task Occurrence for a Product in Care Planner Page', () =>{

    beforeAll(() => {
        cpPetDetailsPage = new CarePlannerPetDetails();
        cpSchedulerPage = new CarePlannerSchedulerPage();
        let authController: AuthController = new AuthController();
        let clientAndPatientController: ClientAndPatientController = new ClientAndPatientController();
        let appointmentController: AppointmentController = new AppointmentController();
        let visitController: VisitController = new VisitController();
        let orderController: OrderController = new OrderController();
        cpEditSchedulePopupPage = new CarePlannerEditSchedulePopup();
        cpEditOccuranceSeriesPopup = new CarePlannerEditOccuranceSeriesPopup();
        //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        
        var flow = protractor.promise.controlFlow();

        //Creating a Auth Token
        flow.execute(authController.getAuthToken).then((response) => {
            browser.logger.info("Getting Basic Auth token...");
            browser.token = response;
            browser.bearerToken = 'bearer ' + response;
            browser.logger.info("Bearer token: " + browser.bearerToken);
        });


        //Create a Client
        flow.execute(clientAndPatientController.createClient).then((response) => {
            browser.logger.info("Creating a new client...");
            //browser.logger.info(JSON.stringify(response));
            browser.clientID = response['ClientId'];
            browser.logger.info("ClientId: " + browser.clientID);
            browser.logger.info("Client name: " + response['FirstName'] + ' ' + response['LastName']);
            browser.clientLastName = response['LastName'];
        });

        // Create patient
        flow.execute(clientAndPatientController.createPatient).then((response) => {
            browser.logger.info("Creating a new patient...");
            //browser.logger.info(JSON.stringify(response));            
            browser.patientID = response;
            browser.logger.info("PatientId: " + browser.patientID);
        //browser.patientName 
        });

        //Create a new appointment for patient
        flow.execute(appointmentController.createNewAppointment).then(function (response) {
            browser.logger.info("Creating a new appointment...");
            //browser.logger.info(JSON.stringify(response));
            browser.appointmentID = response['AppointmentId'];
            browser.logger.info("Appointment ID: " + browser.appointmentID);
        });

        //Check appointment in
        flow.execute(appointmentController.checkInAppointment).then(function (response) {
            browser.logger.info("Checking in the appointment...");
            //browser.logger.info(JSON.stringify(response));
            browser.logger.info("Response received for adding product : " + response);
        });

        //Get checked in patient's details
        flow.execute(appointmentController.getCheckedInPatientDetails).then(function (response) {
            browser.logger.info("Getting details of checked in appointment...");
            //browser.logger.info(JSON.stringify(response));
            browser.visitId = response[0].VisitId;
            browser.logger.info("Visit Id is :" + browser.visitId);
        });

        //Add Product to the Visit
        flow.execute(orderController.addOrderToVisit).then(function (response) {
            browser.logger.info("Product Ordered Response...");
            browser.logger.info((response));
        });

        //Get Visit & Invoice Details by Visit Id
        flow.execute(visitController.getVisitDetailsByVisitId).then(function (response) {
            browser.logger.info("Visit Details & Invoice Details by Visit Id...");
            //browser.logger.info(JSON.stringify(response));
            browser.visitInvoiceItems = response[0].VisitInvoiceItems;

            for (let items of browser.visitInvoiceItems) {
                browser.logger.info("Visit Invoice Details :" + JSON.stringify(items));
                browser.logger.info("Visit Invoice Details [Visit Invoice Item Id]" + items.VisitInvoiceItemId);
                browser.logger.info("Visit Invoice Details [Invoice Item Id]" + items.InvoiceItemId);
            }
        });

        //Get Task Series Details By Order Id
        flow.execute(orderController.getTaskSeriesByOrderId).then(function (response) {
            browser.logger.info("Task Series by Order Id...");
            //browser.logger.info(JSON.stringify(response));
            browser.taskOccurances = response[0].TaskOccurences;

            for (let items of browser.taskOccurances) {
                browser.taskSeriesId = items.TaskSeriesId;
                browser.taskOccurrenceId = items.TaskOccurrenceId;
                browser.logger.info("Task Series Id :'" + browser.taskSeriesId + "' for OrderId : '" + browser.visitId + "'");
                browser.logger.info("Task Occurance Id :'" + browser.taskOccurrenceId + "' for OrderId : '" + browser.visitId + "'");
            }
        });


        // Get resource id to form care planner URL 
        flow.execute(visitController.getVisitResources).then(function (response) {
            browser.logger.info("Getting User Id...");
            // browser.logger(JSON.stringify(response));
            for (let i in response) {
                // browser.logger(response[i]);
                let user = response[i];
                if (user['ADusername'] == browser.appenvdetails.username) {
                    browser.logger.info('UserId: ', user['ResourceId']);
                    browser.userId = user['ResourceId'];
                }
            }
        });

        // Form URL to navigate to Careplanner
        flow.execute(() => {
            browser.logger.info("*********** Launching Browser ***********");
            browser.logger.info("Creating URL and launching browser...");
            var url = browser.baseUrl +
                '?hospitalId=' + browser.appenvdetails.hospitalid +
                '&patientId=' + browser.patientID +
                '&orderId=' + browser.visitId +
                '&userName=' + browser.appenvdetails.username +
                '&userId=' + browser.userId +
                '&accessToken=' + browser.token;
            browser.logger.info('URL: ', url);
            browser.get(url);
            browser.sleep(5000);
            browser.logger.info("*********** Starting Test Execution ***********");
        });
    });

    it('should have the title as VCA Charge Capture', async () => {
        let pageTitle = await cpPetDetailsPage.pageTitle;
        await expect(pageTitle).toEqual('VCA Charge Capture');
    });


    it('should display the client details matched', async () => {
        let _clientLastName = browser.clientLastName.length >= 12 ? browser.clientLastName.slice(0, 12) + '…' : browser.clientLastName;
        await expect(cpPetDetailsPage.clientName).toEqual(_clientLastName);
    });


    it('should display the pet details matched', async () => {
        let _patientName = browser.patientName.length >= 12 ? browser.patientName.slice(0, 12) + '…' : browser.patientName;
        await expect(cpPetDetailsPage.petName).toEqual(_patientName);
        await expect(cpPetDetailsPage.speciesName).toEqual('Canine');
    });


    it('should validate the product category and task', async () => {
        let _categoryCount = await cpSchedulerPage.categoryCount; 
        browser.logger.info('No.of category displayed in scheduler : '+_categoryCount);

        let _taskListCount = await cpSchedulerPage.productTaskListCount;
        browser.logger.info('No.of task displayed in scheduler : ' + _taskListCount);
    });


    it('should successfuly click on a task name toschedule for single occurrence', async () => {
        //Click on a task name under a category
        let taskSeriesName = await cpSchedulerPage.productTaskList; 
        browser.taskSeriesName = taskSeriesName[0];
        browser.logger.info('Product Task List : ' + browser.taskSeriesName);
        await cpSchedulerPage.clickOnTaskByName(browser.taskSeriesName);
    });


    it('should display the popup to schedule the task for single occurrence', async () => {
        //Verify the Popup is displayed
        let displayStatus:boolean = await cpEditSchedulePopupPage.isPopupDisplayed;
        browser.logger.info("Popup displayed status : "+ displayStatus );
        await expect(displayStatus).toBe(true);
    });
    

    it('should able to select the frequency as once for single occurrence', async () => {

        //Set the Frequency toggle as Once for single occurrence
        await cpEditSchedulePopupPage.toggleFrequency("Once");
        browser.logger.info("Task Occurrence frequency is selected as Once");
    });


    it('should able to set the date & time for the schedule', async () => {
       
        //Entering Start Time
        browser.logger.info("Entering task scheduler start time as : " + scheduleStartTime);
        await cpEditSchedulePopupPage.enterTimeForSingleOccurrence(scheduleStartTime);

        //Selectign Start Date
        browser.logger.info("Selecting task scheduler start date");
        await cpEditSchedulePopupPage.selectDateForSingleOccurrence();
    });

    it('should able to enter instruction and click on save to complete the schedule of single occurrence task', async () => {
        
        //Enter the instructions
        browser.logger.info("Entering task occurrence instruction as : " + scheduleInstructions);
        await cpEditSchedulePopupPage.enterInstructions(scheduleInstructions);
    
        //Click on Schedule button
        browser.logger.info("Clicking on the schedule button of task scheduler popup");
        await cpEditSchedulePopupPage.clickScheduleButton();

        browser.sleep(3000);
    });


    it('should have a single task occurrence for the scheduled task series', async() => {
       
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
    });


    it('should match the status with the task occurrence status', async () => {
       
        //Get the status of the single occurrence of the task series
        let taskOccurrenceStatus = await cpSchedulerPage.getTaskOccurrenceStatus(startPosition, endPosition);
        for (let index = 0; index < taskOccurrenceStatus.length; index++) {
            browser.logger.info("Status of the occurrence " + index + " is : " + taskOccurrenceStatus[index].split(' ')[0]);
            expect(taskOccurrenceStatus[index].split(' ')[0]).toEqual(actualOccurrenceStatus[index]);
        }
    });


    it('should display the edit task occurrence popup by click on the single task occurrence', async () => {
        //let taskOccurrenceNumber = 0; // 0 for 1st index & always 0 for single occurrence

        //Click on the task occurrence to bring up the edit task occurrence popup
        browser.logger.info("Click on the task occurrence by index : " + occurrenceIndex);
        await cpSchedulerPage.clickOnOccurrenceByIndex(startPosition, endPosition, occurrenceIndex);
        browser.sleep(2000);

        //Verify the Occurrence Popup display status
        let popupDisplayStatus = await cpEditOccuranceSeriesPopup.isPopupDisplayed;
        browser.logger.info("Occurrence series popup display status : " + popupDisplayStatus)
        expect(popupDisplayStatus).toBe(true);
    });

    it('should successfully enter the task notes for the occurrence', async () => {
       
        //Entering Task Notes in Occurrence Popup
        browser.logger.info("Entering task notes as : " + taskOccurrenceNotes);
        await cpEditOccuranceSeriesPopup.enterTaskNotes(taskOccurrenceNotes);

        //Select the Task occurrence status
        browser.logger.info("Status Completed selected");
        await cpEditOccuranceSeriesPopup.selectStatusInToggleButton(taskUpdateStatus[1]);
    });


    it('Should able to save and complete the occurrence', async () => {
        //Getting Scheduled Time from Occurrence popup
        let occurrenceCompletedTime  = await cpEditOccuranceSeriesPopup.getScheduledTime;
        browser.logger.info("Scheduled time displayed as : " + occurrenceCompletedTime);

        //Entering Occurrence Complete time
        await cpEditOccuranceSeriesPopup.enterCompletedTime(occurrenceCompletedTime);
        browser.logger.info("Entering task occurrence completed time as : " + occurrenceCompletedTime);

        browser.sleep(2000);
        
        //Selecting Occurrence Completed Date
        await cpEditOccuranceSeriesPopup.selectCompletedDate();
        browser.logger.info("Slecting task occurrence completed date");
    });

    it('Save the occurrence', async() => {
        
        // Click on the Save button at Task Occurrence Popup
        await cpEditOccuranceSeriesPopup.clickOnSave();
        browser.logger.info("Save task occurrence details entered by click on save button");
        browser.sleep(4000);   
    })

    it('should reflect the update status of the task', async () => {        
        //Verify the task occurrence status after completing
        let taskOccurrenceStatus = await cpSchedulerPage.getTaskOccurrenceStatus(startPosition, endPosition);
        
        for (let index = 0; index < taskOccurrenceStatus.length; index++) {
            browser.logger.info("Status of the occurrence " + index + " is : " + taskOccurrenceStatus[index].split(' ')[0]);
            expect(taskOccurrenceStatus[index].split(' ')[0]).toEqual(expectedOcurrenceStatus[index]);
        }
    });
});