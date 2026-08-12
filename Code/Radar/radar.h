#ifndef RADAR_H
#define RADAR_H

#include <Servo.h>
#include "data.h"


#define SERVO_PIN 28


Servo radarServo;


void setupRadar(){

  radarServo.attach(SERVO_PIN);

  radarServo.write(90);

  currentAngle = 90;

  delay(500);

}



void moveRadar(int angle){

  radarServo.write(angle);

  currentAngle = angle;

  delay(50);

}



int getRadarAngle(){

  return currentAngle;

}


#endif