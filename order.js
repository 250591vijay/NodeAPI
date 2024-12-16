class Order {
    constructor(id, title,quantity,message, city){
        this.id = id;
        this.title =title;
        this.quantity= quantity;
        this.message = message;
        this.city =city;
    }
}
module.exports = Order;