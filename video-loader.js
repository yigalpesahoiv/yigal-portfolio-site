document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Modal HTML if not present
    if (!document.getElementById('video-modal')) {
        const modalHTML = `
            <div id="video-modal" class="fixed inset-0 z-[100] bg-black/95 hidden flex items-center justify-center opacity-0 transition-opacity duration-300">
                <button id="close-modal" class="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div class="w-full max-w-6xl aspect-video mx-4 relative">
                    <div id="video-container" class="w-full h-full"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById('video-modal');
    const container = document.getElementById('video-container');
    const closeBtn = document.getElementById('close-modal');
    const links = document.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"], a[href*="vimeo.com"]');

    function openModal(embedUrl) {
        container.innerHTML = `<iframe src="${embedUrl}" class="w-full h-full" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen referrerpolicy="no-referrer"></iframe>`;
        modal.classList.remove('hidden');
        // Small delay to allow display:block to apply before opacity transition
        setTimeout(() => {
            modal.classList.remove('opacity-0');
        }, 10);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            container.innerHTML = ''; // Stop video
            document.body.style.overflow = '';
        }, 300);
    }

    function getEmbedUrl(url) {
        let embedUrl = '';

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            let videoId = '';
            if (url.includes('youtu.be')) {
                videoId = url.split('/').pop().split('?')[0];
            } else {
                const urlParams = new URLSearchParams(new URL(url).search);
                videoId = urlParams.get('v');
            }
            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        } else if (url.includes('vimeo.com')) {
            const videoId = url.split('/').pop().split('?')[0];
            embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
        }

        return embedUrl;
    }

    links.forEach(link => {
        // Only target links inside the grid (checking for parent structure or class might be safer, but general check is okay for now)
        // We can check if it's inside the main section or has specific classes if needed.
        // For now, let's assume all video links on these pages should open in lightbox.

        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = link.href;
            const embedUrl = getEmbedUrl(url);
            if (embedUrl) {
                openModal(embedUrl);
            } else {
                window.open(url, '_blank');
            }
        });
    });

    closeBtn.addEventListener('click', closeModal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});
