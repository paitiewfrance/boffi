  var AJS = {"host":"http://locahost:3000"};
  var x = window.location.href;

  $.fn.reverse = [].reverse;


// DETECT DEVICE  ==============================================================

var device = (function(){

  var isIE = IEVersion = false
      md = new MobileDetect(window.navigator.userAgent);

  var init = function(){
    bindEvents();
  }

  var bindEvents = function(){
    $('body').on('mousemove', 'img', function(){
      return false;
    });
  };

  var isSmartPhone = function(){
    // return ($(window).width()  < 768);
      return window.matchMedia("('max-width: 767px')").matches;
  }

  // Is that an IOS ?
  var isIOS = function(){
    // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    return isIOS;
  }

  var isTablet = function(){
    // return ($(window).width() > 992 &&  $(window).width() < 768);
      return window.matchMedia("(min-width: 768) and (max-width: 1219px)").matches;
  }


  // Is that a Desktop ?
  var isDesktop = function(){
    // return ($(window).width()  >= 992);
    return window.matchMedia("(min-width: 1220px)").matches;
  }

  // Get internet explorer version https://gist.github.com/Macagare/4044440
  var getInternetExplorerVersion = function(){
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null)
        rv = parseFloat( RegExp.$1 );
    }
    if (rv != -1) {
      isIE = true;
    }
      return rv;
   }

  var isMobile = function(){
    return $('html').hasClass('is-handled');
  }

  var lightVersion = function(){
    IEVersion = getInternetExplorerVersion();
    if (isMobile() || !isDesktop() || (isIE && IEVersion < 10 )) {
      return true;
    } else {
      return false;
    }
  }

  return {
    init: init,
    isIOS: isIOS,
    isTablet: isTablet,
    isDesktop: isDesktop,
    lightVersion: lightVersion
  }

})();

// END DETECT DEVICE  ==========================================================
var doc = $(document),
    wind = $(window),
    globalLoader = $('.loader').first(),
    hh = wind.height(),
    ww = wind.width(),
    siteIsLoading = true;


