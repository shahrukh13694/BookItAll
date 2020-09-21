
function printSuccess (email) {
    var div = createDiv();
    div.classList.add("BookingDone");
    div.innerHTML = "Booking complete. An email is sent on the email address: " + email;
    var p = createParagraph();
    document.body.appendChild(div);
}


function bookTicketsEventHandler(button, num, email, date, timing, element) {
    button.onclick = function () {
        var qty = num.value;
        var sendTo = email.value;
        var movieName = element.movieName;
        var state = element.venue.state;
        var suburb = element.venue.suburb;
        var cinema = element.venue.cinema;
        url = "/getConfirmation";
        $.get(url,{qty: qty, movieName: movieName, state: state, suburb: suburb, cinema: cinema, date: date, timing: timing, email: sendTo},function(result){
            changeBody();
            var div = createDiv();
            div.classList.add("BookingDone");
            var str = "Booking complete. An email is sent on the email address: " + sendTo;
            str += '<h1>Here are your booking details</h1><p>Movie: ' + movieName + '</p><p>Venue: ' + cinema +', '+ suburb + ', ' + state + '</p><p>Date: ' + date + '</p><p>timing: ' + timing + '</p><p>Number of tickets: ' + qty + '</p><p>Please show this QR code to gain entry in the cinema hall.</p><img src="../images/1.png"/>';
            div.innerHTML = str;
            var formdiv = createDiv();
            var formcont = "<iframe src= 'https://docs.google.com/forms/d/e/1FAIpQLSe-IURs_iuTHbrygS7vucnsY0EYCXVWLGZ6jBxWs93HTHuCcg/viewform?embedded=true' width='639' height='1541' frameborder='0' marginheight='0' marginwidth='0'>Loading…</iframe>";
            formdiv.innerHTML = formcont;
            div.appendChild(formdiv);
            document.body.appendChild(div);
            
    });

    }
}


function showSummary (showId, date, timing, element) {
    changeBody();
    var div = createDiv();
    div.classList.add("summary");
    var h2 = createHeading(1, "Selected Show");
    div.appendChild(h2);
    var p = createParagraph("Movie: " + element.movieName);
    var p2 = createParagraph("Venue: " + element.venue.cinema + ", "+ element.venue.suburb + ", "+ element.venue.state);
    var p3 = createParagraph("Date: " + date + ", Time: "+ timing);
    var p4 = createParagraph("Format: " + element.format);
    div.appendChild(p);
    div.appendChild(p2);
    div.appendChild(p3);
    div.appendChild(p4);
    var num = document.createElement("INPUT");
    num.setAttribute("type", "number");
    num.setAttribute("placeholder", "Enter number of tickets");
    num.setAttribute("min", "1");
    num.setAttribute("max", "5");
    num.id = "numTickets";
    var tediv = createDiv();
    tediv.classList.add("inputsclass");
    tediv.innerHTML = "Please Select number of tickets you want to book";
    tediv.appendChild(num);
    var email = document.createElement("INPUT");
    email.setAttribute("type", "email");
    email.setAttribute("placeholder", "Enter your email address");
    email.required = true;
    email.id = "userEmail";
    tediv.appendChild(email);
    var price = createParagraph("Total Price: A$00.0");
    tediv.appendChild(price);
    num.onchange = function () {
        price.innerHTML = "Total Price: A$" + element.pricePerHead*num.value; 
    }
    
    div.appendChild(tediv);
    var btn = createButton("Confirm Booking");
    bookTicketsEventHandler(btn, num,email,date,timing,element);
    div.appendChild(btn);


    document.body.appendChild(div);
}




function bookTicketEventHandler(button, showId, date, timing, element) {
    button.onclick = function () {
        showSummary(showId, date, timing, element);
    }
}


