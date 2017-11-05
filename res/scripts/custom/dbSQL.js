var db = openDatabase('helpDeskDB', '1.0', 'HelpDesk Database', 500 * 1024 * 1024); // 500 mb;

//CREATE DB:
db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, code TEXT, password TEXT, role TEXT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS customers ('+
        'id INTEGER PRIMARY KEY, name TEXT NOT NULL, type TEXT, studentNumber TEXT NOT NULL, phone TEXT NOT NULL, email TEXT)');
});

db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM users WHERE username = ? OR username = ?', ["admin", "erik"], function (tx, results) {
        const len = results.rows.length;
        if(len < 2){
            tx.executeSql('DELETE FROM users');
            tx.executeSql('INSERT INTO users (id, username, code, password, role) VALUES (?,?,?,?,?)', [1,"admin", "admin", md5("admin"), "admin"]);
            tx.executeSql('INSERT INTO users (id, username, code, password, role) VALUES (?,?,?,?,?)', [2,"erik", "erik", md5("erik"), "user"]);
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