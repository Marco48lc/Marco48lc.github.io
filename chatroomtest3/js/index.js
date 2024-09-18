const $ = (element) => {return document.querySelector(element)}

let Users, DB_chats, Users_now, Users_chatRoom;
let NowRoomName = 'All';
let NowRoomId = 'All';
let ToolNum = 0;

let Tool = document.querySelectorAll('.tool-item');
let member = $('.modal-body');
let groups = $('.group');
let friends = $('.friend');
let list = $('.list');
let chatlist = $('.chatlist');
let chat = $('.chat');
let search = $('#search-input');
let addFriend = $('.add-friends');
let addalert = $('#snackbar');
let alerts = $('.alert-item');
let talk = $('.talk');
let talkInput = $('.talk-input');
let menu = $('.dropdown-menu');
//current user's ID, Name, Img url
let ID, Name, Img;

//put message into Database
function MsgInDB(){
  let inputMsg = $('#inputMsg');
  let send = $('.send');
  let sendH = $('.sendheart');
  inputMsg.addEventListener('keydown', e => {
  e.repeat = false;
  if (e.keyCode == 13) {
      let msg = inputMsg.value;
      msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;");
      if (msg != '') {
        let time = getTime();
        DB_chats.child(NowRoomName + '/context').push({
            name: ID,
            img: Img,
            msg,
            time
        });
        inputMsg.value = '';
      }
  }
  })
  send.addEventListener('click', e => {
    let msg = inputMsg.value;
    msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;");
    if (msg != '') {
      let time = getTime();
      DB_chats.child(NowRoomName + '/context').push({
          name: ID,
          img: Img,
          msg,
          time
      });
      inputMsg.value = '';
    }
  })
  sendH.addEventListener('click', e => {
    generateHeart(e.clientX-50, e.clientY-50, 1);
    let time = getTime();
    DB_chats.child(NowRoomName + '/context').push({
        name: ID,
        img: Img,
        msg: '/////////////heartheart//////////',
        time
    });
  })
}
//start chating
function ChatTrigger(friendName, friendImg, friendId){
  activeTool(1);
  let newChat = true, isGroup = false;
  if(friendName === friendId){
    isGroup = true;
    newChat = false;
  }
  let roomname = [ID, friendId].sort().join('');
  let classId;
  Users_now.child(`chatroom`).once('value', snapshot => {
    snapshot.forEach(element => {
      if(isGroup && element.val().name === friendName){
        classId = element.val().roomId;
      }
      if(newChat && roomname === element.key){
        newChat = false;
        classId = element.val().roomId;
      }
    })
    /*Add room to chatroom & push room to each user*/
    if(newChat){
      let time = getTime();
      classId = makeid();
      DB_chats.child(roomname + '/context').push({
        name: 'none',
        img: 'start.png',
        msg: '',
        time
      });
      Users_now.child(`chatroom/` + roomname).set({
        img: friendImg,
        name: friendName,
        roomId: classId
      });
      Users.child(friendId+`/chatroom/`+roomname).set({
        img: Img,
        name: Name,
        roomId: classId
      });
    }
  }).then( ()=>{
    ClassToggle(null, $(`.${NowRoomId}`), 'active');
    if(friendName !== friendId)
      NowRoomName = roomname;
    else
      NowRoomName = friendName;
    NowRoomId = classId;
    ClassToggle($(`.${NowRoomId}`), null, 'active');
    Chating();
  });
}
//room active
function ChangeRoom(roomName, roomId){
  if(NowRoomName === roomName)
    return;
  ClassToggle($(`.${roomId}`), $(`.${NowRoomId}`), 'active');
  NowRoomName = roomName;
  NowRoomId = roomId;
  Chating();
}
//real-time Database showup
function Chating(){
  let postsRef = DB_chats.child(NowRoomName + '/context');
  let total_post = [];
  let first_count = 0;
  let second_count = 0;
  let post='';

  postsRef.once('value').then(snapshot => {
    let record = NowRoomName;
    snapshot.forEach(element => {
        let {name, img, msg, time} = element.val();
        let who='';
        if(name == ID) who = 'msg-send';
        else who = 'msg-friend-send';
        first_count += 1;

        if(name === 'none'){
          post = `
            <div class="dir-row start-top">
              <div class="start-time">${time}</div>
              <div>Start Chating ~</div>
            </div> 
        `;
        } else if(name === 'start'){
          post = `
            <div class="dir-row start-top">
              <img src="${img}">
              <div class="message">${msg}</div>
              <div class="start-time">${time}</div>
            </div> 
        `;
        } else if(msg === '/////////////heartheart//////////'){
          post = `
            <div class="dir-row ${who} chat-img">
              <img src="${img}">
              <img src="./img/heart.png" style="border-radius: 0">
              <div class="msg-time">${time}</div>
            </div> 
        `;
        } else{
          post = `
            <div class="dir-row ${who} chat-img">
              <img src="${img}">
              <div class="message">${msg}</div>
              <div class="msg-time">${time}</div>
            </div> 
          `;
        }
        total_post.push(post);
    });
    talk.innerHTML = total_post.join('');
    talk.scrollTop = talk.scrollHeight - talk.clientHeight;

    /// Add listener to update new post
    //postsRef.off();
    
    postsRef.on('child_added', data => {
        second_count += 1;
        if (second_count > first_count) {
          //console.log(record);
          let {name, img, msg, time} = data.val();
          let who='';
          if(name == ID) who = 'msg-send';
          else who = 'msg-friend-send';

          if(msg === '/////////////heartheart//////////'){
            post = `
              <div class="dir-row ${who} chat-img">
                <img src="${img}">
                <img src="./img/heart.png" style="border-radius: 0">
                <div class="msg-time">${time}</div>
              </div> 
          `;
          } else{
            post = `
            <div class="dir-row ${who} chat-img">
              <img class="chatimg" src="${img}">
              <div class="message">${msg}</div>
              <div class="msg-time">${time}</div>
            </div> 
          `;
          }
          total_post[total_post.length] = post;
          if(record === NowRoomName){
            talk.innerHTML = total_post.join('');
            talk.scrollTop = talk.scrollHeight - talk.clientHeight;
          }
        }
    });
  })
  .catch(error => console.log(error.message));
}
//choose group member and trigger
function ChooseMem(){
  $('.create').addEventListener('click', () => {
    let GroupName = document.getElementById("name").value;
    let id = document.getElementsByName('member');
    let value = [];

    if(GroupName === ''){
      alerts.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show">
        <strong>Warning!</strong> Name is required!
      </div>
      `;
      $('#AlertBtn').click();
      return
    }
    for(let i = 0; i < id.length; i+=1){
      if(id[i].checked)
        value.push(id[i].value);
    }
    if(value.length < 2){
      alerts.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show">
        <strong>Warning!</strong> Group must be more than 2 members!
      </div>
      `;
      $('#AlertBtn').click();
      return
    }
    value.push(ID);
    CreateGroup(value, [], GroupName);
  })
}
function CreateGroup(IdList, NameList, GroupName){
  let classId = makeid();

  activeTool(1);
  IdList.forEach(element => {
    Users.child(element + `/friends/group/` + GroupName).set({
      img: './img/all.png',
      name: GroupName,
      roomId: classId
    })
    Users.child(element + `/chatroom/` + GroupName).set({
      img: './img/all.png',
      name: GroupName,
      roomId: classId
    })
  })
  let time = getTime();
  DB_chats.child(GroupName).set({
    roomId: classId,
    img: './img/start.png',
    context:[{
      name: 'start',
      img: './img/start.png',
      msg: `Start Chating at ${GroupName}!`,
      time
    }]
  });
  ClassToggle($(`.${classId}`), $(`.${NowRoomId}`), 'active');
  NowRoomName = GroupName;
  NowRoomId = classId;
  Chating();
}
//check if New then add to Database
function CheckFriend(friendName, friendImg, friendId) {
  Users_now.child(`friends/friend`).once('value').then(snapshot => {
    let newFriend = true;
    if(snapshot.child(`${friendId}`).exists())
      newFriend = false;

    if (newFriend) {
      Users_now.child(`friends/friend/` + friendId).set({
        name: friendName,
        img: friendImg
      });
      Users.child(friendId + `/friends/friend/` + ID).set({
        name: Name,
        img: Img
      });
      Users.child(friendId + '/newAdd').push({
        name: Name
      })
      alerts.innerHTML = `
      <div class="alert alert-success alert-dismissible fade show">
        <strong>Success!</strong> Join Success!
      </div>
      `;
      $('#AlertBtn').click();
    } else {
      alerts.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show">
        <strong>Warning!</strong> Added Before.
      </div>
      `;
      $('#AlertBtn').click();
    }
  })
}
function CheckRoom(GroupName, GroupImg, GroupId) {
  Users_now.child(`friends/group`).once('value').then(snapshot => {
    let newGroup = true;
    if(snapshot.child(`${GroupName}`).exists())
      newGroup = false;

    if (newGroup) {
      Users_now.child(`friends/group/` + GroupName).set({
        name: GroupName,
        img: GroupImg,
        roomId: GroupId
      });
      Users_now.child(`chatroom/` + GroupName).set({
        name: GroupName,
        img: GroupImg,
        roomId: GroupId
      });
      alerts.innerHTML = `
      <div class="alert alert-success alert-dismissible fade show">
        <strong>Success!</strong> Join Success!
      </div>
      `;
      $('#AlertBtn').click();
    } else {
      alerts.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show">
        <strong>Warning!</strong> Join Already.
      </div>
      `;
      $('#AlertBtn').click();
    }
  })
}
//New Friend alert
function NewFriend(){
  let list = [];
  let first_count = 0;
  let second_count = 0;
  Users_now.child('newAdd').once('value').then(snapshot => {
    snapshot.forEach(element => {
      first_count += 1;
      let name = element.val().name;
      if(name != "none"){
        list.push(name);
        Users_now.child(`newAdd/${element.key}`).remove();
      }
    })
    if(list.length != 0){
      addalert.innerHTML = `${list} add you as friend ~`;
      addalert.className = "show";
      setTimeout(function(){ 
        addalert.className = addalert.className.replace("show", ""); 
      }, 2500);
      //alert(`${list} add you as friend ~`);
      list = [];
    }

    Users_now.child('newAdd').on('child_added', element => {
      second_count += 1;
      if (second_count > first_count) {
        let name = element.val().name;
        if(name != "none"){
          list.push(name);
          Users_now.child(`newAdd/${element.key}`).remove();
        }
        if(list.length != 0){
          addalert.innerHTML = `${list} add you as friend ~`;
          addalert.className = "show";
          setTimeout(function(){ 
            addalert.className = addalert.className.replace("show", ""); 
          }, 2500);
          //alert(`${list} add you as friend ~`);
          list = [];
        }
      }
    })
  })
}
//Search result show
function Search() {
  search.addEventListener('change', async function(e){
    let serin = e.target.value;
    if(serin === '')
      return;
    let f = '', g = '';
    let info = `<div class="title"><span>Result</span></div>`;
    let r = await Promise.all([SearchFriend(serin), SearchGroup(serin)]);
    f = r[0];
    g = r[1];
    $('.result').innerHTML = info + f + g;
  })
}
//friend and group list
function initList() {
  Users_now.child(`friends/friend`).on('value', snapshot => {
    let list = '<div class="info">Friends</div>';
    let check = '';
    snapshot.forEach(element => {
      let {name, img} = element.val();
      list += `
        <div class="item">
          <div class="friend-img">
            <img src="${img}" alt="">
          </div>
          <div>${name}</div>
          <div class="chat-trigger" onclick="ChatTrigger('${name}', '${img}', '${element.key}')">
            <i class="material-icons" title="Chat">&#xe0d8;</i>
          </div>
        </div>
      `;

      check += `
      <label>
        <input type="checkbox" name="member" value="${element.key}">
        <span>${name}</span>
      </label><br>
      `
    })
    friends.innerHTML = list;
    member.innerHTML = check;
  });

  Users_now.child(`friends/group`).on('value', snapshot => {
    let list = `
    <div class="info">
      <span>Groups&nbsp&nbsp</span>
      <button type="button" class="btn btn-primary choose" data-toggle="modal" data-target="#myModal">
    Click To Add
      </button>
    </div>`;
    snapshot.forEach(element => {
      let {name, img} = element.val();
      list += `
        <div class="item">
          <div class="friend-img">
            <img src="${img}" alt="">
          </div>
          <div>${name}</div>
          <div class="chat-trigger" onclick="ChatTrigger('${name}', '${img}', '${name}')">
            <i class="material-icons" title="Chat">&#xe0d8;</i>
          </div>
        </div>
      `;
    })
    groups.innerHTML = list;
  });
}
//chating beside list
function initChat(){
  Users_now.child(`chatroom`).on('value', snapshot => {
    let items = '';
    snapshot.forEach(element => {
      let {name, img, roomId} = element.val();
      items += `
        <div class="chatbar dir-row center ${roomId}" onclick="ChangeRoom('${element.key}', '${roomId}')">
          <div class="chatimg">
            <img src="${img}">
          </div>
          <div>${name}</div>
        </div>
      `;
    })
    chatlist.innerHTML = items;
  });
}

