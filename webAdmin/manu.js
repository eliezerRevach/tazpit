// var db;

// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics


// Add the Firebase products that you want to use

let SCENARIO='Scenarios';
let FILLED="filled";
let ACCEPTED='accepted';
function refreshListOfS() {
    $("#ListOfS").remove();
    $("#data").html(ListEvent());
    ListEventFun();

}
async function getTextFrom(from, userDoc) {
    console.log(userDoc.id);
    var docRef = db.collection(from).doc(userDoc.id);
    let re;

    await docRef.get().then((doc) => {
        if (doc.exists) {
            re=doc.data();
            return;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    let str="";
    for (const e in re) {
        str=str+e+":"+re[e]+'<br>';
    }

    return str;


}

async function openText(from,userDoc) {
    let toFill=await getTextFrom(from,userDoc);
    $("#data").append("" +
        "<!-- The Modal -->\n" +
        "<div id=\"myModal\" class=\"modal\">\n" +
        "\n" +
        "  <!-- Modal content -->\n" +
        "  <div class=\"modal-content\">\n" +
        "    <span class=\"close\">&times;</span>\n" +
        "    <p>"+toFill+"</p>\n" +
        "  </div>\n" +
        "\n" +
        "</div>");

    // Get the modal
    var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal

        modal.style.display = "block";

// When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

// When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

async function getUser(id) {
    const snapshot = await firebase.database().ref('Users/' + id).once('value');
    let user = (snapshot.val());
    return user["First Name:"]+" "+user["Sec Name:"];
}

async function createTab(from,userDoc,filled) {
    let id = userDoc.id.replace(/\s+/g, '');
    let x = await getUser(userDoc.id);
    var task = $("<div class='task' id=" + id + "></div>").text(x);

    var del = $("<i class='fas fa-trash-alt'></i>").click(function () {
        var p = $(this).parent();
        p.fadeOut(function () {

            //get into Scenerio
            p.remove();
        });
    });
    if (filled == FILLED) {
        var open = $("<i class='fas fa-folder-open'></i>").click(function () {
            openText(from, userDoc);
        });
        task.append(del, open);
    } else {
        task.append(del);
    }
    $(".notcomp").append(task);
    //to clear the input


    //userDoc contains all metadata of Firestore object, such as reference and id
    console.log(userDoc.id)

    //If you want to get doc data
    var userDocData = userDoc.data()
    console.dir(userDocData)

}

function openList(from,filled) {
    let ref=db.collection(from);

    ref.get().then((querySnapshot) => {

        //querySnapshot is "iteratable" itself
        querySnapshot.forEach((userDoc) => {
            createTab(from,userDoc,filled);


        })});

    $(".txtb").on("keyup",function(e){


        //look for


        // //13  means enter button
        if(e.keyCode == 13 && $(".txtb").val() != "") {

            let lookFor = $(".txtb").val();
            let list = document.getElementById("notcomp",).getElementsByTagName("*");
            for (var i = 0; i < list.length; i++) {
                if (!list[i].id.startsWith(lookFor)&&list[i].id!="") {
                    document.getElementById(list[i].id).remove();
                    i=i-1;
                }
            }


        }


        {
            //     var task = $("<div class='task'></div>").text($(".txtb").val());
            //     var del = $("<i class='fas fa-trash-alt'></i>").click(function(){
            //         var p = $(this).parent();
            //         p.fadeOut(function(){
            //             p.remove();
            //         });
            //     });
            //
            //     var check = $("<i class='fas fa-check'></i>").click(function(){
            //         var p = $(this).parent();
            //         p.fadeOut(function(){
            //             $(".comp").append(p);
            //             p.fadeIn();
            //         });
            //         $(this).remove();
            //     });
            //
            //     task.append(del,check);
            //     $(".notcomp").append(task);
            //     //to clear the input
            //     $(".txtb").val("");
        }
    });
}

function refreshFilled(userDocid) {
    $("#ListOfS").remove();
    openFilled(userDocid);
}

function openFilled(userDocid) {
    $("#ListOfS").remove();
    $("#data").html(ListEvent());
    $("#Completed").remove();
    openList(SCENARIO+"/"+userDocid+"/"+FILLED,FILLED);

    document.getElementById("btn btn-cancel").addEventListener("click",refreshListOfS);
    document.getElementById("refForListS").addEventListener("click", function(){
        refreshFilled(userDocid);
    }, false);
}

function refreshAccepted(userDocid) {
    $("#ListOfS").remove();
    openAccepted(userDocid);
}

function openAccepted(userDocid) {
    $("#ListOfS").remove();
    $("#data").html(ListEvent());
    $("#Completed").remove();
    openList(SCENARIO+"/"+userDocid+"/"+ACCEPTED);
    document.getElementById("btn btn-cancel").addEventListener("click",refreshListOfS);
    document.getElementById("refForListS").addEventListener("click", function(){
        refreshAccepted(userDocid);
    }, false);
}

function ListEventFun(){
    let ref=db.collection(SCENARIO);

    ref.get().then((querySnapshot) => {

        //querySnapshot is "iteratable" itself
        querySnapshot.forEach((userDoc) => {
            let id=userDoc.id.replace(/\s+/g,'');
            var task= $("<div class='task' id="+id+"></div>").text(userDoc.id);

            var del = $("<i class='fas fa-trash-alt'></i>").click(function(){
                var p = $(this).parent();
                p.fadeOut(function(){

                    //get into Scenerio
                    p.remove();
                });
            });
            var filled = $("<i class='fas fa-signature'></i>").click(function(){
                openAccepted(userDoc.id);
            });
            var accepted = $("<i class='fas fa-file-signature'></i>").click(function(){
                openFilled(userDoc.id);
            });

            var check = $("<i class='fas fa-check'></i>").click(function(){
                var p = $(this).parent();
                p.fadeOut(function(){

                    //set as complete
                    $(".comp").append(p);
                    p.fadeIn();
                });
                $(this).remove();
            });

            task.append(del,check,filled,accepted);
            $(".notcomp").append(task);
            //to clear the input




            //userDoc contains all metadata of Firestore object, such as reference and id
            console.log(userDoc.id)

            //If you want to get doc data
            var userDocData = userDoc.data()
            console.dir(userDocData)

        })});


    $(".txtb").on("keyup",function(e){


        //look for


        // //13  means enter button
        if(e.keyCode == 13 && $(".txtb").val() != "") {

            let lookFor = $(".txtb").val();
            let list = document.getElementById("notcomp",).getElementsByTagName("*");
            for (var i = 0; i < list.length; i++) {
                if (!list[i].id.startsWith(lookFor)&&list[i].id!="") {
                    document.getElementById(list[i].id).remove();
                    i=i-1;
                }
            }


        }


        {
        //     var task = $("<div class='task'></div>").text($(".txtb").val());
        //     var del = $("<i class='fas fa-trash-alt'></i>").click(function(){
        //         var p = $(this).parent();
        //         p.fadeOut(function(){
        //             p.remove();
        //         });
        //     });
        //
        //     var check = $("<i class='fas fa-check'></i>").click(function(){
        //         var p = $(this).parent();
        //         p.fadeOut(function(){
        //             $(".comp").append(p);
        //             p.fadeIn();
        //         });
        //         $(this).remove();
        //     });
        //
        //     task.append(del,check);
        //     $(".notcomp").append(task);
        //     //to clear the input
        //     $(".txtb").val("");
         }
    });
    document.getElementById("btn btn-cancel").addEventListener("click",removeListOfS);
    document.getElementById("refForListS").addEventListener("click",refreshListOfS);


}
function removeListOfS(){
    document.getElementById("ListOfS").remove();


}
function removeNewEvent(){
    document.getElementById("newEventLoaded").remove();


}
function ListOfV() {
    return undefined;
}

function sendToDataBaseNewEvent() {
    let ScenerioName=document.querySelector('#ScenerioName').value;
    let locationGps=document.querySelector('#geoCode').value;
    let des=document.querySelector('#des').value;
    let city =document.querySelector('#city').value;
    let importent=document.querySelector('#importentEvent').value;
    if(importent==undefined||city==undefined||des==undefined||locationGps==undefined||ScenerioName==undefined||
        importent==""||city==""||des==""||locationGps==""||ScenerioName==""
    ){ window.alert("Error : " + "some field are empty");return;}
    locationGps=locationGps.replace('(','');
    locationGps=locationGps.replace(')','');
    locationGps=locationGps.replace(' ','');
    var res = locationGps.split(",");
    let latitude=res[0];
    let longitude=res[1];
    console.log(latitude);
    console.log(longitude);
    let docRef = db.doc("Scenarios/"+ScenerioName);
    docRef.set({

        "מיקום": new firebase.firestore.GeoPoint(Number(latitude), Number(longitude)),
        "סוג האירוע": des,
        "עיר": city,
        "דחיפות": Boolean(importent),
        "timeCreated":new Date()

    }).then(function (){
        console.log("status saved");
        window.alert("was sended");
    }).catch(function (error){
        window.alert("Error : " + error);
    })
}

function newEvent() {
    let re="<div id=\"newEventLoaded\"><div id=\"wrap\" class=\"input\">\n" +
        "  <header class=\"input-header\">\n" +
        "    <h1>הכנס פרטי אירוע</h1>\n" +
        "  </header>\n" +
        "  <section class=\"input-content\">\n" +
        "    <h2>הכנס פרטים על האירוע</h2>\n" +
        "    <div class=\"input-content-wrap\">\n" +
        "      <dl class=\"inputbox\">\n" +
        "        <dt class=\"inputbox-title\">כותרת על האירוע</dt>\n" +
        "        <dd class=\"inputbox-content\">\n" +
        "          <input id=\"ScenerioName\" type=\"text\" required/>\n" +
        "          <label for=\"input0\">כותרת על האירוע</label>\n" +
        "          <span class=\"underline\"></span>\n" +
        "        </dd>\n" +
        "      </dl>\n" +
        "      <dl class=\"inputbox\">\n" +
        "        <dt class=\"inputbox-title\">פירוט מורחב</dt>\n" +
        "        <dd class=\"inputbox-content\">\n" +
        "          <input id=\"des\" type=\"text\" required/>\n" +
        "          <label for=\"input1\">פירוט מורחב</label>\n" +
        "          <span class=\"underline\"></span>\n" +
        "        </dd>\n" +
        "      </dl>\n" +
        "      <dl class=\"inputbox\">\n" +
        "        <dt class=\"inputbox-title\">עיר</dt>\n" +
        "        <dd class=\"inputbox-content\">\n" +
        "          <input id=\"city\" type=\"text\" required/>\n" +
        "          <label for=\"input1\">עיר</label>\n" +
        "          <span class=\"underline\"></span>\n" +
        "        </dd>\n" +
        "      </dl>\n" +
        "      <dl class=\"inputbox\">\n" +
        "        <dt class=\"inputbox-title\">נקודת מיקום</dt>\n" +
        "        <dd class=\"inputbox-content\">\n" +
        "          <input id=\"geoCode\" type=\"text\" required/>\n" +
        "          <label for=\"input1\">נקודת מיקום</label><a target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://www.latlong.net/\">כדי לפתוח את המפה ולבחור מיקום</a>\n" +
        "          <span class=\"underline\"></span>\n" +
        "        </dd>\n" +
        "      </dl>\n" +
        "<div><input type=\"checkbox\" id=\"importentEvent\" name=\"importentEvent\" value=\"Bike\">\n" +
        "<label for=\"vehicle1\"> לעלות כדחוף</label><br></div>"+
        "      <div class=\"btns\">\n" +
        "          <button class=\"btn btn-confirm\" id=\"btn btn-confirm\">שלח</button>\n" +
        "          <button class=\"btn btn-cancel\" id=\"btn btn-cancel\">בטל</button>\n" +
        "      </div>\n" +
        "  </section>\n" +
        "</div></div>"


    // let form = document.querySelector('#btn btn-confirm');
    // form.addEventListener('click',sendToDataBaseNewEvent());
    return re;
}

function newUsers() {
    return undefined;
}

function ListEvent() {
    let re="  <div id=\"ListOfS\">\n" +
        "    <div class=\"container\">\n" +
        "      <input type=\"text\" class=\"txtb\" placeholder=\"Search Bar\">\n" +
        "      <div class=\"notcomp\" id='notcomp'>\n" +
        "" +
        "\n" +
        "\n" +
        "\n" +
        "      </div>\n" +
        "\n" +
        "      <div class=\"comp\">\n" +
        "        <h3 id=\"Completed\">Completed</h3>\n" +
        "      </div>\n" +
        "<button class=\"refForListS\" id=\"refForListS\">רענן</button>\n" +
        "<button class=\"cancelForListS\" id=\"btn btn-cancel\">בטל</button>\n"+"<style>\n" +

        ".cancelForListS {\n" +
        "  padding: 15px 32px;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  display: inline-block;\n" +
        "  font-size: 16px;\n" +
        "  margin: 4px 2px;\n" +
        "  cursor: pointer;\n" +"    " +
        "    border: 1px solid #373739;\n" +
        "    background: #393a3c;\n" +
        "    color: #fff;"+"}"+

        ".refForListS {\n" +
        "  padding: 15px 32px;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  display: inline-block;\n" +
        "  font-size: 16px;\n" +
        "  margin: 4px 2px;\n" +
        "  cursor: pointer;\n" +"    " +
        "    border: 1px solid #2962ff;\n" +
        "    background: #2962ff;\n" +
        "    color: #fff;" +"}"+


        "</style>"+
        "    </div>\n" +
        "\n" +
        "    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.css\">\n" +
        "    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js\"></script>\n" +
        "    <link rel=\"stylesheet\" href=\"forScenerio.css\">\n" +
        "  \n" +"" + +

        "  </div>";
    return re;
}

function logoff() {
    firebase.auth().signOut();
    window.open("./main.html");
}

function addButtonToEvent() {
    document.getElementById("btn btn-confirm").addEventListener("click", sendToDataBaseNewEvent);
    document.getElementById("btn btn-cancel").addEventListener("click",removeNewEvent);

}

document.addEventListener("DOMContentLoaded", () => {
    // require("firebase/firestore");
    // firebase.initializeApp({
    //     apiKey: 'AIzaSyCei2jEltlh-SK_H7Y95-f6IZXOrRKwuCQ',
    //     authDomain: 'tazpit-testingandprototype.firebaseapp.com',
    //     projectId: 'tazpit-testingandprototype'
    // });
    //
    // var db = firebase.firestore();
    // this.db=db;
// Required for side-effects


    $("#ListOfV").click(function(){
        $("#data").html(ListOfV());

    });
    $("#newEvent").click(function(){
        $("#data").html(newEvent());
        addButtonToEvent();

    });
    $("#newUsers").click(function(){
        $("#data").html(newUsers());

    });
    $("#ListEvent").click(function(){
        $("#data").html(ListEvent());
        ListEventFun();

    });

    document.getElementById("logoff").addEventListener("click", logoff);


});
