jQuery(document).ready(function($) {
  //final width --> this is the quick view image slider width
  //maxQuickWidth --> this is the max-width of the quick-view panel
  var sliderFinalWidth = 200,
    maxQuickWidth = 900;

  //open the quick view panel
  $('.pqv-trigger').on('click', function(event) {
    var pqvTrigger = $(this);
    var selectedImage =pqvTrigger.children('img'),
      selectedImageUrl = pqvTrigger.data('product-image'),
      selectedTitle = pqvTrigger.parent('.pqv-item').children('div.pqv-product-title').html(),
      selectedDescripton =pqvTrigger.parent('.pqv-item').children('div.pqv-product-description').html(),
      selectedArticleLink = pqvTrigger.data('article-link'),
      productType = pqvTrigger.data('product-type');

    $('body').addClass('overlay-layer');
    $('.pqv-scrollable-wrap').addClass('visible');

    if (productType == 'article') {
      $('ul.pqv-item-action li.count-collection').hide()
    } else {
      $('ul.pqv-item-action li.count-collection').show()
    }

    //update the visible slider image in the quick view panel
    //you don't need to implement/use the updateQuickView if retrieving the quick view data with ajax
    updateQuickView( selectedImageUrl, selectedTitle, selectedDescripton, selectedArticleLink );

    var quickViewWidth = ( $(window).width() * .8 < maxQuickWidth ) ? $(window).width() * .8 : maxQuickWidth;
    $('#pqv-quick-view-predict-size').css('width','' + quickViewWidth + 'px');

    animateQuickView(selectedImage, sliderFinalWidth, maxQuickWidth, 'open');
  });

  //close the quick view panel
  $('.pqv-scrollable-wrap').on('click', function(event){
    if ($(event.target).is('.pqv-close') || $(event.target).is('.pqv-scrollable-wrap.visible')) {
      closeQuickView( sliderFinalWidth, maxQuickWidth);
    }
  });

  $(document).keyup(function(event){
    //check if user has pressed 'Esc'
    if (event.which=='27') {
      closeQuickView( sliderFinalWidth, maxQuickWidth);
    }
  });

  //center quick-view on window resize
  $(window).on('resize', function() {
    if ($('.pqv-quick-view').hasClass('is-visible')) {
      window.requestAnimationFrame(resizeQuickView);
    }
  });

  function updateQuickView( url, title, description, article ) {
    $('#pqv-item-image').attr( 'src', '' + url ).attr( 'alt', '' + title );
    $('#pqv-item-title').html( '' + title );
    $('#pqv-item-description').html( '' + description );
    $('#pqv-item-btn-title').html( '' + title );
    $('#pqv-item-article').attr( 'href', '' + article );

    $('#pqv-item-image-predict-size').attr( 'src', '' +  url + '' ).attr( 'alt', '' +  title );
    $('#pqv-item-title-predict-size').html( '' + title );
    $('#pqv-item-description-predict-size').html( '' + description );
    $('#pqv-item-btn-title-predict-size').html( '' + title );
    $('#pqv-item-article-predict-size').attr( 'href', '' + article );
  }

  function resizeQuickView() {
    var quickViewLeft = ($(window).width() - $('.pqv-quick-view').width())/2,
      quickViewTop = ($(window).height() - $('.pqv-quick-view').height())/2;
    $('.pqv-quick-view').css({
      "top": quickViewTop,
      "left": quickViewLeft,
    });
  }

  function closeQuickView(finalWidth, maxQuickWidth) {
    var close = $('.pqv-close'),
      activeSliderUrl = close.siblings('.pqv-slider-wrapper').find('.selected img').attr('src'),
      selectedImage = $('.empty-box').find('img');
    //update the image in the gallery
    if (!$('.pqv-quick-view').hasClass('velocity-animating') && $('.pqv-quick-view').hasClass('add-content')) {
      selectedImage.attr('src', activeSliderUrl);
      animateQuickView(selectedImage, finalWidth, maxQuickWidth, 'close');
    } else {
      closeNoAnimation(selectedImage, finalWidth, maxQuickWidth);
    }
  }

  function animateQuickView(image, finalWidth, maxQuickWidth, animationType) {
    //store some image data (width, top position, ...)
    //store window data to calculate quick view panel position

    var parentListItem = image.parent('.pqv-trigger'),
      topSelected = image.parent('div').parent('.pqv-item').offset().top - $(window).scrollTop() - 40,
      leftSelected = image.parent('div').parent('.pqv-item').offset().left  - ( ( 200 - image.parent('div').parent('.pqv-item').width() ) / 2 ),
      widthSelected = image.width(),
      heightSelected = image.height(),
      windowWidth = $(window).width(),
      windowHeight = $(window).height(),
      finalLeft = (windowWidth - finalWidth)/2,
      finalTop = ($(window).height() - $('.pqv-quick-view').height())/2,
      finalHeight = finalWidth * heightSelected/widthSelected,
      quickViewWidth = ( windowWidth * .8 < maxQuickWidth ) ? windowWidth * .8 : maxQuickWidth ,
      quickViewLeft = (windowWidth - quickViewWidth)/2;

      // if max screen with is 730
      if ( $(window).width() < 730 ) {
        finalTop = 20;
      }

    if ( animationType == 'open') {
      //hide the image in the gallery
      parentListItem.addClass('empty-box');
      //place the quick view over the image gallery and give it the dimension of the gallery image
      $('.pqv-quick-view').css({
        "top": topSelected,
        "left": leftSelected,
        "width": widthSelected,
      }).velocity({
        //animate the quick view: animate its width and center it in the viewport
        //during this animation, only the slider image is visible
        'top': finalTop+ 'px',
        'left': finalLeft+'px',
        'width': finalWidth+'px',
      }, 1000, [ 400, 20 ], function(){
        //animate the quick view: animate its width to the final value
        $('.pqv-quick-view').addClass('animate-width').velocity({
          'left': quickViewLeft+'px',
          'width': quickViewWidth+'px',
        }, 300, 'ease' ,function(){
          //show quick view content
          $('.pqv-quick-view').addClass('add-content');
        });
      }).addClass('is-visible');
    } else {
      //close the quick view reverting the animation
      $('.pqv-quick-view').removeClass('add-content').velocity({
        'top': finalTop+ 'px',
        'left': finalLeft+'px',
        'width': finalWidth+'px',
      }, 300, 'ease', function(){
        $('body').removeClass('overlay-layer');
        $('.pqv-quick-view').removeClass('animate-width').velocity({
          "top": topSelected,
          "left": leftSelected,
          "width": widthSelected,
        }, 500, 'ease', function(){
          $('.pqv-quick-view').removeClass('is-visible');
          parentListItem.removeClass('empty-box');
          $('.pqv-scrollable-wrap').removeClass('visible');
        });
      });
    }
  }

  function closeNoAnimation(image, finalWidth, maxQuickWidth) {
    var parentListItem = image.parent('.pqv-item'),
      topSelected = image.parent('div').parent('.pqv-item').offset().top - $(window).scrollTop() - 40,
      leftSelected = image.parent('div').parent('.pqv-item').offset().left - ( ( 200 - image.parent('div').parent('.pqv-item').width() ) / 2 ),
      widthSelected = image.width();
      //close the quick view reverting the animation
      $('body').removeClass('overlay-layer');
      parentListItem.removeClass('empty-box');
      $('.pqv-quick-view').velocity("stop").removeClass('add-content animate-width is-visible').css({
        "top": topSelected,
        "left": leftSelected,
        "width": widthSelected,
      });
    }
  });

