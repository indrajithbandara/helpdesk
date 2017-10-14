Lockr.prefix = 'tb';
//Lockr.flush();

var tables = [
    {table: 'users',
        data: [
            {id: 1, username: 'admin',  password: md5('admin'), role: 'admin'},
            {id: 2, username: 'erik',   password: md5('erik'),  role: 'user'}, 
        ],}, 
    {table: 'settings',
        data: {label: 'semester', value: 'Spring 2017'},}, 
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
    {table: 'target',
        data: '#!/main',},  
];

function initDB(){
    var data_default = null;
    for(var i = 0; i < tables.length; i++){
        data_default = Lockr.get(tables[i].table);

        if(data_default === undefined)
            Lockr.set(tables[i].table, tables[i].data);    
    }
}

function login(username, password){
    var users = Lockr.get('users');
    for(var i = 0; i < users.length; i++)
        if(users[i].username == username && users[i].password == password){
            return users[i];
        }
    return false;    
}

function setSession(data){
    Lockr.set('session', data); 
}

function setLastSeq(){
    var index = getData('requests') != undefined ? getData('requests').length - 1 : -1;
    var input = index == -1 ? '1' : getData('requests')[index];
    Lockr.set('lastSeq', input); 
}

function setRequests(data){
    Lockr.set('requests', data);
}

function setTechnicians(data){
    Lockr.set('technicians', data);
}

function setSemester(data){
    Lockr.set('settings', data);
}

function getLastSeq(){
    return Lockr.get('lastSeq'); 
}

function getSession(){
    return Lockr.get('session'); 
}

function getSemester(){
    return Lockr.get('settings').value;    
}

function getData(table){
    return Lockr.get(table);
}

function saveData(table, newData){
    var oldData = getData(table);
    oldData.push(newData);
    
    Lockr.set(table, oldData);    
}
//########################################################SQL
//Users and Customers and Requests:
function insertSQL(table, data){

    var oldData = getData(table);
    var newIndex = 1;
    
    if(oldData.length > 0)
        newIndex = oldData[oldData.length - 1].id + 1; //ultim id + 1
    
    data.id = newIndex;
    oldData.push(data);
    Lockr.set(table, oldData);       
}

function updateSQL(table, index, data){
    var oldData = getData(table);
    for (var i = 0; i < oldData.length; i++) {
        if(oldData[i].id == index){
            oldData[i] = data;
            break;
        }
    }    
    Lockr.set(table, oldData);
}

function deleteSQL(table, index){
    var oldData = getData(table);

    if(index == oldData[oldData.length - 1].id){ //last
        oldData.splice(-1, 1);    
    }else if(index == oldData[0].id){ // first
        oldData.shift();
    }else{
        
        newData = [];
        for (var i = 0; i < oldData.length; i++) {
            if(oldData[i].id != index){
                newData.push(oldData[i])
            }
        }
        oldData = newData;
        
        //oldData.splice(index, 1);
    }
    
    Lockr.set(table, oldData);    
}
//########################################################SQL
initDB();

function saveUser(data){
    // Get a database reference to our blog
    var db = admin.database();
    var ref = db.ref("/users");
    ref.push(data);
}