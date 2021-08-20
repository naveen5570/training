
 $(function(){
  $('#searchName').autoComplete({
  source: function(req,res){
  $.ajax({
   url: "/autocomplete",
   dataType: "jsonp",
   type: "GET",
  data: req,
  success: function(data){
  
  },
  error: function(err){
  console.log(err.status);
  },
  });  
  },
  minlength:1,
  select: function(event,ui){
  if(ui.item){
  $('#searchName').text(ui.item.label);
  }
  }
  });
  });
 