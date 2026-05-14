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
        
        // Open QR Code modal
        qrcodeBtn.addEventListener('click', function(e) {
            e.preventDefault();
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
            }
        });
        
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