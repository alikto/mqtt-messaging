const mqtt = require("mqtt");

const broker = "mqtt://localhost";

const topic = "pulse_data";

const client = mqtt.connect(broker);

client.on("connect", function () {
  console.log("-------------- RECEIVER --------------");
  console.log("Connected to MQTT broker");
  client.subscribe(topic);
});

client.on("message", function (topic, message) {
  const data = message.toString();
  console.log("Received message:", data);
  if (data !== "-1") {
  } else {
    console.log("Received -1. Closing connection.");
    client.end();
  }
});

client.on("error", function (error) {
  console.error("Error:", error);
});
