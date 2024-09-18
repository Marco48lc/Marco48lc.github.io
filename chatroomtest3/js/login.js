let email = document.getElementById("email");
let password = document.getElementById("password");
let login = document.getElementById("loginBtn");

function init(){
    login.addEventListener("click", function(e){
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(email.value, password.value).then( ()=>{
            let user = firebase.auth().currentUser;
            if(user){
                alert("Login Success!");
                window.location.href = "./index.html";
            }
        })
        .catch((error) => {
            alert(error.message);
        });
    });
}

function loginGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var loginUser = result.user;
        let id = loginUser.email.replace('@', '-').split('.').join('_');
        let newuser = true;
        firebase.database().ref(`users`).once('value').then(async function(snapshot){
            if(snapshot.child(`${id}`).exists())
                newuser = false;
            if(newuser){
                let img = loginUser.photoURL;
                await firebase.database().ref('users/' + id).set({
                    name: loginUser.displayName,
                    img: img,
                    newAdd: [{
                        name: 'none'
                    }]
                });
                await firebase.database().ref('users/' + id + '/chatroom/All').set({
                    name: 'All',
                    img: `./img/all.png`,
                    roomId: 'All'
                });
                await firebase.database().ref('users/' + id + '/friends/group/All').set({
                    name: 'All',
                    img: `./img/all.png`,
                    roomId: 'All'
                });
                document.location.href = './index.html';
            } else{
                document.location.href = './index.html';
            }
        });
    }).catch(function(error) {
        alert(error.message);
    });
}

window.onload = function() {
    init();
};