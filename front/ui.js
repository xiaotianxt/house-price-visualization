/*
 * @Author: 小田
 * @Date: 2021-05-31 11:26:45
 * @LastEditTime: 2021-05-31 20:28:49
 */

function initSliders() {
  const func = function (contents, buttons) {
    contents.find(".close").on("click", function (e) {
      var index = contents.find(".close").index(this);
      contents.eq(index).slideUp((e) => {
        buttons.eq(index).slideDown(10);
      });
    });

    buttons.on("click", function (e) {
      var index = buttons.index(this);
      buttons.eq(index).slideUp(10, (e) => {
        contents.eq(index).slideDown();
      });
    });
    contents.find(".close");
  };

  var leftContents = $(".sidebar-left .sidebar-item-content");
  var rightContents = $(".sidebar-right .sidebar-item-content");

  var leftButtons = $(".sidebar-left .sidebar-item-button");
  var rightButtons = $(".sidebar-right .sidebar-item-button");

  func(leftContents, leftButtons);
  func(rightContents, rightButtons);
}

function initChart() {
  const labels = ["January", "February", "March", "April", "May", "June"];
  const data = {
    labels: labels,
    datasets: [
      {
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [0, 10, 5, 2, 20, 30, 45],
      },
    ],
  };
  const config = {
    type: "line",
    data,
    options: {},
  };

  var myChart = new Chart(document.getElementById("myChart"), config);
}

export function init() {
  initSliders();
  initChart();

  $("#search-result-info-back").on("click", function (e) {
    $("#info-prev").trigger("click");
  });
}

export function getPriceRange() {
  if (!$("#price-checkbox").is(":checked")) {
    return null; // not checked
  }
  var minPrice = $(
    "#price-range > div > div.input-group.mb-3 > input:nth-child(1)"
  ).val();
  var maxPrice = $(
    "#price-range > div > div.input-group.mb-3 > input:nth-child(3)"
  ).val();

  return { min: minPrice, max: maxPrice };
}