function notification(){
  let notify, notiRoom;
  var notifyConfig = {
    body: '\\ ^o^ /', //msg // get from golbal chatroom
    icon: './img/start.png', //sent person //get from user chatroom
    //tag: //roomId //get from user chatroom
  };
  Users_chatRoom.on('child_added', room =>{
    notiRoom = DB_chats.child(room.key + '/context');
    notiRoom.on('child_added', data =>{
      let time = data.val().time;
      let name = data.val().name;
      //console.log(name)
      if (time === getTime() && name != ID && name !== 'none'){
        let msg = data.val().msg;
        if(msg === '/////////////heartheart//////////')
          msg = 'love~';
        notifyConfig = {
          body: msg,
          icon: data.val().img,
          tag: room.val().roomId
        }
        notify = new Notification(`${room.val().name}`, notifyConfig);
        setTimeout(notify.close.bind(notify), 5000);
        //click to trigger message
        notify.onclick = function(e) {
          e.preventDefault();
          let friendId = room.key.replace(`${ID}`, '');
          ChatTrigger(room.val().name, room.val().img, friendId);
        }
      }
    })
  })
}

window.onload = function(){
  firebase.auth().onAuthStateChanged(user => {
    console.log(Notification.permission);
    if (Notification && Notification.permission !== "granted") {
      Notification.requestPermission(function (status) {
        if (Notification.permission !== status) {
          Notification.permission = status;
        }
      });
    }
    if (!user)
      activeTool(-1);
    else{
      ID = user.email.replace('@', '-').split('.').join('_');
      Users = firebase.database().ref(`users`);
      Users_now = firebase.database().ref(`users/${ID}`);
      DB_chats = firebase.database().ref(`chatroom`);
      Users_chatRoom = firebase.database().ref(`users/${ID}/chatroom`);

      Users_now.once('value', snapshot => {
        Name = snapshot.val().name;
        Img = snapshot.val().img;
      })
  
      initLog(user);
      initTool();
      initList();
      initChat();
      Chating();
      Search();
      NewFriend();
      ChooseMem();
      MsgInDB();
      notification();
      frame();
    }
  });
}
//init toolbar
function initTool(){
  Tool[0].addEventListener('click', () => {
    if (ToolNum !== 0) {
      activeTool(0);
    }
  });
  Tool[1].addEventListener('click', () => {
    if (ToolNum !== 1) {
      activeTool(1);
      Chating();
    }
  });
  Tool[2].addEventListener('click', () => {
    if (ToolNum !== 2) {
      activeTool(2);
    }
  });
}

