const db = openDatabase('helpDeskDB', '1.0', 'HelpDesk Database', 500 * 1024 * 1024); // 500 mb;
Lockr.prefix = '';
Lockr.set('customer_added', false);

//Users and Customers and Requests:
function resetDB(){
    Lockr.flush();
    //CREATE DB:
    db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS users');
        tx.executeSql('DROP TABLE IF EXISTS customers');
    });

    checkDB();

    window.location.href = '../index.html';
}

function transactionSQL(sql, jsonOBJ, callBack){
    function errorHandler(tx, error){
        console.log("Error : " + error.message);
    }

    db.transaction(function (tx) {
        tx.executeSql(sql, jsonOBJ, function (tx, results) {
            callBack(results);
        }, errorHandler);
    });
} 

function checkDB(){
    if(Lockr.get('customer_added') == undefined){
        Lockr.set('customer_added', false);
    }

    if(Lockr.get('settings') == undefined){
        Lockr.set('settings', {semester: 'Spring 2017', ip: 'localhost:8080', key: '51A25649-5E6D-4CA2-BFD6-4A52DB6E4652'});
    }

    if(Lockr.get('lastSeq') == undefined){
        Lockr.set('lastSeq', "000");
    }

    if(Lockr.get('session') == undefined){
        Lockr.set('session', {});
    }

    if(Lockr.get('technicians') == undefined){
        Lockr.set('technicians', []);
    }
    //CREATE DB:
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, code TEXT, password TEXT, role TEXT, technician TEXT)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS customers ('+
            'id INTEGER PRIMARY KEY, name TEXT NOT NULL, type TEXT, phone TEXT NOT NULL, email TEXT)');
    });

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM users WHERE username = ?', ["admin"], function (tx, results) {
            const len = results.rows.length;
            if(len == 0){
                //No users:
                tx.executeSql('INSERT INTO users (id, username, code, password, role) VALUES (?,?,?,?,?)', [1,"admin", "admin123", md5("admin123"), "admin"]);
            }
        });
    });      
}

checkDB();