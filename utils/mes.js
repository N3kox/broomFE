const app = getApp();
function sendMessage (msg) {
  if (app.globalData.socket_open) {
    wx.sendSocketMessage({
      data: msg
    })
  }
}
module.exports = {
  sendMessage : sendMessage
}
