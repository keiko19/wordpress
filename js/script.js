var tpl = ['<div class="center">',
    '{{#prev}}<div class="prev pointer js-prev" data-id=""><div class="wrap"><span class="btn"></span><span class="btn-txt">PREV</span></div></div>{{/prev}}',
    '{{#next}}<div class="next pointer js-next"><div class="wrap"><span class="btn"></span><span class="btn-txt">NEXT</span></div></div>{{/next}}',
    '<div class="image">',
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
    '</div>',
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
                data : {page:1,count:3}
            });
            recentPost.then(function(result){
                renderHomePage(result);
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

function renderHomePage(result) {
    if (!result.posts || result.posts.length == 0) {
        return false;
    }
    var posts = result.posts;
    current = posts[2];
    var d = /(\d*)-(\d*)-(\d*)/.exec(current.date);

    var data = {
        prev: false,
        next: true,
        title: current.title,
        url: current.url,
        excerpt: current.excerpt,
        year: d[1].slice(2),
        month: d[2],
        day: d[3],
        attachmentsUrl: current.attachments.length > 0 && current.attachments[0].images.large.url || "",
        picnum: current.attachments.length
    }

    $('#container').html(template(tpl, data));
}

function bindEvent(){
    var panel = $('#container');
    var nav = $('.js-nav');
    var thumb = $('.js-thumb');
    panel.delegate('.js-next', 'click', function(e){
        var el = this
    }).delegate('.js-prev', 'click', function(e){
            var el = this
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