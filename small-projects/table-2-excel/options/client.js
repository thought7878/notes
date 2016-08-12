document.querySelector('#btnExcel').onclick = function() {
  ExcellentExport.excel(this, 'datatable', '报名表格1');
}

document.querySelector('.subjects').onchange = function(e) {

  if (e.target.nodeName === 'SELECT') {

    var input = e.target.parentNode.querySelector('input');
    input.value = input.dataset.type + e.target.value;
  }
}

!(function(){
  var data = JSON.parse(localStorage.getItem('data') || '[]');
  var form =document.querySelector('form');
  var tmpl = document.querySelector('#tmpl-table');

  var refresh = function() {
    localStorage.setItem('data', JSON.stringify(data));

    var tr1 = '', tr2 = '';
    try {
      var sum = {};
      for (var i = 0, len = data.length; i < len; i++) {
        for (var j = 0, jlen = data[i].sub && data[i].sub.length; j < jlen; j++) {
          var t = data[i].sub[j];
          sum[t] = sum[t] || 0;
          sum[t]++;
        }
      }

      for (var item in sum) {
        tr1 += '<td>' + item + '</td>';
        tr2 += '<td>' + sum[item] + '</td>' ;
      }


    } catch (e) {
      console.log(e)
    }


    tmpl._updateBy({data: data, tr1: tr1, tr2: tr2});
  }

  form._data = function(d) {
    if (!d.name) {
      alert('姓名未填写')
      return null;
    }
    if (!d.sub) {
      alert('学科未填写')
      return null;
    }
    d.id = Date.now() + (Math.random() + '').substring(2, 5);
    data.push(d);
    refresh();
    $('#myModal').modal('hide');
    setTimeout(function(){
      form.reset();
    }, 1000)
    return null;
  }

  document.querySelector('#btn-ok').onclick = function() {
    form.submit();

  }

  window.onload = function() {
    setTimeout(function(){
      refresh();
    }, 100)
  }


  document.querySelector('#container').onclick = function(e) {

    if (e.target.classList.contains('btn-danger')) {
      if (!confirm('确认删除?')) {
        return;
      }
      var ele = e.target
        , id = ele.dataset.id;

      for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].id === id) {

          console.log(ele.dataset.id + ' ' + i)
          data.splice(i, 1)
          refresh();
          return;
        }
      }

    } else if (e.target.classList.contains('btn-success')) {
      var ele = e.target
        , id = ele.dataset.id
        , tmplPrint = document.querySelector('#tmpl-print');

      console.log(ele.dataset.id)

      for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].id === id) {
          console.log(ele.dataset.id + ' ' + i)
          console.log(data[i])
          tmplPrint._updateBy(data[i]);
          window.print();
          return;
        }
      }

    }
  }
})();
