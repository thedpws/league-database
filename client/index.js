let username = "";

function sendXHR(method, url, body, callback){
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4){
            if (!xhr.response) {
                if (callback) return callback();
                else return;
            }
            const res = JSON.parse(xhr.response);
            if (callback) callback(res);
        }
    };

    xhr.send(body);
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function hasCookie(cname){
    return getCookie(cname) !== "";
}
function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}

function viewLogin(){
    document.getElementById('view-login').style.display = "initial";
    document.getElementById('view-main-search').style.display = "none";
    document.getElementById('view-main').style.display = "none";
    document.getElementById('view-main-details').style.display = "none";
    document.getElementById('body').style.backgroundImage = "url(\"111.jpg\")";
}

function viewMain(){
    fillUsername();
    document.getElementById('view-login').style.display = "none";
    document.getElementById('view-main-search').style.display = "initial";
    document.getElementById('view-main').style.display = "initial";
    document.getElementById('view-main-details').style.display = "none";
    document.getElementById('body').style.backgroundImage = "initial";
}

let genus = "";
let species = "";

function openFlowerCreation(){
    document.getElementById("details").innerHTML = `
    <img src="img/#.jpg" height="400" width="400"><br>
    <label id="comname-input-label">Common name</label><input id="comname-input" type="text"><br>
    <label id="genus-input-label">Genus</label><input id="genus-input" type="text"><br>
    <label id="species-input-label">Species</label><input id="species-input" type="text"><br>
    <button onclick="submitFlowerCreation()">Register new flower</button>
    `;

    document.getElementById("sightings-list").innerHTML = "None";
    document.getElementById("add").innerHTML = "";
}

function submitFlowerCreation(){
    const comname = document.getElementById("comname-input").value;
    const genus = document.getElementById("genus-input").value;
    const species = document.getElementById("species-input").value;
    if (!genus) document.getElementById("genus-input-label").style.color = "red";
    else document.getElementById("genus-input-label").style.color = "initial";
    if (!species) document.getElementById("species-input-label").style.color = "red";
    else document.getElementById("species-input-label").style.color = "initial";
    if (!comname) document.getElementById("comname-input-label").style.color = "red";
    else document.getElementById("comname-input-label").style.color = "initial";
    if (!genus || !species || !comname) return;

    sendXHR("POST", `/flower/?comname=${comname}&genus=${genus}&species=${species}`, {}, () => {
        viewDetails(comname, genus, species);
        populateResults();
    })
}

function viewDetails(comname, genus, species){
    document.getElementById('view-login').style.display = "none";
    document.getElementById('view-main-search').style.display = "none";
    document.getElementById('view-main').style.display = "initial";
    document.getElementById('view-main-details').style.display = "initial";

    if (!comname && !genus && !species){
        return openFlowerCreation();
    }

    document.getElementById("details").innerHTML = `
    <img src="img/${comname}.jpg" height="400" width="400">
    <h1>${comname}</h1>
    <h3 id="species-genus">${genus} ${species}</h3>
    <button id="edit-flower-btn" onclick="openFlowerForm('${comname}', '${genus}', '${species}')">Edit flower</button><br>
    <button id="del-flower-btn" onclick="deleteFlower('${comname}')">Unregister flower</button>
    `;

    document.getElementById("sightings-list").innerHTML = "<tr>\n" +
        "                    <th>Seen</th>\n" +
        "                    <th>Location</th>\n" +
        "                    <th>Seen by</th>\n" +
        "                </tr>";

    sendXHR("GET", `/sighting/${comname}`, {}, rs => {
        rs.forEach(r => document.getElementById("sightings-list").innerHTML += `
            <tr>
                <td>${r.SIGHTED}</td>
                <td>${r.LOCATION}</td>
                <td>${r.PERSON}</td>
            </tr>
        `);
    });
    closeForm(comname);
    species = this.species;
    genus = this.genus;
    //document.getElementById("add").innerHTML = `<button onclick="openForm('${comname}')" class="add">Add sighting...</button>`
}

