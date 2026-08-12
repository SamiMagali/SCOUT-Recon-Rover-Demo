#include <WiFi.h>
#include <WebServer.h>

#include "sonar.h"
#include "buzzer.h"
#include "radar.h"
#include "data.h"
#include "webpage.h"


const char* ssid = "SCOUT_SONAR";
const char* password = "12345678";


WebServer server(80);



void setup(){

  Serial.begin(115200);


  setupSonar();

  setupBuzzer();

  setupRadar();



  WiFi.softAP(ssid, password);



  Serial.println("SCOUT SONAR WIFI ONLINE");

  Serial.print("IP Address: ");

  Serial.println(WiFi.softAPIP());



  // Main webpage
  server.on("/", [](){

    server.send(200, "text/html", webpage);

  });



  // Live sonar data
  server.on("/sonar", [](){

    String data = String(currentAngle);

    data += ",";

    data += String(currentDistance);


    server.send(200, "text/plain", data);

  });



  server.begin();

  Serial.println("SERVER READY");

}



void scanPoint(){


  currentDistance = getDistance();



  Serial.print("Angle: ");

  Serial.print(currentAngle);

  Serial.print("°  Distance: ");

  Serial.print(currentDistance);

  Serial.println(" cm");



  if(currentDistance > 0 && currentDistance < 20){

    buzzerDanger();

  }


  else if(currentDistance >= 20 && currentDistance < 50){

    buzzerWarning();

  }


  else{

    buzzerOff();

  }


}





void loop(){


  server.handleClient();



  for(int angle = 0; angle <= 180; angle += 5){


    moveRadar(angle);

    scanPoint();


    server.handleClient();

  }




  for(int angle = 180; angle >= 0; angle -= 5){


    moveRadar(angle);

    scanPoint();


    server.handleClient();

  }


}