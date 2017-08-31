$('#form').submit(function(event) {
  event.preventDefault();
  submit();
});

function submit() {
  let name = $("#name").val();
  let phone = $("#phone").val();
  let message = $("#message").val();
  let info = {name: name, phone: phone, message: message}
  $.ajax({
    type: "POST",
    url: "/contact",
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
  $(".contact-form-message").fadeIn();
  $(".contact-form-message").html('<h2>' + 'YOUR MESSAGE HAS BEEN SENT' + '</h2><p>' + 'We will get back to you shortly!' +'</p>');
}

function failed() {
  $("#form").hide();
  $("#resHeader").hide();
  $(".contact-form-message").addClass("contact-form-failed");
  $(".contact-form-message").fadeIn(3000);
  $(".contact-form-message").html('<h2>' + 'UH OH! SOMETHING WENT WRONG!' + '</h2><p>' + 'Please call us @ 555-555-2849' +'</p>');
}

function initMap() {
  let uluru = {lat: 27.751473, lng: -82.629998};
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  let marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}
