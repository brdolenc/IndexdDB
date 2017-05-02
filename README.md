# LocalStorage - IndexedDB


## Usando a classe

Para utilizar inclua o arquivo e instancie a classe com os parâmetros de configuração do banco de dados

######parâmetros:
- DB_VERSION : Versão do banco de dados, deve ser alterado toda vez que existir uma mudança na configuração
- DB_NAME: Nome do Banco de Dados
- TABLES: Tabelas do banco de dados
  - TBL_NAME: Nome da tabela
  - INDEXS: Índices da tabela [ 'Nome do índice', 'Define se é único ou não' ]

```javascript
var localStorage = new localStorage({
    DB_VERSION: 2,
    DB_NAME: 'BancoDeDados',
    TABLES:[
        {
            TBL_NAME:"usuario",
            INDEXS:[
                ["nome",false],
                ["email",true]
            ]
        },
        {
            TBL_NAME:"cliente",
            INDEXS:[
                ["nome",false],
                ["cpf",true]
            ]
        }
    ]
});
```

## Métodos

#### Insert
Função para inserir dados da tabela do banco de dados

######parâmetros:

| Tipo         | Variavel       | Exemplo       |
| ------------ | -------------  | ------------- |
| String | tableName | Ex: 'Clientes' |
| Object | fields | Ex: { nome: "Bruno", email: "email@gmail.com" } |
| Function | callback | Ex: function(data) { console.log(data); } |

######retorno:
Object

```javascript
localStorage.insert(tableName, fields, callback);
```

#### DEL
Função para deletar dados da tabelas

######parâmetros:

| Tipo         | Variavel       | Exemplo |
| ------------ | -------------  | ------------- |
| String | tableName | Ex: 'Clientes' |
| int | id | Ex: 21 |
| Function | callback | Ex: function(data) { console.log(data); } |

######retorno:
Object

```javascript
localStorage.del(tableName, id, callback);
```

#### GET
Função para retornar uma inserção da tabela

######parâmetros:

| Tipo         | Variavel       | Exemplo |
| ------------ | -------------  | ------------- |
| String | tableName | Ex: 'Clientes' |
| int | id | Ex: 21 |
| Function | callback | Ex: function(data) { console.log(data); } |

######retorno:
Object

```javascript
localStorage.get(tableName, id, callback);
```

#### GETALL
Função para retornar todas inserções da tabela

######parâmetros:

| Tipo         | Variavel       | Exemplo |
| ------------ | -------------  | ------------- |
| String | tableName | Ex: 'Clientes' |
| Function | callback | Ex: function(data) { console.log(data); } |

######retorno:
Object

```javascript
localStorage.getAll(tableName, callback);
```

#### PUT
Função para atualizar uma inserção da tabela

######parâmetros:

| Tipo         | Variavel       | Exemplo |
| ------------ | -------------  | ------------- |
| - String | tableName | Ex: 'Clientes' |
| - int | id | Ex: 21 |
| - Object | fields | Ex: { nome: "Bruno", email: "email@gmail.com" } |
| - Function | callback | Ex: function(data) { console.log(data); } |

######retorno:
Object

```javascript
localStorage.put(tableName, id, fields, callback);
```

#### PUT
Função para retornar uma inserção da tabela através de uma index

######parâmetros:

| Tipo         | Variavel       | Exemplo |
| ------------ | -------------  | ------------- |
| String | tableName | Ex: 'Clientes' |
| String | indexName | Ex: 'email' |
| String | value | Ex: 'email@hotmail.com' |
| Function | callback | Ex:  function(data) { console.log(data); } |

######retorno:
Object

```javascript
localStorage.getByIndex(tableName, indexName, value, callback);
```

