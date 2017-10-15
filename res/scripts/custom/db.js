Lockr.prefix = 'tb';
//Lockr.flush();

let tables = [
    {table: 'users',
        data: [
            {id: 1, username: 'admin',  email: 'ddanielsilva661@gmail.com', code: 'admin', password: md5('admin'), role: 'admin'},
            {id: 2, username: 'erik',   email: 'cetokaiba2009@hotmail.com', code: 'erik',  password: md5('erik'),  role: 'user'}, 
        ],}, 
    {table: 'settings',
        data: {semester: 'Spring 2017', ip: 'localhost:8080', key: '51A25649-5E6D-4CA2-BFD6-4A52DB6E4652'},}, 
    {table: 'requests',
        data: [],},
    {table: 'storedRequests',
        data: [],},
    {table: 'session',
        data: {},},
    {table: 'customers',
        data: [],},
    {table: 'lastSeq',
        data: 1,},
    {table: 'technicians',
        data: [],},
    {table: 'releases',
        data: [],},
    {table: 'logs',
        data: [],
    }
];

function initDB(){
    var data_default = null;
    for(var i = 0; i < tables.length; i++){
        data_default = Lockr.get(tables[i].table);
        if(data_default === undefined)
            Lockr.set(tables[i].table, tables[i].data);    
    }
}

function setLastSeq(){
    var index = Lockr.get('requests') != undefined ? Lockr.get('requests').length - 1 : -1;
    var input = index == -1 ? '1' : Lockr.get('requests')[index];
    Lockr.set('lastSeq', input); 
}
//########################################################SQL
//Users and Customers and Requests:
function insertSQL(table, data){
    var oldData = Lockr.get(table);
    var newIndex = 1;
    
    if(oldData.length > 0)
        newIndex = oldData[oldData.length - 1].id + 1; //ultim id + 1
    
    data.id = newIndex;
    oldData.push(data);
    Lockr.set(table, oldData);       
}

function updateSQL(table, index, data){
    var oldData = Lockr.get(table);
    oldData[index] = data;
    Lockr.set(table, oldData);
}

function deleteSQL(table, index){
    var oldData = Lockr.get(table);
    if(index == oldData.length - 1){ //last
        oldData.splice(-1, 1);    
    }else if(index == 0){ // first
        oldData.shift();
    }else{
        newData = [];
        for (var i = 0; i < oldData.length; i++) {
            if(i != index){
                newData.push(oldData[i])
            }
        }
        oldData = newData;  
    }
    Lockr.set(table, oldData);    
}
//########################################################SQL
initDB();

//Consts:
//const TECHNICIAN_KEY = "51A25649-5E6D-4CA2-BFD6-4A52DB6E4652"; //HOME

const TECHNICIAN_KEY = Lockr.get('settings').key;

//HOME
const BASE_REQUEST = "http://"+Lockr.get('settings').ip+"/sdpapi/request"; //HOME
const BASE_REQUESTER = "http://"+Lockr.get('settings').ip+"/sdpapi/requester"; //HOME

//const BASE_REQUEST = "http://localhost:8080/sdpapi/request"; //HOME
//const BASE_REQUESTER = "http://localhost:8080/sdpapi/requester"; //HOME

//const TECHNICIAN_KEY = "A848D148-6475-41E2-97DA-10E72B0ED804"; //FVTC
//const BASE_REQUEST = "http://10.4.132.81:8080/sdpapi/request"; //FVTC

const OPERATIONS = ["ADD_REQUEST", "EDIT_REQUEST", "CLOSE_REQUEST", "GET_REQUESTS", "GET_ALL"];
const FORMAT = "json";

const CATS = [
    { name: 'Data Recovery', value: 'Data Recovery' }, 
    { name: 'Flash Drive', value: 'Flash Drive' },
    { name: 'Forgot Password', value: 'Forgot Password' }, 
    { name: 'Hardware', value: 'Hardware' },
    { name: 'Internet', value: 'Internet' }, 
    { name: 'Keyboard', value: 'Keyboard' },
    { name: 'Malware', value: 'Malware' }, 
    { name: 'Monitor', value: 'Monitor' },
    { name: 'Network', value: 'Network' }, 
    { name: 'Operating System', value: 'Operating System' },
    { name: 'Power Supply', value: 'Power Supply' }, 
    { name: 'Printer', value: 'Printer' },
    { name: 'Slow Computer', value: 'Slow Computer' }, 
    { name: 'Smartphone', value: 'Smartphone' },
    { name: 'Software', value: 'Software' }, 
    { name: 'Sound', value: 'Sound' },
    { name: 'Touchpad', value: 'Touchpad' },
    { name: 'Unbootable', value: 'Unbootable' },
    { name: 'Wi-fi', value: 'Wi-fi' }
];

