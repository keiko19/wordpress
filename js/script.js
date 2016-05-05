

var homePage = function(){
    this.INDEX = 0; //默认从几开始渲染首页
    this.postResult = [];
    this.animateDiv = $('#container');
    this.bindEvent();
};
homePage.prototype = {
    TPL : ['{{each data as item}}<li class="item" data-index="{{item.index}}"><div class="image">',
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
            '</div></li>{{/each}}'].join(''),
    init : function(){
        var me = this;
        var recentPost = fetchData({
            url : "/wordpress/?json=get_recent_posts",
            data : {page:1,count:10}
            //data : {page:1,count:INDEX+2}
        });
        recentPost.then(function(result){
            if (result.posts && result.posts.length != 0) {
                me.postResult = result.posts;
                var _html = me.renderHomePage( );
                $('#container').html( _html );
            }
        })
    },
    getMorePosts : function(){
        fetchData({
            url : "/wordpress/?json=get_recent_posts",
            data : {page:1,count:me.INDEX+2}
        }).then(function(result){
            if (result.posts && result.posts.length != 0) {
                me.postResult = result.posts;
                me.renderBtns();
            }
        });
    },
    formatHomeData : function(current,idx){
        var d = /(\d*)-(\d*)-(\d*)/.exec(current.date);
        return {
            index : idx,
            title: current.title,
            url: current.url,
            excerpt: current.excerpt,
            year: d[1].slice(2),
            month: d[2],
            day: d[3],
            attachmentsUrl: current.attachments.length > 0 && current.attachments[0].images.large.url || "",
            picnum: current.attachments.length
        };
    },
    renderHomePage : function() {
        //渲染list
        var renerData = [],
            me = this;;
        this.postResult.forEach(function(current,idx){
            renerData.push( me.formatHomeData(current,idx));
        });
        var tpl = template(me.TPL, { data :renerData });
        return tpl;
    },
    renderBtns : function(){
        typeof this.postResult[this.INDEX+1] == "undefined" ? $('.js-next').hide() :  $('.js-next').show();
        typeof this.postResult[this.INDEX-1] == "undefined" ? $('.js-prev').hide() :  $('.js-prev').show();
    },
    translates :function(dom, transitionSpeed, translate3dX) {
        dom[0].style.webkitTransform = 'translate(' + translate3dX + 'px,0px) translateZ(0)';
        dom[0].style.transform = 'translate(' + translate3dX + 'px, 0px) translateZ(0)';

    },
    getTranslateX : function(elem){
        var matrix = window.getComputedStyle(elem[0], null);
        var transform = matrix['webkitTransform'] || matrix['transform'];
        var split = transform.split(')')[0].split(', ');
        var x = Math.round(+(split[12] || split[4]));
        return x || 0;
    },

    bindEvent : function(){
        var me = this;
        var panel = $('#panel');
        var nav = $('.js-nav');
        var thumb = $('.js-thumb');
        panel.delegate('.js-next', 'click', function(e){
            var next = me.INDEX+1;
            var nextDom = me.animateDiv.find('.item[data-index="'+next+'"]');
            //getMorePosts();
            if(me.INDEX >=0 && next < me.postResult.length && nextDom.length>0){
                ++me.INDEX;
                me.renderBtns();
                var _x = -me.getTranslateX(me.animateDiv)+nextDom.offset().left -100;
                me.translates( me.animateDiv, 200, -_x);
            }
        }).delegate('.js-prev', 'click', function(e){
            var prev = me.INDEX-1;
            var prevDom = me.animateDiv.find('.item[data-index="'+prev+'"]');

            if(prev >=0 && prevDom.length > 0){
                --me.INDEX;
                me.renderBtns();
                var _x = -me.getTranslateX(me.animateDiv)+prevDom.offset().left-100;
                me.translates( me.animateDiv, 200, -_x);
            }
        });

        $(window).bind('resize',function(){
            var currentDom = me.animateDiv.find('.item[data-index="'+me.INDEX+'"]');
            if(currentDom.offset().left !== 100){
                var _x = -me.getTranslateX(me.animateDiv) + currentDom.offset().left - 100;
                me.translates( me.animateDiv, 200, -_x);
            }
        });

        nav.bind('click', function (e) {
            thumb.show();
        });
        thumb.delegate('.js-close', 'click', function(){
            thumb.hide()
        });
    }
}


//解析url
var homepage = new homePage();
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
            homepage.init();
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

initPage();