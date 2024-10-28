<div class="a_form-group ">
<?php echo do_shortcode('[user-audio-edit datahref="'.esc_attr($audio).'"]');?>
</div>
<div class="a_form-group">
<input type="text" class="a_form-control" id="title" placeholder="<?php _e('Title', 'audio-editor-recorder'); ?>" style="height:42px;" value="<?php echo esc_attr($title);?>">
</div>
<div class="a_form-group">
<textarea row="25" cols="25" placeholder="<?php _e('Description', 'audio-editor-recorder'); ?>" style="width: 100%;height: 90px;" id="description"><?php echo esc_html($post_content);?></textarea>
</div>
<div class="a_form-group audio-image">
<?php
if(isset($image) && $image !=''){?>
<img src="<?php echo esc_attr($image);?>" id="preview_ie" style="width: 100px;">
<?php } else { ?>
<img src="<?php echo esc_attr(plugin_dir_url( __FILE__ ));?>../images/default_avater.png" id="preview_ie" style="width: 100px;">
<?php }
?>
<button type="button" class="a_btn btn-primary" id="image_upload"><?php _e('Upload image', 'audio-editor-recorder'); ?></button>


<input type="file" name="featured_image" style="opacity: 0" id="featured_image" accept="image/*">

</div>
<div class="a_form-group categoriesbox">
<button type="button" class="a_btn btn-primary addbutton ddd"><i class="fa fa-plus"></i> <?php _e('Add categories', 'audio-editor-recorder'); ?></button>
<?php
if(isset($_GET['edit_post_id']) && $_GET['edit_post_id'] != ''){
	$post_id = sanitize_text_field( $_GET['edit_post_id'] );
} else  {
	$post_id = $post->ID;
}
$catsss = get_the_terms( $post_id,'audios');


if(is_array($catsss) && count($catsss)>0){
	$ii=1000000;
	foreach ($catsss as $key => $value) {
		echo '<div class="categories_box"><input type="text" placeholder="' . _e('Enter Category', 'audio-editor-recorder') . '" name="categories[]" class="categories a_form-control" data-id="'.$ii.'" value="'.esc_attr($value->name).'"><i class="fa fa-minus deleteca"></i><div style="clear:both"></div></div>';
		$ii++;
	}
}
?>
</div>
<button type="button" class="a_btn btn-default updateaudio" id="senddata" data-type="pending" data-post_id="<?php echo esc_attr($post_id);?>"><?php _e('Send for review', 'audio-editor-recorder'); ?></button>
<button type="button" class="a_btn btn-default updateaudio" data-type="draft" data-post_id="<?php echo esc_attr($post_id);?>"><?php _e('Save as Draft', 'audio-editor-recorder'); ?></button>