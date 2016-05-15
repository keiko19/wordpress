<?php get_header(); ?>
<?php if ( is_home() && ! is_front_page() ) : ?>
<header>
    <h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
</header>
<?php endif; ?>
<div class="homepage_body" style="display:none">
    <div class="flex-box">
        <div class="flex-top">
            <div class="top">
                <div class="mylogo pointer"></div>
                <div class="nav pointer iconfont js-nav">&#xe603;</div>
            </div>
        </div>
        <div class="flex-center">
            <div class="center" id="panel">
                    <div class="prev pointer">
                        <div class="click-item js-prev">
                            <div class="wrap"><span class="btn"></span><span class="btn-txt">PREV</span></div>
                        </div>
                        <div class="btn-bottom"></div>
                    </div>
                    <div class="next pointer">
                        <div class="click-item js-next">
                            <div class="wrap"><span class="btn"></span><span class="btn-txt">NEXT</span></div>
                        </div>
                         <div class="btn-bottom"></div>
                    </div>
                    <ul id="container" class="slide-box"></ul>
            </div>
        </div>
    </div>
        <!-- 导航 start -->
    <div class="thunm js-thumb">
        <div class="main-mask"></div>
        <div class="close js-close iconfont pointer">&#xe605</div>
        <div class="nav-list">
            <div class="social">
                <div class="search_container">
                    <div class="search">
                        <i class="magnifier iconfont pointer">&#xe600;</i>
                        <input name="key"/>
                    </div>
                </div>
                <div class="list">
                    <p><a href="http://miragetrip.com/old/old/?page_id=159" target="_blank">ABOUT</a></p>
                    <p><a href="http://miragetrip.com/old/old/?page_id=1203" target="_blank">LINKS</a></p>
                </div>
                <div class="olds">
                    <p><a href="http://miragetrip.com/old/" target="_blank">OLD MIRAGETRIP </a></p>
                    <p><a href="http://miragetrip.com/old/" target="_blank">(2006-2012)</a></p>
                </div>
                <div class="we_chat">
                    <div class="twoCode"></div>
                    <p>0.9(ALPHA)</p>
                    <p>Designed by Evacuee/Coded by ESSE/Powerd by Wordptess</p>
                    <p>© 2005-2016 miragetrip.com. ALL RIGHTS RESERVED.</p>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="artical_page"></div>
        <!-- loading  -->
<div class="loading">
    <div class="master"><span class="master-img"></span></div>
    <div class="load"><span class="load-img"></span></div>
    <div class="blog-desc">DESIGNs wED BY EVACUEE</div>
</div>
<div class="loading_tips"></div>
<?php get_footer(); ?>