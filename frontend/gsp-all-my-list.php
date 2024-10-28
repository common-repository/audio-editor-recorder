<?php

// The shortcode function
if( ! function_exists('gspaudio_my_audios'))
{
function gspaudio_my_audios() {
	if(is_user_logged_in()){

		$message = gspaudio_get_all_my_audio_list();

} else {
  $message = '<div class="container_audio audiolayout" style="background: #fff !important;text-align:center;">'. __('Login Required!', 'audio-editor-recorder') . '</div>';
}
return $message;
}
}
add_shortcode('audio-my-list', 'gspaudio_my_audios');

if( ! function_exists('gspaudio_get_all_my_audio_list'))
{
function gspaudio_get_all_my_audio_list(){
ob_start();	$user_id = get_current_user_id();
	?>
<div class="audio-list-box">


	<?php
	if(isset($_GET['edit_post_id']) && $_GET['edit_post_id'] !=''){
		//echo 'fdsfds';die;
	$edit_post_id = sanitize_text_field( $_GET['edit_post_id'] );

	global $wpdb;
	$post_id = $edit_post_id;
	$get_post = get_post($post_id,ARRAY_A);
	$datahtml = array();
	$title = '';
	$post_content = '';
	$image = '';
	$audio = '';
	$categories = array();
	if(count($get_post)>0){
		$title = $get_post['post_title'];
		$post_content = $get_post['post_content'];
		$imageurl = get_the_post_thumbnail_url($post_id);
    	if(!empty($imageurl)){
			$image = $imageurl;
		}
		$cat = get_the_category( $post_id );

 		if(count($cat)>0){
		foreach ($cat as $key => $value) {
			$categories[] = $value->name;
		}
		}

		$value = get_post_meta( $post_id, '_my_meta_value_key', true );
		if($value !=''){
			$audio= esc_attr( $value ) ;
		}


	}

	 require_once(plugin_dir_path( __FILE__ ).'/user_audio_edit_form.php');

	} else {
	?>
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
				$category = sanitize_text_field( $_GET['category'] );
				$categories = $category;
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
	$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

	if(isset($_GET['category']) && count($_GET['category'])>0){
		$category = sanitize_text_field( $_GET['category'] );
		$implodecat=implode('+', $category);
		$args = array(
        'post_type' => 'audio',
        'author' => $user_id,
        'posts_per_page' => 8,
        'orderby' => 'title',
        'order' => 'ASC',
        'paged' => $paged,
        'post_status' => array('publish', 'pending', 'draft'),
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
        'author' => $user_id,
        'posts_per_page' => 8,
        'orderby'=> 'date',
        'order' => 'DESC',
        'paged' => $paged ,
        'post_status' => array('publish', 'pending', 'draft')
    );
	}

    $loop = new WP_Query( $args );

    while ( $loop->have_posts() ) : $loop->the_post(); ?>
		<?php if(is_user_logged_in()){	$audio_post_item_id = esc_attr(get_the_ID());$current_user_id = get_current_user_id();$author_id = get_post_field( 'post_author', $audio_post_item_id ); if ( $current_user_id == $author_id ) { ?>
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
			$cat = get_the_category( get_the_ID() );

			if(count($cat)>0){
			foreach ($cat as $key => $value) {
			echo '<a href="'.esc_attr(get_category_link($value->term_id)).'" >'.esc_attr($value->name) .'</a>';
			}
			}
$audio_content = esc_attr(wp_strip_all_tags(get_the_content()));
			?>
        	</div>
        	<div class="contentbox"><?php if ($audio_content != 'undefined') {echo $audio_content;} ?></div>
			<div class="post_status_box"><b><?php _e('Status','audio-editor-recorder') ?>:</b><?php echo esc_attr(get_post_status()); ?></div>
<?php if(is_user_logged_in()){	$audio_post_item_id = esc_attr(get_the_ID());$current_user_id = get_current_user_id();$author_id = get_post_field( 'post_author', $audio_post_item_id ); if ( $current_user_id == $author_id ) { ?>        	<div class="actionbox">        		<a href="<?php echo esc_attr(get_the_permalink(get_the_ID()));?>" type="button" class="a_btn btn-primary" data-post_id="<?php echo esc_attr(get_the_ID());?>"><?php _e('Edit','audio-editor-recorder') ?></a>        		<input type="hidden" class="postdatanewd" data-post_id="<?php echo esc_attr(get_the_ID());?>">        	</div><?php }} ?>

    	</div>
		</div><?php }} ?>
    <?php endwhile;
    ?>
    <div style="clear: both;"></div>
    <div class="paginationbox">
    <?php
    	$total_pages = $loop->max_num_pages;
		if ($total_pages > 1){
		$current_page = max(1, get_query_var('paged'));
		echo paginate_links(array(
		'base' => get_pagenum_link(1) . '%_%',
		'format' => '/page/%#%',
		'current' => $current_page,
		'total' => $total_pages,
		'prev_text'    => __('« prev'),
		'next_text'    => __('next »'),
		));
		}
		wp_reset_postdata();
	?>
	</div>
</div>
</div>

	</div>
	</div>
	<style type="text/css">
	.paginationbox .page-numbers {    padding: 4px 9px;    background: #898989;    color: #fff;    border-radius: 2px;    margin: 2px 0 !important;    display: inline-flex;}
	</style>

	<?php }?>
</div>

<script type="text/javascript">
	jQuery('.postdatanew').click(function(){
		jQuery('#postdata .modal-body .a_loadingbox').show();
		jQuery('#postdata .modal-body .afteloadingbox').hide();
	jQuery('#postdata').modal('show');

	jQuery(this).parent().find('.postdatanewd').trigger('click');
});
</script>
<?php
return ob_get_clean();
}
}
?>