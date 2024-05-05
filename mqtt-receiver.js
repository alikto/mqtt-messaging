document.addEventListener("DOMContentLoaded", function () {
  const broker =
    "wss://1487db52e3564dcf9625c136ac6f864f.s1.eu.hivemq.cloud:8884/mqtt";
  const options = {
    username: "aleyna_tuzcu",
    password: "Aleyna_mqtt1",
  };

  const topic = "data";

  const client = mqtt.connect(broker, options);

  const dataTitles = ["temperature", "glucoseLevel", "spo2", "pulse"];
  const charts = {};
  const dataStoreDict = {};

  const MAX_DATA_POINTS = 10; // maximum number of data points to display

  client.on("connect", function () {
    console.log("Connected to MQTT broker");
    client.subscribe(topic);
  });

  function generateChart(bindTo, label) {
    return c3.generate({
      bindto: bindTo,
      data: {
        x: "x",
        columns: [["x"], [label]],
        colors: {
          [label]: getRandomColor(),
        },
      },
      axis: {
        x: {
          type: "timeseries",
          tick: {
            format: "%H:%M:%S",
          },
        },
        y: {
          label: {
            text: label,
            position: "outer-middle",
          },
        },
      },
    });
  }

  function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const color =
      "#" +
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0");

    return color;
  }

  dataTitles.forEach((key) => {
    const bindTo = "#" + key + "Chart";
    const title = key;
    charts[key] = generateChart(bindTo, title);
    dataStoreDict[key] = [["x"], [title]];
  });

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
      duration: 1000,
    });
  }

  client.on("message", function (topic, message) {
    const data = JSON.parse(message.toString());
    console.log("Received JSON data:", data);

    const timestamp = new Date(data.timestamp);

    dataTitles.forEach((key) => {
      const chart = charts[key];
      const dataStore = dataStoreDict[key];
      const value = data[key];

      addData(chart, timestamp, value, dataStore);
    });
  });
});
