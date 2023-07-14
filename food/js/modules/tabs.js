function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {

    const tabsContent = document.querySelectorAll(tabsContentSelector),
    tabItems = document.querySelector(tabsParentSelector),
    tabItem = document.querySelectorAll(tabsSelector);

    function hideTab() {
    tabsContent.forEach((tab) => {
        tab.classList.add('hide', 'fade');
        tab.classList.remove('show');
    });
    tabItem.forEach((item) => {
        item.classList.remove(activeClass);
    });
    }

    function showTab(i = 0) {
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabItem[i].classList.add(activeClass);
    }

    hideTab();
    showTab();

    tabItems.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.classList.contains(tabsSelector.slice(1))) {
        tabItem.forEach((item, i) => {
            if (item == target) {
                hideTab();
                showTab(i);
            }
        });
    }
    });
}

export default tabs;