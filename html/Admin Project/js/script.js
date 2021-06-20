function toggleMenu(){
    let toggle = document.querySelector('.toggle');
    let sideBar = document.querySelector('.sidbar');
    let main = document.querySelector('.main');
    let brand = document.querySelector('.brand .icon');
    toggle.classList.toggle('active')
    sideBar.classList.toggle('active')
    main.classList.toggle('active')
    brand.classList.toggle('active')
}