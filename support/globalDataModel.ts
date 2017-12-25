
import { ReadAppConfig } from '../config/appconfig';



export class GlobalValues {
    StartTime: string;
    GlobalAuthToken: string;
    EnvironmentDetails: ReadAppConfig.EnvironmentDetails;
    ReportFileLocation: string;
    LogFileLocation: string;
    SpecFiles: SpecFile[];
    ResultFolder : string;
    
    //Logger : any;
}

export class SpecFile {
    SpecName: string;
    SpecToken: string;
    StartTime: string;
    EndTime: string;
    TestCases: TestCase[];
    Data: Data;
    ApplicationUrl : string;
    UserId : string;

}

export class TestCase {
    TestName: string;
    TestResult: string;
    TestDescription: string;
    ExceptionDetails : string;
}

export class Data {

    Client: Client;
    Patient: Patient;
    AppointmentId: string;
    VisitId: string;
    VisitInvoiceItemId: string;
    InvoiceItemId: string;
    TaskSeriesId: string;
    TaskOccurrenceId: string;
    UserId: string;
    ClientLastName: string;
}

export class Client {
    Id: any;
    FirstName: string;
    LastName: string;
    Patient: Patient;

}

export class Patient {
    Id: string;
    Name: string;
    Visit: Visit;
    Species: string;
    Age: string;
    Sex: string;
}

export class Visit {
    VisitId: string;
    Product: Product;
    VisitInvoiceItem : VisitInvoiceItem[];
}

export class VisitInvoiceItem {

    visitinvoiceitemid : string;
    visitinvoiceitemname : string;
    invoiceitemid : string;

}

export class Product {
    InvoiceItemId: number;
    InvoiceItemTypeId: number;
    PLNo: number;
    SeqNo: number;
    Code: string;
    TaskSeries: TaskSeries[];
}

export class TaskSeries {
    Taskseriesname: string;
    // TaskOccurrence : TaskOccurrence [];
    Starttime: string;
    Endtime: string;
    Interval: string;
    Observations: string;
    Initialtaskoccurrencecount: number;
    Rescheduleoccurrencecount: number;
    TaskOccurrence: TaskOccurrence[];
    TaskSeriesId : string;
}

export class TaskOccurrence {

    InitialTaskOccurrenceStatus: string;
    FinalTaskOccurrenceStatus: string;
    ScheduleTime: string;
    TaskOccurrenceId : string;

}


export class Scheduletaskseries {

    scheduleStartTime: string;
    scheduleEndTime: string;
    repeatEveryHour: string;
    scheduleInstructions: string;
    expectedNumberOfTaskOccurrences: number;
    actualOccurrenceStatus: string[];
    occurrenceIndex: number;
    expectedOcurrenceStatus: string[];
    taskOccurrenceNotes: string;

}


