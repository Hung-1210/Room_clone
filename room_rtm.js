// Xử lý khi một thành viên mới tham gia phòng
let handleMemberJoined = async (MemberId) => {
    console.log('A new member has joined the room:', MemberId)
    addMemberToDom(MemberId) // Thêm thành viên vào giao diện

    let members = await channel.getMembers() // Lấy danh sách thành viên
    updateMemberTotal(members) // Cập nhật tổng số thành viên

    // Lấy tên của thành viên và thêm tin nhắn chào mừng
    let {name} = await rtmClient.getUserAttributesByKeys(MemberId, ['name'])
    addBotMessageToDom(`Welcome to the room ${name}! 👋`)
}
// Thêm thành viên mới vào danh sách trên giao diện
let addMemberToDom = async (MemberId) => {
    let {name} = await rtmClient.getUserAttributesByKeys(MemberId, ['name'])

    let membersWrapper = document.getElementById('member__list')
    let memberItem = `<div class="member__wrapper" id="member__${MemberId}__wrapper">
                        <span class="green__icon"></span>
                        <p class="member_name">${name}</p>
                    </div>`

    membersWrapper.insertAdjacentHTML('beforeend', memberItem) // Thêm HTML của thành viên vào DOM
}
// Cập nhật tổng số thành viên trong phòng
let updateMemberTotal = async (members) => {
    let total = document.getElementById('members__count')
    total.innerText = members.length 
}
 
// Xử lý khi một thành viên rời phòng
let handleMemberLeft = async (MemberId) => {
    removeMemberFromDom(MemberId) // Xóa thành viên khỏi giao diện

    let members = await channel.getMembers() // Lấy lại danh sách thành viên
    updateMemberTotal(members) // Cập nhật tổng số thành viên

}

// Xóa thành viên khỏi danh sách trên giao diện
let removeMemberFromDom = async (MemberId) => {
    let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`)
    let name = memberWrapper.getElementsByClassName('member_name')[0].textContent
    addBotMessageToDom(`${name} has left the room.`) // Thông báo thành viên đã rời đi
         
    memberWrapper.remove() // Xóa thành viên khỏi DOM
}

// Lấy và hiển thị danh sách thành viên
let getMembers = async () => {
    let members = await channel.getMembers() // Lấy danh sách thành viên
    updateMemberTotal(members) // Cập nhật số lượng thành viên
    for (let i = 0; members.length > i; i++){
        addMemberToDom(members[i]) // Thêm từng thành viên vào giao diện
    }
}

// Xử lý khi nhận được tin nhắn từ thành viên khác
let handleChannelMessage = async (messageData, MemberId) => {
    console.log('A new message was received')
    let data = JSON.parse(messageData.text)

    if(data.type === 'chat'){
        addMessageToDom(data.displayName, data.message) // Hiển thị tin nhắn lên giao diện
    }

    if(data.type === 'user_left'){
        // Xóa khung video khi thành viên rời phòng
        document.getElementById(`user-container-${data.uid}`).remove()

        if(userIdInDisplayFrame === `user-container-${uid}`){
            displayFrame.style.display = null // Ẩn khung video chính
    
            // Đặt lại kích thước các khung video
            for(let i = 0; videoFrames.length > i; i++){
                videoFrames[i].style.height = '300px'
                videoFrames[i].style.width = '300px'
            }
        }
    }
}
// Gửi tin nhắn chat
let sendMessage = async (e) => {
    e.preventDefault()

    let message = e.target.message.value // Lấy nội dung tin nhắn
    channel.sendMessage({text:JSON.stringify({'type':'chat', 'message':message, 'displayName':displayName})}) // Gửi tin nhắn
    addMessageToDom(displayName, message) // Hiển thị tin nhắn của người gửi lên giao diện
    e.target.reset() // Xóa nội dung tin nhắn khỏi input sau khi gửi
}

// Thêm tin nhắn của thành viên lên giao diện
let addMessageToDom = (name, message) => {
    let messagesWrapper = document.getElementById('messages')

    let newMessage = `<div class="message__wrapper">
                        <div class="message__body">
                            <strong class="message__author">${name}</strong>
                            <p class="message__text">${message}</p>
                        </div>
                    </div>`

    messagesWrapper.insertAdjacentHTML('beforeend', newMessage) // Thêm tin nhắn vào DOM

    let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
    if(lastMessage){
        lastMessage.scrollIntoView() // Cuộn xuống tin nhắn cuối cùng
    }
}

// Thêm tin nhắn từ bot lên giao diện
let addBotMessageToDom = (botMessage) => {
    let messagesWrapper = document.getElementById('messages')

    let newMessage = `<div class="message__wrapper">
                        <div class="message__body__bot">
                            <strong class="message__author__bot">🤖 Mumble Bot</strong>
                            <p class="message__text__bot">${botMessage}</p>
                        </div>
                    </div>`

    messagesWrapper.insertAdjacentHTML('beforeend', newMessage) // Thêm tin nhắn bot vào DOM

    let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
    if(lastMessage){
        lastMessage.scrollIntoView() // Cuộn xuống tin nhắn cuối cùng
    }
}

// Thoát khỏi kênh khi rời phòng
let leaveChannel = async () => {
    await channel.leave() // Rời kênh
    await rtmClient.logout() // Đăng xuất khỏi RTM client
}
// Rời kênh khi đóng trang
window.addEventListener('beforeunload', leaveChannel)
// Gửi tin nhắn khi người dùng submit form
let messageForm = document.getElementById('message__form')
messageForm.addEventListener('submit', sendMessage)