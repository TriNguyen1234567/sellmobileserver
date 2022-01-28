CREATE TABLE customer
(
    id              INTEGER Primary Key generated always as identity,
    name_vietnamese VARCHAR(100) NOT NULL,
    name_japanese   VARCHAR(100) NOT NULL,
    birthday        Date         NOT NULL,
    age             INTEGER      NOT NULL,
    address         VARCHAR      NOT NULL,
    phone           VARCHAR      NOT NULL,
    job             VARCHAR      NOT NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoice
(
    id          INTEGER Primary Key generated always as identity,
    sale_date   date NOT NULL,
    customer_id INT  NOT NULL,
    quantity    INT  NOT NULL,
    total_money INT  NOT NULL,
    created_at      timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_invoice_customer
        FOREIGN KEY (customer_id)
            REFERENCES customer (id) ON DELETE CASCADE
);

CREATE TABLE mobile
(
    id         INTEGER Primary Key generated always as identity,
    name       VARCHAR NOT NULL,
    imei       VARCHAR NOT NULL,
    color      VARCHAR NOT NULL,
    status     VARCHAR NOT NULL,
    price      INT     NOT NULL,
    invoice_id INT     NOT NULL,
    created_at      timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mobile_invoice
        FOREIGN KEY (invoice_id)
            REFERENCES invoice (id) ON DELETE CASCADE
);



SELECT COUNT(*) as quantity, SUM(price) as total_money FROM mobile GROUP BY invoice_id having invoice_id = 3

select tblA.invoice_id, tblA.quantity, tblA.total_money, tblB.sale_date from (
	SELECT invoice_id, COUNT(*) as quantity, SUM(price) as total_money FROM mobile GROUP BY invoice_id having invoice_id = 3
) tblA 
join (
	select * from invoice where id = 3
) tblB
ON tblA.invoice_id = tblB.id




SELECT tblA.invoice_id, tblA.quantity, tblA.total_money, tblB.sale_date FROM (
	SELECT invoice_id, COUNT(*) AS quantity, SUM(price) AS total_money FROM mobile GROUP BY invoice_id HAVING invoice_id = 3
) tblA 
JOIN (
	SELECT * FROM invoice WHERE id = 3
) tblB
ON tblA.invoice_id = tblB.id

SELECT i.id, c.name_vietnamese, i.sale_date, i.quantity, i.total_money FROM invoice i, customer c WHERE c.id = i.customer_id;
