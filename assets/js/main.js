/* global ScrollMagic, Linear */

(function($){
    "use strict";
    
    var $document = $(document),
        $window = $(window),
        $body = $('body'),
        $navbar = $('.navbar'),
        $navbarCollapse = $('.navbar-collapse'),
        $scrollToTop = $('.scroll-to-top'),
        $pageScrollLink = $('a.page-scroll'),
        $galleryGrid = $('.gallery-grid'),
        navHeight = 80,
        navHeightShrink = 61;
    
    $document.on('ready', function(){
        
        $window.on('scroll', function(){
        
            // Shrink navigation.
            if ($document.scrollTop() > navHeight){
                $navbar.addClass('shrink');
            }
            else{
                $navbar.removeClass('shrink');
            }


            // Scroll to top.
            if ($(this).scrollTop() > 100){
                $scrollToTop.fadeIn();
            } 
            else{
                $scrollToTop.fadeOut();
            }
        });
        
        
        
        $window.smartload(function(){
            
            // Bootstrap scrollspy
            var ww = Math.max($window.width(), window.innerWidth);

            $body.scrollspy({    
                target: '#navigation',
                offset: ww > 992 ? navHeightShrink : navHeight
            });
            
            
            // Page scrolling
            pageScroll();
            
            
            // Gallery grid
            if ($.fn.imagesLoaded && $.fn.isotope){
                $galleryGrid.imagesLoaded(function(){
                    $galleryGrid.isotope({
                        itemSelector: '.item',
                        layoutMode: 'masonry'
                    });
                });
            }
            else{
                console.log('Gallery grid: Plugin "imagesLoaded" is not loaded.');
                console.log('Gallery grid: Plugin "isotope" is not loaded.');
            }
            
            
            // Section - Treatments
            var $tab = $('#tab-treatments'),
                $tabMenu = $tab.find('a[data-toggle="tab"]'),
                $tabPaneId = $($tab.find('li.active').children().attr('href')),
                $innerContent = $tabPaneId.find('.pricing-table-wrapper').children();

            if ($.fn.tinyscrollbar){
                $innerContent.tinyscrollbar();
            }
            else{
                console.log('Section - Treatments: Plugin "tinyscrollbar" is not loaded.');
            }

            $tabMenu.removeClass('title-strikethrough-base-color');
            $tab.find('li.active').children().addClass('title-strikethrough-base-color');

            $tabMenu.on('shown.bs.tab', function(e){
                var $tabPaneId = $($(this).attr('href')),  
                    $innerContent = $tabPaneId.find('.pricing-table-wrapper').children();

                if ($.fn.tinyscrollbar){
                    $innerContent.tinyscrollbar();
                }
                else{
                    console.log('Section - Treatments: Plugin "tinyscrollbar" is not loaded.');
                }

                $tabMenu.removeClass('title-strikethrough-base-color');
                $(this).addClass('title-strikethrough-base-color');
            });
            
            
            // Section - Reviews
            if ($.fn.flickity){
                var $carouselReviews = $('.carousel-main', '#reviews');
                $carouselReviews.flickity({
                    cellAlign: 'left',
                    contain: true,
                    prevNextButtons: false,
                    pageDots: false
                });
            }
            else{
                console.log('Section - Reviews: Plugin "flickity" is not loaded.');
            }
        });
        
        
        
        $window.smartresize(function(){
            
            // Bootstrap scrollspy
            var dataScrollSpy = $body.data('bs.scrollspy'),
                ww = Math.max($window.width(), window.innerWidth),
                offset = ww > 992 ? navHeightShrink : navHeight;
        
            dataScrollSpy.options.offset = offset;
            $body.data('bs.scrollspy', dataScrollSpy);
            $body.scrollspy('refresh');
            
            
            // Page scrolling
            pageScroll();
            
            
            // Gallery grid
            if ($.fn.isotope){
                $galleryGrid.isotope('layout');
            }
            else{
                console.log('Gallery grid: Plugin "isotope" is not loaded.');
            }
        });
        
        
        
        /*------------------------------------*\
            Detect mobile device.
        \*------------------------------------*/        
        
        var isMobile = {
            Android: function(){
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function(){
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function(){
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function(){
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function(){
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function(){
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };
        
        
        
        /*------------------------------------*\
            Page scrolling feature.
        \*------------------------------------*/

        function pageScroll(){
            $pageScrollLink.on('click', function(e){
                var ww = Math.max($window.width(), window.innerWidth),
                    anchor = $(this),
                    href = anchor.attr('href'),
                    offset = ww > 992 ? navHeightShrink : navHeight;

                $('html, body').stop().animate({
                    scrollTop: $(href).offset().top - (offset - 1)
                }, 1000, 'easeInOutExpo');
                
                // Automatically retract the navigation after clicking on one of the menu items.
                $navbarCollapse.collapse('hide');
                
                e.preventDefault();
            });
        };
        
        
        
        /*------------------------------------*\
            Gallery filtering
        \*------------------------------------*/   
        
        if ($.fn.imagesLoaded && $.fn.isotope){
            var $gridSelectors = $('.gallery-filter').find('a');
            $gridSelectors.on('click', function(e){
                $gridSelectors.parent().removeClass('active');
                $(this).parent().addClass('active');

                var selector = $(this).attr('data-filter');
                $galleryGrid.isotope({
                    filter: selector
                });            

                e.preventDefault();
            });
        }
        else{
            console.log('Gallery filtering: Plugin "imagesLoaded" is not loaded.');
            console.log('Gallery filtering: Plugin "isotope" is not loaded.');
        }
            
        
        
        /*------------------------------------*\
            Gallery magnific popup
        \*------------------------------------*/   
        if ($.fn.magnificPopup){
            $galleryGrid.magnificPopup({
                delegate: 'a',
                type: 'image',
                fixedContentPos: false,
                mainClass: 'mfp-fade',
                gallery:{
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0,2],
                    tPrev: 'Previous',
                    tNext: 'Next',
                    tCounter: '<span class="mfp-counter-curr">%curr%</span> of <span class="mfp-counter-total">%total%</span>'
                }
            });
        }
        else{
            console.log('Gallery magnific popup: Plugin "magnificPopup" is not loaded.');
        }
        
        
        
        /*------------------------------------*\
            Counter number
        \*------------------------------------*/
        
        if ($.fn.countTo){
            var $timer = $('.timer');
            $timer.one('inview', function(isInView){
                if(isInView){
                    $(this).countTo();
                }
            });
        }
        else{
            console.log('Counter Number: Plugin "countTo" is not loaded.');
        }
        
        
        
        /*------------------------------------*\
            Features box
        \*------------------------------------*/        
        
        if (isMobile.any()){
            var $featuresBox = $('.features-box');
            
            $featuresBox.addClass('is-mobile');
            $featuresBox.find('.show-on-hover').addClass('is-mobile');
            
            $featuresBox.on('click', function(e){
                $(this).toggleClass('active');
                $(this).find('.show-on-hover').toggleClass('active');
                e.preventDefault();
            });
        };
        
        
        
        /*------------------------------------*\
            Home bg parallax
        \*------------------------------------*/
        
        if (typeof ScrollMagic !== 'undefined'){
            var selector = '#home-bg-parallax';
            
            // Init controller
            var controller = new ScrollMagic.Controller({globalSceneOptions: {triggerHook: 'onEnter', duration: '200%'}});
        
            // Build scenes
            new ScrollMagic.Scene({triggerElement: selector})
                    .setTween(selector + ' > .bg-parallax', {y: '80%', ease: Linear.easeNone})
                    .addTo(controller);
        }
        
        
        
        /*------------------------------------*\
            Home bg slideshow
        \*------------------------------------*/
        
        if ($.fn.flexslider){
            var $bgSlideshowWrapper = $('.bg-slideshow-wrapper');
            $bgSlideshowWrapper.flexslider({
                selector: '.slides > .bg-cover',
                easing: 'linear',
                slideshowSpeed: 3500,
                controlNav: false,
                directionNav: false,
                keyboard: false,
                pauseOnAction: false,
                touch: false
            });
        }
        else{
            console.log('Home bg slideshow: Plugin "flexslider" is not loaded.');
        }
        
        
        
        /*------------------------------------*\
            Home bg slider
        \*------------------------------------*/
        
        if ($.fn.flickity){
            var $bgSliderWrapper = $('.bg-slider-wrapper');
            $bgSliderWrapper.flickity({
                cellAlign: 'left',
                contain: true,
                prevNextButtons: false,
                pageDots: false,
                draggable: false,
                autoPlay: 3500,
                pauseAutoPlayOnHover: false
            });
        }
        else{
            console.log('Home bg slider: Plugin "flickity" is not loaded.');
        }
        
        
        
        /*------------------------------------*\
            Animated typing
        \*------------------------------------*/
        
        if ($.fn.typed){
            var $typedStrings = $('.typed-strings');
            $typedStrings.typed({
                strings: ['Balinese Massage', 'Bamboo Fusion', 'Foot Reflexology', 'Ear Candeling'],
                typeSpeed: 130,
                loop: true,
                showCursor: false
            });
        }
        else{
            console.log('Animated typing: Plugin "typed" is not loaded.');
        }
        
        
        
        /*------------------------------------*\
            Contact form
        \*------------------------------------*/
        
        var $contactForm = $('#form-contact'),
            $btnContactForm = $('#btn-form-contact');
        
        $btnContactForm.on('click', function(e){
            $contactForm.validate();
            if ($contactForm.valid()){
                send_mail($contactForm, $btnContactForm);
            }
            e.preventDefault();
        });
        
        
        // Send mail
        function send_mail($form, $btnForm){
            var defaultMessage = $btnForm.html(),
                sendingMessage = 'Loading...',
                errorMessage = 'Error Sending!',
                okMessage = 'Email Sent!';
            
            $btnForm.html(sendingMessage);
            
            $.ajax({
                url: $form.attr('action'),
                type: 'post',
                dataType: 'json',
                data: $form.serialize(),
                success: function(data){
                    if (data === true){
                        $btnForm.html(okMessage);
                        $form.find('input[type="text"], textarea').val('');
                    }
                    else{
                        $btnForm.html(errorMessage);
                    }

                    setTimeout(function(){
                        $btnForm.html(defaultMessage);
                    }, 3000);
                },
                error: function(xhr, err){
                    $btnForm.html(errorMessage);

                    setTimeout(function(){
                        $btnForm.html(defaultMessage);
                    }, 3000);
                }
            });
        }
    });
})(jQuery);