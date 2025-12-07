// Navigation Scroll Effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation Link - Set based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// Discover Slider
const sliderItems = document.querySelectorAll('.slider-item');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;

function updateSlider() {
    sliderItems.forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentSlide) {
            item.classList.add('active');
        }
    });
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + sliderItems.length) % sliderItems.length;
        updateSlider();
    });
    
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % sliderItems.length;
        updateSlider();
    });
}

// Add click handlers to slider items to navigate to spot page
sliderItems.forEach(item => {
    item.addEventListener('click', (e) => {
        // Don't navigate if clicking on navigation buttons
        if (e.target.closest('.slider-controls')) {
            return;
        }
        
        const locationKey = item.getAttribute('data-location');
        if (locationKey) {
            window.location.href = `spot.html?location=${locationKey}`;
        }
    });
});


// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements (except timeline items)
document.querySelectorAll('.overview-card, .story-card, .activity-card, .info-card, .feature-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Timeline-specific observer for layer-by-layer reveal animation
const timelineObserverOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -150px 0px'
};

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            timelineObserver.unobserve(entry.target);
        }
    });
}, timelineObserverOptions);

// Observe all timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    timelineObserver.observe(item);
});

// Interactive Map (Using Leaflet.js)
let map;
let markers = [];

const locations = {
    bridge: {
        name: 'Wah Fu Circular Bridge (華富邨圓形天橋)',
        lat: 22.25216,
        lon: 114.13635,
        icon: 'info-sign',
        color: 'blue',
        description: '華富邨標誌性的圓形天橋，連接不同區域的重要通道。',
        image: 'assets/圓形天橋.png',
        badge: 'Architecture',
        title: '圓形天橋',
        subtitle: '華富邨標誌性的圓形天橋',
        features: [
            '連接不同區域的重要通道',
            '獨特的圓形設計',
            '適合拍照打卡',
            '欣賞建築之美'
        ]
    },
    housing: {
        name: 'Twin Tower Housing - Wah Som House (井字公屋)',
        lat: 22.25135,
        lon: 114.13475,
        icon: 'home',
        color: 'orange',
        description: '獨特的井字型公屋設計，是華富邨的建築特色。',
        image: 'assets/井字公屋.png',
        badge: 'Architecture',
        title: '井字公屋',
        subtitle: '獨特的井字型公屋設計',
        features: [
            '華富邨的建築特色',
            '獨特的井字型設計',
            '適合拍照打卡',
            '欣賞建築之美'
        ]
    },
    park: {
        name: 'Waterfall Bay Park (瀑布灣公園)',
        lat: 22.250556913543175,
        lon: 114.13481016703993,
        icon: 'tree-conifer',
        color: 'green',
        description: '設有不同難度的路線，壯麗山海景色，指示清晰的山徑，建議預留 1 至 2 小時。',
        image: 'assets/f6313bdfc0449a9a7cd07bbf35f8d8341564ec60.png',
        badge: 'Hiking',
        title: '瀑布灣公園',
        subtitle: '飽覽全景海岸線的觀景行山徑',
        features: [
            '設有不同難度的路線',
            '壯麗山海景色',
            '指示清晰的山徑',
            '建議預留 1 至 2 小時'
        ]
    },
    beach: {
        name: 'Egg Waffles Rock Beach (雞蛋仔石灘)',
        lat: 22.25025897470844,
        lon: 114.13489599749107,
        icon: 'camera',
        color: 'red',
        description: '美麗的石灘，是欣賞海景和日落的絕佳地點。',
        image: 'assets/151d10cce69ca50a904615596745f04c968eabb0.png',
        badge: 'Beach',
        title: '雞蛋仔石灘',
        subtitle: '美麗的石灘，欣賞海景和日落',
        features: [
            '欣賞海景和日落',
            '獨特的石灘景觀',
            '適合拍照打卡',
            '建議黃昏時分前往'
        ]
    }
};

// Color mapping for Leaflet markers
const colorMap = {
    'blue': '#2b7fff',
    'orange': '#ff6900',
    'green': '#0080ff',
    'red': '#ff4444'
};

