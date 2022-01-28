var http = require("http");
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');
const {Pool} = require('pg');
const {ExportService} = require('./services/export.service');
const {notEmpty} = require("./utils/data.utils");

//MySQL connection
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'network'`1a
// });


var connectionString =
    'postgres://zqjucxeozjmeqv:d9da62430972eaccbc0ed7a01b4949375341bd2e57d2ea4076f45601c32f3190@ec2-44-197-142-172.compute-1.amazonaws.com:5432/d6q81mtui3km92'

app.use(cors());


//app.use(function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  next();
//});

// connection.connect(function (err) {
//     if (err) throw err
//     console.log('You are now connected...')
// })

const pool = new Pool({
    connectionString, ssl: {
        rejectUnauthorized: false
    }
})

module.exports = {pool}

//Body-parser configuration
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

//Create node.js Server
// var server = app.listen(3000, "127.0.0.1", function () {

//     var host = server.address().address
//     var port = server.address().port

//     console.log("Example app listening at http://%s:%s", host, port)

// });

var server = app.listen(process.env.PORT || 3001);


//rest api to update record into mysql database
app.put('/account/', function (req, res) {
    var postData = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');

    pool.query('UPDATE account SET trangthai_kh=($1) where mawifi=($2)', postData, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

//rest api to update record into mysql database
app.put('/congtacvien/', function (req, res) {
    var postData = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');

    pool.query('UPDATE congtacvien SET facebook=($1),sdt=($2),diachi=($3) where hoten=($4)', postData, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

//rest api to authen
app.get('/admin', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query('select username,password from admin', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

//rest api to authen
app.get('/detail/', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    //pool.query('select * from mobilephone ORDER BY no, summary, price', function (error, results, fields) {
    pool.query('select summary, category, price, name, no, giamoi, id from mobilephone GROUP BY category,name,summary, price,  no, giamoi, id', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});


app.get('/detail/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');

    pool.query('select * FROM mobilephone WHERE id = $1', [req.params.id], function (error, results) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.post('/device/', function (req, res) {
    var postData = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');

    pool.query('INSERT INTO mobilephone VALUES ($1, $2, $3, $4, $5, $6, DEFAULT)', postData, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.delete('/device/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');

    pool.query('DELETE FROM mobilephone WHERE id = $1', [req.params.id], function (error, results) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.put('/updateDevice/', function (req, res) {
    var postData = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');

    pool.query('UPDATE mobilephone SET category=($1),summary=($2), price=($3), name=($4), no=($5),giamoi=($6) where id=($7)', postData, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.put('/updateDeviceStatus/', function (req, res) {
    var postData = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');

    pool.query('UPDATE mobilephone SET active=($1) where id=($2)', postData, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.put('/updateDeviceNew/', function (req, res) {
    var postData = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');

    pool.query('UPDATE mobilephone SET new=($1) where id=($2)', postData, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

//rest api to authen
app.get('/detailLess/', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query('select id, category, name, image1, price, active, summary, new, giamoi from mobilephone ORDER BY summary ', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.get('/ipad/', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query("select * from mobilephone where category = 'applewatch' ORDER BY no,  price", function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.get('/applewatch/', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query("select * from mobilephone where category = 'uqmobile' ORDER BY no,  price", function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.get('/macbook/', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query("select * from mobilephone where category = 'au' ORDER BY no,  price ", function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.get('/macbookpro/', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query("select * from mobilephone where category = 'docomo' ORDER BY no,  price ", function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.get('/airpod/', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query("select * from mobilephone where category = 'softbank' ORDER BY no,  price", function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.get('/simdata/', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query("select * from mobilephone where category = 'ymobile' ORDER BY no,  price", function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.get('/dienthoaicu/', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query("select * from mobilephone where category = 'ipad' ORDER BY no,  price", function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.get('/iphone/', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query("select * from mobilephone where category = 'iphone' ORDER BY no,  price", function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.get('/android/', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query("select * from mobilephone where category = 'イヤホン' ORDER BY no,  price", function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.get('/phukien/', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query("select * from mobilephone where category = 'phukien' ORDER BY no,  price", function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.get('/sanphamkhac/', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query("select * from mobilephone where category = 'その他' ORDER BY no,  price", function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});


/**
 * SellPhone Management APIs
 */

app.get('/app/info', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    res.end(JSON.stringify({
        version: '1.0.0',
        release: '20220128'
    }))
});

app.get('/customers', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    // console.log(req);
    pool.query('SELECT id,name_vietnamese, name_japanese, birthday, age, address, phone, job FROM customer', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.post('/customers/search', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    const postData = req.body;
    if (!postData.query !== undefined) {
        const search_type = postData.search_type;
        switch (search_type) {
            case 'BIRTHDAY':
            default:
                const birthday = postData.query.birthday;
                pool.query(`SELECT id,
                                   name_vietnamese,
                                   name_japanese,
                                   birthday,
                                   age,
                                   address,
                                   phone,
                                   job
                            FROM customer
                            WHERE birthday = '${birthday}'`, function (error, results, fields) {
                    if (error) throw error;
                    res.end(JSON.stringify(results.rows));
                });
                break;
        }
    }
});

app.post('/customers', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    const {name_vietnamese, name_japanese, birthday, age, address, phone, job} = req.body;
    const customer = {
        name_vietnamese,
        name_japanese,
        birthday,
        age,
        address,
        phone,
        job
    }
    const insertCustomerSql = `INSERT INTO customer (name_vietnamese, name_japanese, birthday, age, address, phone, job)
                               VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`
    pool.query(insertCustomerSql, Object.values(customer), function (error, results, fields) {
        res.end(JSON.stringify(results.rows));
    });
});

app.put('/customers', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    const {id, name_vietnamese, name_japanese, birthday, age, address, phone, job} = req.body;
    const customer = {
        id,
        name_vietnamese,
        name_japanese,
        birthday,
        age,
        address,
        phone,
        job
    }
    pool.query('Update customer SET name_vietnamese = $2, name_japanese= $3, birthday=$4, age=$5, address=$6, phone=$7, job=$8 where id = $1', Object.values(customer), function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.delete('/customers/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    pool.query('DELETE FROM customer WHERE id = $1', [req.params.id], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.get('/invoices', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    pool.query('SELECT i.id, c.name_vietnamese, i.sale_date, i.quantity, i.total_money FROM invoice i, customer c WHERE c.id = i.customer_id', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.get('/invoices/items/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    const {id} = req.params;
    const customer = {
        id: null,
        address: '',
        age: 0,
        birthday: undefined,
        job: undefined,
        name_japanese: '',
        name_vietnamese: '',
        phone: ''
    }
    const invoiceInfo = {
        mobiles: [],
        invoice_id: null,
        quantity: 0,
        sale_date: null,
        total_money: 0,
        customer
    }
    pool.query('SELECT * FROM mobile WHERE invoice_id = $1', [id], function (error, results, fields) {
        if (error) throw error;
        if (results.rows.length > 0) {
            invoiceInfo.mobiles = results.rows;
            const invoiceSummarySql = `SELECT tblA.invoice_id,
                                              tblA.quantity,
                                              tblA.total_money,
                                              tblB.sale_date,
                                              tblB.customer_id
                                       FROM (
                                                SELECT invoice_id, COUNT(*) AS quantity, SUM(price) AS total_money
                                                FROM mobile
                                                GROUP BY invoice_id
                                                HAVING invoice_id = $1
                                            ) tblA
                                                JOIN (
                                           SELECT *
                                           FROM invoice
                                           WHERE id = $1
                                       ) tblB
                                                     ON tblA.invoice_id = tblB.id`;
            pool.query(invoiceSummarySql, [id], function (error, results, fields) {
                if (!error && results.rows.length > 0) {
                    const invoiceDetail = results.rows[0];
                    invoiceInfo.sale_date = invoiceDetail.sale_date;
                    invoiceInfo.quantity = invoiceDetail.quantity;
                    invoiceInfo.total_money = invoiceDetail.total_money;
                    invoiceInfo.invoice_id = invoiceDetail.invoice_id;
                    invoiceInfo.customer_id = invoiceDetail.customer_id;

                    const customerDataSql = `SELECT *
                                             FROM customer
                                             WHERE id = $1`;
                    pool.query(customerDataSql, [invoiceDetail.customer_id], function (error, results, fields) {
                        if (!error && results.rows.length > 0) {
                            invoiceInfo.customer = results.rows[0];
                            res.end(JSON.stringify(invoiceInfo));
                        }
                    })
                }

            })
        } else {
            res.end(JSON.stringify(invoiceInfo));
        }
    });
});

app.post('/invoices', function (req, res) {
    var postData = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");

    const {invoice_id, customer, mobiles, sale_date, total_money, quantity} = postData;
    const customer_id = null;
    const invoiceData = {
        customer_id, sale_date, quantity, total_money
    };
    const invoiceItems = {
        invoice_id,
        mobiles
    }


    // Create new or update a customer
    if (customer.id == null) {
        const insertCustomerQuery = `INSERT INTO customer (name_vietnamese, name_japanese, birthday, age, address, phone, job)
                                     VALUES ('${customer.name_vietnamese}', '${customer.name_japanese}',
                                             '${customer.birthday}',
                                             ${customer.age}, '${customer.address}',
                                             ${customer.phone}, '${customer.job}') RETURNING id`;
        pool.query(insertCustomerQuery, function (error, results, fields) {
            if (error) throw error;
            if (results.rows[0].id) {
                invoiceData.customer_id = results.rows[0].id;
                createInvoice(invoiceData);
            } else {
                saveInvoiceResponse({
                    success: false,
                    error: 'Can not create customer'
                })
            }
        });
    } else {
        const updateCustomerQuery = `UPDATE customer
                                     SET name_vietnamese = $2,
                                         name_japanese= $3,
                                         birthday=$4,
                                         age=$5,
                                         address=$6,
                                         phone=$7,
                                         job=$8
                                     where id = $1 RETURNING id`;
        pool.query(updateCustomerQuery, Object.values(customer), function (error, results, fields) {
            if (error) throw error;
            if (results.rows[0].id) {
                invoiceData.customer_id = results.rows[0].id;
                createInvoice(invoiceData);
            } else {
                saveInvoiceResponse({
                    success: false,
                    error: 'Can not update customer'
                })
            }

        });
    }

    /**
     * Create new Invoice
     * @param invoiceData
     */
    function createInvoice(invoiceData = null) {
        if (invoiceData !== null) {
            const insertInvoiceQuery = 'INSERT INTO invoice (customer_id, sale_date, quantity, total_money) VALUES ($1, $2, $3, $4) RETURNING id';
            pool.query(insertInvoiceQuery, Object.values(invoiceData), function (error, results, fields) {
                if (error) throw error;
                invoiceItems.invoice_id = results.rows[0].id;
                saveInvoiceItems(invoiceItems);
            });
        } else {
            saveInvoiceResponse({
                success: false,
                error: 'Can not save empty invoice data'
            })
        }
    }


    /**
     * Save invoice items
     * @param invoiceItems
     */
    function saveInvoiceItems(invoiceItems = null) {
        const {invoice_id, mobiles} = invoiceItems;
        if (invoice_id != null && mobiles.length > 0) {
            let sqlString = 'INSERT INTO mobile (name, imei, color, status, price, invoice_id) VALUES ';
            const valueItems = []
            mobiles.forEach((mobile) => {
                valueItems.push(`('${mobile.name}', '${mobile.imei}', '${mobile.color}', '${mobile.status}', ${mobile.price}, ${invoice_id})`);
            });
            sqlString += valueItems.join(', ');
            pool.query(sqlString, function (error, results, fields) {
                if (error) throw error;
                if (results.rows) {
                    saveInvoiceResponse({
                        success: true,
                        data: JSON.stringify(results.rows)
                    });
                }

            });
        } else {
            saveInvoiceResponse({
                success: false,
                error: 'Can not save invoice or invoice items is empty'
            })
        }
    }

    function saveInvoiceResponse(response = null) {
        res.end(JSON.stringify(response));
    }
});

app.delete('/invoices/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    // console.log(req);
    pool.query('DELETE FROM mobile WHERE invoice_id = $1', [req.params.id], function (error, results, fields) {
        if (error) throw error;
        pool.query('DELETE FROM invoice WHERE id = $1', [req.params.id], function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results.rows));
        });
    });

});

app.put('/invoices', function (req, res) {
    var postData = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");

    const {invoice_id, customer, customer_id, mobiles, sale_date, total_money, quantity} = postData;
    const invoiceData = {
        customer_id, sale_date, quantity, total_money
    };
    const invoiceItems = {
        invoice_id,
        mobiles
    }
    delete customer.updated_at;
    delete customer.created_at;
    if (customer.id) {
        const updateCustomerQuery = `UPDATE customer
                                     SET name_vietnamese = $2,
                                         name_japanese= $3,
                                         birthday=$4,
                                         age=$5,
                                         address=$6,
                                         phone=$7,
                                         job=$8
                                     where id = $1 RETURNING id`;
        pool.query(updateCustomerQuery, Object.values(customer), function (error, results, fields) {
            if (error) throw error;
            if (results.rows[0].id) {
                invoiceData.customer_id = results.rows[0].id;
                updateInvoice(invoiceData);
            } else {
                saveInvoiceResponse({
                    success: false,
                    error: 'Can not update customer'
                })
            }

        });
    }

    /**
     * Create new Invoice
     * @param invoiceData
     */
    function updateInvoice(invoiceData = null) {
        if (invoice_id !== null && invoiceData !== null) {
            const updateInvoiceQuery = `UPDATE invoice
                                        SET customer_id=${customer.id},
                                            sale_date='${sale_date}',
                                            quantity=${quantity},
                                            total_money=${total_money}
                                        where id = ${invoice_id} RETURNING id`;
            pool.query(updateInvoiceQuery, function (error, results, fields) {
                if (error) throw error;
                invoiceItems.invoice_id = results.rows[0].id;
                updateInvoiceItems(invoiceItems);
            });
        } else {
            saveInvoiceResponse({
                success: false,
                error: 'Can not save empty invoice data'
            })
        }
    }


    /**
     * Save invoice items
     * @param invoiceItems
     */
    function updateInvoiceItems(invoiceItems = null) {
        if (invoice_id != null && mobiles.length > 0) {
            let sqlString = 'INSERT INTO mobile (name, imei, color, status, price, invoice_id) VALUES ';
            const valueItems = [];
            var insertMobilesSuccess = false;
            var updateMobilesSuccess = false;
            mobiles.forEach((mobile) => {

                if (mobile.id == 0) {
                    valueItems.push(`('${mobile.name}', '${mobile.imei}', '${mobile.color}', '${mobile.status}', ${mobile.price}, ${invoice_id})`);
                } else {
                    let sqlStringUpdate = `UPDATE mobile
                                           SET name   = '${mobile.name}',
                                               imei   = '${mobile.imei}',
                                               color  = '${mobile.color}',
                                               status = '${mobile.status}',
                                               price  = ${mobile.price}
                                           where id = ${mobile.id} `;
                    pool.query(sqlStringUpdate, function (error, results, fields) {
                        if (error) throw error;
                        if (results.rows) {
                            updateMobilesSuccess = true;
                        }

                    });
                }
            });
            if (valueItems.length !== 0) {
                sqlString += valueItems.join(', ');
                console.log(sqlString);
                pool.query(sqlString, function (error, results, fields) {
                    if (error) throw error;
                    if (results.rows) {
                        insertMobilesSuccess = true;
                    }

                });
            }
            saveInvoiceResponse({
                success: true,
            });
        } else {
            saveInvoiceResponse({
                success: false,
                error: 'Can not save invoice or invoice items is empty'
            })
        }
    }

    function saveInvoiceResponse(response = null) {
        res.end(JSON.stringify(response));
    }
});

app.get('/mobiles', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query('SELECT id, name,imei, color, status, price, invoice_id FROM MOBILE WHERE id not in (select mobileid from orderdetail)', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.post('/orderInvoices', function (req, res) {
    var postData = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    const {mobiles, sale_date, total_money, quantity} = postData;

    createOrderInvoice({sale_date, quantity, total_money});

    function createOrderInvoice(data) {
        if (data !== null) {
            const insertOrderInvoiceQuery = 'INSERT INTO OrderInvoice (sale_date, quantity, total_money, isCompleted) VALUES ($1, $2, $3, false) RETURNING id';
            pool.query(insertOrderInvoiceQuery, Object.values(data), function (error, results, fields) {
                if (error) throw error;
                saveOrderItem(mobiles, results.rows[0].id);
            });
        } else {
            saveInvoiceResponse({
                success: false,
                error: 'Can not save empty invoice data'
            })
        }
    }

    function saveOrderItem(data, orderId) {
        if (orderId != null && data.length > 0) {
            let sqlString = 'INSERT INTO OrderDetail (orderId, mobileId, price) VALUES ';
            const valueItems = []
            data.forEach((mobile) => {
                valueItems.push(`('${orderId}', '${mobile.id}', '${mobile.salePrice}')`);
            });
            sqlString += valueItems.join(', ');
            pool.query(sqlString, function (error, results, fields) {
                if (error) throw error;
                if (results.rows) {
                    saveInvoiceResponse({
                        success: true,
                        data: JSON.stringify(results.rows)
                    });
                }

            });
        } else {
            saveInvoiceResponse({
                success: false,
                error: 'Can not save invoice or invoice items is empty'
            })
        }
    }

    function saveInvoiceResponse(response = null) {
        res.end(JSON.stringify(response));
    }
});

app.get('/orderInvoices/Pending', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    pool.query('SELECT id, sale_date, quantity, total_money FROM public.orderinvoice WHERE iscompleted = false ORDER BY id ASC ', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.get('/orderInvoices/details/:id', function (req, res) {
    const {id} = req.params;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    pool.query(`SELECT od.mobileid, mobile."name", mobile.imei, mobile.color, mobile.status, od.price
                FROM orderdetail od
                         JOIN mobile ON mobile.id = od.mobileid
                WHERE od.orderid = ${id}
                ORDER BY id ASC`, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.put('/orderInvoices', function (req, res) {
    var postData = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    const {mobiles, id, total_money} = postData;

    updateOrderInvoices({id, total_money});

    function updateOrderInvoices(data) {
        if (data !== null) {
            const updateOrderInvoiceQuery = `Update orderinvoice
                                             SET total_money = ${data.total_money},
                                                 iscompleted = true
                                             where id = ${data.id}`;
            pool.query(updateOrderInvoiceQuery, function (error, results, fields) {
                if (error) throw error;
                updateOrderItem(mobiles, data.id);
            });
        } else {
            saveInvoiceResponse({
                success: false,
                error: 'Can not save empty invoice data'
            })
        }
    }

    function updateOrderItem(data, orderId) {
        if (orderId != null && data.length > 0) {
            const valueItems = []
            data.forEach((mobile) => {
                valueItems.push(`Update orderdetail
                                 SET price = ${mobile.price}
                                 where orderid = ${orderId}
                                   and mobileid = ${mobile.id}`);
            });
            var sqlString = valueItems.join('; ') + ';';
            pool.query(sqlString, function (error, results, fields) {
                if (error) throw error;
                saveInvoiceResponse({
                    success: true,
                    data: JSON.stringify(results.rows)
                });

            });
        } else {
            saveInvoiceResponse({
                success: false,
                error: 'Can not save invoice or invoice items is empty'
            })
        }
    }

    function saveInvoiceResponse(response = null) {
        res.end(JSON.stringify(response));
    }
});

app.get('/orderInvoices/Completed', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    pool.query('SELECT id, sale_date, quantity, total_money FROM public.orderinvoice WHERE iscompleted = true ORDER BY id ASC ', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.get('/statistics', function (req, res) {
    const type = req.query.type;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    var obj = {};
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");

    getInvoices(type, fromDate, toDate);

    function getInvoices(type, fromDate, toDate) {
        var queryString = '';

        if (type === 'month') {
            queryString = `SELECT date.dateyear,
                                  date.datemonth,
                                  CASE WHEN data.quantity IS NULL THEN 0 ELSE data.quantity END,
                                  CASE WHEN data.total_money IS NULL THEN 0 ELSE data.total_money END
                           FROM (select DISTINCT EXTRACT(YEAR FROM CURRENT_DATE + i)  as dateyear,
                                                 EXTRACT(MONTH FROM CURRENT_DATE + i) as datemonth
                                 from generate_series(date '${fromDate}' - CURRENT_DATE, date '${toDate}' -
                                                                                         CURRENT_DATE) i) date LEFT JOIN (SELECT EXTRACT(YEAR FROM sale_date) as dateyear, EXTRACT(MONTH FROM sale_date) as datemonth, sum(quantity) as quantity, sum(total_money) as total_money FROM invoice WHERE EXTRACT(YEAR FROM sale_date) >= EXTRACT(YEAR FROM TIMESTAMP '${fromDate}') AND EXTRACT(MONTH FROM sale_date) >= EXTRACT(MONTH FROM TIMESTAMP '${fromDate}') AND EXTRACT(YEAR FROM sale_date) <= EXTRACT(YEAR FROM TIMESTAMP '${toDate}') AND EXTRACT(MONTH FROM sale_date) <= EXTRACT(MONTH FROM TIMESTAMP '${toDate}') GROUP BY dateyear, datemonth ORDER BY EXTRACT(YEAR FROM sale_date), EXTRACT(MONTH FROM sale_date)) as data
                           on date.dateyear = data.dateyear AND data.datemonth = date.datemonth`;
        } else {
            queryString = `SELECT d.date as sale_date,
                                  CASE WHEN data.quantity IS NULL THEN 0 ELSE data.quantity END,
                                  CASE WHEN data.total_money IS NULL THEN 0 ELSE data.total_money END
                           from (select CURRENT_DATE + i as date
                                 from generate_series(date '${fromDate}'- CURRENT_DATE, date '${toDate}' - CURRENT_DATE) i) d
                                    LEFT JOIN (SELECT sale_date,
                                                      sum(quantity)    as quantity,
                                                      sum(total_money) as total_money
                                               FROM invoice
                                               WHERE sale_date >= '${fromDate}'
                                                 AND sale_date <= '${toDate}'
                                               GROUP BY sale_date) data ON d.date = data.sale_date`;
        }
        pool.query(queryString, function (error, results, fields) {
            if (error) throw error;
            obj['invoice'] = results.rows
            getOrder(type, fromDate, toDate);
        });
    }

    function getOrder(type, fromDate, toDate) {
        var queryString = '';
        if (type === 'month') {
            queryString = `SELECT date.dateyear,
                                  date.datemonth,
                                  CASE WHEN data.quantity IS NULL THEN 0 ELSE data.quantity END,
                                  CASE WHEN data.total_money IS NULL THEN 0 ELSE data.total_money END
                           FROM (select DISTINCT EXTRACT(YEAR FROM CURRENT_DATE + i)  as dateyear,
                                                 EXTRACT(MONTH FROM CURRENT_DATE + i) as datemonth
                                 from generate_series(date '${fromDate}' - CURRENT_DATE, date '${toDate}' -
                                                                                         CURRENT_DATE) i) date LEFT JOIN (SELECT EXTRACT(YEAR FROM sale_date) as dateyear, EXTRACT(MONTH FROM sale_date) as datemonth, sum(quantity) as quantity, sum(total_money) as total_money FROM orderinvoice WHERE iscompleted IS TRUE AND EXTRACT(YEAR FROM sale_date) >= EXTRACT(YEAR FROM TIMESTAMP '${fromDate}') AND EXTRACT(MONTH FROM sale_date) >= EXTRACT(MONTH FROM TIMESTAMP '${fromDate}') AND EXTRACT(YEAR FROM sale_date) <= EXTRACT(YEAR FROM TIMESTAMP '${toDate}') AND EXTRACT(MONTH FROM sale_date) <= EXTRACT(MONTH FROM TIMESTAMP '${toDate}') GROUP BY dateyear, datemonth ORDER BY EXTRACT(YEAR FROM sale_date), EXTRACT(MONTH FROM sale_date)) as data
                           on date.dateyear = data.dateyear AND data.datemonth = date.datemonth`;
        } else {
            queryString = `SELECT d.date as sale_date,
                                  CASE WHEN data.quantity IS NULL THEN 0 ELSE data.quantity END,
                                  CASE WHEN data.total_money IS NULL THEN 0 ELSE data.total_money END
                           from (select CURRENT_DATE + i as date
                                 from generate_series(date '${fromDate}'- CURRENT_DATE, date '${toDate}' - CURRENT_DATE) i) d
                                    LEFT JOIN (SELECT sale_date,
                                                      sum(quantity)    as quantity,
                                                      sum(total_money) as total_money
                                               FROM orderinvoice
                                               WHERE iscompleted IS TRUE
                                                 AND sale_date >= '${fromDate}'
                                                 AND sale_date <= '${toDate}'
                                               GROUP BY sale_date) data ON d.date = data.sale_date`;
        }

        pool.query(queryString, function (error, results, fields) {
            if (error) throw error;
            obj['orderinvoice'] = results.rows;
            res.end(JSON.stringify(obj));
        });
    }


});

app.get('/devices', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query(`
                SELECT a.id,
                       a.name,
                       a.imei,
                       a.status,
                       a.price,
                       a.invoice_id,
                       b.sale_date,
                       c.name_vietnamese
                FROM MOBILE a
                         JOIN invoice b
                              ON a.invoice_id = b.id
                         JOIN customer c
                              ON b.customer_id = c.id`,
        function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results.rows));
        });
});

app.get('/invoices/report/:id', async function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    const {id} = req.params;
    if (notEmpty(id)) {
        getInvoiceReportDetail(id);
    } else {
        res.end(null);
    }

    // Get Data From DB
    function getInvoiceReportDetail(invoice_id) {
        let mobiles = [];
        const reportHeader = {
            sale_date: undefined,
            name_vietnamese: null,
            name_japanese: null,
            birthday: undefined,
            phone: null,
            job: null,
            address: null
        };
        const summary = {
            quantity: 0,
            total_money: 0
        };
        const reportDetail = {
            reportHeader,
            summary,
            mobiles
        }
        let customer_id = null;
        pool.query('SELECT * FROM mobile WHERE invoice_id = $1', [invoice_id], function (error, results, fields) {
            if (error) throw error;
            mobiles = results.rows;
            const invoiceSummarySql = `SELECT tblA.invoice_id,
                                              tblA.quantity,
                                              tblA.total_money,
                                              tblB.sale_date,
                                              tblB.customer_id
                                       FROM (
                                                SELECT invoice_id, COUNT(*) AS quantity, SUM(price) AS total_money
                                                FROM mobile
                                                GROUP BY invoice_id
                                                HAVING invoice_id = $1
                                            ) tblA
                                                JOIN (
                                           SELECT *
                                           FROM invoice
                                           WHERE id = $1
                                       ) tblB ON tblA.invoice_id = tblB.id`;
            pool.query(invoiceSummarySql, [invoice_id], function (error, results, fields) {
                if (!error && results.rows.length > 0) {
                    const invoiceDetail = results.rows[0];
                    reportHeader.sale_date = invoiceDetail.sale_date;
                    summary.quantity = invoiceDetail.quantity;
                    summary.total_money = invoiceDetail.total_money;
                    customer_id = invoiceDetail.customer_id;

                    const customerDataSql = `SELECT *
                                             FROM customer
                                             WHERE id = $1`;
                    pool.query(customerDataSql, [customer_id], async function (error, results, fields) {
                        if (!error && results.rows.length > 0) {
                            const customer = results.rows[0];
                            reportHeader.job = customer.job;
                            reportHeader.phone = customer.phone;
                            reportHeader.address = customer.address;
                            reportHeader.birthday = customer.birthday;
                            reportHeader.name_japanese = customer.name_japanese;
                            reportHeader.name_vietnamese = customer.name_vietnamese;

                            reportDetail.reportHeader = reportHeader;
                            reportDetail.summary = summary;
                            reportDetail.mobiles = mobiles;
                            await generateInvoiceReportExcel(reportDetail);
                        } else {
                            res.end(null);
                        }
                    })
                } else {
                    res.end(null);
                }

            })
        });
    }

    async function generateInvoiceReportExcel(reportDetail = null) {
        if (notEmpty(reportDetail)) {
            const exportService = new ExportService();
            await exportService.invoiceReport(reportDetail).then((bufferResponse) => {
                console.log('>>> Generate Invoice Report Finished! Customer Name: ', reportDetail.reportHeader.name_vietnamese);
                res.end(bufferResponse);
            }).catch((e) => {
                console.log('>>> Invoice Report: ', e);
                res.end(null);
            });
        } else {
            res.end(null);
        }
    }
});
