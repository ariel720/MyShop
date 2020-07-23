/*
Shinhee Kim
200394763
2020-07-23
*/




$(document).ready(function(){
  $('.delete-product').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/product/'+id,
      success: function(response){
        alert('Product Deleted.');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
