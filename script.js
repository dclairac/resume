document.addEventListener("DOMContentLoaded", function (event) {
    // Dark theme
    var prevActiveTheme = localStorage.getItem("theme-color");
    document.documentElement.setAttribute("data-theme", prevActiveTheme ? prevActiveTheme : "light");
    var themeToggle = document.getElementsByClassName('theme-color-toggle')[0];
    themeToggle.onclick = function () {
        var currentTheme = document.documentElement.getAttribute("data-theme");
        var switchToTheme = currentTheme === "dark" ? "light" : "dark";
        localStorage.setItem("theme-color", switchToTheme)
        document.documentElement.setAttribute("data-theme", switchToTheme);
        changeLogoTheme();
    }
    //I18N
    window.addEventListener('DOMContentLoaded', async () => {
        await updateText().catch(error => {console.log(error)});
    });
    // AOS
    AOS.init({
        once: true,
        offset: 10,
        duration: 600,
        easing: 'cubic-bezier(0.42, 0, 0.12, 1.28)'
    });
    // kursor
     new kursor({
         type: 4,
         color: '#7E74F1'
     });
    // SVG Sprite Support
    svg4everybody();
    // CSS Var support
    cssVars({});
    // Sticky Menu
    var menu = document.getElementsByClassName("header")[0];
    if (window.pageYOffset >= 32) { // fix middle load page issue
        menu.classList.add('sticky');
    }
    var lastScroll = 0;
    window.addEventListener("scroll", function () {
        var currentScroll = window.pageYOffset;
        if (currentScroll <= 32) {
            menu.classList.remove('sticky');
            return;
        } else {
            menu.classList.add('sticky');
        }
        lastScroll = currentScroll;
    });
    // Smooth scroll
    document.querySelectorAll('.header .nav .nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth',
                block: "start"
            });
        });
    });
    // Active section
    var sections = document.querySelectorAll("section");
    var navLi = document.querySelectorAll(".header .nav .nav-links li");
    window.onscroll = function () {
        var current = "";
        sections.forEach((section) => {
            var sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 282) {
                current = section.getAttribute("id");
            }
        });
        navLi.forEach((li) => {
            li.classList.remove("active");
            if (li.classList.contains(current)) {
                li.classList.add("active");
            }
        });
    };
    // Back to top
    var trigger = document.getElementsByClassName('logo')[0];
    trigger.onclick = function () {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
    // Mobile menu
    var mobileMenuToggle = document.getElementsByClassName('mobile-menu-toggle')[0];
    mobileMenuToggle.onclick = function () {
        document.querySelector(".header .nav .nav-links").classList.toggle('active');
    }
    // Career
    document.querySelector(".career-section .companies-list").addEventListener('click', function (e) {
        e.preventDefault();
        if (e.target.tagName === 'LI') {
           window.innerWidth > 992 ? document.querySelector(".career-section .selector").style.top = e.target.offsetTop + 'px' : null;
            document.querySelector(".career-section .companies-list li.active").classList.remove('active')
            e.target.classList.add('active');
            var targetTab = e.target.getAttribute('data-tab');
            if (targetTab) {
                document.querySelector(".career-section .content.active").classList.remove('active')
                document.getElementById(targetTab).classList.add('active')
            }
        }
    });
    // Skill
    var bars = document.querySelectorAll(".progress-bar .main-bar .fill");
    window.addEventListener('scroll', function () {
        if (isInViewport(document.getElementsByClassName('progress-bar-wrapper')[0])) {
            bars.forEach(item => {
                if (isInViewport(item)) {
                    item.style.width = item.getAttribute('data-width') + '%';
                }
            })
        }
    });
    function isInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    // Contact Form
    function validateForm() {
        if (document.contactForm.name.value == '') {
            document.querySelector('.validation-error.name').classList.add('active')
            document.contactForm.name.focus();
            return false;
        } else {
            document.querySelector('.validation-error.name').classList.remove('active')
        }
        var emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
        if (document.contactForm.email.value == '' || !document.contactForm.email.value.match(emailRegex)) {
            document.querySelector('.validation-error.email').classList.add('active')
            document.contactForm.email.focus();
            return false;
        } else {
            document.querySelector('.validation-error.email').classList.remove('active')
        }
        if (document.contactForm.message.value == '') {
            document.querySelector('.validation-error.message').classList.add('active')
            document.contactForm.message.focus();
            return false;
        } else {
            document.querySelector('.validation-error.message').classList.remove('active')
        }
        return true;
    }
    document.contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm()) {
            var formElements = document.contactForm.elements;
            var formData = {};
            for (var i = 0; i < formElements.length; i++) {
                if (formElements[i].name && formElements[i].value) {
                    formData[formElements[i].name] = formElements[i].value
                }
            }
            var raw = JSON.stringify(formData);
            var requestOptions = {
                method: 'POST',
                body: raw,
                redirect: 'follow'
            };
            document.getElementsByClassName("submit-btn")[0].classList.add('show-loading');
            fetch("https://contact-form.devchapter-work.workers.dev", requestOptions)
                .then(response => response.text())
                .then(result => {
                    document.getElementsByClassName("submit-btn")[0].classList.remove('show-loading')
                    document.getElementsByClassName('success-submit-message')[0].classList.add('active')
                    document.contactForm.reset();
                    setTimeout(function () {
                        document.getElementsByClassName('success-submit-message')[0].classList.remove('active')
                    }, 4000)
                })
                .catch(error => {
                    document.getElementsByClassName("submit-btn")[0].classList.remove('show-loading')
                    document.getElementsByClassName('fail-submit-message')[0].classList.add('active');
                    setTimeout(function () {
                        document.getElementsByClassName('fail-submit-message')[0].classList.remove('active')
                    }, 4000)
                });
        }
    })
    document.contactForm.addEventListener('change', function (e) {
        e.preventDefault();
        document.querySelectorAll('.validation-error').forEach(function (el) {
            el.classList.remove('active')
        })
    })
    // Copyright
    var currentYear = new Date().getFullYear();
    var copyrightText = document.querySelector(".footer .copyright .year").innerHTML
    document.querySelector(".footer .copyright .year").innerHTML = copyrightText.replace('year', currentYear);
})


