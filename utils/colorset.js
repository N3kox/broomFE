//
var color_list = ["gaoliangred",
                  "orange",
                  "olive",
                  "cyan",
                  "yuanweiblue",
                  "jingyugray"]

function GetColor (num) {
    var color;
    var color_count = 6;
    var result = num % color_count;

    switch (result) {
      case 1:
        color = color_list[0];
        break;
      case 2:
        color = color_list[1];
        break;
      case 3:
        color = color_list[2];
        break;
      case 4:
        color = color_list[3];
        break;
      case 5:
        color = color_list[4];
        break;
      case 0:
        color = color_list[5];
        break;
    }
    return color;
  }

  module.exports = {
      GetColor : GetColor
  }