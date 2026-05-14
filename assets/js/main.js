// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDropdown = document.getElementById('mobileDropdown');
    
    if (mobileMenuBtn && mobileDropdown) {
        // Toggle mobile dropdown
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !mobileDropdown.contains(e.target)) {
                mobileDropdown.classList.remove('active');
            }
        });
        
        // Close dropdown when clicking a link
        const dropdownLinks = mobileDropdown.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileDropdown.classList.remove('active');
            });
        });
        
        // Close dropdown on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileDropdown.classList.remove('active');
            }
        });
    }

    // QR Code functionality
    const qrcodeBtn = document.getElementById('qrcodeBtn');
    const qrcodeModal = document.getElementById('qrcodeModal');
    const qrcodeCloseBtn = document.getElementById('qrcodeCloseBtn');
    const qrcodeDisplay = document.getElementById('qrcodeDisplay');
    
    if (qrcodeBtn && qrcodeModal && qrcodeCloseBtn && qrcodeDisplay) {
        let qrcodeInstance = null;
        
        // Open QR Code modal (supports click and touch)
        const openQrModal = function(e) {
            if (e) e.preventDefault();
            qrcodeModal.style.display = 'flex';

            // Generate QR code only when modal is opened
            if (!qrcodeInstance) {
                qrcodeDisplay.innerHTML = ''; // Clear previous QR code
                qrcodeInstance = new QRCode(qrcodeDisplay, {
                    text: 'https://mohammadrezanarimaniucdavis.github.io/',
                    width: 280,
                    height: 280,
                    colorDark: '#022851',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });

                // Some mobile browsers perform better with an <img> instead of canvas.
                // Convert canvas (if created) to data URL and replace with an <img> for reliability.
                setTimeout(function() {
                    try {
                        const canvas = qrcodeDisplay.querySelector('canvas');
                        if (canvas && canvas.toDataURL) {
                            const img = document.createElement('img');
                            img.alt = 'QR code for Mohammadreza Narimani website';
                            img.src = canvas.toDataURL('image/png');
                            img.style.maxWidth = '70vw';
                            img.style.width = 'auto';
                            img.style.height = 'auto';
                            img.style.borderRadius = '8px';
                            img.style.display = 'block';
                            img.style.margin = '0 auto';
                            qrcodeDisplay.innerHTML = ''; // remove canvas/table
                            qrcodeDisplay.appendChild(img);
                        }
                    } catch (err) {
                        // If conversion fails, leave the original QR element (canvas/table).
                        console.warn('QR conversion to image failed:', err);
                    }
                }, 120);
            }
        };

        qrcodeBtn.addEventListener('click', openQrModal);
        qrcodeBtn.addEventListener('touchstart', function(e) { e.preventDefault(); openQrModal(e); }, {passive: false});
        
        // Close QR Code modal
        qrcodeCloseBtn.addEventListener('click', function() {
            qrcodeModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        qrcodeModal.addEventListener('click', function(e) {
            if (e.target === qrcodeModal) {
                qrcodeModal.style.display = 'none';
            }
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && qrcodeModal.style.display === 'flex') {
                qrcodeModal.style.display = 'none';
            }
        });
    }
});