// Function to update missions based on selected language
async function updateMissions(lang) {
    const missionList = document.querySelector("#mission-list");
    const missionsData = await fetchMissionsData(lang).catch(error => { console.log(error); missionsData=[]});

    //Filter with case insensitive test
    const filterText = document.getElementById("filter").value
    const filteredMissionData = (filterText.length<=0) ? missionsData:_.filter(missionsData, function(o) {return (Object.values(o).filter(str => new RegExp(filterText, 'i').test(str)).length>0); });    
    document.getElementById("nbResult").innerHTML=filteredMissionData.length;

    //Order result by date
    const order = document.getElementById("orderPicture").getAttribute("data-order");
    console.log("order is : "+order);
    const orderedArray=_.orderBy(filteredMissionData,['dtend.slice(-4)', 'dtstart', 'title'], [order, order, 'asc']);

    missionList.textContent = '';
    orderedArray.forEach((mission) => {
        const missionCard = document.createElement('div');
        missionCard.className = 'container';
        var missionContent=`` +
            `<div class="mission-list-header">
                <div class="mission-list-header-left">
                    <div class="mission-list-header-logo-container">
                        <picture>
                            <source srcset="assets/img/logos/${mission.logo}-dark.png" media="none" data-media="(prefers-color-scheme: dark)">
                            <img alt="Logo" loading="lazy" decoding="async" data-nimg="1" srcset="assets/img/logos/${mission.logo}-light.png" src="assets/img/logos/${mission.logo}-light.png" class="mission-logo"></img>
                        </picture>
                    </div>
                </div>
                <div class="mission-list-header-main">
                    <div class="mission-list-header-title">${mission.title}</div>
                    <div class="mission-list-header-poste">${mission.role}</div>
                </div>
                <div class="mission-list-header-right">
                    <span class="mission-list-header-date-tag">${mission.dtstart.slice(0,4)} - ${mission.dtend.slice(0,4)}</span>
                </div>
            </div>
            <div class="mission-list-content">
                <div class="mission-list-content-title" data-i18n="missions_job_desc">...</div>
                <div class="mission-list-content-desc">
                    ${mission.desc}
                </div>
                <div class="mission-list-content-title" data-i18n="missions_job_tasks">...</div>
                <div class="mission-list-content-desc">
                    <ul>`;
        mission.tasks.forEach((mTask) => {
            switch (mTask.charAt(0)) {
                case '+':
                    missionContent+=`<li class="mission-list-content-3th">${mTask.slice(1)}</li>`;
                  break;
                case '-':
                    missionContent+=`<li class="mission-list-content-2nd">${mTask.slice(1)}</li>`;
                  break;
                default:
                    missionContent+= `<li class="mission-list-content-1st">${mTask}</li>`;
              }
        });    
        missionContent+=`` +
                    `</ul>
                </div>
            </div>
            <div class="mission-list-footer">
                <div class="mission-list-footer-title" data-i18n="missions_job_envs">...</div>
                <div class="mission-list-footer-tags">` ;
        mission.tags.forEach((mTags) => {
            missionContent+= `<span class="small-tag">${mTags}</span>`;
        });
        missionContent += `` +
                `</div>
                <div class="mission-list-footer-mention" ><div data-i18n="missions_job_for">...</div><div><u>${mission.company}</u></div></div>
            </div>`;
            missionCard.innerHTML = missionContent;
            missionList.appendChild(missionCard);
    });
}

