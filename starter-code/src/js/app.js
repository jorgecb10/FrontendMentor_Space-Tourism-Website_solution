import { getData } from "./data.js";

document.addEventListener('DOMContentLoaded', initApp)

async function initApp() {
    const data = await getData()

    mainNavigation()
    setActiveLink()
    initTabs('.dest-tab', tab => renderSection(data, 'destinations', tab.dataset.dest, getDomDestination, updateDOMDest))
    initTabs('.crew-tab', tab => renderSection(data, 'crew', tab.dataset.crew, getDomCrew, updateDomCrew))
    initTabs('.tech-tab', tab => renderSection(data, 'technology', tab.dataset.tech, getDomTech, updateDOMTech))
}

function mainNavigation() {
    const iconHamburger = document.querySelector('.header__icon--hamburger')
    const navigation = document.querySelector('.navigation__ul')

    iconHamburger.addEventListener('click', e => {
        e.preventDefault()
        navigation.classList.toggle('show')
        iconHamburger.classList.toggle('rotate-360')
        iconHamburger.src = iconHamburger.src.includes('assets/shared/icon-hamburger.svg')
        ? 'assets/shared/icon-close.svg'
        : 'assets/shared/icon-hamburger.svg';
    })

    resizeWindow(navigation, iconHamburger)
}

function setActiveLink() {
    const links = document.querySelectorAll('.navigation__a')
    const main = document.querySelector('main')

    links.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href')
            if(!href || href === '#') return

            e.preventDefault()
            links.forEach(l => l.classList.remove('active'))
            link.classList.add('active')
            main.style.animation = 'fadeOutPage 0.3s ease forwards'

            setTimeout(() => {
                window.location.href = href
            }, 300);
        })
    })
}

function initTabs(selector, onTabClick) {
    const tabs = document.querySelectorAll(selector)
    if (!tabs.length) return

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'))
            tab.classList.add('active')
            onTabClick(tab)
        })
    })
}

function resizeWindow(navigation, icon) {
    const mediaQuery = window.matchMedia('(min-width: 768px)')

    mediaQuery.addEventListener('change', e => {
        if(e.matches) {
            navigation.classList.remove('show')
            icon.src = 'assets/shared/icon-hamburger.svg'
        } 
    })
}

function renderSection(data, collection, key, getDom, updateDOM) {
    const { img, content, findItem, classes } = getDom()
    const item = findItem(data[collection], key)
    if(!item) return

    img.classList.add(classes.leaving)
    content.classList.add('content-leaving')

    setTimeout(() => {
        updateDOM(img, item)
        img.classList.replace(classes.leaving, classes.entering)
        content.classList.replace('content-leaving', 'content-entering')
    }, 400);
}

function getDomDestination() {
    return {
        img: document.getElementById('planet-img'),
        content: document.querySelector('.dest-content'),
        findItem: (list, key) => list.find(d => d.name.toLowerCase() === key),
        classes: { leaving: 'planet-leaving', entering: 'planet-entering' }
    }
}

function getDomCrew() {
    return {
        img: document.getElementById('avatar-img'),
        content: document.querySelector('.crew-content'),
        findItem: (list, key) => list.find(c => c.name.split(' ')[0].toLowerCase() === key),
        classes: { leaving: 'element-leaving', entering: 'element-entering' }
    }
}

function getDomTech() {
    return {
        img: document.getElementById('vehicle-img'),
        content: document.querySelector('.tech-content'),
        findItem: (list, key) => list.find(t => t.name.split(' ')[0].toLowerCase() === key),
        classes: { leaving: 'element-leaving', entering: 'element-entering' }
    }
}

function updateDOMDest(img, dest) {
    document.getElementById('planet-img-webp').srcset = dest.images.webp
    document.getElementById('planet-img-png').srcset = dest.images.png
    img.src = dest.images.png
    document.getElementById('dest-name').textContent = dest.name
    document.getElementById('dest-desc').textContent = dest.description
    document.getElementById('dest-distance').textContent = dest.distance
    document.getElementById('dest-travel').textContent = dest.travel
}

function updateDomCrew(img, member) {
    document.getElementById('avatar-img-webp').srcset = member.images.webp
    document.getElementById('avatar-img-png').srcset = member.images.png
    img.src = member.images.png
    document.getElementById('crew-heading').textContent = member.role
    document.getElementById('crew-name').textContent = member.name
    document.getElementById('crew-bio').textContent = member.bio
}

function updateDOMTech(img, vehicle) {
    img.src = vehicle.images.portrait
    document.getElementById('tech-name').textContent = vehicle.name
    document.getElementById('tech-desc').textContent = vehicle.description
}