function openForm(comname){
    document.getElementById("add").innerHTML = `
        <div style="margin-right: 10px">
        <button onclick="closeForm('${comname}')" style="margin-right: 100px;">Close</button><br>
        <input style="float: right;" id="date-input" type="date" placeholder="YYYY-MM-DD"><label style="float: right; margin-right: 5px">Seen</label><br>
        <input style="float: right;" id="location-input" type="text"><label style="float: right; margin-right: 5px">Location</label><br>
        <button onclick="submitForm('${comname}')" style="float: right;">Submit</button>
        </div>`;
    console.log(document.getElementById("add").innerHTML);
}

function closeForm(comname){
    document.getElementById("add").innerHTML = `
    <button onclick="openForm('${comname}')" class="add">Add sighting...</button>
    `;
}

function submitForm(comname){
    const sighted = document.getElementById("date-input").value;
    if (sighted.split("-").length !== 3) {
        document.getElementById("date-input").style.color = "red";
        return;
    }
    const location = document.getElementById("location-input").value;
    sendXHR("POST", `/sighting/?name=${comname}&person=${username}&location=${location}&sighted=${sighted}`,{}, () => {
        viewDetails(comname, genus, species);
        document.getElementById("add").innerHTML = `
    <button onclick="openForm('${comname}')" class="add">Add sighting...</button>
    `;
    });
}

function openFlowerForm(comname, genus, species){
    document.getElementById("species-genus").innerHTML = `
    <label id="genus-input-label">Genus</label><input id="genus-input" type="text"><br>
    <label id="species-input-label">Species</label><input id="species-input" type="text"><br>`;
    document.getElementById("edit-flower-btn").innerText = "Save flower registry";
    document.getElementById("edit-flower-btn").onclick = () => {
        const newGenus = document.getElementById("genus-input").value;
        const newSpecies = document.getElementById("species-input").value;
        if (!newGenus) document.getElementById("genus-input-label").style.color = "red";
        else document.getElementById("genus-input-label").style.color = "initial";
        if (!newSpecies) document.getElementById("species-input-label").style.color = "red";
        else document.getElementById("species-input-label").style.color = "initial";
        if (!newGenus || !newSpecies) return;
        sendXHR("PUT", `/flower/${comname}?genus=${newGenus}&species=${newSpecies}`, {}, () => {
            populateFilteredResults();
            viewDetails(comname, newGenus, newSpecies);
        });
    }
}

function deleteFlower(comname){
    sendXHR("DELETE", `/flower/${comname}`, {}, () => {
       populateResults(viewMain);
    });
}


function login(){
    username = document.getElementById('uname-input').value;
    if (username === "") return;
    setCookie("username", username, 1);
    viewMain();
}

function logout(){
    username = "";
    setCookie("username", "", 1);
    viewLogin();
}

function fillUsername(){
    const es = document.getElementsByClassName("username");
    for (let i = 0; i < es.length; i++){
        const e = es[i];
        e.innerText = username;
    }
}

function populateResults(callback){
    sendXHR("GET", "/flower", {}, res => {
        document.getElementById("flowersList").innerHTML = `
    <div onclick="viewDetails()">
        <img src="img/add.jpg" height="100" width="100">
        <h1><i>Register a new flower</i></h1>
    </div>
    `;
        for (i in res) {
            const flower = res[i];
            document.getElementById("flowersList").innerHTML += `
    <div onclick="viewDetails('${flower.COMNAME}', '${flower.GENUS}', '${flower.SPECIES}')">
    <img src="img/${flower.COMNAME}.jpg" height="100" width="100">
    <h1>${flower.COMNAME}</h1>
    </div>`;
        }
        if (callback) callback();
    });
}


function populateFilteredResults(callback){
    const keywords = document.getElementById("searchbar").value;
    if (!keywords) return populateResults(callback);
    sendXHR("GET", `/flower/search/${keywords}`, {}, res => {
        document.getElementById("flowersList").innerHTML = "";
        for (i in res) {
            const flower = res[i];
            document.getElementById("flowersList").innerHTML += `
    <div onclick="viewDetails('${flower.COMNAME}', '${flower.GENUS}', '${flower.SPECIES}')">
    <img src="img/${flower.COMNAME}.jpg" height="100" width="100">
    <h1>${flower.COMNAME}</h1>
    </div>`;
        }
        if (callback) callback();
    });
}
if (!hasCookie("username")) viewLogin();
else {
    username = getCookie("username");
    viewMain();
}



populateResults();