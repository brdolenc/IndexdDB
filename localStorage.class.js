/** 
* @author Bruno Dolenc <brdolenc@gmail.com> 
* @version 0.1 
* @access public 
*/ 


/**
* Class localStorage, Classe criada para otimizar o uso do Local Store, indexedDB
*
* @param {Object} dataObject
* 
*/
function localStorage(dataObject){

    //Verifica se o navegador tem suporte para IndexedDB
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if(!window.indexedDB) { window.alert("Your browser does not support a stable version of IndexedDB"); }

    //Abrindo o banco de dados
    var request = window.indexedDB.open(dataObject.DB_NAME, dataObject.DB_VERSION);
    var db = null;

    /*
     * Todas as modificações estruturais serão feitas no metodo "onupgradeneeded" 
     * toda vez que a versão do banco de dados for alterada
    */
    request.onupgradeneeded = function(){
        db = event.target.result;
        
        //Loop para criar e atualizar todas as tabelas e indexs instaciadas 
        for (var table in dataObject.TABLES) {
            //Criando a tabela do banco de dados 
            var objTabela = db.createObjectStore(dataObject.TABLES[table].TBL_NAME, { autoIncrement : true });
            for(var index in dataObject.TABLES[table].INDEXS){
                //Criandos as indexs da tabela
                objTabela.createIndex(dataObject.TABLES[table].INDEXS[index][0], dataObject.TABLES[table].INDEXS[index][0], { unique: dataObject.TABLES[table].INDEXS[index][1] });
            }
        }
    }

    //Verifica se o banco de dados foi conectado
    request.onsuccess = function(){
        db = event.target.result;
    }

    //Não foi possível conectar-se ao banco de dados
    request.onerror = function(){
        window.alert('Could not connect to the database');
    }

    /**
     * Função para validação das index, campos obrigatórios
     * 
     * @param   {String} tableName
     * @param   {Object} fields
     * @returns {boolean}
    */
    validation = function(tableName, fields){
        //Loop para validações dos campos obrigatórios
        for (var tableItem in dataObject.TABLES) {
            if(dataObject.TABLES[tableItem].TBL_NAME==tableName){
                for(var index in dataObject.TABLES[tableItem].INDEXS){
                    varifyFields = false;
                    for(var fieldIndex in fields){
                        if(dataObject.TABLES[tableItem].INDEXS[index][0]==fieldIndex && fields[fieldIndex]!=""){
                            varifyFields = true;
                        }
                    }
                    //se não existir retorna erro
                    if(!varifyFields) { return { field: dataObject.TABLES[tableItem].INDEXS[index][0], response: false } }
                }
            }
        }
        return { response: true };
    }

    /**
     * Função para inserir dados da tabela do banco de dados
     * 
     * @param   {String} tableName
     * @param   {Object} fields
     * @param   {Function} callback
     * @returns {Object}
    */
    localStorage.prototype.insert = function(tableName, fields, callback){

        //define a tabela e a permisão 
        var transaction = db.transaction(tableName, "readwrite");
        //define a tabela que sera usada nas tranzacoes
        var table = transaction.objectStore(tableName);

        //Verifica se as indexs foram preenchidas
        responseValid = validation(tableName, fields);
        //se não existir retorna erro
        if(!responseValid.response) { callback({type: 'error', message: 'Field '+responseValid.field+' is required'}); return false; }

        var response;
        //adiciona o objeto a tabela
        var add = table.add(fields);
        add.onsuccess = function(event) {
            response = {type: event.type, message: 'done', id: event.target.result};
            callback(response);
        };
        add.onerror = function(event) {
            response = {type: event.type, message: event.target.error.message};
            callback(response);
        };
    }

    /**
     * Função para deletar dados da tabela
     * 
     * @param   {String} tableName
     * @param   {int} id
     * @param   {Function} callback
     * @returns {Object}
    */
    localStorage.prototype.del = function(tableName, id, callback){

        //define a tabela e a permisão 
        var transaction = db.transaction(tableName, "readwrite");
        //define a tabela que sera usada nas tranzacoes
        var table = transaction.objectStore(tableName);

        var response;
        //remove o objeto da tabela
        var del = table.delete(id);
        del.onsuccess = function(event) {
            response = {type: event.type, message: 'done'};
            callback(response);
        };
        del.onerror = function(event) {
            response = {type: event.type, message: event.target.error.message};
            callback(response);
        };
    }

    /**
     * Função para retornar uma inserção da tabela
     * 
     * @param   {String} tableName
     * @param   {int} id
     * @param   {Function} callback
     * @returns {Object}
    */
    localStorage.prototype.get = function(tableName, id, callback){

        //define a tabela e a permisão 
        var transaction = db.transaction(tableName, "readonly");
        //define a tabela que sera usada nas tranzacoes
        var table = transaction.objectStore(tableName);

        var response;
        //retorna o objeto da tabela
        var get = table.get(id);
        get.onsuccess = function(event) {
            response = {type: event.type, message: 'done', data: event.target.result};
            callback(response);
        };
        get.onerror = function(event) {
            response = {type: event.type, message: event.target.error.message};
            callback(response);
        }
    }

    /**
     * Função para atualizar uma inserção da tabela
     * 
     * @param   {String} tableName
     * @param   {int} id
     * @param   {Object} fields
     * @param   {Function} callback
     * @returns {Object}
    */
    localStorage.prototype.put = function(tableName, id, fields, callback){

        //define a tabela e a permisão 
        var transaction = db.transaction(tableName, "readwrite");
        //define a tabela que sera usada nas tranzacoes
        var table = transaction.objectStore(tableName);

        var response;
        //retorna o objeto da tabela
        var get = table.get(id);

        get.onsuccess = function(event) {
            //salva os dados originais
            dataUpdate = get.result;
            //se não existir retorna erro
            if(dataUpdate==undefined) { callback({type: 'error', message: 'Insertion not Exist'}); return false; }
            //altera apenas os dados que foram atualizados
            for (var indexA in dataUpdate) {
                var valueA = dataUpdate[indexA];
                for (var indexB in fields) {
                    var valueB = fields[indexB];
                    if(indexA==indexB){
                        dataUpdate[indexA] = valueB;
                    }
                }
            }

            //Verifica se as indexs foram preenchidas
            responseValid = validation(tableName, dataUpdate);
            //se não existir retorna erro
            if(!responseValid.response) { callback({type: 'error', message: 'Field '+responseValid.field+' is required'}); return false; }

            //atualiza apenas os dados alterados do objeto
            var put = table.put(dataUpdate, id);
            put.onsuccess = function(event) {
                response = {type: event.type, message: 'done', data: event.target.result};
                callback(response);
            };
            put.onerror = function(event) {
                response = {type: event.type, message: event.target.error.message};
                callback(response);
            }
        }
        get.onerror = function(event) {
            response = {type: event.type, message: event.target.error.message};
            callback(response);
        }
    }


    /**
     * Função para retornar todas inserções da tabela
     * 
     * @param   {String} tableName
     * @param   {Function} callback
     * @returns {Object}
    */
    localStorage.prototype.getAll = function(tableName, callback){

        //define a tabela e a permisão 
        var transaction = db.transaction(tableName, "readonly");
        //define a tabela que sera usada nas tranzacoes
        var table = transaction.objectStore(tableName);

        var response = [];
        //retorna todos objetos da tabela
        var getAll = table.openCursor();
        getAll.onsuccess = function(event) {
            var cursor = event.target.result;
            if(cursor && cursor!=null && cursor.value!=undefined) { 
                //adiciona o valor do cursor em um array para retornar
                cursor.value.id = cursor.key;
                response.push(cursor.value);
                cursor.continue(); 
            }else{
                callback(response);
            }
        };
        getAll.onerror = function(event) {
            response = {type: event.type, message: event.target.error.message};
            callback(response);
        };
    }

    /**
     * Função para retornar uma inserção da tabela através de uma index 
     * 
     * @param   {String} tableName
     * @param   {String} indexName
     * @param   {String} value
     * @param   {Function} callback
     * @returns {Object}
    */
    localStorage.prototype.getByIndex = function(tableName, indexName, value, callback){

        //define a tabela e a permisão 
        var transaction = db.transaction(tableName, "readonly");
        //define a tabela que sera usada nas tranzacoes
        var table = transaction.objectStore(tableName);

        //verifica se a index passada existe
        indexTest = false;
        for(var indexTable in table.indexNames){
            if(table.indexNames[indexTable]==indexName){
                indexTest = true;
            }
        }

        //se não existir retorna erro
        if(!indexTest) { callback({type: 'error', message: 'Index not Exist'}); return false; }

        var response;
        //retorna o objeto da tabela
        var index = table.index(indexName);
        var getByIndex = index.get(value);

        getByIndex.onsuccess = function(event) {
            response = {type: event.type, message: 'done', data: event.target.result};
            callback(response);
        };
        getByIndex.onerror = function(event) {
            response = {type: event.type, message: event.target.error.message};
            callback(response);
        }
    }

};



