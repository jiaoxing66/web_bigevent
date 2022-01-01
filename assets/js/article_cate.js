$(function () {
  var layer = layui.layer
  var form = layui.form
  getArtCateList()

  // 获取文章列表函数
  function getArtCateList() {
    $.ajax({
      type: 'get',
      url: '/my/article/cates',
      success: function (res) {
        // console.log(res)
        if (res.status !== 0) {
          return layer.msg('获取列表失败')
        }
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 添加文章的回调
  var indexAdd = null
  $('#btnAddCate').on('click', function (e) {
    e.preventDefault()
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  // 点击添加按钮时候 通过代理  为form-add绑定submint事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'post',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        // console.log(res)
        if (res.status !== 0) {
          return layer.msg('添加分类失败')
        }
        getArtCateList()
        layer.msg('添加成功')
        layer.close(indexAdd)
      }
    })
  })

  // 通过代理为 btn-edit 绑定submit事件
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function (e) {
    e.preventDefault()
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })
    // console.log(1)
    var id = $(this).attr('data-id')
    // 发起请求获取对应分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        form.val('form-edit', res.data)
        // console.log(res)
      }
    })
  })

  // 通过代理为确认修改 添加submit事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'post',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新失败')
        }
        getArtCateList()
        layer.msg('更新成功')
        layer.close(indexEdit)
      }
    })
  })

  // 通过代理为删除按钮 添加点击事件
  $('tbody').on('click', '.btn-delete', function (e) {
    e.preventDefault()
    var id = $(this).attr('data-id')
    layer.confirm(
      '确定要删除这条吗？',
      {
        btn: ['删除', '取消']
      },
      function () {
        $.ajax({
          type: 'get',
          url: '/my/article/deletecate/' + id,
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg('删除失败')
            }
            layer.msg('删除成功')
            layer.close(index)
            getArtCateList()
          }
        })
      }
    )
  })
})
