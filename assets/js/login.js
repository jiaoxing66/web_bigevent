$(function () {
  // 点 去注册账号的链接
  $('#link_reg').on('click', function () {
    $('.reg-box').show()
    $('.login-box').hide()
  })
  // 点 去登陆的链接
  $('#link_login').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })
})

// 从layui中获取form对象
// 自定义检验规则
var form = layui.form
var layer = layui.layer

form.verify({
  // 自定义了一个叫做 pwd 校验规则
  pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
  // 校验两次密码是否一致的规则
  repwd: function (value) {
    // 通过形参拿到的是确认密码框中的内容
    // 还需要拿到密码框中的内容
    // 然后进行一次等于的判断
    // 如果判断失败,则return一个提示消息即可
    var pwd = $('.reg-box [name=password]').val()
    if (pwd !== value) {
      return '两次密码不一致！'
    }
  }
})

// 注册提交行为
$('#form-reg').on('submit', function (e) {
  e.preventDefault()
  var data = { username: $('#form-reg [name=username]').val(), password: $('#form-reg [name=password]').val() }
  $.post('/api/reguser', data, function (res) {
    // console.log(res)
    if (res.status !== 0) {
      return layer.msg(res.message)
    }
    layer.msg('注册成功')
    $('#link_login').click()
  })
})
// 登陆提交行为
$('#form_login').submit(function (e) {
  e.preventDefault()
  $.ajax({
    type: 'post',
    url: '/api/login',
    data: $(this).serialize(), // 快速获取表单中的数据
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      layer.msg('登陆成功')
      // console.log(res.token)
      localStorage.setItem('token', res.token)
      location.href = '/index.html' // 跳转到首页
    }
  })
})
