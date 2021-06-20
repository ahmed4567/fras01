function sideOn()
        {
            let bars = document.querySelector(".copls");
                bars.classList.toggle('open');
            let sideL = document.querySelector('.menu-info');
                sideL.classList.toggle('open');
                        $(window).resize(function(){
                        if(window.innerWidth > 1023) {
                        $(".menu-info").removeClass("open");
                        }else {
                        $(".menu-info").addClass("open");
                        }
                        });
            
        }
        