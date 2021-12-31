$(function () {
  var layer = layui.layer
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  $('#file').hide() // 默认选择文件的隐藏起来 太丑了

  // 未上传文件按钮绑定事件
  $('#btnChooseImage').click(function (e) {
    e.preventDefault()
    $('#file').click()
  })

  // 为文件选择框绑定change事件
  $('#file').change(function (e) {
    // console.log(e)
    var fileList = e.target.files
    if (fileList.length === 0) {
      return layer.msg('请选择一张图片')
    }
    // 1. 拿到用户选择的文件
    var file = e.target.files[0]
    // 2. 将文件转为url地址
    var imgUrl = URL.createObjectURL(file)
    // 3. 将新的地址给之前的image
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgUrl) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 点击提交 发起ajax请求 为确定按钮，绑定点击事件
  $('#btnUpload').click(function (e) {
    e.preventDefault()
    // 整理数据
    var dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    $.ajax({
      type: 'post',
      url: '/my/update/avatar',
      data: { avatar: dataURL },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('图片上传失败')
        }
        layer.msg('图片上传成功')
        // 调用index的获取信息函数更新数据
        window.parent.getUserInfo()
      }
    })
  })
})
