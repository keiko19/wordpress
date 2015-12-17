<?php
        /**
        * 加载低定义css
        */
       function mirageyard_scripts() {
            // Add custom fonts, used in the main stylesheet.
            // wp_enqueue_style( 'twentyfifteen-fonts', twentyfifteen_fonts_url(), array(), null );

            // Add Genericons, used in the main stylesheet.
            wp_enqueue_style( 'styles', get_template_directory_uri() . '/style.css' );
       }
       add_action( 'wp_enqueue_scripts', 'mirageyard_scripts' );

        /**
        * Register widget area.
        * 注册组件sidebar
        * @link https://codex.wordpress.org/Function_Reference/register_sidebar
        */
        function mirageyard_widgets_init() {
            register_sidebar( array(
                'name' => __('Left Sidebar', 'mirageyard') ,
                'id'            => 'sidebar-1',
                'description'   => __( '页面左侧主导航', 'mirageyard' ),
                'before_widget' => '<aside id="%1$s" class="widget %2$s">',
                'after_widget'  => '</aside>',
                'before_title'  => '<h2 class="widget-title">',
                'after_title'   => '</h2>',
            ) );
        }
        /* add_action( 'widgets_init', 'mirageyard_widgets_init' );*/

        if (!function_exists('mirageyard_setup')):
            /**
            * 设置默认的主题，并注册为WordPress的各种功能的支持.
            * @since island 1.0.0
            */
            function mirageyard_setup() {
                /* 1.启用自定义菜单 */
                register_nav_menus(array(
                    'mainmenu' => __('Main Menu', 'mirageyard') ,
                    'social'  => __( 'Social Links Menu', 'mirageyard' ),
                ));
            }
        endif;
        add_action('after_setup_theme', 'mirageyard_setup');
?>