function createCard (element) {
    var mainDiv = createDiv();
    mainDiv.classList.add("col", "s12", "m7");
    var insideDiv = createDiv();
    insideDiv.classList.add("card", "horizontal");
    var imgDiv = createDiv();
    imgDiv.classList.add("card-image");
    var div = createDiv();
    div.classList.add("card-stacked");
    var div2 = createDiv();
    div2.classList.add("card-content");
    var div3 = createDiv();
    div3.classList.add("card-action");
    var url = "/getMovieDetails";
    $.get(url,{ id: element.movieID},function(result){
        console.log('getMovieDetails Request Completed');
        console.log(result._posterLink);
        var img = createImage(result._posterLink);
        imgDiv.appendChild(img);
        var h = createHeading(2, result._movieTitle);
        div2.appendChild(h);
        var p = createParagraph(result._overview);
        div2.appendChild(p);    
        var p2 = createParagraph("Genre: " + result._genres);
        div2.appendChild(p2);   
        var p3 = createParagraph("Release Date: " + result._releaseDate + ",    Runtime: " + result._runtime + " minutes,   Rating: " + result._rating);
        div2.appendChild(p3);

    });
    url = "/getMovieTrailerLink";
    $.get(url,{id: element.movieID},function(result){
        var ele = "<a href='" + result + "' target = '_blank'><button>Watch Trailer</button></a>";
        var dt = createDiv();
        dt.innerHTML = ele;
        div2.appendChild(dt);    
    });
   
    var ven = createParagraph("Venue: " + element.venue.cinema + ", "+ element.venue.suburb + ", "+ element.venue.state + ", Format: " + element.format);
    div3.appendChild(ven);
    var price = createParagraph("Ticket Price: A$"+ element.pricePerHead);
    div3.appendChild(price);
    var tpDiv = createDiv();
    tpDiv.classList.add("dateTime");
    for (var j=0; j<element.date.length; j++){
        var tp = createParagraph("Date: " + element.date[j] );
        tpDiv.appendChild(tp);
        for (var i = 0; i<element.timing.length; i++) {
            var btn = createButton(element.timing[i]);
            bookTicketEventHandler(btn, element.showId, element.date[j], element.timing[i], element);
            tpDiv.appendChild(btn);

        }
    }

    /*
    var listDiv = createDiv();
    listDiv.classList.add("card-tabs");
    var tabs = createDiv();
    tabs.classList.add("card-content", "grey", "lighten-4");
    var tabsEle = "";
    ele2 = "<ul class='tabs tabs-fixed-width'>"
    for (var j=0; j<element.date.length; j++){
        var t = element.date[j].replace(/\s+/g, '');
        ele2 += "<li class='tab'><a href='#" + t + j + "'>" + element.date[j] + "</a></li>";
        var k = element.date[j].replace(/\s+/g, '');
        var ele3 = "<div id='"+ k + j + "'>";
        for (var i = 0; i<element.timing.length; i++){            
            ele3 += "<button>" + element.timing[i] + "</button>";
        }
        tabsEle += ele3;
    }
    listDiv.innerHTML = ele2;
    tabs.innerHTML = tabsEle;
*/

    div3.appendChild(tpDiv);
    div.appendChild(div2);

    div.appendChild(div3);
    insideDiv.appendChild(imgDiv);
    insideDiv.appendChild(div);
    
    mainDiv.appendChild(insideDiv);
    return mainDiv;
}

function createMovieDataDiv () {
    var movieData = createDiv();
    movieData.classList.add("movieResultListDiv");
    return movieData;
}

function getMoviesData (state, suburb) {
    changeBody();
    var movieData = createMovieDataDiv();
    var url = "/getShowsData";
    console.log(state,suburb);
    $.get(url,{state : state, suburb: suburb},function(result){
        console.log('getShowsData Request completed');
        console.log(result);

        if (result) {
            var p = createParagraph("Showing results for State - "+state+", Suburb - "+suburb);
            p.classList.add("results");
            movieData.appendChild(p);
            result.forEach(element => {
                var card = createCard(element);
                document.body.appendChild(card);
            });
          
        }
        else {
            console.log("not found");
            console.log(movieData);
            var p = createParagraph("No movie data found");
            movieData.appendChild(p);
        }
    });
    document.body.appendChild(movieData);
}





//Creating page for filters

var stateObject = {
    "Victoria": {
        "vermont south": ["HOYTS Cinema", "Village Cinemas"],
        "Burwood": ["Village Cinemas"],
        "Knox": ["HOYTS Cinema"],
        "Doncaster": ["HOYTS Cinema"],

    },
    "New South Wales": {
        "Chatswood": ["HOYTS Cinema", "Village Cinemas"],
        "Manly": ["HOYTS Cinema", "Village Cinemas"]
    }
}
function selection() 
{
    var stateSel = document.getElementById("stateSel");
	
    for (var state in stateObject) 
	{
        stateSel.options[stateSel.options.length] = new Option(state, state);
    }
    stateSel.onchange = function () {
        suburbSel.length = 1; // remove all options bar first
        //cimenaSel.length = 1; // remove all options bar first
        if (this.selectedIndex < 1) return; // done   
        for (var county in stateObject[this.value]) {
            suburbSel.options[suburbSel.options.length] = new Option(county, county);
        }
    }
    stateSel.onchange(); // reset in case page is reloaded
    suburbSel.onchange = function () {
        //cimenaSel.length = 1; // remove all options bar first
        if (this.selectedIndex < 1) return; // done   
        var cities = stateObject[stateSel.value][this.value];
        //for (var i = 0; i < cities.length; i++) {
            //cimenaSel.options[cimenaSel.options.length] = new Option(cities[i], cities[i]);
        //}
    }
}
function display()
{
	var state =document.getElementById("stateSel").value;
	var suburb = document.getElementById("suburbSel").value;
	//var cinema=document.getElementById("cimenaSel").value;
	if (state==""||suburb=="") 
	{
		alert("Please select all the values and then press submit.");
	}
	else
	{		
        getMoviesData(state,suburb);
	}
}

function createHeader () {
    var code = "<nav><div class='nav-wrapper'><a href='#' class='class='brand-logo center'><img src = '../images/bookemall.png'/></a></div></nav>";
    return code;
}

window.onload = function() {
  init();
};

function init(){
	changeBody();
}

function changeBody()
{
    var ret = createHeader();
    document.body.innerHTML = "";
    document.body.innerHTML = ret + "<div class='input-field col s12 selection'><form name='myform id='myForm' action='JavaScript:display()'><select name='optone' id='stateSel' size='1' style='display: block;'><option value='' disabled selected>Select State</option></select><br><br><select style='display: block;' name='opttwo' id='suburbSel' size='1'><option value='' disabled selected>Select Suburb</option></select><br><br><input id ='submit' class='waves-effect waves-light btn' type='submit' value='Submit'></form></div>"
    selection();
}