function initMap() {
    // Initialize map centered on Wah Fu Estate (average of all locations)
    const centerLat = (22.25216 + 22.25135 + 22.250556913543175 + 22.25025897470844) / 4;
    const centerLon = (114.13635 + 114.13475 + 114.13481016703993 + 114.13489599749107) / 4;
    map = L.map('map').setView([centerLat, centerLon], 15);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Add markers for each location
    Object.keys(locations).forEach(key => {
        const loc = locations[key];
        const markerColor = colorMap[loc.color] || loc.color;
        // Handle both 'lon' and 'lng' properties
        const lng = loc.lon !== undefined ? loc.lon : loc.lng;
        
        // Create custom icon based on location type
        const markerIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                background-color: ${markerColor};
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
            ">📍</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const marker = L.marker([loc.lat, lng], {
            icon: markerIcon
        }).addTo(map);
        
        marker.bindPopup(`
            <div style="padding: 10px; min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: ${markerColor}; font-size: 16px; font-weight: bold;">${loc.name}</h3>
                <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.5;">${loc.description}</p>
            </div>
        `);
        
        markers.push({ key, marker, loc });
    });
}

// Function to update spot info card
function updateSpotInfoCard(locationKey) {
    const location = locations[locationKey];
    if (!location) return;
    
    const infoCard = document.getElementById('spotInfoCard');
    if (!infoCard) return;
    
    const image = document.getElementById('spotInfoImage');
    const badge = document.getElementById('spotInfoBadge');
    const title = document.getElementById('spotInfoTitle');
    const subtitle = document.getElementById('spotInfoSubtitle');
    const list = document.getElementById('spotInfoList');
    
    if (image) image.src = location.image || '';
    if (badge) badge.textContent = location.badge || '';
    if (title) title.textContent = location.title || '';
    if (subtitle) subtitle.textContent = location.subtitle || '';
    
    if (list && location.features) {
        list.innerHTML = location.features.map(feature => `<li>${feature}</li>`).join('');
    }
}

// Map button interactions
const mapButtons = document.querySelectorAll('.map-btn');

mapButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        mapButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Get location key
        const locationKey = btn.getAttribute('data-location');
        const location = locations[locationKey];
        
        // Update spot info card
        updateSpotInfoCard(locationKey);
        
        
        if (location && map) {
            // Fly to location (handle both lon and lng)
            const lng = location.lon !== undefined ? location.lon : location.lng;
            map.flyTo([location.lat, lng], 16, {
                animate: true,
                duration: 1.0
            });
            
            // Open popup for the marker
            const markerData = markers.find(m => m.key === locationKey);
            if (markerData) {
                setTimeout(() => {
                    markerData.marker.openPopup();
                }, 1000);
            }
        }
    });
});

// Initialize map on spot.html page
if (currentPage === 'spot.html' || currentPage.includes('spot')) {
    // Initialize map immediately on spot page
    if (document.getElementById('map')) {
        // Initialize info card with default location first
        const activeButton = document.querySelector('.map-btn.active');
        if (activeButton) {
            const defaultLocation = activeButton.getAttribute('data-location');
            updateSpotInfoCard(defaultLocation || 'bridge');
        } else {
            updateSpotInfoCard('bridge');
        }
        
        setTimeout(() => {
            initMap();
            
            // Check for location parameter in URL
            const urlParams = new URLSearchParams(window.location.search);
            const locationParam = urlParams.get('location');
            
            if (locationParam && locations[locationParam]) {
                // Scroll to map section first
                const mapSection = document.querySelector('.map-section');
                if (mapSection) {
                    mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                
                // Wait for map to be fully initialized
                setTimeout(() => {
                    // Find and click the corresponding button
                    const targetButton = document.querySelector(`.map-btn[data-location="${locationParam}"]`);
                    if (targetButton) {
                        targetButton.click();
                    } else {
                        // If button not found, still update the info card
                        updateSpotInfoCard(locationParam);
                    }
                }, 1000);
            }
        }, 500);
    }
}

// Before/After Slider
const beforeAfterSlider = document.getElementById('beforeAfterSlider');
const afterImage = document.querySelector('.after-image');
const sliderHandle = document.querySelector('.slider-handle');

if (beforeAfterSlider && afterImage && sliderHandle) {
    function updateSlider(value) {
        const percentage = value;
        afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        sliderHandle.style.left = `${percentage}%`;
    }
    
    beforeAfterSlider.addEventListener('input', (e) => {
        updateSlider(e.target.value);
    });
    
    // Mouse drag functionality
    let isDragging = false;
    
    sliderHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const sliderRect = beforeAfterSlider.getBoundingClientRect();
            const percentage = ((e.clientX - sliderRect.left) / sliderRect.width) * 100;
            const clampedPercentage = Math.max(0, Math.min(100, percentage));
            beforeAfterSlider.value = clampedPercentage;
            updateSlider(clampedPercentage);
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Touch support
    sliderHandle.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const sliderRect = beforeAfterSlider.getBoundingClientRect();
            const touch = e.touches[0];
            const percentage = ((touch.clientX - sliderRect.left) / sliderRect.width) * 100;
            const clampedPercentage = Math.max(0, Math.min(100, percentage));
            beforeAfterSlider.value = clampedPercentage;
            updateSlider(clampedPercentage);
        }
    });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// Timeline Navigation (Future Page)
