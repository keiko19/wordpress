var TPL = ['<div class="image">',
    '<div class="mask"></div>',
    '<div class="picnum">{{picnum}}P</div>',
    '<img class="main-img" src="{{attachmentsUrl}}">',
    '<div class="enter pointer" data-src="{{url}}"><a class="enter-link" target="_blank" href="{{url}}">enter</a></div>',
    '</div>',
    '</div>',
    '<div class="bottom">',
    '<div class="brief">{{excerpt}}</div>',
    '<div class="info">',
    '<p class="title">{{title}}</p>',
    '<div class="time"><div class="year">{{year}}</div><div class="date">{{month}}/{{day}}</div></div></div>',
    '</div>'].join('');

//var fn = new Function('data','var $out="";if(data.a){$out+="<div>";$out+=data.b;$out+="</div>"}return $out;')
//模板渲染方法
var open = "{{";
var close = "}}";
function template(source,data){
    var _fn = "";
    var header = 'var $out="";';
    var prefix = "$out+=",end = ";";
    var footerCode = "return $out;"
    var variaPrefic = 'data["',variaEdn = '"]'
    var isLogicStart = /^\#/;
    var isLogicEnd = /^\//;
    $(source.split(open)).each(function(index,item){
        var code = item.split(close);
        var $0 = code[0],$1 = code[1];
        if(code.length == 1){
            _fn+=prefix+"'"+$0+"'"+end;
        }else{
            if(isLogicStart.test($0)){
                _fn+= 'if('+variaPrefic+$0.slice(1)+variaEdn+'){';
            }else if(isLogicEnd.test($0)){
                _fn+= "}";
            }else{
                _fn+=prefix+variaPrefic+$0+variaEdn+end;
            }
            _fn+=prefix+"'"+$1+"'"+end;
        }
    });
    var _funcode = (header+_fn+footerCode);
    var render = new Function('source','data',_funcode);
    return render(source,data);
}

var INDEX = 0; //默认从几开始渲染首页
var postResult = []
//解析url
function initPage(){
    var path = location.pathname;
    var localprefix = 'wordpress',localtest = path.indexOf(localprefix);
    if(localtest !== -1){
        path = location.pathname.slice(localtest+localprefix.length,path.length);
    }
    if(/\/category\//.test(path)){
        //category 跳转?
    }else{
        //首页 获取最新一篇文章
        var slug = (/\/([^\/]*)\//).exec(path),
            type = 'post';
        if(!slug || path == '/'){
            var recentPost = fetchData({
                url : "/wordpress/?json=get_recent_posts",
                data : {page:1,count:INDEX+2}
            });
            recentPost.then(function(result){
                if (result.posts && result.posts.length != 0) {
                    postResult = result.posts;
                    renderHomePage();
                }
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
}

function router(url){
    var _url,_data;
    //列表页
    var slug = (/\/([^\/]*)\//).exec(path),
        type = 'post';
    if(!slug || path == '/'){
        _data = {
            url : "/wordpress/?json=get_recent_posts",
            data : {page:1,count:INDEX+2}
        };
    }else if(slug[1] == 'category'){
        //category 跳转
        var catslug = "";
        _url = "/api/get_category_posts/";
        _data = {count:INDEX+2, page:1, slug:catslug}
    }else{
        _data = {
            url : "/api/get_"+type+"/",
            data : {slug:slug[1]}
        }
    }

    return {
        url : _url,
        data : _data
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
            resolve(data);
        }).error(function (err) {
            //reject(err);
        });
    });
}

function getMorePosts(){
    fetchData({
        url : "/wordpress/?json=get_recent_posts",
        data : {page:1,count:INDEX+2}
    }).then(function(result){
        if (result.posts && result.posts.length != 0) {
            postResult = result.posts;
            console.log(postResult)
            renderBtns();
        }
    });
}

function formatHomeData(current){
    var d = /(\d*)-(\d*)-(\d*)/.exec(current.date);
    return {
        prev: INDEX!==0,
        next: typeof postResult[INDEX+1] !== "undefined",
        title: current.title,
        url: current.url,
        excerpt: current.excerpt,
        year: d[1].slice(2),
        month: d[2],
        day: d[3],
        attachmentsUrl: current.attachments.length > 0 && current.attachments[0].images.large.url || "",
        picnum: current.attachments.length
    };
}

function renderHomePage() {
    var current = postResult[INDEX];
    var data = formatHomeData(current);
    var tpl = template(TPL, data);
    $('#container').html(tpl);
    setTimeout(function () {
        window.scrollTo(window._x,window._y);
    },1)
}

function renderBtns(){
    typeof postResult[INDEX+1] == "undefined" ? $('.js-next').hide() :  $('.js-next').show();
    typeof postResult[INDEX-1] == "undefined" ? $('.js-prev').hide() :  $('.js-prev').show();
}

function bindEvent(){
    var panel = $('#panel');
    var nav = $('.js-nav');
    var thumb = $('.js-thumb');
    panel.delegate('.js-next', 'click', function(e){
        window._y = window.scrollY;
        window._x = window.scrollX;
        ++INDEX;
        getMorePosts();
        if(INDEX >=0 && typeof postResult[INDEX] !== "undefined"){
            renderHomePage();
        }
    }).delegate('.js-prev', 'click', function(e){
        window._y = window.scrollY;
        window._x = window.scrollX;
        --INDEX;
        if(INDEX >=0 && typeof postResult[INDEX] !== "undefined"){
            renderHomePage();
            renderBtns()
        }
    });

    nav.bind('click', function (e) {
        thumb.show();
    });
    thumb.delegate('.js-close', 'click', function(){
        thumb.hide()
    });
}

initPage();
bindEvent();