// // scroll to id
scrollToID();
function scrollToID() {
 $('.scroll-to').on('click', function(event) {
   event.preventDefault();
   var target = $(this).attr('href'); /* or window.location.hash if from outer page */
   $('html, body').stop(true,true).animate({
    scrollTop: $(target).offset().top - 70
   }, 700, function() {
   });
 });
}

$(document).ready(function() {
  // New Main-menu
  // Advanced crucial Main-menu hovers, triggers and fixed-menu functions
  mainMenuTriggers();
  fixedMenu();

  function mainMenuTriggers() {
    //mobile menu
    $('#mobile-menu-trigger').on('click', function(e) {
      $('#main-menu').toggleClass('mobile-menu-visible');
      $('body').toggleClass('mobile-menu-visible');
    });
  }

  // Add menu after scrolldown
  // Determine if mobile and modify accordingly
  function fixedMenu() {
    // sentinel
    var fixedMenuOn = false;

    if ( window.innerWidth >= 1050 ) {
      fixedMenuOn = true;
    }
    $(window).on('resize', function(event) {
      if ( window.innerWidth >= 1050 ) {
        fixedMenuOn = true;
      } else {
        fixedMenuOn = false;
        $('body').removeClass('fixed-menu-active');
        $('body').removeClass('menu-scroll-out');
      }
    });

    var $document = $(document),
    $element = $('body');
    $main_menu = $("#main-menu").find('.calculator');
    $document.scroll(function() {
      if (fixedMenuOn === true) {
        if ($document.scrollTop() > ($(window).height() * 0.60)) {
          // user scrolled more than 60% of the screen size
          $element.removeClass('menu-scroll-in');
          $element.removeClass('menu-fade-in');
          $element.addClass('fixed-menu-active');
          // $element.addClass('menu-scroll-in');
          $main_menu.hide();
        } else {
          $('.fixed-menu-active').removeClass('menu-scroll-in');
          $('.fixed-menu-active').addClass('menu-scroll-out');
          $('.menu-scroll-out').one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
          function (e) {
            $element.removeClass('fixed-menu-active');
            $element.removeClass('menu-scroll-out');
            $element.addClass('menu-fade-in');
            $main_menu.show();
          });
        }
      } else {
        //for mobile menu add bg if it's scrolled more than height of slider/top image - menu bar height
        if ($document.scrollTop() > 480) {
          $element.removeClass('menu-scroll-in');
          $element.removeClass('menu-fade-in');
          $element.addClass('fixed-mobile-menu');
          $element.addClass('menu-scroll-in');
        } else {
          $element.removeClass('menu-scroll-in');
          $('.fixed-mobile-menu').addClass('menu-scroll-out');
          $('.menu-scroll-out').one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
          function (e) {
            $element.removeClass('fixed-mobile-menu');
            $element.removeClass('menu-scroll-out');
            $element.addClass('menu-fade-in');
          });
        }
      }
    });
  }
});

