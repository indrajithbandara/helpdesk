Lockr.prefix = '';

if(Lockr.get('settings') == undefined){
    Lockr.set('settings', {semester: 'Spring 2017', ip: 'localhost:8080', key: '51A25649-5E6D-4CA2-BFD6-4A52DB6E4652'});
}

if(Lockr.get('lastSeq') == undefined){
    Lockr.set('lastSeq', 1);
}

const tables = ['requests', 'storedRequests', 'session', 'technicians', 'releases'];

for(var i = 0; i < tables.length; i++){
    if(Lockr.get(tables[i]) === undefined)
        Lockr.set(tables[i],[]);
}
//
function setLastSeq(){
    var index = Lockr.get('request') != undefined ? Lockr.get('request').length - 1 : -1;
    var input = index == -1 ? '1' : Lockr.get('request')[index];
    Lockr.set('request', input); 
}
//########################################################SQL
//Users and Customers and Requests:
function insertSQL(table, data){
    let temp = localStorage[table];
    temp.push(data);
    localStorage[table] = temp;     
}

function updateSQL(table, index, data){
    let temp = localStorage[table];
    temp[index] = data;
    localStorage[table] = temp;
}

function deleteSQL(table, index){
    let temp = localStorage[table];
    if(index == temp.length - 1){ //last
        temp.splice(-1, 1);    
    }else if(index == 0){ // first
        temp.shift();
    }else{
        newData = [];
        for (var i = 0; i < temp.length; i++) {
            if(i != index){
                newData.push(temp[i])
            }
        }
        temp = newData;  
    }
    localStorage[table] = temp;    
}
//Consts:
//const TECHNICIAN_KEY = "51A25649-5E6D-4CA2-BFD6-4A52DB6E4652"; //HOME
var TECHNICIAN_KEY = Lockr.get('settings').key;
var IP             = Lockr.get('settings').ip;
var BASE_REQUEST   = "http://"+IP+"/sdpapi/request"; //HOME
var BASE_REQUESTER = "http://"+IP+"/sdpapi/requester"; //HOME

function changeSettings(){
    TECHNICIAN_KEY = Lockr.get('settings').key;
    IP             = Lockr.get('settings').ip;
    BASE_REQUEST   = "http://"+IP+"/sdpapi/request"; //HOME
    BASE_REQUESTER = "http://"+IP+"/sdpapi/requester"; //HOME    
}

changeSettings();
//
const OPERATIONS = ["ADD_REQUEST", "EDIT_REQUEST", "CLOSE_REQUEST", "GET_REQUESTS", "GET_ALL"];
const FORMAT = "json";

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
