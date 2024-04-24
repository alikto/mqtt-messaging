const mqtt = require("mqtt");

const broker = "mqtt://localhost";

const topic = "pulse_data";

const client = mqtt.connect(broker);

function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}

client.on("connect", function () {
  console.log("-------------- SENDER --------------");
  console.log("Connected to MQTT broker");
  setInterval(() => {
    const timestamp = new Date().toISOString(); // Get current timestamp
    const patientData = {
      timestamp: timestamp,
      temp: getRandomValue(36.0, 38.0),
      pulse: getRandomValue(60, 100),
      bloodPressure: {
        systolic: getRandomValue(100, 130),
        diastolic: getRandomValue(80, 100)
      },
      spo2: getRandomValue(50, 60),
      glucoseLevel: getRandomValue(100,200),
      
    };

    const jsonPatientData = JSON.stringify(patientData);

    client.publish(topic, jsonPatientData);
    console.log("Published message:", patientData);
  }, 1000);
});

client.on("error", function (error) {
  console.error("Error:", error);
});