function is_touch_device() {
  return 'ontouchstart' in window // works on most browsers
  || 'onmsgesturechange' in window; // works on ie10
};

function requestMetadata(form, dataKey) {
  return form.data(dataKey)
}

function formForExitIntend(formId) {
  return formId === 'exit-intend'
}

var errorMessage = function(currentForm) {
  if (formForExitIntend(currentForm.attr('id'))) {
    $('#exit-intend').hide();
    $('.modal-copy h3').html('Niestety nie udało się wysłać Twojego zgłoszenia')
    $('.modal-copy p').html('Sprawdź swoje dane i spróbuj ponownie!')
  } else {
    $('.w-form').click(function() {
      $('.success').html('<div class="error">Niestety nie udało się wysłać Twojego zgłoszenia, sprawdź swoje dane i spróbuj ponownie!</div>');
    });
  }
}

function handleSuccessResponse(currentForm) {
  if (formForExitIntend(currentForm.attr('id'))) {
    $('#exit-intend').hide();
    $('#bio_ep').addClass('thank-you');
  } else {
    $('.w-form').hide();
    $('.txt_form').hide();
    if ($('#contactForm4').length) {
      $('.success').html('<h2>Dziękujemy!</h2> <h3>Przypomnimy Ci z wyprzedzeniem o zbliżającym się końcu ważności Twojego ubezpieczenia.</h3>');
    } else if ($('#contactForm5').length) {
      $('.success').html('<h2>Dziękujemy!</h2> <h3>Przypomnimy Ci z wyprzedzeniem o zbliżającym się końcu ważności Twojego badania technicznego.</h3>');
    } else {
      $('.success').html('<h2>Dziękujemy za zapisanie się!</h2> <h3>Już wkrótce konsultant mfind skontaktuje się z Tobą.</h3>');
    }
    $('.box_right').css({
      top: '15%'
    });
  }
}

