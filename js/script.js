var TPL = ['{{each data as item}}<li class="item" data-index="{{item.index}}"><div class="image">',
    '<div class="mask"></div>',
    '<div class="enter pointer" data-src="{{item.url}}"><a class="enter-link" target="_blank" href="{{item.url}}">enter</a></div>',
    '<div class="picnum">{{item.picnum}}P</div>',
    '<img class="main-img" src="{{item.attachmentsUrl}}">',
    '</div>',
    '</div>',
    '<div class="bottom">',
    '<div class="brief">{{item.excerpt}}</div>',
    '<div class="info">',
    '<p class="title">{{item.title}}</p>',
    '<div class="time"><div class="year">{{item.year}}</div><div class="date">{{item.month}}/{{item.day}}</div></div></div>',
    '</div></li>{{/each}}'].join('');

var INDEX = 0; //默认从几开始渲染首页
var postResult = [];
var eventDispatcher = {};
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
                data : {page:1,count:10}
                //data : {page:1,count:INDEX+2}
            });
            recentPost.then(function(result){
                if (result.posts && result.posts.length != 0) {
                    postResult = result.posts;
                    var _html = renderHomePage( postResult );
                    console.log(postResult)
                    //var _html = renderHomePage( postResult[INDEX] );
                    $('#container').html( _html );
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
            renderBtns();
        }
    });
}

function formatHomeData(current,idx){
    var d = /(\d*)-(\d*)-(\d*)/.exec(current.date);
    return {
        index : idx,
        //prev: INDEX!==0,
        //next: typeof postResult[INDEX+1] !== "undefined",
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

function renderHomePage(postResult) {
    //渲染list
    var renerData = []
    postResult.forEach(function(current,idx){
        renerData.push( formatHomeData(current,idx));
    });
    var tpl = template(TPL, { data :renerData });
    return tpl;
}

function renderBtns(){
    typeof postResult[INDEX+1] == "undefined" ? $('.js-next').hide() :  $('.js-next').show();
    typeof postResult[INDEX-1] == "undefined" ? $('.js-prev').hide() :  $('.js-prev').show();
}

function translates(dom, transitionSpeed, translate3dX) {
    dom[0].style.webkitTransform = 'translate(' + translate3dX + 'px,0px) translateZ(0)';
    dom[0].style.transform = 'translate(' + translate3dX + 'px, 0px) translateZ(0)';

}

var animateDiv = $('#container');
function bindEvent(){
    var panel = $('#panel');
    var nav = $('.js-nav');
    var thumb = $('.js-thumb');
    panel.delegate('.js-next', 'click', function(e){
        //window._y = window.scrollY;
        //window._x = window.scrollX;
        var current = INDEX;
        ++INDEX;
        //getMorePosts();
        if(INDEX >=0 && typeof postResult[INDEX] !== "undefined"){
            //renderBtns();
            //var animateDiv = $('#container').find('.main[data-index="'+current+'"]');
            //animate()
            var next = current+1;
            var _x = $('#container').find('.item[data-index="'+next+'"]').offset().left -100;
            translates( animateDiv, 200, -_x);
        }
    }).delegate('.js-prev', 'click', function(e){
        //window._y = window.scrollY;
        //window._x = window.scrollX;
        var current = INDEX;
        --INDEX;
        if(INDEX >=0 && typeof postResult[INDEX] !== "undefined"){
            //renderBtns();
            var prev = current-1;
            var _x = $('#container').find('.item[data-index="'+prev+'"]').offset().left-100;
            translates( animateDiv, 200, -_x);
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