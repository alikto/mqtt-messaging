document.addEventListener("DOMContentLoaded", function() {
  const broker = "wss://1487db52e3564dcf9625c136ac6f864f.s1.eu.hivemq.cloud:8884/mqtt";
  const options = {
    username: "aleyna_tuzcu",
    password: "Aleyna_mqtt1"
  };

  const topic = "data";

  const client = mqtt.connect(broker, options);

  const maxDataPoints = 10;

  const ctxTemp = document.getElementById('tempChart').getContext('2d');
  const ctxPulse = document.getElementById('pulseChart').getContext('2d');
  const ctxSpo2 = document.getElementById('spo2Chart').getContext('2d');
  const ctxGlucose = document.getElementById('glucoseChart').getContext('2d');

  const option = {
    responsive: true,
    scales: {
      xAxis: [{
        type: 'time',
        time: {
          unit: 'second'
        }
      }],
      yAxis: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }

  const tempChart = new Chart(ctxTemp, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Temperature',
        data: [],
        borderColor: 'red',
        borderWidth: 1,
        fill: false
      }]
    },
    options: option
  });

  const pulseChart = new Chart(ctxPulse, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Pulse',
        data: [],
        borderColor: 'blue',
        borderWidth: 1,
        fill: false
      }]
    },
    options: option
  });

  const spo2Chart = new Chart(ctxSpo2, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Spo2',
        data: [],
        borderColor: 'green',
        borderWidth: 1,
        fill: false
      }]
    },
    options: option
  });

  const glucoseChart = new Chart(ctxGlucose, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Glucose Level',
        data: [],
        borderColor: 'orange',
        borderWidth: 1,
        fill: false
      }]
    },
    options: option
  });


  client.on("connect", function () {
    console.log("Connected to MQTT broker");
    client.subscribe(topic);
  });

  client.on("message", function (topic, message) {
    const data = JSON.parse(message.toString());
    console.log("Received JSON data:", data);
    
    const timestamp = new Date(data.timestamp);
    const timeString = `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`;

    const temp = data.temp;
    const pulse = data.pulse;
    const spo2 = data.spo2;
    const glucoseLevel = data.glucoseLevel;
    
    addData(tempChart, timeString, temp);
    addData(pulseChart, timeString, pulse);
    addData(spo2Chart, timeString, spo2);
    addData(glucoseChart, timeString, glucoseLevel);
  });

  client.on("error", function (error) {
    console.error("Error:", error);
  });

  function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);

    if (chart.data.labels.length > maxDataPoints) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }

    chart.update();
  }
});