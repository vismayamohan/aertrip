$(document).ready(function() {
  $('#exp_carousel').owlCarousel({
    navigation:false,
    loop:true,
    margin:10,
    responsiveClass:true,
    autoplay:true,
    slideSpeed:500,
    autoplayTimeout:5000,
    responsive:{
      0: {
        items: 1,
      },
      700: {
        items: 1.5,
      },
      1000: {
        items: 1,
      }
    }
  });
})
$(document).ready(function() {
  $('#skill_carousel').owlCarousel({
    navigation:false,
    loop:true,
    margin:10,
    responsiveClass:true,
    autoplay:false,
    responsive:{
      0: {
        items: 1,
      },
      700: {
        items: 1,
      },
      1000: {
        items: 1,
      }
    }
  });
})

$(document).ready(function() {
  $('#work_carousel').owlCarousel({
    navigation:false,
    loop:true,
    margin:10,
    responsiveClass:true,
    addClassActive: true,
    dots: false,
    afterAction: function(el){
      //remove class active
      this
      .$owlItems
      .removeClass('activeblah')
   
      //add class active
      this
      .$owlItems //owl internal $ object containing items
      .eq(this.currentItem + 1)
      .addClass('activeblah')    
       } ,
    responsive:{
      0: {
        items: 1.5,
      },
      700: {
        items: 2,
      },
      1000: {
        items: 3,
      }
    },

    afterAction: function(elem){
      $(elem).addClass("curent");
  }
  });
})

// $('.skill_main').click(function() {
//   $('.skillimg').attr('src',"./assets/images/icon-flight-number.png.png");
//   // console.log(a);
// })

$("#html").click(function() {
  $('.skillimg').attr('src',"./assets/images/html5.png");
  console.log('hello')
})
$("#css").click(function() {
  $('.skillimg').attr('src',"./assets/images/css3.png");
  console.log('hello')
})
$("#bootstrap").click(function() {
  $('.skillimg').attr('src',"./assets/images/bootstrap.png");
  console.log('hello')
})
$("#tailwind").click(function() {
  $('.skillimg').attr('src',"./assets/images/tailwind.png");
  console.log('hello')
})
$("#javascript").click(function() {
  $('.skillimg').attr('src',"./assets/images/javascript.png");
  console.log('hello')
})
$("#angular").click(function() {
  $('.skillimg').attr('src',"./assets/images/angular.png");
  console.log('hello')
})
