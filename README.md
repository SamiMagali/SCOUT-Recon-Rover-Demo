# SCOUT Recon Rover

**SCOUT** is a prototype tracked reconnaissance rover designed to explore how a small vehicle could detect and monitor its surroundings, with the potential for remote control and future autonomous operation.

The project combines **3D-printed mechanical components, a Raspberry Pi Pico W, ultrasonic sensing, a servo-mounted radar system, a web interface, and an interactive demo game**.

The project was originally developed as part of the **Imperial College London Maker Challenge** and has since continued as an independent project.

## 🚀 What I Built

The current SCOUT project includes:

- 📡 **Ultrasonic radar/sonar system** using an HC-SR04
- 🔄 **Servo-mounted sensor** capable of scanning across its surroundings
- 🖥️ **Web-based interface** hosted by a Raspberry Pi Pico W
- 🔊 **Proximity warning system**
- 🛞 **Tracked rover design**
- 🧩 **3D-printed components and custom CAD**
- 🎮 **Interactive SCOUT demo game**

## 🛰️ Radar System

The radar system uses an **HC-SR04 ultrasonic sensor** mounted on an SG90 servo.

The servo sweeps the sensor across a range of angles while the Pico W measures the distance to objects. The measurements are then displayed through a browser-based interface.

This creates a simple radar-style view of the rover's surroundings.

The system demonstrates one of the core ideas behind SCOUT: allowing a small rover to **sense and monitor its environment**.

## 💻 Software

The project uses:

- **C++ / Arduino framework**
- **Raspberry Pi Pico W**
- HTML / CSS / JavaScript
- OpenSCAD for CAD
- Software developed for the SCOUT demo game

The Raspberry Pi Pico W hosts the web interface, allowing sensor information to be viewed through a browser.
Some AI tools were used as a programming aid during development, primarily for troubleshooting and understanding unfamiliar concepts.

## 🎮 SCOUT Demo Game

After completing the Maker Challenge, I decided to continue developing SCOUT by creating a **separate interactive demo game** based around the project.

The game allows people to experience the concept of SCOUT digitally rather than simply looking at the physical prototype. It is designed as an accessible way for people to **discover and interact with the idea behind SCOUT**.

The game is a continuation of the project rather than part of the original physical Maker Challenge prototype. It allows me to explore the **software, interaction and user experience** side of SCOUT while continuing to develop the original idea.

## 🛠️ Hardware

Some of the main components used include:

- Raspberry Pi Pico W
- HC-SR04 ultrasonic sensor
- SG90 micro servo
- L298N motor driver
- DC motors
- 3D-printed rover components

## 🔧 Development

SCOUT went through several design iterations, including changes to the rover's body and mechanical system.

The project was built as a prototype, so not every subsystem reached the final working stage. The **radar/sonar system and web interface were successfully demonstrated**, while the **tracked drive system remained a work in progress**.

Rather than treating this as a failure, the incomplete systems helped identify areas for future development. The project is now being expanded beyond the original physical prototype through the addition of the interactive demo game.

The development process, including the project's successes, problems and design decisions, is documented separately in the **Development Story**.

## 📸 Project

*Photos, CAD renders, development documentation and the SCOUT demo game will be added here.*

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
- Further development of the SCOUT demo game
- Connecting the digital experience more closely with the physical rover

---

**SCOUT Recon Rover**  
Designed, built and developed by Sami Magali.

### Third-party components

The track design and sonar head/mount were sourced from **Thingiverse** and incorporated into the SCOUT prototype. These components are not original SCOUT designs; attribution and the original licences are retained where applicable.
