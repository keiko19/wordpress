<?php get_header(); ?>
<?php if ( is_home() && ! is_front_page() ) : ?>
<header>
    <h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
</header>
<?php endif; ?>
<div class="body">
    <div class="top">
        <div class="mylogo pointer"></div>
        <div class="nav pointer iconfont js-nav">&#xe603;</div>
    </div>
    <div class="center" id="panel">
        <div class="prev pointer js-prev"><div class="wrap"><span class="btn"></span><span class="btn-txt">PREV</span></div></div>
        <div class="next pointer js-next"><div class="wrap"><span class="btn"></span><span class="btn-txt">NEXT</span></div></div>
        <div id="container"></div>
    </div>
        <!-- 导航 start -->
    <div class="thunm js-thumb">
        <div class="main-mask"></div>
        <div class="nav-list">
            <div class="close js-close iconfont pointer">&#xe605</div>
            <div class="social">
                <div class="search">
                    <i class="magnifier iconfont pointer">&#xe600;</i>
                    <input name="key"/>
                </div>
                <ul class="list">
                    <li>ABOUT</li>
                    <li>LINKS</li>
                    <li>ACTIVITY</li>
                </ul>
            </div>
            <ul class="thumb-list">
                <li>DIARY</li>
                <li>LINKS</li>
                <li>ACTIVITY</li>
            </ul>
        </div>
    </div>
    <!-- 导航 end -->
</div>
<?php get_footer(); ?>