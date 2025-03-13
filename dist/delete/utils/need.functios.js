"use strict";

function checkSchetsEquality(childs) {
  var firstSchet = childs[0].schet;
  return childs.every(function (child) {
    return child.schet === firstSchet;
  });
}
module.exports = {
  checkSchetsEquality: checkSchetsEquality
};