function handleMpcCode() {
  var phone = $('#inputPhone').val();
  var mail = $('#inputEmail').val();
  if ($('#contactForm5').length) {
    if (phone && mail === '') {
      $('.mpc_reminder').val('LP_inspection_reminder_phone');
    } else if (mail && phone === '') {
      $('.mpc_reminder').val('LP_inspection_reminder_email');
    } else if (mail && phone !== '') {
      $('.mpc_reminder').val('LP_inspection_reminder_email_phone');
    }
  } else if ($('#contactForm4').length) {
    if (phone && mail === '') {
      $('.mpc_reminder').val('LP_policy_reminder_phone');
    } else if (mail && phone === '') {
      $('.mpc_reminder').val('LP_policy_reminder_email');
    } else if (mail && phone !== '') {
      $('.mpc_reminder').val('LP_policy_reminder_email_phone');
    }
  }
}

$('form[data-request-url*=".mfind.pl"]').each(function() {
  var formAttr = $(this);
  formAttr.attr('data-request-url', formAttr.attr('data-request-url') + window.location.search)
})

// Contact forms
var formHandler = function(form) {
  currentForm = $(form);
  var submitBtn = currentForm.find('button');
  submitBtn.addClass('loading').prop('disabled', true);
  handleMpcCode();
  $.ajax({
    url: requestMetadata(currentForm, 'request-url'),
    method: 'POST',
    dataType: 'json',
    data: currentForm.serialize(),
    headers: {
      'Authorization': 'Basic ' + requestMetadata(currentForm, 'auth-hash'),
      'Accept': 'application/json'
    },
    success: function(response) {
      if (response.success) {
        handleSuccessResponse(currentForm);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'calculationCreated',
          calculation_id: response.id
        });
      } else {
        errorMessage(currentForm);
      }
    },
    error: function() {
      errorMessage(currentForm)
    }
  })
  .always(function() {
    submitBtn.removeClass('loading').prop('disabled', false);
  });
}

