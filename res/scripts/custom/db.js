const db = openDatabase('helpDeskDB', '1.0', 'HelpDesk Database', 500 * 1024 * 1024); // 500 mb;
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

//CREATE DB:
db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, code TEXT, password TEXT, role TEXT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS customers ('+
        'id INTEGER PRIMARY KEY, name TEXT NOT NULL, type TEXT, phone TEXT NOT NULL, email TEXT)');
});

db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM users WHERE username = ?', ["admin"], function (tx, results) {
        const len = results.rows.length;
        console.log(len);
        if(len == 0){
            //tx.executeSql('DELETE FROM users WHERE');
            tx.executeSql('INSERT INTO users (id, username, code, password, role) VALUES (?,?,?,?,?)', [1,"admin", "admin", md5("admin"), "admin"]);
        }
    });
});

function transactionSQL(sql, jsonOBJ, callBack){
    //
    function errorHandler(tx, error){
        console.log("Error : " + error.message);
    }

    db.transaction(function (tx) {
        tx.executeSql(sql, jsonOBJ, function (tx, results) {
            callBack(results);
        }, errorHandler);
    });
}