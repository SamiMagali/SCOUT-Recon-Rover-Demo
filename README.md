# SCOUT Recon Rover

**SCOUT** is a prototype tracked reconnaissance rover designed to explore how a small vehicle could detect and monitor its surroundings, with the potential for remote control and future autonomous operation.

The project combines **3D-printed mechanical components, a Raspberry Pi Pico W, ultrasonic sensing, a servo-mounted radar system, and a web interface**.

## 🚀 What I Built

The current prototype includes:

- 📡 **Ultrasonic radar/sonar system** using an HC-SR04
- 🔄 **Servo-mounted sensor** capable of scanning across its surroundings
- 🖥️ **Web-based interface** hosted by a Raspberry Pi Pico W
- 🔊 **Proximity warning system**
- 🛞 **Tracked rover design**
- 🧩 **3D-printed components and custom CAD**

The project was developed as part of the **Imperial College London Maker Challenge**.

## 🛰️ Radar System

The radar system uses an **HC-SR04 ultrasonic sensor** mounted on an SG90 servo.

The servo sweeps the sensor across a range of angles while the Pico W measures the distance to objects. The measurements are then displayed through a browser-based interface.

This creates a simple radar-style view of the rover's surroundings.

## 💻 Software

The project uses:

- **C++ / Arduino framework**
- **Raspberry Pi Pico W**
- HTML / CSS / JavaScript
- OpenSCAD for CAD

## 🛠️ Hardware

Some of the main components used include:

- Raspberry Pi Pico W
- HC-SR04 ultrasonic sensor
- SG90 micro servo
- L298N motor driver
- 3D-printed rover components

## 🔧 Development

SCOUT went through several design iterations, including changes to the rover's body and mechanical system.

The project was built as a prototype, so not every subsystem reached the final working stage. The **radar/sonar system and web interface were successfully demonstrated**, while the **tracked drive system remained a work in progress**.

Documenting these limitations is part of the project. The goal is to show the **engineering process**, including experimentation, failed approaches and future improvements.

## 📸 Project

*Photos, CAD renders and development documentation will be added here.*

## 🔮 Future Improvements

Possible future versions could include:

- Fully functional tracked drive
- Wireless control
- Improved radar visualisation
- Longer-range sensing
- Multiple sensors
- On-board camera
- Autonomous navigation
- Obstacle avoidance
- Improved mechanical track system that actually works...

---

**SCOUT Recon Rover**  
Built, designed and tested by Sami Magali.




Third-party components: The track design and sonar head/mount were sourced from Thingiverse and incorporated into the SCOUT prototype. These components are not original SCOUT designs; attribution and original licences are retained where applicable.