// Function to update content based on selected language
async function updateContent(lang) {
    const langData = await fetchLanguageData(lang).catch(error => { console.log(error); langData=[]});
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = langData[key];
    });
    document.querySelectorAll('[data-i18n="menu_resume"]').forEach(element => {
        element.setAttribute("href",`data/dclairac-resume-${lang}.pdf`);
    });
}

// Function to set the language preference
function setLanguagePreference(lang) {
    localStorage.setItem('language', lang);
    location.reload();
}

// Function to fetch language data
async function fetchLanguageData(lang) {
    const response = await fetch(`data/caption-${lang}.json`).catch(error => { console.log(error)});
    return response.json();
}
// Function to fetch missions data
async function fetchMissionsData(lang) {
    const response = await fetch(`data/missions-${lang}.json`).catch(error => {console.log(error)});
    return response.json();
}

async function updateText(){
    const lang = localStorage.getItem('language') || 'en';
    await updateMissions(lang).catch(error => {console.log(error)});
    await updateContent(lang).catch(error => { console.log(error)});
    changeLogoTheme();
}

// Function to change language
async function changeLanguage() {
    const userPreferredLanguage = localStorage.getItem('language') || 'en';
    const lang = (userPreferredLanguage === "en") ? "fr":"en";
    await setLanguagePreference(lang).catch(error => {console.log(error)});
    await updateText().catch(error => {console.log(error)});
}

//Function to switch imapge based on theme
function changeLogoTheme() {
    const theme=document.documentElement.getAttribute("data-theme")|| 'light';
    const pictures = document.querySelectorAll('picture')
    pictures.forEach((picture) => {
        const sources = picture.querySelectorAll(`source[media*="prefers-color-scheme"], source[data-media*="prefers-color-scheme"]`)
        sources.forEach((source) => {
            // Preserve the source `media` as a data-attribute
            // to be able to switch between preferences
            if (source?.media.includes('prefers-color-scheme')) {
            source.dataset.media = source.media
            }
    
            // If the source element `media` target is the `preference`,
            // override it to 'all' to show or set it to 'none' to hide
            if (source?.dataset.media.includes(theme)) {
            source.media = 'all'
            } else if (source) {
            source.media = 'none'
            }
        })
    })
}

async function switchOrder(){
    const orderPicture = document.getElementById("orderPicture");
    const currentOrder = orderPicture.getAttribute("data-order");
    console.log("order was : "+currentOrder);
    if(currentOrder==="asc"){
        orderPicture.setAttribute("data-order","desc");
        orderPicture.innerHTML="⬇️"
    }else{
        orderPicture.setAttribute("data-order","asc");
        orderPicture.innerHTML="⬆️"
    }
    await updateText().catch(error => {console.log(error)});
}