<?php
get_header();
?>
<div class="audio-list-box">
Hola
<div class="row">
	<div class="col-sm-3">
		<div class="filterbox">
			<h2><?php _e('Filter', 'audio-editor-recorder'); ?></h2>
		<form method="get">
		<ul>
		<?php
			$args = array(
			'child_of'            => 0,
			'current_category'    => 0,
			'depth'               => 0,
			'echo'                => 1,
			'exclude'             => array(1),
			'exclude_tree'        => '',
			'feed'                => '',
			'feed_image'          => '',
			'feed_type'           => '',
			'hide_empty'          => false,
			'hide_title_if_empty' => false,
			'hierarchical'        => true,
			'order'               => 'ASC',
			'orderby'             => 'name',
			'separator'           => '<br />',
			'show_count'          => 0,
			'show_option_all'     => '',
			'show_option_none'    => __( 'No categories', 'audio-editor-recorder' ),
			'style'               => 'list',
			'taxonomy'            => 'category',
			'title_li'            => __( 'Categories', 'audio-editor-recorder' ),
			'use_desc_for_title'  => 1,
			);
		$all_categories = get_categories($args);
		$categories = array();
		if(count($all_categories)>0){
			if(isset($_GET['category'])){
				$categories = sanitize_text_field( $_GET['category'] );
				//$categories = $_GET['category'];
			}
			foreach ($all_categories as $key => $value) {
				$selected = '';
				if(in_array($value->slug, $categories)){
					$selected = 'checked';
				}
				?>
				<li><div class="checkbox"><input type="checkbox" name="category[]" value="<?php echo esc_attr($value->slug);?>" <?php echo esc_attr($selected);?>> <?php echo esc_attr($value->name) ;?></div></li>
			<?php } ?>
			<li><button type="submit" class="a_btn btn-primary"><?php _e('Filter', 'audio-editor-recorder'); ?></button></li>
		 <?php }
		?>
		</ul>
	</form>

	</div>
	</div>
	<div class="col-sm-9">

		<div class="main_contentbox">
		<div class="row">
	<?php
	if(isset($_GET['category']) && count($_GET['category'])>0){
		$category = sanitize_text_field( $_GET['category'] );
		$implodecat=implode('+', $category);
		$args = array(
        'post_type' => 'audio',
        'post_status' => 'publish',
        'posts_per_page' => 8,
        'orderby' => 'title',
        'order' => 'ASC',
			'tax_query' => array(
			array(
			'taxonomy' => 'category',
			'field' => 'name',
			'terms' => $implodecat,
			'include_children' => false
			) ,
    	)
		);
	} else {
	$args = array(
        'post_type' => 'audio',
        'post_status' => 'publish',
        'posts_per_page' => 8,
        'orderby' => 'title',
        'order' => 'ASC',
    );
	}

    $loop = new WP_Query( $args );

    while ( $loop->have_posts() ) : $loop->the_post(); ?>

		<div class="col-sm-4">
    	<div class="list_item_box">
    		<?php
    		$imageurl = get_the_post_thumbnail_url();
    		if(!empty($imageurl)){
    		?>
    		<div class="imgbox gggg"><img src="<?php echo esc_attr($imageurl); ?>" ></div>
    		<?php }?>
			<div class="titlebox ggg"><a href="<?php echo esc_attr(get_permalink(get_the_ID()));?>"><?php echo esc_attr(get_the_title()); ?></a></div>
    		<?php
			$value = get_post_meta( get_the_ID(), '_my_meta_value_key', true );
			if($value !=''){
				echo '<audio id="adioPlay" src="'. esc_attr( $value ) . '" controls></audio>';
			}
    		?>

        	<div class="category_box">
			<?php
			$cat = get_the_category( $post->ID );

			if(count($cat)>0){
			foreach ($cat as $key => $value) {
			echo '<a href="'.esc_attr(get_category_link($value->term_id)).'" >'.esc_attr($value->name) .'</a>';
			}
			}
$audio_content = esc_attr(wp_strip_all_tags(get_the_content()));
			?>
        	</div>
        	<div class="contentbox"><?php if ($audio_content != 'undefined') {echo $audio_content;} ?></div>
    	</div>
		</div>
    <?php endwhile;
    wp_reset_postdata();
    ?>
</div>
</div>

	</div>


</div>
</div>
<?php
get_footer();
?>