document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Floating Leaf Particles Generator ---
    const particlesContainer = document.getElementById('particles');
    const leafCount = 12;

    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.classList.add('particle');
        
        // Randomize sizes, positions, and delays
        const size = Math.random() * 12 + 8; // 8px to 20px
        leaf.style.width = `${size}px`;
        leaf.style.height = `${size * 1.5}px`;
        leaf.style.left = `${Math.random() * 100}%`;
        leaf.style.animationDelay = `${Math.random() * 10}s`;
        leaf.style.animationDuration = `${Math.random() * 8 + 10}s`; // 10s to 18s
        
        particlesContainer.appendChild(leaf);
    }

    // --- 2. Cover Screen & Opening Action ---
    const coverScreen = document.getElementById('coverScreen');
    const openBtn = document.getElementById('openBtn');
    const mainContent = document.getElementById('mainContent');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');

    let isPlaying = false;

    openBtn.addEventListener('click', () => {
        // Slide open cover screen
        coverScreen.classList.add('opened');
        mainContent.classList.add('visible');

        // Play subtle background audio after user interaction
        bgMusic.play().then(() => {
            isPlaying = true;
            musicToggle.classList.add('playing');
        }).catch(err => {
            console.log("Audio autoplay prevented or failed:", err);
        });

        // Smooth scroll to introduction after opening
        setTimeout(() => {
            window.scrollTo({
                top: window.innerHeight * 0.2,
                behavior: 'smooth'
            });
        }, 600);
    });

    // Toggle Audio Control
    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            isPlaying = false;
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            bgMusic.play();
            isPlaying = true;
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        }
    });

    // --- 3. Countdown Timer ---
    // Target Date: 29 July 2026, 21:30 (9:30 PM)
    const targetDate = new Date("July 29, 2026 21:30:00").getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const countdownMessage = document.getElementById('countdownMessage');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            daysEl.innerText = "00";
            hoursEl.innerText = "00";
            minutesEl.innerText = "00";
            secondsEl.innerText = "00";
            countdownMessage.innerText = "اليوم هو يوم الفرح ❤️";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysEl.innerText = days < 10 ? `0${days}` : days;
        hoursEl.innerText = hours < 10 ? `0${hours}` : hours;
        minutesEl.innerText = minutes < 10 ? `0${minutes}` : minutes;
        secondsEl.innerText = seconds < 10 ? `0${seconds}` : seconds;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // --- 4. Calendar Integration (.ics Download) ---
    const addToCalendarBtn = document.getElementById('addToCalendarBtn');

    addToCalendarBtn.addEventListener('click', () => {
        const title = "حفل زفاف رضى الله و رضينا";
        const description = "نتشرف بحضوركم حفل زفافنا في قاعات روزموند - طريق المطار";
        const location = "قاعات روزموند – طريق المطار, عمّان";
        const startDate = "20260729T183000Z"; // 9:30 PM local (UTC+3) -> 18:30 UTC
        const endDate = "20260729T203000Z";   // 11:30 PM local

        const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Arabic Wedding Invitation//NONSGML v1.0//EN
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
DTSTART:${startDate}
DTEND:${endDate}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'wedding-invitation.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast("تم تحميل حدث التقويم!");
    });

    // --- 5. Share Functionality ---
    const shareBtn = document.getElementById('shareBtn');
    const navShareBtn = document.getElementById('navShareBtn');

    function handleShare() {
        if (navigator.share) {
            navigator.share({
                title: 'دعوة زفاف رضى الله و رضينا',
                text: 'يسرنا دعوتكم لحضور حفل زفافنا يوم الأربعاء 29.7.2026',
                url: window.location.href,
            }).catch((error) => console.log('Error sharing:', error));
        } else {
            // Fallback: Copy URL to clipboard
            navigator.clipboard.writeText(window.location.href);
            showToast("تم نسخ رابط الدعوة بنجاح!");
        }
    }

    if (shareBtn) shareBtn.addEventListener('click', handleShare);
    if (navShareBtn) navShareBtn.addEventListener('click', handleShare);

    // --- Helper: Toast Notification ---
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.innerText = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
