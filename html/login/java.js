
         function validationuser()
         {
             let userClass = document.querySelector('.user-up .fa-check-circle');
             let userClassno = document.querySelector('.user-up .fa-times-circle');
             let userup = document.getElementById('usernameup');
              let textValiduser = document.getElementById('validuser');
              if(userup.value.length < 6 || userup.value.length == 0){
  
                userClass.style.display=("none");
                userClassno.style.display=("block");
                textValiduser.innerHTML = "Enter 6-18 letters or numbers";
                textValiduser.style.color="#ff0000";
                 document.getElementById('usernameup').style.outline=("1px solid red");
              }else 
              {
                userClass.style.display=("block");
                userClassno.style.display=("none");
                textValiduser.innerHTML = "Valid Username";
                textValiduser.style.color="green";
                 document.getElementById('usernameup').style.outline=("1px solid green");
              };
              if(userup.value  == ''){
                userClass.style.display=("none");
                userClassno.style.display=("none");
                textValiduser.innerHTML = "";
                textValiduser.style.color="#00ff00";
              }
  
         }
         //  Validation Password
       function validationPassword()
       {
           let passClass = document.querySelector('.pass-up .fa-check-circle');
           let passClassno = document.querySelector('.pass-up .fa-times-circle');
            let pass = document.getElementById('passup');
            let textValidpass = document.getElementById('validpass');
            if(pass.value.length == 0 || pass.value.length < 6){

                passClass.style.display=("none");
                passClassno.style.display=("block");
                textValidpass.innerHTML = "Enter 8-18 letters or numbers";
                textValidpass.style.color="#ff0000";
               document.getElementById('passup').style.outline=("1px solid red");
               return false;
            }else 
            {
                passClass.style.display=("block");
                passClassno.style.display=("none");
                textValidpass.innerHTML = "Stronge Password";
                textValidpass.style.color="green";
               document.getElementById('passup').style.outline=("1px solid green");
               
            };
            if(pass.value  == ''){
                passClass.style.display=("none");
                passClassno.style.display=("none");
               textValidpass.innerHTML = "";
               textValidpass.style.color="#00ff00";
            }

       }
              //  Validation Confirm Password
              function validationconfPassword()
              {
                  let passconfClass = document.querySelector('.confpass-up .fa-check-circle');
                  let passconfClassno = document.querySelector('.confpass-up .fa-times-circle');
                  let pass = document.getElementById('passup');
                   let passconf = document.getElementById('confpassup');
                   let textValidconfpass = document.getElementById('validconfpass');
                   if(passconf.value != pass.value){
       
                    passconfClass.style.display=("none");
                    passconfClassno.style.display=("block");
                    textValidconfpass.innerHTML = "Enter the same password";
                    textValidconfpass.style.color="#ff0000";
                      document.getElementById('confpassup').style.outline=("1px solid red")
                      return false;
                   }else 
                   {
                    passconfClass.style.display=("block");
                    passconfClassno.style.display=("none");
                    textValidconfpass.innerHTML = "Same Password";
                    textValidconfpass.style.color="green";
                      document.getElementById('confpassup').style.outline=("1px solid green")
                   };
                   if(passconf.value  == ''){
                    passconfClass.style.display=("none");
                    passconfClassno.style.display=("none");
                    textValidconfpass.innerHTML = "";
                    textValidconfpass.style.color="#00ff00";
                   }
       
              }
        // Validation Email
      
        function validationEmail()
        {
            let emailClass = document.querySelector('.emailadress .fa-check-circle');
            let emailClassno = document.querySelector('.emailadress .fa-times-circle');
            let email = document.getElementById('email');
            let textValid = document.getElementById('valideemail');


            const patterEmail = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
            if(email.value.match(patterEmail)){
               emailClass.style.display=("block");
               emailClassno.style.display=("none");
               textValid.innerHTML = "Your Email Address is valid";
               textValid.style.color="green";
               document.getElementById('email').style.outline=("1px solid green");
            }else 
            {
                emailClass.style.display=("none");
                emailClassno.style.display=("block");
               textValid.innerHTML = "Your Email Address is invalid";
               textValid.style.color="#ff0000";
               document.getElementById('email').style.outline=("1px solid red");
               return false;
            };
            if(email.value  == ''){
                passClass.style.display=("none");
                passClassno.style.display=("none");
               textValidpass.innerHTML = "";
               textValidpass.style.color="#00ff00";
            }

        }

       

            //   Validation Phone Number

            function validationPhonenum()
            {
                let phoneClass = document.querySelector('.phoneup .fa-check-circle');
                let phoneClassno = document.querySelector('.phoneup .fa-times-circle');
                let phoneup = document.getElementById('phone-num');
                let textValidphone = document.getElementById('validphone');

                const patterPhone = /^01[0-2]\d{1,8}$/;

                if(phoneup.value.match(patterPhone) && phoneup.value.length > 10){
                    phoneClass.style.display=("block");
                    phoneClassno.style.display=("none");
                    textValidphone.innerHTML = "Your Phone Number is valid";
                    textValidphone.style.color="green";
                    document.getElementById('phone-num').style.outline=("1px solid green");
                 }else 
                 {
                    phoneClass.style.display=("none");
                    phoneClassno.style.display=("block");
                    textValidphone.innerHTML = "Your Phone Number is invalid";
                    textValidphone.style.color="#ff0000";
                    document.getElementById('phone-num').style.outline=("1px solid red");
                    return false;
                 };
                 if(phoneup.value  == ''){
                    phoneClass.style.display=("none");
                    phoneClassno.style.display=("none");
                    textValidphone.innerHTML = "";
                    textValidphone.style.color="#00ff00";
                 }
     
             }


            //  mode
            function mode()
          {
            let sin = document.querySelector('.signinfield');
                let up = document.querySelector('.signupfield');
                sin.classList.toggle('active');
                up.classList.toggle('active');
          }