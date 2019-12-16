/**
 * 获取当前页面名称
 */
function getPageName(){
  let pages = getCurrentPages();
  let pageUrl = pages[pages.length - 1].route.split('/');
  return pageUrl[pageUrl.length - 1];
}

module.exports = {
  getPageName : getPageName,
}