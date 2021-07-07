const togglesid = document.getElementById('toggle');
      togglesid.addEventListener('click', function(){
          let sideLeft = document.querySelector('.sidebar-left');
              sideLeft.classList.toggle('active');
          let main = document.querySelector('.main');
            main.classList.toggle('active');
          let logo = document.querySelector('.logo .title');
              logo.classList.toggle('active');
              let logoicon = document.querySelector('.logo .icon');
              logoicon.classList.toggle('active'); 
      })




function validationuser()
         {
             let adminup = document.querySelector('.adminup-up .fa-check-circle');
             let adminupno = document.querySelector('.adminup-up .fa-times-circle');
             let adminuser = document.getElementById('adminuserup');
              let textValiduserad = document.getElementById('validuserad');
              if(adminuser.value.length < 6 || adminuser.value.length == 0){
  
                adminup.style.display=("none");
                adminupno.style.display=("block");
                textValiduserad.innerHTML = "Enter 6-18 letters or numbers";
                textValiduserad.style.color="#ff0000";
                 document.getElementById('adminuserup').style.outline=("1px solid red");
              }else 
              {
                adminup.style.display=("block");
                adminupno.style.display=("none");
                textValiduserad.innerHTML = "Valid Username";
                textValiduserad.style.color="green";
                 document.getElementById('adminuserup').style.outline=("1px solid green");
              };
              if(adminuser.value  == ''){
                adminup.style.display=("none");
                adminupno.style.display=("none");
                textValiduserad.innerHTML = "";
                textValiduserad.style.color="#00ff00";
              }
  
         }
         //  Validation Password
       function validationPassword()
       {
           let passClassad = document.querySelector('.passadmin-up .fa-check-circle');
           let passClassnoad = document.querySelector('.passadmin-up .fa-times-circle');
            let passad = document.getElementById('passupad');
            let textValidpassad = document.getElementById('validpassad');
            if(passad.value.length == 0 || passad.value.length < 6){

                passClassad.style.display=("none");
                passClassnoad.style.display=("block");
                textValidpassad.innerHTML = "Enter 6-18 letters or numbers";
                textValidpassad.style.color="#ff0000";
               document.getElementById('passupad').style.outline=("1px solid red");
               return false;
            }else 
            {
                passClassad.style.display=("block");
                passClassnoad.style.display=("none");
                textValidpassad.innerHTML = "Stronge Password";
                textValidpassad.style.color="green";
               document.getElementById('passupad').style.outline=("1px solid green");
               
            };
            if(passad.value  == ''){
                passClassad.style.display=("none");
                passClassnoad.style.display=("none");
                textValidpassad.innerHTML = "";
                textValidpassad.style.color="#00ff00";
            }

       }
              //  Validation Confirm Password
              function validationconfPassword()
              {
                  let passconfClassad = document.querySelector('.confpassadmin-up .fa-check-circle');
                  let passconfClassnoad = document.querySelector('.confpassadmin-up .fa-times-circle');
                  let passad = document.getElementById('passupad');
                   let confpassad = document.getElementById('confpassupad');
                   let textValidconfpassad = document.getElementById('validconfpassad');
                   if(confpassad.value != passad.value){
       
                    passconfClassad.style.display=("none");
                    passconfClassnoad.style.display=("block");
                    textValidconfpassad.innerHTML = "Enter the same password";
                    textValidconfpassad.style.color="#ff0000";
                      document.getElementById('confpassupad').style.outline=("1px solid red");
                      return false;
                   }else 
                   {
                    passconfClassad.style.display=("block");
                    passconfClassnoad.style.display=("none");
                    textValidconfpassad.innerHTML = "Same Password";
                    textValidconfpassad.style.color="green";
                      document.getElementById('confpassupad').style.outline=("1px solid green");
                   };
                   if(passconf.value  == ''){
                    passconfClassad.style.display=("none");
                    passconfClassnoad.style.display=("none");
                    textValidconfpassad.innerHTML = "";
                    textValidconfpassad.style.color="#00ff00";
                   }
       
              }
        // Validation Email
      
        function validationEmail()
        {
            let emailClassad = document.querySelector('.emailadressAdmin .fa-check-circle');
            let emailClassnoad = document.querySelector('.emailadressAdmin .fa-times-circle');
            let emailade = document.getElementById('emailadm');
            let textValidad = document.getElementById('valideemailad');


            const patterEmail = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
            if(emailade.value.match(patterEmail)){
                emailClassad.style.display=("block");
                emailClassnoad.style.display=("none");
                textValidad.innerHTML = "Your Email Address is valid";
                textValidad.style.color="green";
               document.getElementById('emailadm').style.outline=("1px solid green");
            }else 
            {
                emailClassad.style.display=("none");
                emailClassnoad.style.display=("block");
                textValidad.innerHTML = "Your Email Address is invalid";
                textValidad.style.color="#ff0000";
               document.getElementById('emailadm').style.outline=("1px solid red");
               return false;
            };
            if(emailade.value.length  == 0){
                emailClassad.style.display=("none");
                emailClassnoad.style.display=("none");
                textValidad.innerHTML = "";
                textValidad.style.color="#00ff00";
            }

        };

       

            //   Validation Phone Number

            function validationPhonenum()
            {
                let phoneClassad = document.querySelector('.phoneupadmin .fa-check-circle');
                let phoneClassnoad = document.querySelector('.phoneupadmin .fa-times-circle');
                let phoneupad = document.getElementById('phone-numad');
                let textValidphonead = document.getElementById('validphonead');

                const patterPhone = /^01[0-2]\d{1,8}$/;

                if(phoneupad.value.match(patterPhone) && phoneupad.value.length > 10){
                    phoneClassad.style.display=("block");
                    phoneClassnoad.style.display=("none");
                    textValidphonead.innerHTML = "Your Phone Number is valid";
                    textValidphonead.style.color="green";
                    document.getElementById('phone-numad').style.outline=("1px solid green");
                 }else 
                 {
                    phoneClassad.style.display=("none");
                    phoneClassnoad.style.display=("block");
                    textValidphonead.innerHTML = "Your Phone Number is invalid";
                    textValidphonead.style.color="#ff0000";
                    document.getElementById('phone-numad').style.outline=("1px solid red");
                    return false;
                 };
                 if(phoneupad.value  == ''){
                    phoneClassad.style.display=("none");
                    phoneClassnoad.style.display=("none");
                    textValidphonead.innerHTML = "";
                    textValidphonead.style.color="#00ff00";
                 }
     
             }

            //  Close
             
            function closereg()
            {
                let close = document.querySelector('.wall-reg');
                 close.classList.add('close');
                 document.querySelector('.wall-reg').classList.remove('open');
            }
            function openreg()
            {
                let open = document.querySelector('.wall-reg');
            open.classList.add('open');
            document.querySelector('.wall-reg').classList.remove('close');
            
            }