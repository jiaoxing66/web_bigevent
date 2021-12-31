$(function () {
  getUserInfo() // 获取用户信息
  // 退出登录
  $('#btnLogout').on('click', function () {
    var layer = layui.layer
    layer.confirm('确定退出吗？', { icon: 3, title: '提示' }, function (index) {
      // 清空本地存储
      localStorage.removeItem('token')
      // 跳转到登录页
      location.href = '/login.html'
      // 关闭confirm询问框
      layer.close(index)
    })
  })
})

// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    type: 'get',
    url: '/my/userinfo',
    // headers: { Authorization: localStorage.getItem('token') || '' },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败')
      }
      // 调用 renderAvatar 渲染用户图象
      renderAvatar(res.data)
    }
    // 不论成功还是失败都会执行这个
    /* complete: function (res) {
      // console.log(res)
      if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        localStorage.removeItem('token')
        location.href = 'login.html'
      }
    } */
  })
}

// 渲染用户图象
function renderAvatar(user) {
  var name = user.nickname || user.username
  // $('#welcome').html('欢迎' + name)
  $('#welcome').html(`欢迎 ${name}`) // 渲染用户名字
  // 渲染用户图象
  if (user.user_pic !== null) {
    $('.text-avatar').hide()
    $('.layui-nav-img').attr('src', user.user_pic).show()
  } else {
    $('.layui-nav-img').hide()
    var first = name.slice(0, 1).toUpperCase()
    $('.text-avatar').html(first).show()
  }
}