function getTime() {
  let date = new Date();
  let n = date.getMonth() + 1;
  let d = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  if (h < 10)  h = '0' + h;
  if (m < 10)  m = '0' + m;
  let now = n + '/' + d + ' ' + h + ':' + m;
  return now;
}
//classID for active
function makeid(){
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for (var i = 0; i < 10; i++) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function ClassToggle(add, remove, Class) {
  if(remove)
    remove.classList.remove(Class);
  if(add)
    add.classList.add(Class);
}
function activeTool(index){
  //none login
  if(index === -1){
    [chat, list, addFriend, talk, talkInput].forEach(c => c.classList.add('hidden'));
    return;
  }

  for(var i=0; i<3; i+=1){
    if(i === index)
      Tool[i].classList.add('active');
    else
      Tool[i].classList.remove('active');
  }
  //show chatlist
  if(index === 0){
    [chat, addFriend, talk, talkInput].forEach(c => c.classList.add('hidden'));
    [list].forEach(c => c.classList.remove('hidden'));
    ClassToggle(null, chat, 'dir-row');
    ToolNum = 0;
  }
  //show chatroom
  else if(index === 1){
    [list, addFriend].forEach(c => c.classList.add('hidden'));
    [chat, talk, talkInput].forEach(c => c.classList.remove('hidden'));
    ClassToggle(chat, null, 'dir-row');
    ToolNum = 1;
  }
  //show serch
  else if(index === 2){
    [list, chat, talk, talkInput].forEach(c => c.classList.add('hidden'));
    [addFriend].forEach(c => c.classList.remove('hidden'));
    ClassToggle(null, chat, 'dir-row');
    ToolNum = 2;
  }
}
//init logout and account
function initLog(user){
  menu.innerHTML = `
    <span class='dropdown-item'> ${user.email} </span>
    <span class='dropdown-item' id='logout-btn'>
      <div class="dir-row">
        <i class="material-icons">&#xe879;</i>
        <span>Logout</span>
      </div>
    </span>`;
  $('#logout-btn').addEventListener('click', () => {
      firebase.auth().signOut().then( ()=>{
        alerts.innerHTML = `
          <div class="alert alert-success alert-dismissible fade show">
            <strong>Success!</strong> Logout Success!
          </div>
        `;
        $('#AlertBtn').click();
        window.location.reload();
      })
      .catch((error)=>{
          alert(error.message);
      });
  });
}

function SearchFriend(serin){
  let f = '';
  return new Promise((resolve, reject) => {
    Users.once('value').then(snapshot => {
      snapshot.forEach(element => {
        let {name, img} = element.val();
        if (element.key === ID) return;
        if (name.toLowerCase().includes(serin.toLowerCase())) {
          f += `
            <div class="item">
              <div class="item-img">
                <img src="${img}" alt="">
              </div>
              <div class="item-msg">${name}</div>
              <button class="add-btn dir-row" onclick="CheckFriend('${name}', '${img}', '${element.key}')">
                <i class="material-icons">&#xe7fe;</i>
                Add Friend
              </button>
            </div>          
          `;
        }
      });
      resolve(f);
    });
  })
}
function SearchGroup(serin){
  let g = '';
  return new Promise((resolve, reject) => {
    DB_chats.once('value').then(snapshot => {
      snapshot.forEach(element => {
        let name = element.key;
        if(!element.child(`img`).exists())
          return;
        let img = element.val().img;
        let id = element.val().roomId;
        if (name.toLowerCase().includes(serin.toLowerCase())) {
          g += `
            <div class="item">
              <div class="item-img">
                <img src="${img}" alt="">
              </div>
              <div class="item-msg">${name}</div>
              <button class="add-btn dir-row" onclick="CheckRoom('${name}', '${img}', '${id}')">
                <i class="material-icons">&#xe7f0;</i>
                Join Group
              </button>
            </div>          
          `;
        }
      });
      resolve(g);
    })
  })
}

//heart animation
let brd = document.createElement("DIV");
document.body.insertBefore(brd, document.getElementById("board"));
const duration = 3000;
const speed = 0.5;
let hearts = [];
function generateHeart(x, y, scale){
  let heart = document.createElement("DIV");
  heart.setAttribute('class', 'heart');
  brd.appendChild(heart);
  heart.time = duration;
  heart.x = x;
  heart.y = y;
  heart.style.left = heart.x + "px";
  heart.style.top = heart.y + "px";
  heart.scale = scale;
  heart.style.transform = "scale(" + scale + "," + scale + ")";
  if(hearts == null)
    hearts = [];
  hearts.push(heart);
}
let before = Date.now();
let id = setInterval(frame, 5);
function frame(){
  let current = Date.now();
  let deltaTime = current - before;
  before = current;
  for(i in hearts){
    let heart = hearts[i];
    heart.time -= deltaTime;
    if(heart.time > 0){
      heart.y -= speed;
      heart.style.top = heart.y + "px";
      heart.style.left = heart.x + "px";
    }
    else{
      heart.parentNode.removeChild(heart);
      hearts.splice(i, 1);
    }
   }
}