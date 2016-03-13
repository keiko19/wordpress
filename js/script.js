var path = location.pathname;
var localprefix = 'wordpress',localtest = path.indexOf(localprefix);
if(localtest !== -1){
    path = location.pathname.slice(localtest+localprefix.length,path.length);
}
//var index= location.hash.match()
if(/\/category\//.test(path)){
    //category 跳转?
}else{
    //首页 获取最新一篇文章
    var slug = (/\/([^\/]*)\//).exec(path),
        type = 'post';
    if(!slug || path == '/'){
        var recentPost = fetchData({
            url : "/wordpress/?json=get_recent_posts",
            data : {page:1}
        });
        recentPost.then(function(result){
            renderHome(result);
        });
    }else{
        fetchData({
            url : "/api/get_"+type+"/",
            data : {slug:slug[1]}
        }).then(function (result) {
            //console.log(result)
        });
    }
}

function fetchData(json){
    //获取文章信息
    return new Promise(function(resolve,reject){
        $.ajax({
            type: json.type || 'GET',
            dataType: json.dataType || "json",
            url: json.url,
            data : json.data,
            timeout: json.timeout || 30000
        }).done(function (data) {
            //console.log(data)
            resolve(data);
        }).error(function (err) {
            //reject(err);
        });
    });
}

var $title = $('#title');
var $picnum = $('#picnum');
var $time = $('#time');
var $img = $('#mainimg');
var dataTpl = '<div class="year">{{year}}</div><div class="date">{{month}}/{{day}}</div></div>'
function renderHome(result){
    var _c = result.posts && result.posts[0];
    console.log( $title)
    if(!_c){
        return false;
    }
    var date = _c.date,
        title = _c.title;
    $title.html(_c.title);
    $time.html( renderDate(date) );

    var pic = _c.attachments;
    if(pic && pic.length > 0){
        $img = pic.url;
    }
}
function renderDate(date){
    var d = /(\d*)-(\d*)-(\d*)/.exec(date);
    var dateObj = {year : d[1].slice(2),month:d[2],day:d[3]}
    return dateHtml = dataTpl.replace(/\{\{([^\}\}]*)\}\}/g,function(str,match){
        return dateObj[match];
    });
}
//var articalObj = {
//    get img(){
//
//    },
//    set img(value){
//
//    }
//};
//var model = function (opts) {
//    var options = $.extend({},opts);
//    this.current = options.current || 1;
//}
//model.prototype = {
//
//}