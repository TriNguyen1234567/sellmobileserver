var http = require("http");
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');
const {Pool} = require('pg')

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
    pool.query("select * from mobilephone where category = 'ipad_new' ORDER BY no,  price", function (error, results, fields) {
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
    pool.query("select * from mobilephone where category = 'apple_watch_new' ORDER BY no,  price", function (error, results, fields) {
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
    pool.query("select * from mobilephone where category = 'macbook_new' ORDER BY no,  price ", function (error, results, fields) {
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
    pool.query("select * from mobilephone where category = 'macbookpro' ORDER BY no,  price ", function (error, results, fields) {
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
    pool.query("select * from mobilephone where category = 'air_pods_new' ORDER BY no,  price", function (error, results, fields) {
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
    pool.query("select * from mobilephone where category = 'sim_data_wifi_new' ORDER BY no,  price", function (error, results, fields) {
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
    pool.query("select * from mobilephone where category = 'dienthoaicu' ORDER BY no,  price", function (error, results, fields) {
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
    pool.query("select * from mobilephone where category = 'iphone_new' ORDER BY no,  price", function (error, results, fields) {
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
    pool.query("select * from mobilephone where category = 'android' ORDER BY no,  price", function (error, results, fields) {
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
    pool.query("select * from mobilephone where category = 'sanphamkhac' ORDER BY no,  price", function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});


/**
 * SellPhone Management APIs
 */

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
    var postData = req.body;
    console.log(postData);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query('INSERT INTO customer (name_vietnamese, name_japanese, birthday, age, address, phone, job) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id', postData, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.put('/customers', function (req, res) {
    var postData = req.body;
    console.log(postData);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    console.log(req);
    pool.query('Update customer SET name_vietnamese = $2, name_japanese= $3, birthday=$4, age=$5, address=$6, phone=$7, job=$8 where id = $1', postData, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results.rows));
    });
});

app.delete('/customers/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    // console.log(req);
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
    console.log(req);
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
    const invoiceInfo = {
        items: [],
        invoice_id: null,
        quantity: 0,
        sale_date: null,
        total_money: 0
    }
    pool.query('SELECT * FROM mobile WHERE invoice_id = $1', [id], function (error, results, fields) {
        if (error) throw error;
        if (results.rows.length > 0) {
            invoiceInfo.items = results.rows;
            const invoiceSummarySql = `SELECT tblA.invoice_id, tblA.quantity, tblA.total_money, tblB.sale_date FROM (
                                         SELECT invoice_id, COUNT(*) AS quantity, SUM(price) AS total_money FROM mobile GROUP BY invoice_id HAVING invoice_id = $1
                                        ) tblA 
                                        JOIN (
                                         SELECT * FROM invoice WHERE id = $1
                                        ) tblB
                                        ON tblA.invoice_id = tblB.id`;
            pool.query(invoiceSummarySql, [id], function (error, results, fields) {
                if (!error && results.rows.length > 0) {
                    const invoiceDetail = results.rows[0];
                    invoiceInfo.sale_date = invoiceDetail.sale_date;
                    invoiceInfo.quantity = invoiceDetail.quantity;
                    invoiceInfo.total_money = invoiceDetail.total_money;
                    invoiceInfo.invoice_id = invoiceDetail.invoice_id;
                }
                res.end(JSON.stringify(invoiceInfo));
            });
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

    const {customer, mobiles, sale_date, total_money, quantity} = postData;
    const customer_id = null;
    const invoiceData = {
        customer_id, sale_date, quantity, total_money
    };
    const invoice_id = null;
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

