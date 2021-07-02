const tog = document.querySelector('.toggle').addEventListener('click',function(){
    let left = document.querySelector('.left-slide');
        left.classList.toggle('active');
    let bTitle = document.querySelector('.brand .title');
        bTitle.classList.toggle('active');
    let bIcon = document.querySelector('.brand .icon');
        bIcon.classList.toggle('active');
    let tog = document.querySelector('.toggle');
        tog.classList.toggle('active');
    let mains = document.querySelector('.main-stud');
        mains.classList.toggle('active');
})