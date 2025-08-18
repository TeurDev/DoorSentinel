# DoorSentinel

## 📝 Description  
A mobile security app developed with **React Native** and **TypeScript** (using Expo), allowing real-time monitoring of door openings and closings via ESP32 devices connected to a custom server.

## 📸 Screenshots  

![Home Screen](image1.png)  
*Initial screen of the app with login and registration options.* 
*List of connected devices and their status (locked/unlocked). With dark and light mode*

## 📖 Detailed Description  
**DoorSentinel** is an application focused on real-time access monitoring and control.  

- Developed using **React Native with TypeScript** and **Expo** for simplified app building and deployment.  
- Connects to **ESP32 devices** that detect door openings and closings.  
- When an event is detected, the **ESP32** sends a signal to the [backend](https://github.com/TeurDev/DoorSentinel-Backend) server, built with **Node.js**.  
- The backend manages the logic, connects to the **MongoDB** (NoSQL) database, and sends push notifications to the mobile app.  
- The frontend focuses on visualization: it allows user registration, device management, creation of device groups, and immediate alerts.  

### 🔧 Main Technologies
- **Frontend:** React Native + TypeScript + Expo  
- **[Backend](https://github.com/TeurDev/DoorSentinel-Backend):** Node.js + Express  
- **Database:** MongoDB  
- **IoT Devices:** ESP32  
- **Push Notifications:** Integrated via Expo and custom server  

In summary, the **frontend (DoorSentinel)** does not perform complex calculations; it serves as the interface for interacting with the system. The main logic and data management reside in the **[backend](https://github.com/TeurDev/DoorSentinel-Backend)**.

---
