const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const port = 8000;
//สำหรับเก็บ users
let products = []
let counter = 1;

let conn = null;

const initMYSQL = async () => {
  try {
      conn = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: 'root',
          database: 'webdb',
          port: 8700
      });
      console.log('Connected to MySQL database');
  } catch (error) {
      console.error('Failed to connect to MySQL:', error);
  }
};

const validateData = (productData) => {
  let errors = [];
  if (!productData.Productname) {
      errors.push("กรุณากรอกชื่อสินค้า");
  }
  if (!productData.Price) {
      errors.push("กรุณากรอกราคา");
  }
  if (!productData.Amount){
      errors.push("กรุณากรอกจำนวนคงเหลือ")
  }
  if (!productData.Date){
      errors.push("กรุณาเลือกวันที่")
  }
  if (!productData.Time){
      errors.push("กรุณาเลือกเวลา")
  }
  if (!productData.Productid){
      errors.push("กรุณากรอกรหัสสินค้า")
  }
  if (!productData.Sales){
      errors.push("กรุณากรอกจำนวนที่ขาย")
  }
  if (!productData.NameCustomer){
      errors.push("กรุณากรอกชื่อลูกค้า")
  }
  if (!productData.Address){
      errors.push("กรุณากรอกที่อยู่")
  }
  if (!productData.Phone){
     errors.push("กรุณากรอกเบอร์โทรศัพท์")
  }
  return errors;
}



//path = GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา

app.get('/product', async (req, res) => {
  try {
      const results = await conn.query('SELECT * FROM product');
      res.json(results[0]);
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Something went wrong' });
  }
});



//path = post /user
//2.	POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/product', async (req, res) => {
  try {
      const product = req.body;
      const errors = validateData(product);
      if (errors.length > 0) {
          throw { message: "กรอกข้อมูลไม่ครบถ้วน", errors: errors };
      }
      const results = await conn.query("INSERT INTO product SET ?", product);
      res.json({
          message: "Create new product successfully",
          data: results[0]
      });
  } catch (error) {
      console.error('Error creating product:', error);
      const errorMessage = error.message || 'Something went wrong';
      const errors = error.errors || [];
      res.status(500).json({ message: errorMessage, errors: errors });
  }
});


//path = GET /users/:id สำหรับการดึง users รายคนออกมา

app.get('/product/:id',async (req,res) => {
  try {
    let id = req.params.id;
    const results = await conn.query('SELECT * FROM product WHERE id = ?',id);
   
    if (results[0].length == 0){
      throw {statusCode : 404, message : 'product not found'}
    } 
    res.json(results[0][0])

  }catch(error){
    console.log('errorMessage', error.message);
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({
      message: 'somthing went wrong',
      errorMessge: error.message
    })
  }
})

//path = PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/product/:id',async (req, res) => {
  
  try{
    let id = req.params.id;
    let updateproduct = req.body;
    
  const results = await conn.query(
    "UPDATE product SET ? WHERE id = ?",
    [updateproduct,id])
  res.json({
    message: "Update product successfully",
    data : results[0]
  })
  }catch(error){
    console.log('errorMessage',error.message);
    res.status(500).json({
      message: 'somthing went wrong',
    })
  }

})
  //return user ที่ update แล้ว

  //DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
  app.delete('/product/:id', async (req, res) => {
    try {
      let id = req.params.id;
      const results = await conn.query('DELETE FROM product WHERE id = ?', id)
      res.json({
        message: 'Delete user successfully',
        data:results[0]
      })
    } catch (error) {
      console.log('errorMessage', error.message)
      res.status(500).json({
        message: 'something went wrong'
      })
    }
  })


  app.listen(port, async () => {
    await initMYSQL();
    console.log('HTTP server running on port', port);
});
