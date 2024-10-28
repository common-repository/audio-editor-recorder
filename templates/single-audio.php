<?php

if( wp_is_block_theme() ) {
    block_template_part('header');
    echo '<style>div#headerimg, hr, #footer{display:none;}</style>';
}

get_header();

global $post;
wp_enqueue_style( 'gsp-font-awesome', plugins_url( '../assets/css/font-awesome.min.css?id='.rand(), __FILE__ ),false,true );
?>
<div class="single-audio-page jkk">
<div class="container_audio">
<?php
if((isset($_GET['edit_post_id']) && $_GET['edit_post_id'] !='') OR (isset($_GET['p']) && $_GET['p'] !='') ){
global $wpdb;
$post_id =  isset($_GET['edit_post_id']) ? sanitize_text_field($_GET['edit_post_id']) : sanitize_text_field($_GET['p']);
$get_post = get_post($post_id,ARRAY_A);
$datahtml = array();
$title = '';
$post_content = '';
$image = '';
$audio = '';
$categories = array();
if(count($get_post)>0){
$title = $get_post['post_title'];
$post_content = esc_attr(wp_strip_all_tags(get_the_content()));
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
require_once(plugin_dir_path( __FILE__ ).'../frontend/user_audio_edit_form.php');
} else {
?>
<div class="row">
<div class="col-sm-12">
<div class="fer-video">
<?php
$imageurl = get_the_post_thumbnail_url($post->ID);
if(!empty($imageurl)){
?>
<div class="imgbox"><img src="<?php echo esc_attr($imageurl); ?>" ></div>
<?php }?>
<div class="sub-title">
<?php echo esc_attr( $post->post_title );?>
</div>

<div class="audiobox">
<?php
$value = get_post_meta( $post->ID, '_my_meta_value_key', true );
if($value !=''){
echo '<audio id="adioPlay" src="'. esc_attr( $value ) . '" controls></audio>';
}
?>
</div>

<div class="sub-meta">
<?php
$cat = get_the_category( $post->ID );

if(count($cat)>0){
foreach ($cat as $key => $value) {
echo '<a href="'.get_category_link($value->term_id).'" >'.esc_attr( $value->name ) .'</a>';
}
}
?>
</div>
<div class="sub-dec">
<p><?php $audio_content = ( $post->post_content );if ($audio_content != 'undefined') {echo $audio_content;} ?></p>
</div>
<?php if(is_user_logged_in()){
$current_user_id = get_current_user_id();global $post;$post_id = $post->ID;$author_id = get_post_field( 'post_author', $post_id ); if ( $current_user_id == $author_id ) { ?><div class="edit-new-btns">
<a href="?edit_post_id=<?php echo esc_attr( $post->ID );?>" data-post_id="<?php echo esc_attr( $post->ID );?>"><?php _e('Edit', 'audio-editor-recorder'); ?></a>
<input type="hidden" class="postdatanewd" data-post_id="<?php echo esc_attr( $post->ID );?>">
</div><?php }} ?>
</div>
</div>
</div>
</div>
<?php }?>

</div>
<script type="text/javascript">
jQuery('.postdatanew').click(function(){
jQuery('#postdata .modal-body .a_loadingbox').show();
jQuery('#postdata .modal-body .afteloadingbox').hide();
jQuery('body').append('<div class="a_modal-backdrop in"></div>');
jQuery('#postdata').show();

jQuery(this).parent().find('.postdatanewd').trigger('click');
});
</script>
<?php
if( wp_is_block_theme() ) {
    block_template_part('footer');
}

get_footer();

?>