var globalSite = (function(){

    var init = function(){
      device.init();
      bindEvents();
      contentLoading();
      pageInit();
    }

    var showPreLoader = function(){

      $(window).on('load', siteIsLoaded);
      setTimeout(function(){
        init();
      },2000);
    }

    var siteIsLoaded = function(){
      siteIsLoading = false;
      $(window).trigger('resize');
    }


    var bindEvents = function(){
        // Navigation opening and closing
        $('body').on('click', 'nav.nav--element .nav--toggle', navToggle);
        // Modal language opening
        $('body').on('click', 'nav.nav--element .cta--language--current', modalToggle);
        // Modal language closing
        $('body').on('click', '.modal--change--language .modal--bg', modalClose);

        $('body').on('mouseenter', 'nav.nav--element ul li.has--submenu a', linkHandler);
    }


    var linkHandler = function(e){
      e.preventDefault();
      var waitLink = true,
          link = $(this),
          location = link.attr('data--link'),
          url = "localhost:3000/" + location.toString();
          getData(url);
    }


    var getData = function(url){

    }

    var navToggle  = function(e){

      // Selector
      if (navWait)
        return;
      var navWait = true;

      var toggle = $(this),
          // Main Nav content
          nav = $('nav.nav--element').first(),
          target = nav.find('.menu--toggle'),
          content = nav.find('.menu--content'),
          navTop = content.find('.menu--top'),
          navPrimary = content.find('.menu--primary .menu--content--level--1'),
          navBottom = content.find('.menu--secondary'),
          // aside
          aside = content.find('aside.menu--content--aside'),
          asideElements = aside.find('.aside--social--list, .cta--language--wrapper');

      // Nav toggle must move away
      // Set unscrollable class to body
      // Set isPointable and isVisible class to the main menu
      // Animate top menu + main menu and bottom list menu
      // Animate elements from the aside bar
      // Set NavWait to false

       // If the device is not smartphone or tablet

       if (toggle.hasClass('menu--open')) {

         var navParent = toggle.parent('.menu--toggle');

         // Before Animation

          navPrimary.find('ul li a ').css({
            display:'block',
            opacity:0
          });

          navBottom.find('ul li a').css({
            display:'block',
            opacity:0
          });

          asideElements.css({
            opacity:0
          });

       var tl = new TimelineLite(),
           start = 0;

          tl.call(function(){
            $('body').addClass('isUnScrollable');
          });

          if (!device.lightVersion()) {

            tl.to(target, .8, {
              x:'-100rem',
              ease:Expo.easeOut
            },start);

          } else {
            var close = target.find('.menu--close');
            tl.call(function(){
              close.addClass('isClicked');
            });
          }

          tl.call(function(){
            content.addClass('isVisible');
          },null,null,0);

          tl.staggerFromTo(navPrimary.find('> ul > li > a '), .8, {
            x:20,
            opacity:0
          },{
            x:0,
            opacity:1,
            ease:Expo.easeOut
          },0.04, start+.3);

          tl.staggerFromTo(navBottom.find('ul li a'), .8, {
            opacity:0,
            y:10
          },{
            opacity:1,
            y:0,
            ease:Expo.easeOut
          },0.08, start+.6);

          tl.call(function(){
            content.addClass('isPointable');
          },null,null,1.3);

          tl.from(aside, .6, {
            scaleY:0,
            ease:Expo.easeOut
          },start+.5);

          if (!device.lightVersion()) {

              tl.staggerFromTo(asideElements, .4, {
                cycle:{
                  y:[20,-20]
                },
                opacity:0
              },{
                opacity:1,
                y:0,
                ease:Expo.easeOut
              },0, start+.8);

          } else {

              tl.staggerFromTo(asideElements, .4, {
                cycle:{
                  x:[20,-20]
                },
                opacity:0
              },{
                opacity:1,
                x:0,
                ease:Expo.easeOut
              },0, start+.8);
          }

          tl.call(function(){
            navWait = false;

            aside.css({
              transform:''
            });

            navPrimary.find('> ul > li > a ').css({
              opacity:'',
              transform:''
            });

            navBottom.find('ul li a').css({
              opacity:'',
              transform:''
            });

            asideElements.css({
              opacity:'',
              transform:''
            });

          });

       tl.play();


     } else if(toggle.hasClass('menu--content--close')) {

         var tl = new TimelineLite(),
             start = 0;

         tl.pause();

         tl.to(target, .8, {
           x:0,
           ease:Expo.easeOut
         },start);

         tl.to(content, .3, {
           alpha:0,
           ease:Sine.EaseIn,
           onComplete:function(){
             setTimeout(function(){
               content.removeClass('isVisible isPointable');
             },300);
           }
         },start);

         tl.call(function(){
           content.css({
             opacity:''
           });
         });

         tl.play();


     } else if (toggle.hasClass('menu--close')) {

         console.log('yes it is');

         var tl = new TimelineLite(),
             start = 0;

         tl.pause();

         tl.to(toggle, .3, {
           alpha:0,
           ease:Sine.easeOut,
           onComplete:function(){
             setTimeout(function(){
               toggle.removeClass('isClicked');
             },200);
           }
         },start);

         tl.to(content, .3, {
           opacity:0,
           ease:Sine.EaseIn,
           onComplete:function(){
             content.removeClass('isVisible isPointable');
           }
         },start);

         tl.call(function(){
           content.css({
             opacity:''
           });

           toggle.css({
             opacityh:''
           });
         });

         tl.play();

       }
     // End Nav Toggle
    }

    var modalToggle = function(){
      var modalWindow = $('.modal--change--language'),
          card = modalWindow.find('.modal--card'),
          cardBackground = card.find('.modal--card--bg'),
          modalElements = card.find('.modal--header, .modal--form, .modal--footer');

      modalWindow.css({
          opacity:0,
          left:0,
      });

      cardBackground.css({
        right:'100%'
      });

      modalElements.css({
        opacity:0
      });

      var tl = new TimelineLite();
      tl.pause();

      tl.to(modalWindow, .3, {
        opacity:1,
        ease:Sine.easeOut
      },0);

      tl.fromTo(cardBackground, .4, {
        right:'100%',
        x:20
      },{
        right:0,
        x:0,
        ease:Expo.easeOut
      },0.5);


      tl.staggerFromTo(modalElements, .5, {
        opacity:0,
        y:20
      },{
        opacity:1,
        y:0,
        ease:Expo.easeOut
      },0.08, 1);


      tl.play();
    }


    var modalClose = function(){
      var modalWindow = $('.modal--change--language'),
          card = modalWindow.find('.modal--card'),
          cardBackground = card.find('.modal--card--bg'),
          modalElements = card.find('.modal--header, .modal--form, .modal--footer'),
          tl = new TimelineLite();
      tl.pause();

      tl.staggerTo(modalElements, .5, {
        opacity:0,
        y:-20
      },0.1, 0);

      tl.to(cardBackground, .4, {
        x:-20,
        left:'100%',
        ease:Expo.easeOut
      },0.5);

      tl.to(modalWindow, .5, {
        opacity:0,
        ease:Expo.easeOut,
      },1);

      tl.call(function(){

        modalWindow.css({
          opacity:'',
          left:''
        });

        cardBackground.css({
          right:'',
          left:''
        });

      });

      tl.play();
    }



    var pageInit = function(){
      $(window).trigger('resize');
    }


    var siteIsLoaded = function(){
      siteIsLoading = false;
      $(window).trigger('resize');
    }

    // Play one time
    var intro = function(){
     var container = $('.page--container').first(),
         nav = container.find('nav.nav--element'),
         navToggle = nav.find('.menu--open');

     navToggle.css({

     });
    }


    var contentLoading = function(){

    }



   return {
     showPreLoader: showPreLoader,
     init: init
   }

})();

globalSite.showPreLoader();
