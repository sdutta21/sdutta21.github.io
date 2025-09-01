const fs = require('fs');
const yaml = require('js-yaml');

// Read the YAML config file
function loadConfig() {
    try {
        const fileContents = fs.readFileSync('./portfolio-config.yaml', 'utf8');
        return yaml.load(fileContents);
    } catch (e) {
        console.error('Error loading config file:', e);
        process.exit(1);
    }
}

// Generate JavaScript config object from YAML
function generateJSConfig(config) {
    return `const portfolioConfig = ${JSON.stringify(config, null, 4)};`;
}

// Generate HTML sections
function generateExperienceHTML(experience) {
    return experience.map((exp, index) => `
        <div class="panel panel-default">
            <div class="panel-heading" role="tab" id="heading${index}">
                <h4 class="panel-title">
                    <a class="collapsed hover-glow" data-toggle="collapse" data-parent="#experienceAccordion" 
                       href="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                        ${exp.title} | <strong>${exp.company}</strong>
                    </a>
                </h4>
            </div>
            <div id="collapse${index}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading${index}">
                <div class="panel-body">
                    <p><i>${exp.period}</i></p>
                    <ul>
                        ${exp.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `).join('');
}

function generateEducationHTML(education) {
    return education.map((edu, index) => `
        <div class="panel panel-default">
            <div class="panel-heading" role="tab" id="eduHeading${index}">
                <h4 class="panel-title">
                    <a class="collapsed hover-glow" data-toggle="collapse" data-parent="#educationAccordion" 
                       href="#eduCollapse${index}" aria-expanded="false" aria-controls="eduCollapse${index}">
                        ${edu.title} | <strong>${edu.institution}</strong>
                    </a>
                </h4>
            </div>
            <div id="eduCollapse${index}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="eduHeading${index}">
                <div class="panel-body">
                    <p>Coursework: ${edu.coursework}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Build the complete HTML file
function buildHTML() {
    const config = loadConfig();
    
    const htmlContent = `<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${config.personal.name}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Engineer and Photographer in San Francisco - Systems Integration, Energy Access, and 4x5 Photography" />
    
    <!-- Preload critical resources -->
    <link rel="preload" href="https://fonts.googleapis.com/css?family=Quicksand:300,400,500,700&display=swap" as="style">
    <link rel="preload" href="https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700&display=swap" as="style">
    <link rel="preload" href="${config.personal.profile_image}" as="image">
    
    <link rel="shortcut icon" href="favicon.ico">

    <style>
        /* Trustworthy color scheme with custom warm accents - Targeted overrides */
        body { 
            font-family: 'Quicksand', sans-serif; 
            margin: 0; 
            padding: 0; 
            background-color: #F8F9FA;
            color: #2C3E50;
        }
        .container-wrap { max-width: 1200px; margin: 0 auto; }
        .loading-screen { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: linear-gradient(135deg, #CC7C5E 0%, #2C3E50 100%);
            display: flex; 
            justify-content: center; 
            align-items: center; 
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fun-cursor { cursor: default; }
        .custom-cursor {
            display: none;
        }
        .parallax-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #ECF0F1, #F8F9FA);
            z-index: -1;
            opacity: 0.3;
        }
        .floating-elements {
            position: fixed;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }
        .floating-element {
            position: absolute;
            opacity: 0.08;
            animation: float 8s ease-in-out infinite;
        }
        .floating-element:nth-child(odd) { animation-direction: reverse; }
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(90deg); }
        }
        .hover-glow { transition: all 0.3s ease; }
        .hover-glow:hover { 
            box-shadow: 0 4px 12px rgba(204, 124, 94, 0.25);
            transform: translateY(-1px);
        }
        .typewriter {
            overflow: hidden;
            border-right: .15em solid #CC7C5E;
            white-space: nowrap;
            margin: 0 auto;
            animation: typing 3.5s steps(40, end), blink-caret .75s step-end infinite;
        }
        @keyframes typing {
            from { width: 0 }
            to { width: 100% }
        }
        @keyframes blink-caret {
            from, to { border-color: transparent }
            50% { border-color: #CC7C5E; }
        }
        /* Targeted color overrides for your custom color */
        .heading-meta span { color: #CC7C5E !important; }
        a:hover { color: #CC7C5E !important; }
        .panel-title a:hover { color: #CC7C5E !important; }
        /* Fix accordion hover state text visibility */
        .panel-heading a:hover {
            background-color: #CC7C5E !important;
            color: #ffffff !important;
        }
        .panel-heading a.collapsed:hover {
            background-color: #CC7C5E !important;
            color: #ffffff !important;
            border: 1px solid #CC7C5E !important;
        }
        /* Project Carousel Styles */
        .project-carousel {
            margin-top: 40px;
        }
        .carousel-container {
            position: relative;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(44, 62, 80, 0.1);
            min-height: 300px;
        }
        .carousel-slides {
            position: relative;
            width: 100%;
            height: 300px;
            overflow: hidden;
        }
        .carousel-slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        .carousel-slide.active {
            opacity: 1;
        }
        .carousel-slide-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(44, 62, 80, 0.8));
            color: white;
            padding: 20px;
            font-size: 14px;
            font-weight: 500;
        }
        .carousel-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 0 10px;
            pointer-events: none;
        }
        .carousel-btn {
            background: rgba(204, 124, 94, 0.8);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            pointer-events: auto;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .carousel-btn:hover {
            background: rgba(204, 124, 94, 1);
            transform: scale(1.1);
        }
        .carousel-dots {
            display: flex;
            justify-content: center;
            padding: 15px;
            background: #f8f9fa;
            gap: 8px;
        }
        .carousel-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #bdc3c7;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .carousel-dot.active {
            background: #CC7C5E;
            transform: scale(1.2);
        }
        @media screen and (max-width: 768px) {
            .carousel-slides {
                height: 250px;
            }
            .carousel-btn {
                width: 35px;
                height: 35px;
                font-size: 16px;
            }
        }
    </style>
    
    <!-- Load fonts asynchronously -->
    <link href="https://fonts.googleapis.com/css?family=Quicksand:300,400,500,700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
    <link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
    
    <!-- Load CSS asynchronously - excluding broken font files -->
    <link rel="stylesheet" href="css/animate.css" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="css/icomoon.css" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="css/bootstrap.css" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="css/flexslider.css" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="css/owl.carousel.min.css" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="css/owl.theme.default.min.css" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="css/style.css" media="print" onload="this.media='all'">
</head>
<body class="fun-cursor">
    
    <!-- Loading Screen -->
    <div class="loading-screen" id="loadingScreen">
        <div class="loading-spinner"></div>
    </div>
    
    <!-- Custom Cursor -->
    <div class="custom-cursor" id="customCursor"></div>
    
    <!-- Parallax Background -->
    <div class="parallax-bg" id="parallaxBg"></div>
    
    <!-- Floating Elements -->
    <div class="floating-elements" id="floatingElements"></div>
    
    <div id="colorlib-page">
        <div class="container-wrap">
            <a href="#" class="js-colorlib-nav-toggle colorlib-nav-toggle" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"><i></i></a>
            <aside id="colorlib-aside" role="complementary" class="border js-fullheight">
                <div class="text-center">
                    <div class="author-img hover-glow" style="background-image: url(${config.personal.profile_image});"></div>
                    <h1 id="colorlib-logo"><a href="index.html">${config.personal.name}</a></h1>
                    <span class="position typewriter">${config.personal.title}</span>
                </div>
                <nav id="colorlib-main-menu" role="navigation" class="navbar">
                    <div id="navbar" class="collapse">
                        <ul>
                            <li><a href="#" data-nav-section="about" class="hover-glow">About Me</a></li>
                            <li><a href="#" data-nav-section="projects" class="hover-glow">Projects</a></li>
                            <li><a href="#" data-nav-section="resume" class="hover-glow">Resume</a></li>
                        </ul>
                    </div>
                </nav>
                <div class="colorlib-footer" style="margin-top: auto;">
                    <ul>
                        <li><a target="_blank" href="${config.personal.calendly_url}" class="hover-glow"><i class="icon-calender"></i></a></li>
                        <li><a target="_blank" href="${config.personal.linkedin_url}" class="hover-glow"><i class="icon-linkedin2"></i></a></li>
                    </ul>
                </div>
            </aside>

            <div id="colorlib-main">
                <section class="colorlib-about" data-section="about">
                    <div class="colorlib-narrow-content">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="row animate-box" data-animate-effect="fadeInLeft">
                                    <div class="col-md-12">
                                        <div class="about-desc">
                                            <span class="heading-meta">A Little <span style="color:#CC7C5E;">About Me</span></span>
                                            
                                            <strong>Things I am working on:</strong>
                                            <ul>
                                                ${config.current_work.map(exploration => {
                                                    if (typeof exploration === 'object') {
                                                        if (exploration.link) {
                                                            const linkElement = `<a target="_blank" href="${exploration.link}">${exploration.text}</a>`;
                                                            return `<li>${exploration.italic ? `<i>${linkElement}</i>` : linkElement}</li>`;
                                                        }
                                                        return `<li${exploration.italic ? ' style="font-style: italic;"' : ''}>${exploration.text}</li>`;
                                                    }
                                                    return `<li>${exploration}</li>`;
                                                }).join('')}
                                            </ul>
                                            <br>
                                            
                                            <strong>Things I have worked on:</strong>
                                            <ul>
                                                ${config.past_work.map(work => `<li>${work}</li>`).join('')}
                                            </ul>
                                            <br>
                                            
                                            <strong>Current Explorations:</strong>
                                            <ul>
                                                ${config.current_explorations.map(exploration => {
                                                    if (typeof exploration === 'object') {
                                                        if (exploration.link) {
                                                            const linkElement = `<a target="_blank" href="${exploration.link}">${exploration.text}</a>`;
                                                            return `<li>${exploration.italic ? `<i>${linkElement}</i>` : linkElement}</li>`;
                                                        }
                                                        return `<li${exploration.italic ? ' style="font-style: italic;"' : ''}>${exploration.text}</li>`;
                                                    }
                                                    return `<li>${exploration}</li>`;
                                                }).join('')}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="colorlib-about" data-section="projects">
                    <div class="colorlib-narrow-content">
                        <div class="row">
                            <div class="col-md-12 animate-box" data-animate-effect="fadeInLeft">
                                <span class="heading-meta"><span style="color:#CC7C5E;">Projects</span> I Am Proud Of</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-7">
                                <div class="row animate-box" data-animate-effect="fadeInLeft">
                                    <div class="col-md-12">
                                        <div class="about-desc">
                                            <ul style="column-count:1; margin-top: 15px;">
                                                ${config.proud_projects.map(project => {
                                                    if (typeof project === 'object' && project.link) {
                                                        return `<li><a target="_blank" href="${project.link}">${project.text}</a></li>`;
                                                    }
                                                    return `<li>${project}</li>`;
                                                }).join('')}
                                            </ul>
                                            <br>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-5">
                                <div class="project-carousel animate-box" data-animate-effect="fadeInRight">
                                    <div class="carousel-container">
                                        <div class="carousel-slides" id="projectCarousel">
                                            </div>
                                        <div class="carousel-nav">
                                            <button class="carousel-btn prev" id="prevBtn">‹</button>
                                            <button class="carousel-btn next" id="nextBtn">›</button>
                                        </div>
                                        <div class="carousel-dots" id="carouselDots"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="colorlib-education" data-section="resume">
                    <div class="colorlib-narrow-content">
                        <div class="row">
                            <div class="col-md-10 col-md-offset-3 col-md-pull-3 animate-box" data-animate-effect="fadeInLeft">
                                <span class="heading-meta">Resume - <a href="${config.personal.resume_pdf}" target="_blank" class="hover-glow">.PDF</a></span>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-12 animate-box" data-animate-effect="fadeInLeft">
                                <div class="fancy-collapse-panel">
                                    <strong>Experience:</strong><br><br>
                                    <div class="panel-group" id="experienceAccordion" role="tablist" aria-multiselectable="true">
                                        ${generateExperienceHTML(config.experience)}
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-12 animate-box" data-animate-effect="fadeInLeft">
                                <div class="fancy-collapse-panel">
                                    <strong>Education:</strong><br><br>
                                    <div class="panel-group" id="educationAccordion" role="tablist" aria-multiselectable="true">
                                        ${generateEducationHTML(config.education)}
                                    </div>
                                    <br><br><br><br><br><br>
                                    <p>Not a front-end person - used <a href="${config.footer.template_credit.link}" target="_blank" class="hover-glow">this</a> template</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>

    
    <script>
    // --- BEGIN REPLACEMENT ---

    // Pass carousel data from YAML config to the browser
    const projectCarouselData = ${JSON.stringify(config.project_carousel || [])};

    // Full height sidebar logic
    function setFullHeight() {
        const elements = document.querySelectorAll('.js-fullheight');
        const windowHeight = window.innerHeight;
        elements.forEach(el => {
            el.style.height = windowHeight + 'px';
        });
    }

    // Create subtle floating elements
    function createFloatingElements() {
        const container = document.getElementById('floatingElements');
        const symbols = ['⚡', '🔋', '📸', '🌱', '💡', '⚙️'];
        
        for (let i = 0; i < 6; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
            element.style.left = Math.random() * 100 + '%';
            element.style.top = Math.random() * 100 + '%';
            element.style.fontSize = (Math.random() * 15 + 25) + 'px';
            element.style.animationDelay = Math.random() * 8 + 's';
            container.appendChild(element);
        }
    }

    // Subtle parallax effect
    document.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const bg = document.getElementById('parallaxBg');
        if (bg) {
            bg.style.transform = \`translateY(\${scrolled * 0.3}px)\`;
        }
    });

    // Initialize everything on page load
    document.addEventListener('DOMContentLoaded', () => {
        // Run setup functions
        createFloatingElements();
        setFullHeight();
        window.addEventListener('resize', setFullHeight); // Re-run on resize

        // Hide loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1000);
        
        // --- CAROUSEL LOGIC ---
        const slidesContainer = document.getElementById('projectCarousel');
        const dotsContainer = document.getElementById('carouselDots');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (slidesContainer && projectCarouselData && projectCarouselData.length > 0) {
            let currentIndex = 0;

            // 1. Populate slides and dots from the config data
            projectCarouselData.forEach((item, index) => {
                const slide = document.createElement('div');
                slide.className = 'carousel-slide';
                slide.style.backgroundImage = \`url('\${item.image_url}')\`;
                
                const overlay = document.createElement('div');
                overlay.className = 'carousel-slide-overlay';
                overlay.textContent = item.caption;
                
                slide.appendChild(overlay);
                slidesContainer.appendChild(slide);

                const dot = document.createElement('div');
                dot.className = 'carousel-dot';
                dot.addEventListener('click', () => showSlide(index));
                dotsContainer.appendChild(dot);
            });

            const slides = document.querySelectorAll('.carousel-slide');
            const dots = document.querySelectorAll('.carousel-dot');

            // 2. Function to show a specific slide
            function showSlide(index) {
                // Bounds checking
                if (index >= slides.length) index = 0;
                if (index < 0) index = slides.length - 1;

                slides.forEach(slide => slide.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));

                slides[index].classList.add('active');
                dots[index].classList.add('active');
                currentIndex = index;
            }

            // 3. Event Listeners for buttons
            prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
            nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));

            // 4. Show the first slide initially
            showSlide(0);
        }
    });

    // --- END REPLACEMENT ---
    </script>

    <script defer src="js/jquery.min.js"></script>
    <script defer src="js/bootstrap.min.js"></script>
</body>
</html>`;

    // Write the generated HTML to file
    fs.writeFileSync('./index.html', htmlContent);
    console.log('✅ Generated index.html from portfolio-config.yaml');
    console.log('🚀 Your portfolio is now ready with improved performance and fun animations!');
}

// Package.json for dependencies
const packageJson = {
    "name": "portfolio-generator",
    "version": "1.0.0",
    "description": "Generate portfolio HTML from YAML config",
    "main": "build.js",
    "scripts": {
        "build": "node build.js",
        "watch": "nodemon build.js"
    },
    "dependencies": {
        "js-yaml": "^4.1.0"
    },
    "devDependencies": {
        "nodemon": "^3.0.1"
    }
};

// Run the build
if (require.main === module) {
    console.log('Building HTML file...');
    buildHTML();
    console.log('Build complete! Check your index.html file.');
}