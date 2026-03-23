document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;
    
    function checkUserLogin() {
        const currentUser = JSON.parse(localStorage.getItem('charmeCurrentUser'));
        const welcomeMessage = document.getElementById('welcome-message');
        const accountLink = document.getElementById('account-link');
        
        if (currentUser && welcomeMessage) {
            const firstName = currentUser.name.split(' ')[0];
            welcomeMessage.textContent = `Olá, ${firstName}!`;
            if (accountLink) {
                accountLink.textContent = 'Minha Conta';
            }
        }
    }
    
    checkUserLogin();

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i].classList.remove('active');
        });
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            stopSlider();
            startSlider();
        });
    });

    if (slides.length > 0) {
        startSlider();
    }

    let cart = JSON.parse(localStorage.getItem('charmeCart')) || [];
    
    function saveCart() {
        localStorage.setItem('charmeCart', JSON.stringify(cart));
        updateCartCount();
    }
    
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = totalItems;
        });
        document.querySelectorAll('.cart-count-badge').forEach(el => {
            el.textContent = totalItems;
            el.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }

    const cartButtons = document.querySelectorAll('.btn-add-cart');
    const cartCount = document.querySelector('.cart-count');

    cartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card') || this.closest('.easter-card');
            
            let productName, productPrice, productImage, productCategory;
            
            if (productCard) {
                if (productCard.classList.contains('easter-card')) {
                    productName = productCard.querySelector('h3').textContent;
                    productPrice = productCard.querySelector('.price-current').textContent;
                    productImage = productCard.querySelector('img').src;
                    productCategory = 'Páscoa';
                } else {
                    productName = productCard.querySelector('h3').textContent;
                    productPrice = productCard.querySelector('.price-current').textContent;
                    productImage = productCard.querySelector('.product-img img').src;
                    productCategory = productCard.querySelector('.product-category').textContent;
                }
                
                const existingItem = cart.find(item => item.name === productName);
                
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    const priceNum = parseFloat(productPrice.replace('R$ ', '').replace(',', '.'));
                    cart.push({
                        name: productName,
                        price: priceNum,
                        image: productImage,
                        category: productCategory,
                        quantity: 1
                    });
                }
                
                saveCart();
                
                const originalText = this.textContent;
                this.textContent = '✓ Adicionado!';
                this.style.background = '#2E7D32';
                
                cartCount.style.transform = 'scale(1.3)';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                    cartCount.style.transform = 'scale(1)';
                }, 1500);
            }
        });
    });

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input');
            const button = this.querySelector('button');
            
            if (input.value && input.value.includes('@')) {
                button.textContent = '✓ Inscrito!';
                button.style.background = '#2E7D32';
                input.value = '';
                
                setTimeout(() => {
                    button.textContent = 'Inscrever';
                    button.style.background = '';
                }, 2000);
            } else {
                input.style.border = '2px solid #E53935';
                setTimeout(() => {
                    input.style.border = '';
                }, 2000);
            }
        });
    }

    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                const searchBtn = document.querySelector('.search-btn');
                const originalContent = searchBtn.textContent;
                searchBtn.textContent = 'Buscando...';
                
                setTimeout(() => {
                    searchBtn.textContent = originalContent;
                    alert(`Buscando por: "${this.value}"\n\n(Em breve: resultados da busca)`);
                }, 1000);
            }
        });
    }

    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '';
        }
    });

    const easterCards = document.querySelectorAll('.easter-card');
    if (easterCards.length > 0) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        easterCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }

    let touchStartX = 0;
    let touchEndX = 0;
    const slider = document.querySelector('.hero-slider');

    if (slider) {
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                currentSlide = (currentSlide + 1) % slides.length;
            } else {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            }
            showSlide(currentSlide);
            stopSlider();
            startSlider();
        }
    }

    updateCartCount();
    console.log('🍫 Charme Chocolate - Site carregado com sucesso!');
});

function openZoomModal(imgContainer) {
    const img = imgContainer.querySelector('img');
    const card = imgContainer.closest('.product-card');
    const productName = card.querySelector('h3').textContent;
    const productPrice = card.querySelector('.price-current').textContent;
    
    document.getElementById('zoom-image').src = img.src;
    document.getElementById('zoom-image').alt = productName;
    document.getElementById('zoom-product-name').textContent = productName;
    document.getElementById('zoom-product-price').textContent = productPrice;
    document.getElementById('image-zoom-modal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeZoomModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('image-zoom-modal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeZoomModal();
    }
});

// Mobile Menu
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    function openMobileMenu() {
        if (mobileMenu && mobileMenuOverlay) {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMobileMenu() {
        if (mobileMenu && mobileMenuOverlay) {
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMobileMenu);
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Update mobile user name
    const currentUser = JSON.parse(localStorage.getItem('charmeCurrentUser'));
    const mobileUserName = document.getElementById('mobile-user-name');
    if (currentUser && mobileUserName) {
        const firstName = currentUser.name.split(' ')[0];
        mobileUserName.textContent = `Olá, ${firstName}`;
    }

    // Update mobile cart count
    const mobileCartCount = document.getElementById('mobile-cart-count');
    if (mobileCartCount) {
        const cart = JSON.parse(localStorage.getItem('charmeCart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        mobileCartCount.textContent = totalItems;
    }
});
