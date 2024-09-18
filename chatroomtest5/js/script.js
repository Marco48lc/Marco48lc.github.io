const input_msg = document.getElementById("input_msg");
const msgDiv = document.querySelector(".msg");

setInterval(() => {
    fetch("readMsg.php").then((req)=>{
        if(req.ok){
            return req.text();
        }
    }).then((data)=>{
        msgDiv.innerHTML = data;
    })
  }, 500);



window.onkeydown= (e) => {
    if(e.key == "Enter"){
        update();
    }
}
function update(){
    let message = input_msg.value;
    input_msg.value = "";
    fetch(`addMsg.php?message=${message}`).then((req)=>{
        if(req.ok){
            return req.text();
        }
    }).then((data)=>{
        console.log("msg has been added");    
        msgDiv.scrollTop = msgDiv.scrollHeight - msgDiv.clientHeight;    
    });
}