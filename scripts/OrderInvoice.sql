CREATE TABLE OrderInvoice
(
    id          INTEGER Primary Key generated always as identity,
    sale_date   date NOT NULL,
    quantity    INT  NOT NULL,
    total_money INT  NOT NULL,
	isCompleted BOOLEAN NOT NULL,
    created_at      timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE OrderDetail
(
	orderId INT NOT NULL,
	mobileId INT NOT NULL,
	price INT NOT NULL,
	created_at      timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(orderId, mobileId),
	CONSTRAINT fk_OrderInvoice
        FOREIGN KEY (orderId)
            REFERENCES OrderInvoice (id) ON DELETE CASCADE,
	CONSTRAINT fk_Mobile_OD
        FOREIGN KEY (mobileId)
            REFERENCES mobile (id) ON DELETE CASCADE
)