const COLORS = [
        { name: 'Black', value: 'Black' }, 
        { name: 'Blue', value: 'Blue' },
        { name: 'Brown', value: 'Brown' }, 
        { name: 'Gold', value: 'Gold' },
        { name: 'Green', value: 'Green' },
        { name: 'Grey', value: 'Grey' },
        { name: 'Orange', value: 'Orange' },
        { name: 'Pink', value: 'Pink' },
        { name: 'Purple', value: 'Purple' },
        { name: 'Red', value: 'Red' },
        { name: 'Silver', value: 'Silver' },
        { name: 'White', value: 'White' },
        { name: 'Yellow', value: 'Yellow' }
];

const OS = [
        { name: 'Android', value: 'Android' }, 
        { name: 'Arch Linux', value: 'Arch Linux' },
        { name: 'Fedora', value: 'Fedora' }, 
        { name: 'iOS', value: 'iOS' },
        { name: 'Linux Mint', value: 'Linux Mint' },
        { name: 'Mac OS X', value: 'Mac OS X' },
        { name: 'Ubuntu', value: 'Ubuntu' },
        { name: 'Windows 10', value: 'Windows 10' },
        { name: 'Windows 7', value: 'Windows 7' },
        { name: 'Windows 8', value: 'Windows 8' },
        { name: 'Windows 8.1', value: 'Windows 8.1' },
        { name: 'Windows Vista', value: 'Windows Vista' },
        { name: 'Windows XP', value: 'Windows XP' }
];  

const BASE_GET = {
    "operation": {
        "details": {
            "from": "0",
            "limit": "0",
            "filterby": "All_Requests",
            "name": "GET_REQUESTS",
            "OPERATION_NAME" : "GET_REQUESTS",
        },
        "name": "GET_REQUESTS",
        "OPERATION_NAME" : "GET_REQUESTS",
    }
};

const BASE_CLOSE = {
    "operation": {
        "details": {
            "closeAccepted": "Accepted",
            "closeComment": "The closing comment"
        }
    }
}

const INPUT_INTAKE = {
    "operation": {
        "details" : {
            "requester" : "administrator",
            "requesttemplate" : "Default Request",
            "priority": "Low",
            "level": "Tier 1",
            "status": "open",
        },
    },
};

const INPUT_REQUESTERS = {
    "operation": {
        "details": {}
    }
}

const TAGS_INTAKE = {
        "technician name": "technicianName",
        "ticket number" : "ticketNumber",
        "student or faculty" : "customerType",
        "student id number (if faculty, put n/a)" : "studentNumber",
        "customer name" : "customerName",
        "phone number" : "phoneNumber",
        "email address" : "emailAddress",
        "alternate phone number" : "alternativePhone",
        "When and how is the best way to contact you?" : "bestTime",
        "Is the device under warranty?" : "withWarranty",
        "When is the last time you backed up all of your important files on the device?" : "lastTimeBackup",
        "Operating System" : "operatingSystem",
        "What is the password of the device?": "passwordDevice",
        "How old is the device?" : "howOldIsDevice",
        "Device Manufacturer Brand Name" : "brandName",
        "Color of the Device" : "colorDevice",
        "Model Number of the Device" : "modelNumber",
        "Is the charger included with the device?" : "withCharger",
        "Would you like Microsoft Office 365 installed on the device?" : "wantOffice",
        "What is your Blackboard password, if you would like Microsoft Office 365 installed?" : "blackboardPassword",
        "Would you like a free antivirus program installed on the device?" : "wantAntivirus",
        "Would you like your operating system upgraded to Windows 10, if possible?" : "wantUpgrade",
        "Is there anything that you would like to be educated or trained on related to the device?" : "moreHelp",
        "description" : "description",
        "subject": "ticketNumber",
        "category": "category"
};

const SATISFACTION = [
        { name: 'Very Satisfied', value: 'Very Satisfied' }, 
        { name: 'Satisfied', value: 'Satisfied' },
        { name: 'Unsatisfied', value: 'Unsatisfied' }, 
        { name: 'Very Unsatisfied', value: 'Very Unsatisfied' },
];