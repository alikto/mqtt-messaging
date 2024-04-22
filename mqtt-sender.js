const mqtt = require("mqtt");

const broker = "mqtt://localhost";

const topic = "pulse_data";

const client = mqtt.connect(broker);

client.on("connect", function () {
  console.log("-------------- SENDER --------------");
  console.log("Connected to MQTT broker");
  setInterval(() => {
    const random_pulse = Math.floor(Math.random() * 100).toString();
    client.publish(topic, random_pulse);
    console.log("Published message:", random_pulse);
  }, 1000);
});

client.on("error", function (error) {
  console.error("Error:", error);
});
