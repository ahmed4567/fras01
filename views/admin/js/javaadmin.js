const notfication = document.getElementById('notfication');
      notfication.addEventListener('click', function(){
          let notPage = document.querySelector('.notfication-container');
          notPage.classList.toggle('open');
      })
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
const chatHead = document.querySelector('.chat-header');
      chatHead.addEventListener('click', function()
      {
        let  chatBott = document.querySelector('.chat-area');
               chatBott.classList.toggle('bottom')
      })



    //  Test Manage Cours Add
