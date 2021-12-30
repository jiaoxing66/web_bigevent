// 注意:每次调用 $.get() 或者 $.(post) 或者 $.(ajax) 的时候
// 会先调用 ajaxPrefilter 这个函数
//  在这个函数中 可以拿到我们给ajax提供的配置对象

$.ajaxPrefilter(function (options) {
  // 再发起真正的  ajax请求之前  统一请求的根路径
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url
  // 统一为有权限的接口， 设置 headers 请求头
  if (options.url.indexOf('/my') !== -1) {
    options.headers = { Authorization: localStorage.getItem('token') || '' }
  }

  // 全局挂在没有token强制跳转
  options.complete = function (res) {
    // console.log(res)
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      localStorage.removeItem('token')
      location.href = 'login.html'
    }
  }
})
