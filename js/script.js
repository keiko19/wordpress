var HOST = 'http://www.miragetrip.com/';
//todo 1.loading 2.copyright 3.window resize 4.on scroll
var HomePage = function(){
    this.INDEX = 0; //默认从几开始渲染首页
    this.postResult = [];
    this.animateDiv = $('#container');
};
HomePage.prototype = {
    TPL : ['{{each data as item}}<li class="item" data-index="{{item.index}}">',
        '<div class="item-flex-box">',
            '<div class="image pointer js-artical" data-link="{{item.url}}" style="background:url(&quot;{{item.attachmentsUrl}}&quot) center center no-repeat;background-size:cover;">',
                '<div class="mask"></div>',
                '<div class="enter pointer" data-src="{{item.url}}"><a class="enter-link" target="_blank" href="{{item.url}}">enter</a></div>',
                '<div class="picnum">{{item.picnum}}P</div>',
            '</div>',
        '<div class="bottom">',
        '<div class="brief pointer js-artical" data-link="{{item.url}}">{{#item.excerpt}}</div>',
        '<div class="info">',
        '<p class="title"><a target="_blank" href="{{item.url}}">{{item.title}}</a></p>',
        '<div class="time"><div class="year">{{item.year}}</div><div class="date">{{item.month}}/{{item.day}}</div></div></div>',
        '</div></div></li>{{/each}}'].join(''),
    page : 1,
    count : 20,
    init : function(){
        var me = this;
        var recentPost = fetchData({
            url : "/?json=get_recent_posts",
            data : {page:me.page,count:me.count}
            //data : {page:1,count:INDEX+2}
        });
        recentPost.then(function(result){
            $('.homepage_body').show();
            if (result.posts && result.posts.length != 0) {
                me.page++;
                me.postResult = result.posts;
                var _html = me.renderHomePage(result.posts);
                $('#container').html( _html );
            }
        });
        this.bindEvent();
    },
    getMorePosts : function(){
        var me = this;
        fetchData({
            url : "/?json=get_recent_posts",
            data : {page:me.page,count:me.count}
        }).then(function(result){
            if (result.posts && result.posts.length != 0) {
                me.page++;
                me.postResult.push(result.posts);
                var _html = me.renderHomePage(result.posts);
                $('#container').append( _html )
            }
        });
    },
    formatHomeData : function(current,idx){
        var d = /(\d*)-(\d*)-(\d*)/.exec(current.date);
        return {
            index : idx,
            title: current.title,
            url: '#slug='+current.slug,
            excerpt: current.excerpt,
            year: d[1].slice(2),
            month: d[2],
            day: d[3],
            attachmentsUrl: current.custom_fields  &&  current.custom_fields.topic &&  current.custom_fields.topic[0] || "",
            picnum: current.attachments.length
        };
    },
    renderHomePage : function(result) {
        //渲染list
        var renerData = [],
            me = this;
        result.forEach(function(current,idx){
            renerData.push( me.formatHomeData(current,idx));
        });
        var tpl = template(me.TPL, { data :renerData });
        this.renderBtns();
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
    nextClick: function(){
        var me = this;
            var next = me.INDEX+1;
            var nextDom = me.animateDiv.find('.item[data-index="'+next+'"]');
            if( me.postResult.length - me.INDEX < 10){
                me.getMorePosts();
            }
            if(me.INDEX >=0 && next < me.postResult.length && nextDom.length>0){
                ++me.INDEX;
                //me.renderBtns();
                typeof me.postResult[me.INDEX-1] == "undefined" ? $('.js-prev').hide() :  $('.js-prev').show();
                var _x = -me.getTranslateX(me.animateDiv)+nextDom.offset().left -100;
                me.translates( me.animateDiv, 200, -_x);
            }
    },
    prevClick : function(){
        var me = this;
        var prev = me.INDEX-1;
            var prevDom = me.animateDiv.find('.item[data-index="'+prev+'"]');

            if(prev >=0 && prevDom.length > 0){
                --me.INDEX;
                me.renderBtns();
                var _x = -me.getTranslateX(me.animateDiv)+prevDom.offset().left-100;
                me.translates( me.animateDiv, 200, -_x);
            }
    },
    bindEvent : function(){
        var me = this;
        var panel = $('#panel');
        var nav = $('.js-nav');
        var thumb = $('.js-thumb');
        panel.delegate('.js-next', 'click', function(e){
            me.nextClick();
        }).delegate('.js-prev', 'click', function(e){
            me.prevClick();
        });

        //$(window).bind('resize',function(){
        //    var currentDom = me.animateDiv.find('.item[data-index="'+me.INDEX+'"]');
        //
        //    if(currentDom.offset().left !== 100){
        //        var _x = -me.getTranslateX(me.animateDiv) + currentDom.offset().left - 100;
        //        me.translates( me.animateDiv, 200, -_x);
        //    }
        //});

        nav.bind('click', function (e) {
            thumb.show();
        });
        thumb.delegate('.js-close', 'click', function(){
            thumb.hide()
        });
        
        me.animateDiv.delegate('.js-artical','click', function(){
             var link = $(this).attr("data-link");
             window.open(link);
        });
        
        $(window).bind('scroll', function(){
            me.nextClick();
        });
    }
};

var ArticalPage = function(){

};
ArticalPage.prototype = {
    TPL : ['<div class="back pointer"><div class="wrap"><span class="btn"></span><span class="btn-txt">BACK</span></div></div>',
           '<div class="main">',
            '<div class="right-box">',
                '<div class="right-share">',
                    '<div class="right-social"><i class="share iconfont pointer">&#xe601;</i><i class="prev pointer"></i><i class="next pointer"></i></div>',
                '</div>',
                '<div class="comments">',
                    '<div class="comments-title">Comments（{{comments.length}})</div>',
                    '{{if comments.length}}',
                    '<div class="comments-wrapper"><ul class="comments-list">',
                    '{{each comments as item}}',
                    '<li id="comment_{{item.id}}" data-user="{{item.name}}">',
                    '<div class="comment-author">',
                    '<a href="javascript:void(0);" class="reply iconfont">&#xe602;</a>',
                    '<a href="{{item.url}}" target="_blank" rel="nofollow">{{item.name}}</a>({{item.date}})',
                    '</div>',
                    '<div class="comment-c"><p>{{#item.content}}</p></div>',
                    '</li>',
                    '{{/each}}',
                    '</ul></div>',
                    '{{/if}}',
                '</div>',
                '<div class="comment-post">',
                    '<div class="comment-post-wrapper">',
                    '<form>',
                        '<div><textarea placeholder="YOUR NAME"></textarea></div>',
                        '<div><textarea placeholder="WRITE HERE"></textarea></div>',
                        '<div class="comment-submit"><input type="submit" class="post-comment" value="POST"></div>',
                    '</form>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="artical">',
            '<div class="top">',
            '<div class="time">',
            '<div class="year">{{year}}</div>',
            '<div class="date">{{day}}/{{month}}</div>',
            '</div>',
            '<div class="artical-info">',
            '<h3 class="title">{{title}}</h3>',
            '{{each categories as cate}}<div class="classify">{{cate.title}}</div>{{/each}}',
            '</div>',
            '</div>',
            '<div class="artical-content">',
            '{{#content}}',
            '</div>',
            '</div>',
            '</div>'].join(''),
    init : function(opt){
        $('.homepage_body').hide();
        var me = this;
        this.type = opt.type;
        this.slug = opt.slug;
        var recentPost = fetchData({
            url : "?json=get_post&slug="+me.slug
        });
        recentPost.then(function(result){
            if(result && result.post){
                me.render(result.post)
            }
        })
    },
    formatData: function(current){
        var d = /(\d*)-(\d*)-(\d*)/.exec(current.date);
        return $.extend({},{
            year: d[1].slice(2),
            month: d[2],
            day: d[3]
        },current);
    },
    render : function(post) {
        //渲染list
        var me = this;
        var renderData = me.formatData(post);
        console.log(renderData)
        var tpl = template(me.TPL, renderData);
        $('.artical_page').html(tpl);
    }
}

var homepage = new HomePage();
var articalPage = new ArticalPage();
//解析url
function initPage(){
    parseSearch();
    var path = location.pathname;
    var localprefix = 'wordpress',localtest = path.indexOf(localprefix);
    if(localtest !== -1){
        path = location.pathname.slice(localtest+localprefix.length,path.length);
    }

    if(hashObj.slug){
        articalPage.init({slug : hashObj.slug});
    }else{
        homepage.init();
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

function parseSearch(){
    var hashObj = {};
    var hash = location.hash.slice(location.hash.indexOf('#')+1,location.hash.length);
    hash.split('&').forEach(function(item){
        hashObj[item.split('=')[0]]= item.split('=')[1];
    });

    window.hashObj = hashObj;
}

initPage();
