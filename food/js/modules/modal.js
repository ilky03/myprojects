function openModal(modalSelector, modalTimerId) {
    const modal= document.querySelector(modalSelector);

    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';

    console.log(modalTimerId);
    if (modalTimerId) {
        clearInterval(modalTimerId);
    }
}

function closeModal(modalSelector) {
    const modal= document.querySelector(modalSelector);

    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function modal(modalSelector, triggerSelector, modalTimerId) {

    const modal= document.querySelector(modalSelector),
    openModalBtn = document.querySelectorAll(triggerSelector);
    
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    openModalBtn.forEach((btn) => {
        btn.addEventListener('click', () => openModal(modalSelector, modalTimerId));
    });

    modal.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('modal') || e.target.classList.contains('modal__close')) {
            closeModal(modalSelector);
        }
    }); 

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });

    window.addEventListener('scroll', showModalByScroll);

}

export default modal;
export { openModal, closeModal };