var config = require("./dbconfig");
const sql = require("mssql");
const Order = require("./order");

// function to fetch order
async function getOrders() {
  try {
    // Async function
    let pool = await sql.connect(config);
    let products = pool.request().query("select * from Orders");
    return (await products).recordsets;
  } catch (error) {
    console.log(error);
  }
}
// const getOrder = async (orderId)=>{
//     try {
//         let pool =await sql.connect(config);
//         let product = pool.request().input('input_parameter',sql.Int,orderId)
//                                      .query("select * from Orders where Id =@input_parameter")
//         return (await product).recordsets;
//     } catch (error) {
//         console.log(error);
//     }
// }
const getOrder = async (orderId) => {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("input_parameter", sql.Int, orderId)
      .query("SELECT * FROM Orders WHERE Id = @input_parameter");

    // Return the first recordset (array of results)
    return product.recordsets[0];
  } catch (error) {
    console.log("Error in getOrder:", error);
    throw error; // Rethrow the error to allow the caller to handle it
  }
};

const addOrder = async (order) => {
  try {
    let pool = await sql.connect(config);
    let insertProduct = await pool
      .request()
      .input("id", sql.Int, order.id)
      .input("title", sql.NVarChar, order.title)
      .input("quantity", sql.Int, order.quantity)
      .input("message", sql.NVarChar, order.message)
      .input("city", sql.NVarChar, order.city)
      .execute("InsertOrder");
    return insertProduct.recordsets;
  } catch (error) {
    console.log(error);
  }
};
const deleteOrder = async (orderId) => {
  try {
    let pool = await sql.connect(config);
    let deleteResult = await pool
      .request()
      .input("id", sql.Int, orderId) // Passing the ID of the order to delete
      .execute("DeleteOrder"); // Stored procedure to handle deletion
    return deleteResult.recordsets; // Returning the result of the operation
  } catch (error) {
    console.log(error); // Log any errors that occur
  }
};

const updateOrder = async (order) => {
  try {
    let pool = await sql.connect(config);
    let updateProduct = await pool
      .request()
      .input("id", sql.Int, order.id)
      .input("title", sql.NVarChar, order.title)
      .input("quantity", sql.Int, order.quantity)
      .input("message", sql.NVarChar, order.message)
      .input("city", sql.NVarChar, order.city)
      .execute("UpdateOrder");
    return updateProduct.recordsets;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getOrders: getOrders,
  getOrder: getOrder,
  addOrder: addOrder,
  deleteOrder: deleteOrder,
  updateOrder: updateOrder
};
