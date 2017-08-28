$('#form').submit(function(event) {
  event.preventDefault();
  submit();
})

function submit() {
  var name = $("#name").val();
  var phone = $("#phone").val();
  var message = $("#message").val();
  var info = {name: name, phone: phone, message: message}
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/contact",
    data: info,
    success: function(text) {
      if (text === "success") {
        success();
      } else {
        failed();
      }
    }
  });
}

function success() {
  $("#form").hide();
  $("#resHeader").hide();
  $(".message-update").fadeIn();
  $(".message-update").html('<h2>' + 'YOUR MESSAGE HAS BEEN SENT' + '</h2><p>' + 'We will get back to you shortly!' +'</p>');
}

function failed() {
  $("#form").hide();
  $("#resHeader").hide();
  $(".message-update").addClass("failed")
  $(".message-update").fadeIn(3000);
  $(".message-update").html('<h2>' + 'UH OH! SOMETHING WENT WRONG!' + '</h2><p>' + 'Please call us @ 555-555-2849' +'</p>');
}

function initMap() {
  var uluru = {lat: -25.363, lng: 131.044};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}
