$(function () {
  var form = layui.form
  var layer = layui.layer
  // 自定义密码校验规则
  form.verify({
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    newPwd: function (value) {
      if (value === $('[name = oldPwd]').val()) {
        // layer.msg('新旧密码不能相同 ')
        return '新旧密码不能相同'
      }
    },
    samePwd: function (value) {
      if (value !== $('[name=newPwd]').val()) {
        return '两次输入的新密码必须相同'
      }
    }
  })

  // 发起重置密码ajax请求
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'post',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          layer.msg('更行密码失败')
        }
        layer.msg('更新密码成功')
        $('.layui-form')[0].reset()
      }
    })
  })
})
