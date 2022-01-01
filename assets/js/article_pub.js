$(function () {
  var layer = layui.layer
  var form = layui.form

  initCate()
  // 初始化富文本编辑器
  initEditor()

  /// 获取文章分类的列表的方法
  function initCate() {
    $.ajax({
      type: 'get',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类列表失败')
        }
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        form.render()
      }
    })
  }

  // 图片裁剪
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 为选择封面的按钮绑定点击事件的处理函数
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })

  // 为文件选择框绑定change事件
  $('#coverFile').change(function (e) {
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

  // 整理数据
  var art_state = '已发布'
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })

  // 为表单绑定 submit 提交事件
  $('#form-pub').on('submit', function (e) {
    // 1. 阻止表单的默认提交行为
    e.preventDefault()
    // 2. 基于 form 表单，快速创建一个 FormData 对象
    var fd = new FormData($(this)[0])
    // 3. 将文章的发布状态，存到 fd 中
    fd.append('state', art_state)
    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        // 6. 发起 ajax 数据请求
        publishArticle(fd)
      })
  })

  // 发布文章的ajax
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        // 发布文章成功后，跳转到文章列表页面
        location.href = '/article/article_list.html'
      }
    })
  }
})