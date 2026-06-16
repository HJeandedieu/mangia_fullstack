ALTER TABLE "MenuItem"
ADD CONSTRAINT positive_price
CHECK ("price" > 0);

ALTER TABLE "Order"
ADD CONSTRAINT positive_total_amount
CHECK ("totalAmount" >= 0);

ALTER TABLE "OrderItem"
ADD CONSTRAINT positive_quantity
CHECK ("quantity" > 0);

ALTER TABLE "OrderItem"
ADD CONSTRAINT positive_unit_price
CHECK ("unitPrice" > 0);

ALTER TABLE "Table"
ADD CONSTRAINT positive_capacity
CHECK ("capacity" > 0);

ALTER TABLE "Table"
ADD CONSTRAINT positive_table_number
CHECK ("tableNumber" > 0);

ALTER TABLE "Reservation"
ADD CONSTRAINT positive_guest_count
CHECK ("guestCount" > 0);