var Db = require("./dboperations");
var Order = require("./order");
const dboperations = require("./dboperations");
// To create API and to enable it
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const app = express();
var router = express.Router();

// middleware
//app.use(express.json());
//app.use(express.urlencoded({extende:false}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

//To run the port
var port = process.env.PORT || 8090;
app.listen(port);
console.log("App is runnning at port" + port);
//app.listen(port,()=>{console.log(`Server Started at port:${port}`)})
// It will return promise

// Middle ware
// It will always call before any other route is executed
router.use((request, response, next) => {
  //console.log('middleware');
  next();
});

// To Create REST API
router.route("/orders").get((request, response) => {
  dboperations.getOrders().then((result) => {
    //console.log(result);
    //response.status(200).json(result)
    response.json(result[0]);
  });
});

// This will print in terminal
dboperations.getOrders().then((result) => {
  console.log(result);
});

// router.route("/orders/:id").get((request, response) => {
//   dboperations.getOrder(request.params.id).then((result) => {
//     //console.log(result);
//     //response.status(200).json(result)
//     //response.json(result[0]);
//     //response.json(result);
//      const id = Number(request.params.id);
//     if (!id || isNaN(id)) {
//         return response.status(400).json({ error: "Invalid or missing order ID" });
//       }
//       else{
//         return response.status(200).json(result[0]);
//       }
//   });
// });
router.route("/orders/:id").get(async (request, response) => {
  const orderId = request.params.id;

  if (!orderId || isNaN(Number(orderId))) {
    return response.status(400).json({ error: "Invalid or missing order ID" });
  }

  try {
    const order = await dboperations.getOrder(orderId);

    // Check if an order was found
    if (order && order.length > 0) {
      return response.status(200).json(order[0]); // Return the first order
    } else {
      return response.status(404).json({ Msg: "Order not found" });
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});

// router.route("/orders/:id").get((request, response) => {
//   const orderId = request.params.id;

//   // Validate if the 'id' is provided and is a valid number (you can adjust this depending on your ID type)
//   if (!orderId || isNaN(Number(orderId))) {
//     return response.status(400).json({ error: "Invalid or missing order ID" });
//   }

//   // Now that we have a valid 'id', proceed with the database query
//   dboperations.getOrder(orderId).then((result) => {
//     // Check if the result contains the order
//     if (result && result.recordsets && result.recordsets.length > 0 && result.recordsets[0].length > 0) {
//       // Return the first order if it exists
//       return response.status(200).json(result.recordsets[0][0]);  // Assuming it's the first record in the first recordset
//     } else {
//       // If no order is found, send a 404 error
//       return response.status(404).json({ error: "Order not found" });
//     }
//   }).catch((error) => {
//     // Catch any errors from the database operation
//     console.error('Error fetching order:', error);
//     return response.status(500).json({ error: "Internal Server Error" });
//   });
// });

// router.route('/orders/:id').get((request, response) => {
//     const id = Number(request.params.id);  // Convert the id from the request to a number
//     if (!id || id <= 0) {
//         return response.status(400).json({ error: "Invalid or missing id" });  // Return error if id is invalid
//     }
//  // This will be return promise
//     dboperations.getOrder(id).then((result) => {
//         if (!result || result.length === 0) {
//             return response.status(404).json({ error: "Order not found" });
//         }
//         //response.json(result[0]);
//         const existingOrder = result[0];
//         if (existingOrder.id !== id) {
//             return response.status(400).json({ error: "ID mismatch between request and database" });
//         }
//         response.json(existingOrder);
//     }).catch(error => {
//         console.log(error);
//         response.status(500).json({ error: "Internal server error" });
//     });
// });

router.route("/orders").post((request, response) => {
  //destructure the coming from poatman
  let order = { ...request.body };
  dboperations.addOrder(order).then((result) => {
    // It return the inserted record from "return insertProduct.recordsets;" from dboperations.js
    //response.json(result[0]);
    // response.status(201).json(result[0]);
    response.status(201).json({
      status: "Sucess",
      id: order.id,
      title: order.title,
      quantity: order.quantity,
      message: order.message,
      city: order.city,
    });
  });
});

router.route("/orders/:id").delete(async (request, response) => {
  const orderId = request.params.id;

  if (!orderId || isNaN(Number(orderId))) {
    return response.status(400).json({ error: "Invalid or missing order ID" });
  }

  try {
    const order = await dboperations.deleteOrder(orderId);

    // Check if an order was found
    if (!order || order.length === 0) {
      response
        .status(200)
        .json({ msg: `Order with ID ${orderId} not found.` });
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/orders/:id").put(async (request, response)=>{
  const orderId = request.params.id;
  //const order = { ...request.body };
  // body whatever the request is called in postman under body->raw data
  const updatedOrder = {
    id: Number(orderId), 
    title: request.body.title,
    quantity: request.body.quantity,
    message: request.body.message,
    city: request.body.city,
  };
  if (!updatedOrder.title || !updatedOrder.quantity || !updatedOrder.message || !updatedOrder.city) {
    return response.status(400).json({ error: "Missing required order fields" });
  }
try {
 // This statement will call the updateOrder() function in dboperation.js file
  const order = await dboperations.updateOrder(updatedOrder);
    // Respond with success and updated order data
    return response.status(200).json({
      status: "Success",
      msg: `Order with ID ${orderId} has been updated`,
      title: updatedOrder.title,
      quantity:updatedOrder.quantity,
      message: updatedOrder.message,
      city:updatedOrder.city
    });
 
} catch (error) {
  console.error("Error fetching order:", error);
    return response.status(500).json({ error: "Internal Server Error" });
}
})

