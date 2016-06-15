var HOST = 'http://www.miragetrip.com/';
var scrollFunc = function (e) {
    var direct = 0;
    e = e.originalEvent || window.event;
    if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
        //当滑轮向上滚动时 e.wheelDelta > 0
        //当滑轮向下滚动时 e.wheelDelta < 0
        direct = event.wheelDelta/60;
    } else if (e.detail) {  //Firefox滑轮事件
        //当滑轮向上滚动时 e.detail > 0
        //当滑轮向下滚动时 e.detail < 0
        direct = -event.detail/3;
    }
    return direct;
}
var loading = $('.loading');
var loading_tips = $('.loading_tips');
//todo 1.loading 2.copyright  4.on scroll
var HomePage = function(){
    this.INDEX = 0; //默认从几开始渲染首页
    this.postResult = [];
    this.animateDiv = $('#container');
};
HomePage.prototype = {
    TPL : ['{{each data as item}}<li class="item" data-index="{{item.index}}">',
        '<div class="item-flex-box">',
            '<div class="image pointer js-artical" data-id="{{item.id}}" data-link="{{item.url}}" style="background:url(&quot;{{item.attachmentsUrl}}&quot) center center no-repeat;background-size:cover;">',
                '<div class="mask"></div>',
                '<div class="enter pointer" data-src="{{item.url}}"><a class="enter-link js-artical" href="javascript:void(0)" data-id="{{item.id}}" data-link="{{item.url}}">enter</a></div>',
                '<div class="picnum">{{item.picnum}}P</div>',
            '</div>',
        '<div class="bottom">',
        '<div class="brief pointer js-artical" data-id="{{item.id}}" data-link="{{item.url}}">{{#item.excerpt}}</div>',
        '<div class="info">',
        '<p class="title"><a class="js-artical" href="javascript:void(0)" data-id="{{item.id}}" data-link="{{item.url}}">{{item.title}}</a></p>',
        '<div class="time"><div class="year">{{item.year}}</div><div class="date">{{item.month}}/{{item.day}}</div></div></div>',
        '</div></div></li>{{/each}}'].join(''),
    page : 1,
    count : 20,
    params : {},
    isLoadAll : false,
    isLoading : false,
    url : "/?json=get_recent_posts",
    init : function(){
        var me = this;
        var index = parseInt(localStorage.getItem('MIRAGE_HOME_INDEX'));
        var id = localStorage.getItem('MIRAGE_HOME_ID');
        var initPage = Math.ceil( (index*10000)/(me.count*10000) ) + 1;
        var count = index > me.count ? (me.count*10000*initPage)/10000 : me.count;
        var recentPost = fetchData({
            url : me.url,
            data : {page:me.page,count:count}
        }).done(function(result){
            loading.fadeOut(800,function(){
                $('.homepage_body').show();
                if (result.posts && result.posts.length != 0) {
                    index > me.count ? me.page = initPage+1 : me.page++;
                    me.postResult = result.posts;
                    var _html = me.renderHomePage(result.posts,0);
                    $('#container').html( _html );
                    if( index >0 && me.postResult[index] && me.postResult[index]["id"]==id){
                        me.scrollToTarget(index);
                        me.INDEX = index;
                        try{
                            localStorage.setItem('MIRAGE_HOME_INDEX',0);
                            localStorage.setItem('MIRAGE_HOME_ID',"");
                        }catch(e){

                        }
                    }
                }
                me.bindEvent();
            });
        });
    },
    getMorePosts : function(){
        var me = this;
        fetchData({
            url : me.url,
            data : $.extend( {page:me.page,count:me.count}, me.params )
        }).done(function(result){
            if (result.posts && result.posts.length != 0) {
                var start = me.postResult.length;
                if(result.pages == me.page){
                    me.isLoadAll = true;
                }
                me.page++;
                me.isLoading = false;
                me.postResult = me.postResult.concat(result.posts);
                var _html = me.renderHomePage(result.posts,start);
                $('#container').append( _html );
                loading_tips.css("visibility","hidden");
            }
        });
    },
    formatHomeData : function(current,idx){
        var d = /(\d*)-(\d*)-(\d*)/.exec(current.date);
        return {
            id : current.id,
            index : idx,
            title: current.title,
            url: current.url,
            excerpt: current.excerpt,
            year: d[1].slice(2),
            month: d[2],
            day: d[3],
            attachmentsUrl: current.custom_fields  &&  current.custom_fields.topic &&  current.custom_fields.topic[0] || "",
            picnum: current.attachments.length
        };
    },
    renderHomePage : function(result,start) {
        //渲染list
        var renerData = [],
            me = this;
        result.forEach(function(current,idx){
            var index = idx + start;
            renerData.push( me.formatHomeData(current,index));
        });
        var tpl = template(me.TPL, { data :renerData });
        //this.renderBtns();
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
            if( me.postResult.length - me.INDEX < 10 && !me.isLoading && !me.isLoadAll){
                me.isLoading = true;
                me.getMorePosts();
            }
            if(me.INDEX >=0 && next < me.postResult.length && nextDom.length>0){
                ++me.INDEX;
                me.isLoadAll && me.renderBtns();
                typeof me.postResult[me.INDEX-1] == "undefined" ? $('.js-prev').hide() :  $('.js-prev').show();
                var _x = -me.getTranslateX(me.animateDiv)+nextDom.offset().left -100;
                me.translates( me.animateDiv, 200, -_x);
            }

        if(next == me.postResult.length && me.isLoading){
            loading_tips.css("visibility","visible");
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
    scrollToTarget : function(index){
        var current = this.animateDiv.find('.item[data-index="'+index+'"]');
        if(!current || current.length == 0){
            return false;
        }
        var _x = -this.getTranslateX(this.animateDiv)+current.offset().left -100;
        this.translates( this.animateDiv, 200, -_x);
    },
    reset : function(){
        this.INDEX = 0;
        this.page = 1;
    },
    renderSearch : function(search){
        var me = this;
        me.hideThumb();
        me.reset();
        loading_tips.css("visibility","visible");
        fetchData({
            url : '?json=get_search_results',
            data : {page:me.page,count:me.count,search:decodeURIComponent(search)}
        }).done(function(result){
            loading_tips.css("visibility","hidden");
            me.animateDiv.html();
            me.translates( me.animateDiv, 200, 0);
            if (result.posts && result.posts.length != 0) {
                me.page++;
                me.url = "?json=get_search_results";
                me.params.search = search;
                if(result.pages == 1){
                    me.isLoadAll = true;
                }
                me.postResult = result.posts;
                var _html = me.renderHomePage(result.posts,0);
                $('#container').html( _html );
                me.renderBtns();
            }
        })
    },
    hideThumb : function(){
        var thumb = $('.js-thumb');
        thumb.fadeOut(300);
        $('.nav-list').css({
            "transform":"translate(100%,-100%)"
        });
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

        var lastTime = null;
        $(window).bind('mousewheel', function(e){
            var time = new Date();
            if(lastTime && time-lastTime < 500){
                return false;
            }
            lastTime = time;
            var direct = scrollFunc(e);
            if(direct < 0){
                me.nextClick();
            }else if(direct > 0){
                me.prevClick();
            }
        });

        $(window).bind('resize',function(){
            me.scrollToTarget(me.INDEX);
        });

        nav.bind('click', function (e) {
            nav.hide();
            thumb.fadeIn(300);
            $('.nav-list').css({
                "transform":"translate(0,0)"
            });
        });
        thumb.delegate('.js-close', 'click', function(){
            me.hideThumb();
            nav.show();
        }).delegate('input[name="key"]','keyup', function(e){
            if(e.keyCode == 13){
                var value = $('input[name="key"]').val();
                me.renderSearch( $.trim(value) );
            }
        });
        
        me.animateDiv.delegate('.js-artical','click', function(){
             var link = $(this).attr("data-link");
             var id = $(this).attr("data-id");
            try{ //safri无痕模式 bug
                localStorage.setItem('MIRAGE_HOME_INDEX',me.INDEX);
                localStorage.setItem('MIRAGE_HOME_ID',id);
            }catch(e){}

             window.location.href = link;
        });

        $('.mylogo').bind('click', function(){
            me.INDEX = 0;
            me.scrollToTarget(me.INDEX);
            me.renderBtns();
        });

    }
};

var ArticalPage = function(){

};
ArticalPage.prototype = {
    TPL : ['<div class="back js-backHome pointer"><div class="wrap"><span class="btn"></span><span class="btn-txt">BACK</span></div></div>',
           '<div class="main">',
            '<div class="artical">',
                '<div class="artical-top">',
                    '<div class="artical-info">',
                    '{{title}}',
                    '</div>',
                    '<div>',
                        '<div class="cats">{{each categories as cate}}<span class="classify">{{cate.title}}</span>{{/each}}</div>',
                        '<div class="time">',
                            '<div class="year">{{year}}</div>',
                            '<div class="date">{{day}}/{{month}}</div>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="artical-content">',
                '{{#content}}',
                '</div>',
            '</div>',
            '<div class="right-box">',
            '<div class="right-share">',
            '<div class="right-social">',
            '{{if next_url}}<a class="prev-artical pointer" title="上一篇文章" href="{{next_url}}"></a><span class="prev-txt">PREV</span>{{/if}}',
            '{{if previous_url}}<span class="next-txt">NEXT</span><a class="next-artical pointer" title="下一篇文章" href="{{previous_url}}"></a>{{/if}}',
            '</div>',
            '</div>',
            '<div class="comments">',
            '<div class="comments-title">Comments（{{comments.length}})</div>',
            '{{if comments.length}}',
            '<div class="comments-wrapper"><ul class="comments-list">',
            '{{each comments as item}}',
            '<li id="comment_{{item.id}}" data-user="{{item.name}}">',
            '<div class="comment-author">',
            '<a href="javascript:void(0);" data-id="{{item.id}}" data-name="{{item.name}}" class="js-replay reply iconfont">&#xe602;</a>',
            '<a href="{{item.url}}" target="_blank" rel="nofollow">{{item.name}}</a>({{item.date}})',
            '</div>',
            '<div class="comment-c"><p>{{#item.content}}</p></div>',
            '</li>',
            '{{/each}}',
            '</ul></div>',
            '{{/if}}',
            '</div>',
            '<div class="comment-post">',
            '<div class="comment-load-mask"><span>WATING</span></div>',
            '<div class="comment-post-wrapper">',
            '<form>',
            '<div><textarea class="js-post-name" placeholder="YOUR NAME"></textarea></div>',
            '<div><textarea class="js-post-text" placeholder="WRITE HERE"></textarea></div>',
            '<div class="comment-submit"><a class="post-comment js-post" href="javascript:void(0)"></a></div>',
            '</form>',
            '</div>',
            '</div>',
            '</div>',
            '</div>'].join(''),
    commentTpl : ['<li id="comment_{{id}}" data-user="{{name}}"><div class="comment-author"><a href="javascript:void(0);" data-id="{{id}}" data-name="{{name}}"  class="js-replay reply iconfont">&#xe602;</a>',
        '<a href="{{url}}" target="_blank" rel="nofollow">{{name}}</a>({{date}})</div><div class="comment-c"><p></p><p>{{#content}}</p><p></p></div></li>'].join(''),
    init : function(opt){
        $('.homepage_body').hide();
        var me = this;
        this.type = opt.type;
        this.slug = opt.slug;
        var recentPost = fetchData({
            url : "?json=get_post&slug="+me.slug
        }).done(function(result){
            loading.fadeOut(800,function(){
                if(result && result.post){
                    me.id=result.post.id;
                    me.render(result)
                }
            });
        });
        this.bindEvent();
    },
    formatData: function(result){
        var d = /(\d*)-(\d*)-(\d*)/.exec(result.post.date);
        result.post.comments && result.post.comments.length > 0 && result.post.comments.reverse();
        return $.extend({},{
            year: d[1].slice(2),
            month: d[2],
            day: d[3],
            next_url : result.next_url,
            previous_url : result.previous_url
        },result.post);
    },
    render : function(result) {
        //渲染list
        var me = this;
        var renderData = me.formatData(result);
        var tpl = template(me.TPL, renderData);
        $('.artical_page').html(tpl);
        var articalContent = $('.artical-content');
        var $fimg = articalContent.find("img");
        var iframe = articalContent.find("iframe");
        $fimg.parents("p:not(.full-img)").addClass("full-img");
        iframe.parents("p:not(.full-img)").addClass("full-img");
    },
    post : function(){
        var me = this;
        var _name = $(".js-post-name").val();
        var _content = $(".js-post-text").val();
        var _aid = $(".js-post-text").attr('data-id');
        if (!_name || !_content) {
            return false;
        }else{
            var loadingDom = $('.comment-load-mask');
            loadingDom.show();
            fetchData({
                type: "POST",
                url: "/api/respond/submit_comment/",
                data: {post_id:me.id, email:"",parent:_aid, name:_name, url:"", content:_content},
                timeout: 30000
            }).done(function(_d){
                loadingDom.hide();
                me.resetComment();
                if (_d.status=="ok") { //写一条新评论
                    var tpl = template(me.commentTpl, _d);
                    $(".comments-list").prepend(tpl);
                    return false;
                } else {
                    //tips('tips', 'show', '评论提交失败，请刷新或稍后重试！');
                    return false;
                }
            }).fail(function(){
                loadingDom.hide();
                me.resetComment();
            });
        }
    },
    resetComment : function(){
        var postText = $('.js-post-text');
        postText.val('');
        postText.attr({'data-id':'',"data-user":''});
        $(".js-post-name").val('');
    },
    bindEvent : function(){
        var me = this;

        $('.artical_page').delegate('.js-replay', 'click', function(e){
            var name = $(e.target).attr('data-name');
            var id = $(e.target).attr('data-id');
            var postText = $('.js-post-text');
            postText.val('@'+name+':');
            postText.attr({'data-id':id,"data-user":name});
        }).delegate('.js-post-text','change', function(){
            var postText = $('.js-post-text');
            var name = postText.attr("data-user");
            var value = postText.val();
            if(value.indexOf('@'+name+':') !==0){
                postText.attr({'data-id':"","data-user":""});
            }
        }).delegate('.js-post','click', function(){
           me.post();
        }).delegate('.js-backHome','click',function(){
            window.location.href = HOST;
        });
    }
}
var homepage = new HomePage();
var articalPage = new ArticalPage();
//解析url
function initPage(){
    parseSearch();
    var path = location.pathname.split('/');
    var localprefix = 'wordpress',localtest = path.indexOf(localprefix);
    if(localtest !== -1){
        path = location.pathname.slice(localtest+localprefix.length,path.length);
    }

    if(path.length == 2){
        homepage.init();
    }else if(path.length == 3){
        articalPage.init({slug : path[1]});
    }
}

function fetchData(json){
    //获取文章信息
    return $.ajax({
        type: json.type || 'GET',
        dataType: json.dataType || "json",
        url: json.url,
        data : json.data,
        timeout: json.timeout || 30000
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
