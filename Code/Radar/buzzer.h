#ifndef BUZZER_H
#define BUZZER_H


#define BUZZER_PIN 16


void setupBuzzer(){

  pinMode(BUZZER_PIN, OUTPUT);

  digitalWrite(BUZZER_PIN, LOW);

}



void buzzerOff(){

  noTone(BUZZER_PIN);

}



void buzzerWarning(){

  tone(BUZZER_PIN, 2000, 150);

}



void buzzerDanger(){

  tone(BUZZER_PIN, 4000, 250);

}



#endif