jQuery(document).ready(function($) {
  $('#contactForm1').validate({
    rules: {
      phone: {
        required: true
      },
      'agreements[]': {
        required: true
      }
    },
    submitHandler: formHandler
  })

  $('#contactForm2').validate({
    rules: {
      phone: {
        require_from_group: [1, '.contact-group']
      },
      email: {
        require_from_group: [1, '.contact-group']
      },
      'agreements[]': {
        required: true
      }
    },
    submitHandler: formHandler
  });

  $('#contactForm3').validate({
    rules: {
      phone: {
        required: true
      },
      'agreements[]': {
        required: true
      },
      next_call: {
        required: true
      }
    },
    submitHandler: formHandler
  });

  $('#contactForm4').validate({
    rules: {
      phone: {
        require_from_group: [1, '.contact-group']
      },
      email: {
        require_from_group: [1, '.contact-group']
      },
      'insurance_start_date': {
        required: true
      },
      'agreements[]': {
        required: true
      }
    },
    submitHandler: formHandler
  });

  $('#contactForm5').validate({
    rules: {
      phone: {
        require_from_group: [1, '.contact-group']
      },
      email: {
        require_from_group: [1, '.contact-group']
      },
      'technical_exam_date': {
        required: true
      },
      'agreements[]': {
        required: true
      }
    },
    submitHandler: formHandler
  });

  $('#exit-intend').validate({
    rules: {
      phone: {
        required: true
      },
      'agreements[]': {
        required: true
      }
    },
    errorPlacement: function(error, element) {
      if (element.attr('name') === 'phone') {
        error.insertAfter(element);
      } else {
        precedentElement = element.parent();
        precedentElement.addClass('agreements-error');
        error.insertAfter(precedentElement);
      }
    },
    submitHandler: formHandler
  });

  $('a[href^="https://www.mfind.pl"]').each(function() {
    $(this).attr('href', $(this).attr('href') + window.location.search);
  });

  $('.pqv-trigger[data-article-link^="https://www.mfind.pl"]').each(function() {
    var href = $(this).data('article-link')
    $(this).data('article-link', href + window.location.search);
  });

  $.extend($.validator.messages, {
    required: 'To pole jest wymagane.',
    email: 'Proszę wpisać prawidłowy adres email',
    number: 'Proszę wpisać prawidłowy numer',
    maxlength: $.validator.format('Proszę wpisać nie więcej niż {0} znaków.'),
    minlength: $.validator.format('Proszę wpisać przynajmniej {0} znaków.'),
    require_from_group: 'Pole telefonu lub e-mail jest wymagane.'
  });

  window.bioEp = {
    bgEl: {},
    popupEl: {},
    closeBtnEl: {},
    shown: !1,
    overflowDefault: "visible",
    transformDefault: "",
    width: 400,
    height: 220,
    html: "",
    css: "",
    fonts: [],
    delay: 5,
    showOnDelay: !1,
    cookieExp: 30,
    showOncePerSession: !1,
    onPopup: null,
    cookieManager: {
      create: function(a, b, d, c) {
        var e = "";
        c ? e = "; expires=0" : d && (c = new Date, c.setTime(c.getTime() + 864E5 * d), e = "; expires=" + c.toGMTString());
        document.cookie = a + "=" + b + e + "; path=/"
      },
      get: function(a) {
        a += "=";
        for (var b = document.cookie.split(";"), d = 0; d < b.length; d++) {
          for (var c = b[d];
            " " ==
            c.charAt(0);) c = c.substring(1, c.length);
          if (0 === c.indexOf(a)) return c.substring(a.length, c.length)
        }
        return null
      },
      erase: function(a) {
        this.create(a, "", -1)
      }
    },
    checkCookie: function() {
      if (0 >= this.cookieExp) {
        if (this.showOncePerSession && "true" == this.cookieManager.get("bioep_shown_session")) return !0;
        this.cookieManager.erase("bioep_shown");
        return !1
      }
      return "true" == this.cookieManager.get("bioep_shown") ? !0 : !1
    },
    addPopup: function() {
      this.bgEl = document.createElement("div");
      this.bgEl.id = "bio_ep_bg";
      document.body.appendChild(this.bgEl);
      document.getElementById("bio_ep") ? this.popupEl = document.getElementById("bio_ep") : (this.popupEl = document.createElement("div"), this.popupEl.id = "bio_ep", this.popupEl.innerHTML = this.html, document.body.appendChild(this.popupEl));
      this.closeBtnEl = document.getElementById("bio_ep_close");
      if (!this.closeBtnEl) {
        this.closeBtnEl = document.createElement("div")
        this.closeBtnEl.id = "bio_ep_close";
        var closeX = document.createElement("i");
        closeX.innerHTML = '&times;';
        this.closeBtnEl.appendChild(closeX);
        this.popupEl.insertBefore(this.closeBtnEl, this.popupEl.firstChild);
      }
    },
    showPopup: function() {
      if (!this.shown) {
        document.body.classList.add('bio_ep-modal-open');
        if (this.bgEl.style.display = "block", this.popupEl.style.display = "block", this.scalePopup(), this.overflowDefault = document.body.style.overflow, document.body.style.overflow = "hidden", this.shown = !0, this.cookieManager.create("bioep_shown",
          "true", this.cookieExp, !1), this.cookieManager.create("bioep_shown_session", "true", 0, !0), "function" === typeof this.onPopup) this.onPopup();
      }
    },
    hidePopup: function() {
      this.bgEl.style.display = "none";
      this.popupEl.style.display = "none";
      document.body.style.overflow = this.overflowDefault
      document.body.classList.remove('bio_ep-modal-open')
    },
    scalePopup: function() {
      var a = bioEp.popupEl.offsetWidth,
        b = bioEp.popupEl.offsetHeight,
        d = window.innerWidth,
        c = window.innerHeight,
        e = 0,
        f = 0,
        g = a / b;
      a > d - 40 && (e = d - 40, f = e / g, f > c - 40 && (f = c - 40, e = f * g));
      0 === f && b > c - 40 && (e = (c - 40) * g);
      a = e / a;
      if (0 >= a ||
        1 < a) a = 1;
      "" === this.transformDefault && (this.transformDefault = window.getComputedStyle(this.popupEl, null).getPropertyValue("transform"));
      this.popupEl.style.transform = this.transformDefault + " scale(" + a + ")"
    },
    addEvent: function(a, b, d) {
      a.addEventListener ? a.addEventListener(b, d, !1) : a.attachEvent && a.attachEvent("on" + b, d)
    },
    loadEvents: function() {
      this.addEvent(document, "mouseout", function(a) {
        a = a ? a : window.event;
        "input" != a.target.tagName.toLowerCase() && (a.clientX >= Math.max(document.documentElement.clientWidth, window.innerWidth ||
          0) - 50 || 50 <= a.clientY || a.relatedTarget || a.toElement || bioEp.showPopup())
      }.bind(this));
      this.addEvent(this.closeBtnEl, "click", function() {
        bioEp.hidePopup()
      });
      this.addEvent(this.bgEl, "click", function() {
        bioEp.hidePopup()
      });
      this.addEvent(window, "resize", function() {
        if (window.innerWidth > 720) {
          bioEp.scalePopup()
        } else {
          bioEp.hidePopup()
        }
      })
    },
    setOptions: function(a) {
      this.width = "undefined" === typeof a.width ? this.width : a.width;
      this.height = "undefined" === typeof a.height ? this.height : a.height;
      this.html = "undefined" === typeof a.html ? this.html : a.html;
      this.css = "undefined" === typeof a.css ? this.css : a.css;
      this.delay = "undefined" === typeof a.delay ? this.delay : a.delay;
      this.showOnDelay = "undefined" === typeof a.showOnDelay ? this.showOnDelay : a.showOnDelay;
      this.cookieExp = "undefined" === typeof a.cookieExp ? this.cookieExp : a.cookieExp;
      this.showOncePerSession = "undefined" === typeof a.showOncePerSession ? this.showOncePerSession : a.showOncePerSession;
      this.onPopup = "undefined" === typeof a.onPopup ? this.onPopup : a.onPopup
    },
    domReady: function(a) {
      "interactive" === document.readyState || "complete" === document.readyState ?
        a() : this.addEvent(document, "DOMContentLoaded", a)
    },
    init: function(a) {
      "undefined" !== typeof a && this.setOptions(a);
      // this.addCSS();
      this.domReady(function() {
        bioEp.checkCookie() || (bioEp.addPopup(), setTimeout(function() {
          bioEp.loadEvents();
          bioEp.showOnDelay && bioEp.showPopup()
        }, 1E3 * bioEp.delay))
      })
    }
  };

  if (window.innerWidth > 720) {
    bioEp.init({
      cookieExp: 7,
      showOncePerSession: true
    });
  }

  $('label[for="agreements"]').click(function() {
    agreementsDiv = $(this);
    if (agreementsDiv.hasClass('agreements-error') || $('#agreements').is(':checked')) {
      agreementsDiv.removeClass('agreements-error');
    } else {
      agreementsDiv.addClass('agreements-error');
    }
  });

  buttonShow = $('.button-show');
  buttonHide = $('.button-hide');
  contentShowMore = $('.content-showmore');
  buttonShow.click(function() {
    contentShowMore.slideToggle('slow');
    buttonShow.hide();
    buttonHide.show();
  });
  $('.button-hide').click(function() {
    contentShowMore.slideToggle('slow');
    buttonShow.show();
    buttonHide.hide();
  });

  $('.pqv-trigger[data-article-link*=".mfind.pl"]').each(function(){
    var href = $(this).data('article-link')
    $(this).data('article-link', href + window.location.search);
  });

  $.datetimepicker.setLocale('pl');

  $('.input-datetimepicker').datetimepicker({
    format: 'd.m.Y H:i',
    minDate: 0,
    minDateTime: new Date(),
    allowTimes: [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00',
      '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
      '19:00', '19:30', '20:00', '20:30'
    ]
  });

  $('.input-datepicker').datetimepicker({
    timepicker: false,
    format: 'd.m.Y',
    minDate: 0
  });

  var today = new Date();

  function addDays(date, days) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
  }

  function addYears(date, years) {
    return new Date(date.getFullYear() + years, date.getMonth(), date.getDate() - 1);
  }

  $('#technical-exam-date').datetimepicker({
    timepicker: false,
    format: 'd.m.Y',
    minDate: addDays(today, 1),
    maxDate: addYears(today, 5)
  });

  var apiUrl = "https://autka2.mfind.pl/cars";
  var $list = $('.make-name');
  $('.make-name').ready(function() {
    $.ajax({
      url : apiUrl,
      type: "get",
      dataType : 'json'
    })
    .done(function(res) {
      res.sort(function(a, b){
        if(a.make_name < b.make_name) { return -1; }
        if(a.make_name > b.make_name) { return 1; }
        return 0;
      });
      res.forEach(function(el) {
        $list.append("<option value="+ el.make_name +">"+el.make_name+"</option>");
      })
    })
  });
});
