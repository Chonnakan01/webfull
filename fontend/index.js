const BASE_URL = 'http://localhost:8000'
let mode = 'CREATE'
let selectedId = '' 

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')
  console.log('id', id)
  if (id) {
    mode = 'EDIT'
    selectedId = id

    try {
      const response = await axios.get(`${BASE_URL}/product/${id}`)
      const product = response.data
      console.log(response.data)

let ProductnameDOM = document.querySelector('input[name=Productname]')
let PriceDOM = document.querySelector('input[name=Price]')
let AmountDOM = document.querySelector('input[name=Amount]')
let DateDOM = document.querySelector('input[name=Date]')
let TimeDOM = document.querySelector('input[name=Time]')
let ProductidDOM = document.querySelector('input[name=Productid]')
let SalesDOM = document.querySelector('input[name=Sales]')
let NameCustomerDOM = document.querySelector('input[name=NameCustomer]')
let AddressDOM = document.querySelector('textarea[name=Address]')
let PhoneDOM = document.querySelector('input[name=Phone]')




ProductnameDOM.value = product.Productname
PriceDOM.value = product.Price
AmountDOM.value = product.Amount
DateDOM.value = product.Date
TimeDOM.value = product.Time
ProductidDOM.value = product.Productid
SalesDOM.value = product.Sales
NameCustomerDOM.value = product.NameCustomer
AddressDOM.value = product.Address
PhoneDOM.value = product.Phone


    } catch (error) {
      console.log('error', error)
    }
  }
}
const validateData = (productData) => {
  let errors = []
  if (!productData.Productname){
      errors.push("กรุณากรอกชื่อสินค้า")
  }
  if (!productData.Price){
      errors.push("กรุณากรอกราคา")
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
  return errors
}

const submitData = async () => {
  let ProductnameDOM = document.querySelector('input[name=Productname]')
  let PriceDOM = document.querySelector('input[name=Price]')
  let AmountDOM = document.querySelector('input[name=Amount]')
  let DateDOM = document.querySelector('input[name=Date]');
  let TimeDOM = document.querySelector('input[name=Time]')
  let ProductidDOM = document.querySelector('input[name=Productid]')
  let SalesDOM = document.querySelector('input[name=Sales]')
  let NameCustomerDOM = document.querySelector('input[name=NameCustomer]')
  let AddressDOM = document.querySelector('textarea[name=Address]')
  let PhoneDOM = document.querySelector('input[name=Phone]')

  let messageDOM = document.getElementById('message')

  try {
    let productData = {
  Productname: ProductnameDOM ? ProductnameDOM.value : '',
  Price: PriceDOM ? PriceDOM.value : '',
  Amount: AmountDOM ? AmountDOM.value : '',
  Date: DateDOM ? DateDOM.value : '',
  Time: TimeDOM ? TimeDOM.value : '',
  Productid: ProductidDOM ? ProductidDOM.value : '',
  Sales: SalesDOM ? SalesDOM.value : '',
  NameCustomer: NameCustomerDOM ? NameCustomerDOM.value : '',
  Address: AddressDOM ? AddressDOM.value : '',
  Phone: PhoneDOM ? PhoneDOM.value : ''
}

    const errors = validateData(productData)

    if (errors.length > 0) {
      throw {
        message: 'กรอกข้อมูลไม่ครบ!',
        errors: errors
      }
    }

    let message = 'บันทึกข้อมูลสำเร็จ!'

    if(mode == 'CREATE'){
      await axios.post(`${BASE_URL}/product`, productData)
      
      TimeDOM.type = 'time'
    } else {
      await axios.put(`${BASE_URL}/product/${selectedId}`, productData)
      message = 'แก้ไขข้อมูลสำเร็จ!'
    }

    messageDOM.innerText = message
    messageDOM.className = 'message success'

  } catch (error) {
    console.log('error message', error.message)
    console.log('error', error.errors)
    let errorMessage = error.message || 'เกิดข้อผิดพลาด!'
    let errors = error.errors || []

    if (error.response) {
      errorMessage = error.response.data.message
      errors = error.response.data.errors
    }

    let htmlData = '<div>'
    htmlData += `<div>${errorMessage}</div>`
    if (errors.length > 0) {
      htmlData += '<ul>'
      errors.forEach(error => {
        htmlData += `<li>${error}</li>`
      })
      htmlData += '</ul>'
    }
    htmlData += '<div>'

    messageDOM.innerHTML = htmlData
    messageDOM.className = 'message danger'
  }
}

