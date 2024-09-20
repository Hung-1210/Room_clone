// Lấy phần tử form từ DOM
let form = document.getElementById('lobby__form')
// Lấy tên người dùng đã lưu trong sessionStorage (nếu có)
let displayName = sessionStorage.getItem('display_name')
if(displayName){
    form.name.value = displayName
}
// Bắt sự kiện submit khi người dùng nhấn nút submit
form.addEventListener('submit', (e) => {
    e.preventDefault()
// Lưu tên người dùng vào sessionStorage
    sessionStorage.setItem('display_name', e.target.name.value)
 // Lấy mã phòng từ form (nếu không có, tạo mã phòng ngẫu nhiên)
    let inviteCode = e.target.room.value
    if(!inviteCode){
        inviteCode = String(Math.floor(Math.random() * 10000))
    }

    // Chuyển hướng người dùng đến trang room.html với mã phòng
    window.location = `room.html?room=${inviteCode}`
})