#ifndef WEBPAGE_H
#define WEBPAGE_H


const char webpage[] PROGMEM = R"rawliteral(

<!DOCTYPE html>

<html>

<head>

<meta name="viewport" content="width=device-width, initial-scale=1">

<title>SCOUT SONAR</title>


<style>

body{

background:#020402;

color:#00ff66;

font-family:Arial;

text-align:center;

margin:0;

}


h1{

margin-top:20px;

}


canvas{

background:black;

border:3px solid #00ff66;

display:block;

margin:auto;

}


.info{

font-size:22px;

margin-top:15px;

}


</style>

</head>



<body>


<h1>
SCOUT SONAR RECON
</h1>


<canvas id="sonar" width="800" height="500"></canvas>


<div class="info">

ANGLE:
<span id="angle">0</span>°

<br>

DISTANCE:
<span id="distance">0</span> cm

<br>

STATUS:
<span id="status">SCANNING</span>

</div>





<script>


let canvas=document.getElementById("sonar");

let ctx=canvas.getContext("2d");



let cx=canvas.width/2;

let cy=canvas.height-40;


let radius=350;



let angle=90;

let distance=0;



// stored sonar returns

let echoes=[];







function radians(a){

return a*Math.PI/180;

}








function drawGrid(){



ctx.strokeStyle="#004400";

ctx.lineWidth=2;



for(let r=radius;r>0;r-=radius/4){


ctx.beginPath();

ctx.arc(

cx,

cy,

r,

Math.PI,

Math.PI*2

);

ctx.stroke();


}




ctx.beginPath();

ctx.moveTo(cx-radius,cy);

ctx.lineTo(cx+radius,cy);

ctx.stroke();





// angle markers


for(let a=0;a<=180;a+=30){


let x=cx-radius*Math.cos(radians(a));

let y=cy-radius*Math.sin(radians(a));



ctx.beginPath();

ctx.moveTo(cx,cy);

ctx.lineTo(x,y);

ctx.stroke();


}



}









function drawEchoes(){



for(let i=0;i<echoes.length;i++){


let e=echoes[i];



let d=e.distance;



if(d>100){

continue;

}




let scaled=(d/100)*radius;



let x=cx-scaled*Math.cos(radians(e.angle));

let y=cy-scaled*Math.sin(radians(e.angle));





// beam


ctx.lineWidth=2;


if(d<40){

ctx.strokeStyle="red";

}

else{

ctx.strokeStyle="#00aa55";

}




ctx.beginPath();


ctx.moveTo(cx,cy);


ctx.lineTo(x,y);


ctx.stroke();





// object point


if(d<40){


ctx.fillStyle="red";


ctx.beginPath();

ctx.arc(

x,

y,

6,

0,

Math.PI*2

);


ctx.fill();


}



}


}










function drawSweep(){



let x=cx-radius*Math.cos(radians(angle));

let y=cy-radius*Math.sin(radians(angle));



ctx.strokeStyle="#00ff66";

ctx.lineWidth=5;



ctx.beginPath();


ctx.moveTo(cx,cy);


ctx.lineTo(x,y);


ctx.stroke();



}









function draw(){


ctx.clearRect(

0,

0,

canvas.width,

canvas.height

);



drawGrid();


drawEchoes();


drawSweep();


}









function updateSonar(){



fetch("/sonar")


.then(r=>r.text())


.then(data=>{


let values=data.split(",");



angle=parseInt(values[0]);

distance=parseInt(values[1]);



document.getElementById("angle").innerHTML=angle;

document.getElementById("distance").innerHTML=distance;



// new scan begins

if(angle<=15){

echoes=[];

}



// save echo

if(distance>0){


echoes.push({

angle:angle,

distance:distance

});


}



if(distance<40){

document.getElementById("status").innerHTML="OBJECT DETECTED";

}

else{

document.getElementById("status").innerHTML="CLEAR";

}




draw();



});


}







setInterval(updateSonar,80);


draw();



</script>


</body>

</html>


)rawliteral";


#endif