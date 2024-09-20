// Lấy phần tử chứa tin nhắn và cuộn xuống cuối cùng (hiển thị tin nhắn mới nhất)
let messagesContainer = document.getElementById('messages');
messagesContainer.scrollTop = messagesContainer.scrollHeight;
// Lấy các phần tử giao diện của danh sách thành viên và nút bật/tắt
const memberContainer = document.getElementById('members__container');
const memberButton = document.getElementById('members__button');

// Lấy các phần tử giao diện của cửa sổ chat và nút bật/tắt
const chatContainer = document.getElementById('messages__container');
const chatButton = document.getElementById('chat__button');

// Biến trạng thái hiển thị danh sách thành viên
let activeMemberContainer = false;


// Bắt sự kiện click để hiển thị/ẩn danh sách thành viên
memberButton.addEventListener('click', () => {
  if (activeMemberContainer) {
    memberContainer.style.display = 'none'; // Ẩn danh sách thành viên
  } else {
    memberContainer.style.display = 'block'; // Đổi trạng thái
  }

  activeMemberContainer = !activeMemberContainer;
});

// Biến trạng thái hiển thị cửa sổ chat
let activeChatContainer = false;

// Bắt sự kiện click để hiển thị/ẩn cửa sổ chat
chatButton.addEventListener('click', () => {
  if (activeChatContainer) {
    chatContainer.style.display = 'none';
  } else {
    chatContainer.style.display = 'block';
  }

  activeChatContainer = !activeChatContainer;
});

// Lấy phần tử để hiển thị video chính và các khung video khác
let displayFrame = document.getElementById('stream__box')
let videoFrames = document.getElementsByClassName('video__container')
let userIdInDisplayFrame = null;

// Hàm mở rộng khung video khi được click
let expandVideoFrame = (e) => {

  let child = displayFrame.children[0]
  if(child){
     // Đưa khung video cũ trở về container ban đầu
      document.getElementById('streams__container').appendChild(child)
  }

 // Hiển thị khung video mới
  displayFrame.style.display = 'block'
  displayFrame.appendChild(e.currentTarget)
  userIdInDisplayFrame = e.currentTarget.id

// Thu nhỏ các khung video khác
  for(let i = 0; videoFrames.length > i; i++){
    if(videoFrames[i].id != userIdInDisplayFrame){
      videoFrames[i].style.height = '100px'
      videoFrames[i].style.width = '100px'
    }
  }

}

// Bắt sự kiện click cho tất cả khung video
for(let i = 0; videoFrames.length > i; i++){
  videoFrames[i].addEventListener('click', expandVideoFrame)
}


// Hàm ẩn khung video chính
let hideDisplayFrame = () => {
    userIdInDisplayFrame = null 
    displayFrame.style.display = null // Ẩn khung video chính

    let child = displayFrame.children[0]
    document.getElementById('streams__container').appendChild(child) // Đưa khung video trở lại

        // Khôi phục kích thước của tất cả khung video về kích thước ban đầu
    for(let i = 0; videoFrames.length > i; i++){
      videoFrames[i].style.height = '300px'
      videoFrames[i].style.width = '300px'
  }
}

displayFrame.addEventListener('click', hideDisplayFrame)