<?php
if ( has_nav_menu( 'mainmenu' ) || has_nav_menu( 'social' )  ) : ?>
	<?php if ( has_nav_menu( 'mainmenu' ) ) : ?>
	<div id="site-navigation" class="main-nav">
				<?php
					// Primary navigation menu.
					wp_nav_menu( array(
						'menu_class'     => 'nav-menu',
						'theme_location' => 'mainmenu',
					) );
				?>
			<!-- .main-navigation -->
	</div><!-- .secondary -->
	<?php endif; ?>
	<?php if ( has_nav_menu( 'mainmenu' ) ) : ?>
	<div id="social-navigatio" class="social-nav">
			<?php
				// Primary navigation menu.
				wp_nav_menu( array(
					'menu_class'     => 'nav-menu',
					'theme_location' => 'social',
				) );
				?>
		<!-- .main-navigation -->
	</div><!-- .secondary -->
	<?php endif; ?>
<?php endif; ?>
