// Class Car
class Car {
  constructor(cars) {
    this.cars = cars;
  }
  filterCarAvailable() {
    return this.cars.filter((car) => car.available === true);
  }
  filterCarUnAvailable() {
    return this.cars.filter((car) => car.available === false);
  }

  filterCarByUser() {
    var driver = document.getElementById("driver").value;
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;
    var dateTime = date + time;
    var passanger = document.getElementById("passanger").value;

    if (driver === undefined || driver === "") {
      alert("Please select a driver");
      return;
    }
    // else if (driver.value === yes){
    //     return this.car.filter(car => car.available === true)
    // }
    // else if (driver.value === no){
    //     return this.car.filter(car => car.available === false)
    // }
    else if (dateTime < getDateTimeNow()) {
      alert("Please select a date and time greater than now");
      return;
    } else if (passanger == "" && driver.toString() == "true") {
      return this.cars.filter(
        (car) => car.available === true && car.availableAt <= dateTime
      );
    } else if (passanger != "" && driver.toString() == "true") {
      return this.cars.filter(
        (car) =>
          car.available === true &&
          car.capacity >= passanger &&
          car.availableAt <= dateTime
      );
    } else if (passanger == "" && driver.toString() == "false") {
      return this.cars.filter(
        (car) => car.available === false && car.availableAt <= dateTime
      );
    } else if (passanger != "" && driver.toString() == "false") {
      return this.cars.filter(
        (car) =>
          car.available === false &&
          car.capacity >= passanger &&
          car.availableAt <= dateTime
      );
    }
  }
}

// Module Request
var xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", "http://localhost:7000/api/cars", false);
xmlHttp.send(null); // Request body null

// Get Data from JSON
var data = JSON.parse(xmlHttp.responseText);

// Filter Car by Available
var cars = new Car(data);

// Get Element by ID carsList
var app = document.getElementById("carsList");
htmlData = "";

// Get Data from API
data = cars.filterCarAvailable();
data = cars.filterCarUnAvailable();

// Function Format Rupiah
function rupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
}

// Trigger Function by Button id=btnFilterCar
var btnFilterCar = document
  .getElementById("btnFilterCar")
  .addEventListener("click", getCars);

// Function Number Format Rupiah
function getDateTimeNow() {
  var today = new Date();
  var date =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");
  var time =
    String(today.getHours()).padStart(2, "0") +
    ":" +
    String(today.getMinutes()).padStart(2, "0") +
    ":" +
    String(today.getSeconds()).padStart(2, "0");
  var dateNow = date + "T" + time + ".000Z";
  return dateNow;
}

// Loop Data
function getCars() {
  var htmlData = "";
  data = cars.filterCarByUser();
  if (data === "" || data === undefined) {
    htmlData = "";
    app.innerHTML = htmlData;
    return;
  } else {
    for (let index = 0; index < data.length; index++) {
      var car = data[index];
      var rentCost = rupiah(car.rentPerDay);
      htmlData += `<div style="width: 333px; box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; height: fit-content; margin-bottom: 35px;">
                    <img src=${car.image} alt="${car.manufacture}" style="width: 100%; height: 222px; border-radius: 3px;">
                    <p style="margin: 16px 0px 8px 0px; font-family: 'Helvetica'; font-style: normal; font-weight: 400;font-size: 14px; line-height: 20px;">${car.manufacture} ${car.model}</p>
                    <h5 style="margin-bottom: 8px; font-family: 'Helvetica'; font-style: normal; font-weight: 700; font-size: 16px; line-height: 24px;">${rentCost} / hari</h5>
                    <h6 style="height: 60px; margin-bottom: 16px; font-family: 'Helvetica'; font-style: normal; font-weight: 300; font-size: 14px; line-height: 20px;">${car.description}</h6>
                    <div style="display: flex; ">
                        <div style="margin-right: 8px; padding: 0px;"> 
                            <i class="bi bi-people" aria-hidden="true" style="font-size:24px;"></i>
                        </div> 
                        <p style="font-family: 'Helvetica'; font-style: normal; font-weight: 300; font-size: 14px; line-height: 26px;">
                        ${car.capacity} Orang
                        </p>
                    </div>
                    <div style="display: flex; ">
                        <div style="margin-right: 12px; padding: 2px 0px;"> 
                            <i class="bi bi-gear" aria-hidden="true" style="font-size:20px;"></i>
                        </div> 
                        <p style="font-family: 'Helvetica'; font-style: normal; font-weight: 300; font-size: 14px; line-height: 26px;">
                        ${car.transmission}
                        </p>
                    </div>
                    <div style="display: flex;">
                        <div style="margin-right: 12px; padding: 2px 0px;"> 
                            <i class="bi bi-calendar4" aria-hidden="true" style="font-size:20px;"></i>
                        </div> 
                        <p style="font-family: 'Helvetica'; font-style: normal; font-weight: 300; font-size: 14px; line-height: 26px;">
                        ${car.year}
                        </p>
                    </div>
                    <button style="margin-top:8px; width: 100%; padding: 14px 0px; background: #5CB85F; border-radius: 3px; border: none; color: white; text-align: center; text-decoration: none; font-family: 'Helvetica';
                    font-style: normal;
                    font-weight: 700;
                    font-size: 14px; font-family: 'Helvetica'; line-height: 20px;">
                        Pilih Mobil
                    </button>
                </div>`;
    }
    app.innerHTML = htmlData;
    if (htmlData == "") {
      alert("No car available");
    }
  }
}
