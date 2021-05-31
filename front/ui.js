/*
 * @Author: 小田
 * @Date: 2021-05-31 11:26:45
 * @LastEditTime: 2021-05-31 20:28:49
 */

export function init() {
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
    contents.find(".close").trigger("click");
  };

  var leftContents = $(".sidebar-left .sidebar-item-content");
  var rightContents = $(".sidebar-right .sidebar-item-content");

  var leftButtons = $(".sidebar-left .sidebar-item-button");
  var rightButtons = $(".sidebar-right .sidebar-item-button");

  func(leftContents, leftButtons);
  func(rightContents, rightButtons);
}
