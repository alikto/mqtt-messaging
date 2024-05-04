document.addEventListener("DOMContentLoaded", function() {
  const broker = "wss://1487db52e3564dcf9625c136ac6f864f.s1.eu.hivemq.cloud:8884/mqtt";
  const options = {
    username: "aleyna_tuzcu",
    password: "Aleyna_mqtt1"
  };

  const topic = "data";

  const client = mqtt.connect(broker, options);

  const MAX_DATA_POINTS = 10; // Maximum number of data points to display
  const tempData = [['x'], ['Temperature']];
  const pulseData = [['x'], ['Pulse']];

  client.on("connect", function () {
    console.log("Connected to MQTT broker");
    client.subscribe(topic);
  });

  function generateChart(bindTo, label){
    return c3.generate({
      bindto: bindTo,
      data: {
          x: 'x',
          columns: [
              ['x'],
              [label]
          ],
          colors: {
              Temperature: 'red',
              Pulse: 'blue'
          }
      },
      axis: {
          x: {
              type: 'timeseries',
              tick: {
                  format: '%H:%M:%S'
              }
          },
          y: {
              label: {
                  text: label,
                  position: 'outer-middle'
              }
          }
      }
  });
  }

  const tempChart = generateChart('#tempChart', 'Temperature')
  const pulseChart = generateChart('#pulseChart', 'Pulse')

  function addData(chart, time, value, dataStore) {
    if (dataStore[0].length >= MAX_DATA_POINTS + 1) {
      dataStore[0].splice(1, 1);
      dataStore[1].splice(1, 1);
    }
    dataStore[0].push(time);
    dataStore[1].push(value);
    chart.load({
        columns: dataStore,
        length: 0,
        duration: 1000
    });
}

  client.on("message", function(topic, message) {
      const data = JSON.parse(message.toString());
      console.log("Received JSON data:", data);
      const timestamp = new Date(data.timestamp);
      const temp = data.temp;
      const pulse = data.pulse;
      addData(tempChart, timestamp, temp, tempData);
      addData(pulseChart,timestamp, pulse, pulseData);
  })
});