const timelineDots = document.querySelectorAll('.timeline-dot');
const timelineContent = document.querySelector('.timeline-content h3');
const timelineDescription = document.querySelector('.timeline-content p');
const prevTimelineBtn = document.querySelector('.timeline-controls .timeline-btn:first-child');
const nextTimelineBtn = document.querySelector('.timeline-controls .timeline-btn:last-child');

const timelineData = [
    {
        title: '第一階段：遷置與準備',
        description: '居民陸續遷往接收屋邨，華富北展開土地平整及清拆工程，為新發展做好準備。'
    },
    {
        title: '第二階段：基礎建設',
        description: '進行道路、水電、通訊等基礎設施建設，為新社區奠定基礎。'
    },
    {
        title: '第三階段：建築與落成',
        description: '興建新式住宅大樓及配套設施，預計完成後可容納更多居民。'
    }
];

let currentTimelineIndex = 0;

function updateTimeline() {
    timelineDots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentTimelineIndex) {
            dot.classList.add('active');
        }
    });
    
    if (timelineContent && timelineDescription) {
        timelineContent.textContent = timelineData[currentTimelineIndex].title;
        timelineDescription.textContent = timelineData[currentTimelineIndex].description;
    }
    
    // Update progress fill
    const progressFill = document.getElementById('timelineProgressFill');
    if (progressFill) {
        const progress = (currentTimelineIndex / (timelineData.length - 1)) * 100;
        progressFill.style.width = progress + '%';
        
        // Update progress fill color to match active dot
        const colors = ['#e29578', '#006d77', '#83c5be'];
        progressFill.style.background = colors[currentTimelineIndex] || '#e29578';
    }
    
    // Update button states
    if (prevTimelineBtn) {
        prevTimelineBtn.style.opacity = currentTimelineIndex === 0 ? '0.3' : '1';
        prevTimelineBtn.style.pointerEvents = currentTimelineIndex === 0 ? 'none' : 'auto';
    }
    
    if (nextTimelineBtn) {
        nextTimelineBtn.style.opacity = currentTimelineIndex === timelineData.length - 1 ? '0.3' : '1';
        nextTimelineBtn.style.pointerEvents = currentTimelineIndex === timelineData.length - 1 ? 'none' : 'auto';
    }
}

