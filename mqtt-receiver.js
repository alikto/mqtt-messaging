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
  try {
    const jsonData = JSON.parse(data); // Parse the received JSON string
    console.log("Received JSON data:", jsonData);

  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  if (data === "-1") {
    console.log("Received -1. Closing connection.");
    client.end();
  }
});

client.on("error", function (error) {
  console.error("Error:", error);
});
