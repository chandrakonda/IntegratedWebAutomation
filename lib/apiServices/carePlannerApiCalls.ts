import { browser, protractor } from 'protractor';
import { AuthController } from "../apiControllers/authController";
import { ClientAndPatientController } from "../apiControllers/clientAndPatientController";
import { AppointmentController } from "../apiControllers/appointmentController";
import { VisitController } from "../apiControllers/visitController";
import { OrderController } from "../apiControllers/orderController";
// Framework logger
import { LogHelper } from '../../support/logHelper';
import { SpecFile } from '../../support/globalDataModel';
export class CarePlannerApiCalls {

    //static apiTokenValue: string;

    // GetAuthToken() {
    //     try {
    //         let __authController = new AuthController();
    //         __authController.getAuthToken1();
    //         browser.logger.info(AuthController.authTokenValue);
           
    //     } catch (e) {
    //         throw e;
    //     }
    // }

    async CreateClientPetAddProduct(specData : SpecFile) {
        try {
            await browser.sleep(10000);
            LogHelper.Logger.info(AuthController.authTokenValue);

            let __clientAndPatientController = new ClientAndPatientController();
            let __appointmentController = new AppointmentController();
            let __orderController = new OrderController();
            let __visitController: VisitController = new VisitController();
            
            await __clientAndPatientController.createClient(AuthController.authTokenValue,specData);  // create client
            await __clientAndPatientController.createPatient(AuthController.authTokenValue,specData);  // create patient
            await __appointmentController.createNewAppointment(AuthController.authTokenValue);  // create appointment
            await __appointmentController.checkinAppointment(AuthController.authTokenValue);  // checkin appointment
            await __appointmentController.getCheckedInPatientDetail(AuthController.authTokenValue);  // checkin appointment
            await __orderController.addOrderToVisit(AuthController.authTokenValue);
            await browser.sleep(10000);  /// Wait to get details
            await __visitController.getVisitDetailsByVisitId(AuthController.authTokenValue);
            await __orderController.getTaskSeriesByOrderId(AuthController.authTokenValue);
            await __visitController.getVisitDetailsByVisitId(AuthController.authTokenValue);
            await __visitController.getVisitResources(AuthController.authTokenValue);

            LogHelper.Logger.info("Creating URL and launching browser...");
            let __url = browser.baseUrl +
                '?hospitalId=' + browser.appenvdetails.hospitalid +
                '&patientId=' + browser.patientID +
                '&orderId=' + browser.visitId +
                '&userName='+ browser.appenvdetails.username +
                '&userId=' + browser.userId +  // chandrasekhar.konda .. need to implement
                '&accessToken=' + AuthController.tokenValue;
                LogHelper.Logger.info('URL: ', __url);
            browser.get(__url);
            browser.sleep(5000);

        } catch (e) {
            LogHelper.Logger.error(e);
        }
    }

    AddMultipleProducts() {



    }




}