if (prevTimelineBtn && nextTimelineBtn) {
    prevTimelineBtn.addEventListener('click', () => {
        if (currentTimelineIndex > 0) {
            currentTimelineIndex--;
            updateTimeline();
            // Scroll to timeline section
            const timelineSection = document.querySelector('.timeline-section');
            if (timelineSection) {
                timelineSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    nextTimelineBtn.addEventListener('click', () => {
        if (currentTimelineIndex < timelineData.length - 1) {
            currentTimelineIndex++;
            updateTimeline();
            // Scroll to timeline section to show the next spot
            const timelineSection = document.querySelector('.timeline-section');
            if (timelineSection) {
                timelineSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // Initialize timeline
    updateTimeline();
}

// Story Navigation (Floating Nav)
const storySections = document.querySelectorAll('.story-detail');
const floatingNav = document.querySelector('.stories-toc');
const floatingStoryNav = document.getElementById('floatingStoryNav');
const floatingNavItems = document.querySelectorAll('.floating-nav-item');

// Original TOC navigation
if (floatingNav && storySections.length > 0) {
    const tocItems = document.querySelectorAll('.toc-item');
    
    tocItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = storySections[index];
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Floating Story Navigation
if (floatingStoryNav && storySections.length > 0) {
    // Show/hide floating nav based on scroll position
    const storiesToc = document.querySelector('.stories-toc');
    let isNavVisible = false;
    
    function updateFloatingNavVisibility() {
        if (!storiesToc) return;
        
        const tocBottom = storiesToc.getBoundingClientRect().bottom;
        const shouldShow = tocBottom < 0 && window.scrollY > 200;
        
        if (shouldShow !== isNavVisible) {
            isNavVisible = shouldShow;
            if (shouldShow) {
                floatingStoryNav.classList.add('visible');
            } else {
                floatingStoryNav.classList.remove('visible');
            }
        }
    }
    
    // Handle floating nav item clicks
    floatingNavItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-story');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Highlight active story section in floating nav
    const storyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const storyId = entry.target.id;
                
                // Update floating nav active state
                floatingNavItems.forEach(item => {
                    if (item.getAttribute('data-story') === storyId) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
                
                // Update original TOC active state
                const tocItems = document.querySelectorAll('.toc-item');
                const index = Array.from(storySections).indexOf(entry.target);
                tocItems.forEach(item => item.classList.remove('active'));
                if (tocItems[index]) {
                    tocItems[index].classList.add('active');
                }
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    });
    
    storySections.forEach(section => {
        storyObserver.observe(section);
    });
    
    // Update visibility on scroll
    window.addEventListener('scroll', updateFloatingNavVisibility);
    updateFloatingNavVisibility();
}

// Parallax Effect for Hero Sections
const heroSections = document.querySelectorAll('.hero-section');

window.addEventListener('scroll', () => {
    heroSections.forEach(hero => {
        const scrolled = window.pageYOffset;
        const heroTop = hero.offsetTop;
        const heroHeight = hero.offsetHeight;
        
        if (scrolled > heroTop - window.innerHeight && scrolled < heroTop + heroHeight) {
            const parallaxSpeed = 0.5;
            const heroImage = hero.querySelector('.hero-image');
            if (heroImage) {
                const yPos = -(scrolled - heroTop) * parallaxSpeed;
                heroImage.style.transform = `translateY(${yPos}px)`;
            }
        }
    });
});

// Counter Animation for Stats
const statsSection = document.querySelector('.stats-section');
const statNumbers = document.querySelectorAll('.stat-item h3');

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach((stat, index) => {
                    const text = stat.textContent;
                    const number = parseInt(text.replace(/[^0-9]/g, ''));
                    if (number && !stat.classList.contains('animated')) {
                        stat.classList.add('animated');
                        if (text.includes('+')) {
                            animateCounter(stat, number, 2000);
                            setTimeout(() => {
                                stat.textContent = number.toLocaleString() + '+';
                            }, 2000);
                        } else if (text.includes('%')) {
                            animateCounter(stat, number, 2000);
                            setTimeout(() => {
                                stat.textContent = number + '%';
                            }, 2000);
                        } else {
                            animateCounter(stat, number, 2000);
                        }
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Image Lazy Loading
const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => {
    if (img.dataset.src) {
        imageObserver.observe(img);
    }
});

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// 1920 Image Hover Video Play
const image1920 = document.getElementById('image-1920');
const video1920 = document.getElementById('video-1920');

if (image1920 && video1920) {
    image1920.addEventListener('mouseenter', () => {
        const img = image1920.querySelector('img');
        if (img) {
            img.style.display = 'none';
        }
        video1920.style.display = 'block';
        video1920.play();
    });
    
    image1920.addEventListener('mouseleave', () => {
        video1920.pause();
        video1920.currentTime = 0;
        video1920.style.display = 'none';
        const img = image1920.querySelector('img');
        if (img) {
            img.style.display = 'block';
        }
    });
}

// Handle hash navigation on story page
function handleStoryHashNavigation() {
    if (currentPage === 'story.html' || currentPage.includes('story')) {
        const hash = window.location.hash;
        if (hash) {
            // Wait for page to load, then scroll to the section
            setTimeout(() => {
                const targetSection = document.querySelector(hash);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update floating nav active state
                    const floatingNavItem = document.querySelector(`.floating-nav-item[data-story="${hash.substring(1)}"]`);
                    if (floatingNavItem) {
                        floatingNavItems.forEach(item => item.classList.remove('active'));
                        floatingNavItem.classList.add('active');
                    }
                }
            }, 500);
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to page
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize first slide
    if (sliderItems.length > 0) {
        updateSlider();
    }
    
    // Handle story hash navigation
    handleStoryHashNavigation();
});

