#ifndef SONAR_H
#define SONAR_H

#define TRIG_PIN 14
#define ECHO_PIN 15


long getDistance() {

  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);

  digitalWrite(TRIG_PIN, LOW);


  long duration = pulseIn(ECHO_PIN, HIGH, 30000);


  if(duration == 0){
    return -1;
  }


  long distance = duration * 0.0343 / 2;


  return distance;

}



void setupSonar(){

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

}


#endif