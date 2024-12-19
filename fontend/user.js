const BASE_URL = 'http://localhost:8000'

window.onload = async () => {
    await loadData()
}

const loadData = async () => {
    console.log('on load')
    // 1. Load users ทั้งหมดออกมาจาก API
    const response = await axios.get(`${BASE_URL}/product`)
    console.log(response.data)

    // 2. นำ Users ที่โหลดมาใส่กลับเข้าไปใน HTML
    const userDOM = document.getElementById('user')
    let htmlData = '<div>'
    for (let i = 0; i < response.data.length; i++) {
        let user = response.data[i]
        htmlData += `<div>
           ID ${user.id} ชื่อสินค้า ${user.Productname} ราคา ${user.Price} จำนวนคงเหลือ ${user.Amount} วันที่ ${user.Date} เวลา ${user.Time} รหัสสินค้า ${user.Productid} จำนวนที่ขาย ${user.Sales} ชื่อ ${user.NameCustomer} เบอร์โทรศัพท์ ${user.Phone}
            <a href="index.html?id=${user.id}"><button class='edit'>Edit</button></a>
           <a> <button class='delete' data-id='${user.id}'>Delete</button> </a>
        </div>`
    }
    htmlData += '</div>'
    userDOM.innerHTML = htmlData

    const deleteDOMs = document.getElementsByClassName('delete')
    for (let i = 0; i < deleteDOMs.length; i++) {
        deleteDOMs[i].addEventListener('click', async (event) => {
            // ดึงค่า id จาก attribute ของปุ่ม delete
            const id = event.target.dataset.id
            try {
                await axios.delete(`${BASE_URL}/product/${id}`)
                loadData()
            } catch (error) {
                console.log(error)
            }
        })
    }
}
