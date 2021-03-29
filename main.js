const elem = document.getElementById("country-list");

fetch("https://corona-api.com/countries")
.then((response) => response.json())
.then((res) => {
res.data.map((country) => {
    const li = document.createElement("button");
    li.id = country.code;
    li.classList.add("country-name");
    li.innerHTML =  `<div class="list-col1">${country.code}</div><div class="list-col2">${country.name}</div><div class="list-col3"><img src="https://www.countryflags.io/${country.code}/flat/32.png">`;
    li.addEventListener("click", ()  => {
    getData(country.code).then((res) => {
        document.getElementById(
            "countryselected"
          ).innerHTML = `<div>${country.name}</div>`;
          displayData(res);
    });
    });
    elem.appendChild(li); 
});
getData("IN").then((res) => {
    document.getElementById(
      "countryselected"
    ).innerHTML = `<div>INDIA</div>`;
    displayData(res);
});
});

const getData = async (countryCode) => {
const resp = await fetch(`https://corona-api.com/countries/${countryCode}`);
const data = await resp.json();
return data;
};

function displayData(resp) {
    console.log(resp);
  
    document.getElementById(
      "active-api"
    ).innerHTML = `<div>${resp.data.latest_data.critical}</div>`;
    document.getElementById(
      "confirmed-api"
    ).innerHTML = `<div>${resp.data.latest_data.confirmed}</div>`;
    document.getElementById(
      "recovered-api"
    ).innerHTML = `<div>${resp.data.latest_data.recovered}</div>`;
    document.getElementById(
      "deaths-api"
    ).innerHTML = `<div>${resp.data.latest_data.deaths}</div>`;

    let graphData =[];
    resp.data.timeline.map((data) => {
        graphData.push([new Date(data.date).getTime(), data.active]);
    });

    graphData.reverse();

    var options1 = {
        chart: {
          id: "chart2",
          type: "area",
          height: 200,
          foreColor: "#ccc",
          toolbar: {
            autoSelected: "pan",
            show: false,
          },
        },
        colors: ["#00BAEC"],
        stroke: {
          width: 1,
        },
        grid: {
          borderColor: "#555",
          clipMarkers: false,
          yaxis: {
            lines: {
              show: false,
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          gradient: {
            enabled: true,
            opacityFrom: 0.55,
            opacityTo: 0,
          },
        },
        markers: {
          size: 1,
          colors: ["#000524"],
          strokeColor: "#00BAEC",
          strokeWidth: 1
        },
        series: [
          {
            data: graphData,
          },
        ],
        tooltip: {
          theme: "light"
        },
        xaxis: {
          type: "datetime"
        },
        yaxis: {
          min: 0,
          tickAmount: 4,
        }
      };
      
      var chart1 = new ApexCharts(document.querySelector("#chart-area"), options1);
      
      chart1.render();
      chart1.updateSeries([
        {
          data: graphData,
        },
      ]);
      
      var options2 = {
        chart: {
          id: "chart1",
          height: 130,
          type: "bar",
          foreColor: "#ccc",
          brush: {
            target: "chart2",
            enabled: true,
          },
          selection: {
            enabled: false,
            fill: {
              color: "#fff",
              opacity: 0.4,
            },
            xaxis: {
                min: new Date(resp.data.timeline[resp.data.timeline.length-1].date).getTime(),
                  max: new Date(resp.data.timeline[0].date).getTime(),
            },
          },
        },
        colors: ["#FF0080"],
        series: [
          {
            data: graphData,
          },
        ],
        stroke: {
          width: 2
        },
        grid: {
          borderColor: "#444"
        },
        markers: {
          size: 0
        },
        xaxis: {
          type: "datetime",
          tooltip: {
            enabled: false,
          }
        },
        yaxis: {
          tickAmount: 2,
        }
      };
      
      var chart2 = new ApexCharts(document.querySelector("#chart-bar"), options2);
      
      chart2.render();
      chart1.updateSeries([
        {
          data: graphData,
        },
      ]);
};