// SHBI Documentation Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize syntax highlighting
    hljs.highlightAll();
    
    // Setup theme toggling
    setupThemeToggle();
    
    // Setup navigation
    setupNavigation();
    
    // Setup back to top button
    setupBackToTop();
    
    // Setup mobile TOC toggle
    setupMobileTOC();
    
    // Setup copy to clipboard for code blocks
    setupCodeCopy();
    
    // Setup reading progress bar
    setupReadingProgress();
    
    // Setup accordions
    setupAccordions();
    
    // Setup tabbed content
    setupTabs();
    
    // Setup interactive diagrams and visualizations
    setupInteractiveDiagrams();
});

// Theme toggle functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || 
                         (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Apply the theme
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }
    
    // Toggle theme when switch is clicked
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
        
        // Re-highlight code blocks after theme change
        setTimeout(() => {
            hljs.highlightAll();
        }, 100);
    });
}

// Navigation functionality
function setupNavigation() {
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('section');
    
    // Add click event to TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // On mobile, close the TOC after clicking a link
            if (window.innerWidth <= 1024) {
                document.getElementById('toc').classList.remove('show');
            }
        });
    });
    
    // Highlight active TOC item based on scroll position
    window.addEventListener('scroll', function() {
        // Determine which section is in view
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        // Update active class on TOC links
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Trigger scroll event to highlight initial section
    window.dispatchEvent(new Event('scroll'));
}

// Back to top button functionality
function setupBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Mobile TOC toggle
function setupMobileTOC() {
    const toggleButton = document.getElementById('toggle-toc');
    const toc = document.getElementById('toc');
    
    if (!toggleButton || !toc) return;
    
    toggleButton.addEventListener('click', function() {
        toc.classList.toggle('show');
    });
    
    // Close TOC when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024 && 
            !e.target.closest('.sidebar') && 
            toc.classList.contains('show')) {
            toc.classList.remove('show');
        }
    });
}

// Copy code blocks to clipboard
function setupCodeCopy() {
    const copyButtons = document.querySelectorAll('.copy-code');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the code element
            const codeContainer = this.closest('.code-container');
            if (!codeContainer) return;
            
            const codeElement = codeContainer.querySelector('code');
            if (!codeElement) return;
            
            // Copy code to clipboard
            navigator.clipboard.writeText(codeElement.textContent)
                .then(() => {
                    // Show success feedback
                    button.innerHTML = '<i class="fas fa-check"></i>';
                    button.classList.add('copied');
                    
                    // Reset after 2 seconds
                    setTimeout(() => {
                        button.innerHTML = '<i class="fas fa-copy"></i>';
                        button.classList.remove('copied');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    // Show error feedback
                    button.innerHTML = '<i class="fas fa-times"></i>';
                    setTimeout(() => {
                        button.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                });
        });
    });
}

// Reading progress bar
function setupReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// Setup accordions
function setupAccordions() {
    // Regular accordions
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (!header) return;
        
        header.addEventListener('click', () => {
            // Close other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Debugging accordions
    const debugItems = document.querySelectorAll('.debug-item');
    
    debugItems.forEach(item => {
        const header = item.querySelector('.debug-header');
        if (!header) return;
        
        header.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
}

// Setup tabbed content
function setupTabs() {
    const tabbedContents = document.querySelectorAll('.tabbed-content');
    
    tabbedContents.forEach(container => {
        const tabButtons = container.querySelectorAll('.tab-button');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                const panes = container.querySelectorAll('.tab-pane');
                panes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to current button
                button.classList.add('active');
                
                // Show corresponding pane
                const targetId = button.getAttribute('data-tab');
                const targetPane = container.querySelector(`#${targetId}`);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    });
}

// Setup all interactive diagrams and visualizations
function setupInteractiveDiagrams() {
    // Setup message bus animation
    setupMessageBusAnimation();
    
    // Setup scope item interactions
    setupScopeItems();
    
    // Setup propagation visualization
    setupPropagationVisualization();
    
    // Setup request-response visualization
    setupRequestResponseVisualization();
    
    // Setup scopes hierarchy visualization
    setupScopeHierarchy();
}

// Message bus animation
function setupMessageBusAnimation() {
    const publishButton = document.getElementById('trigger-publish');
    if (!publishButton) return;
    
    publishButton.addEventListener('click', function() {
        runMessageBusAnimation();
    });
    
    // Also run it once on page load
    setTimeout(runMessageBusAnimation, 1000);
}

function runMessageBusAnimation() {
    const message = document.getElementById('message-animation');
    if (!message) return;
    
    // Reset message state
    message.style.opacity = '0';
    message.style.transform = 'translateY(0)';
    
    // Show message in publisher
    setTimeout(() => {
        message.style.opacity = '1';
    }, 300);
    
    // Move message towards bus
    setTimeout(() => {
        message.style.transform = 'translateY(80px)';
        message.style.transition = 'transform 0.6s ease-out, opacity 0.3s';
    }, 1000);
    
    // Hide message when it reaches bus
    setTimeout(() => {
        message.style.opacity = '0';
        
        // Pulse the bus
        const bus = document.getElementById('bus-animation');
        if (bus) {
            bus.style.transform = 'scale(1.05)';
            bus.style.transition = 'transform 0.3s';
            
            setTimeout(() => {
                bus.style.transform = 'scale(1)';
            }, 300);
        }
    }, 1600);
    
    // Create messages for subscribers
    setTimeout(() => {
        const subscribers = document.querySelectorAll('.subscribers-container .component');
        
        subscribers.forEach((subscriber, index) => {
            // Create message element for this subscriber
            const subMessage = document.createElement('div');
            subMessage.className = 'message';
            subMessage.textContent = 'Coin Collected';
            subMessage.style.opacity = '0';
            
            // Add message to subscriber
            subscriber.appendChild(subMessage);
            
            // Show message with delay based on index
            setTimeout(() => {
                subMessage.style.opacity = '1';
            }, index * 200);
            
            // Remove message after display
            setTimeout(() => {
                subMessage.style.opacity = '0';
                setTimeout(() => {
                    subMessage.remove();
                }, 300);
            }, 1000 + index * 200);
        });
    }, 1900);
}

// Scope items interaction
function setupScopeItems() {
    const scopeItems = document.querySelectorAll('.scope-item');
    
    scopeItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            scopeItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Additional animations or info display could be added here
        });
    });
}

// Propagation visualization
function setupPropagationVisualization() {
    // Direct node references
    const gameplayNode = document.getElementById('gameplay-node');
    const coreNode = document.getElementById('core-node');
    const globalNode = document.getElementById('global-node');
    const aiNode = document.getElementById('ai-node');
    const uiNode = document.getElementById('ui-node');
    const networkingNode = document.getElementById('networking-node');
    
    // Button references
    const localBtn = document.getElementById('local-btn');
    const upBtn = document.getElementById('up-btn');
    const downBtn = document.getElementById('down-btn');
    const updownBtn = document.getElementById('updown-btn');
    
    // Check if elements exist
    if (!gameplayNode || !localBtn) {
        console.log("Propagation elements not found");
        return;
    }
    
    // Function to reset all nodes
    function resetNodes() {
        // Clear all receiving classes
        const allNodes = document.querySelectorAll('.node-content');
        allNodes.forEach(node => {
            node.classList.remove('receiving');
        });
        
        // Remove any existing messages
        const messages = document.querySelectorAll('.prop-message');
        messages.forEach(msg => msg.remove());
    }
    
    // Function to add message to gameplay node
    function addMessage() {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = 'prop-message';
        messageEl.innerHTML = '<i class="fas fa-envelope"></i>';
        gameplayNode.appendChild(messageEl);
    }
    
    // Local propagation
    localBtn.addEventListener('click', () => {
        resetNodes();
        
        // Reset button states
        document.querySelectorAll('.prop-button').forEach(btn => btn.classList.remove('active'));
        localBtn.classList.add('active');
        
        // Add message
        addMessage();
        
        // Mark gameplay node as receiving
        gameplayNode.classList.add('receiving');
    });
    
    // Up propagation
    upBtn.addEventListener('click', () => {
        resetNodes();
        
        // Reset button states
        document.querySelectorAll('.prop-button').forEach(btn => btn.classList.remove('active'));
        upBtn.classList.add('active');
        
        // Add message
        addMessage();
        
        // Mark gameplay and parent nodes as receiving
        gameplayNode.classList.add('receiving');
        coreNode.classList.add('receiving');
        globalNode.classList.add('receiving');
    });
    
    // Down propagation
    downBtn.addEventListener('click', () => {
        resetNodes();
        
        // Reset button states
        document.querySelectorAll('.prop-button').forEach(btn => btn.classList.remove('active'));
        downBtn.classList.add('active');
        
        // Add message
        addMessage();
        
        // Mark gameplay node as receiving
        // (In this case, gameplay has no children in our example)
        gameplayNode.classList.add('receiving');
    });
    
    // Up and down propagation
    updownBtn.addEventListener('click', () => {
        resetNodes();
        
        // Reset button states
        document.querySelectorAll('.prop-button').forEach(btn => btn.classList.remove('active'));
        updownBtn.classList.add('active');
        
        // Add message
        addMessage();
        
        // Mark all nodes as receiving
        const allNodes = document.querySelectorAll('.node-content');
        allNodes.forEach(node => {
            node.classList.add('receiving');
        });
    });
    
    // Trigger local propagation by default
    setTimeout(() => {
        localBtn.click();
    }, 500);
}

// Request-response visualization
function setupRequestResponseVisualization() {
    const sendRequestBtn = document.getElementById('send-request');
    const sendResponseBtn = document.getElementById('send-response');
    
    if (!sendRequestBtn || !sendResponseBtn) return;
    
    // Hide response button initially
    sendResponseBtn.style.display = 'none';
    
    // Setup send request button
    sendRequestBtn.addEventListener('click', function() {
        // Get message elements
        const requestMessage = document.querySelector('.request-message');
        const responseMessage = document.querySelector('.response-message');
        const processingIndicator = document.querySelector('.rr-processing');
        
        if (!requestMessage || !responseMessage || !processingIndicator) return;
        
        // Reset state
        responseMessage.style.opacity = '0';
        responseMessage.style.transform = 'translateX(0)';
        
        // Disable request button during animation
        sendRequestBtn.disabled = true;
        
        // Show request message
        requestMessage.style.opacity = '1';
        
        // Move request message to responder
        setTimeout(() => {
            requestMessage.style.transform = 'translateX(100%)';
        }, 500);
        
        // Show processing indicator
        setTimeout(() => {
            processingIndicator.style.display = 'block';
            sendResponseBtn.style.display = 'block';
        }, 1500);
    });
    
    // Setup send response button
    sendResponseBtn.addEventListener('click', function() {
        // Get elements
        const responseMessage = document.querySelector('.response-message');
        const processingIndicator = document.querySelector('.rr-processing');
        
        if (!responseMessage || !processingIndicator) return;
        
        // Hide processing and response button
        processingIndicator.style.display = 'none';
        sendResponseBtn.style.display = 'none';
        
        // Show response message
        responseMessage.style.opacity = '1';
        
        // Move response message to requester
        setTimeout(() => {
            responseMessage.style.transform = 'translateX(-100%)';
        }, 500);
        
        // Reset everything after animation
        setTimeout(() => {
            // Reset messages
            document.querySelector('.request-message').style.opacity = '0';
            document.querySelector('.request-message').style.transform = 'translateX(0)';
            responseMessage.style.opacity = '0';
            responseMessage.style.transform = 'translateX(0)';
            
            // Re-enable request button
            sendRequestBtn.disabled = false;
        }, 2000);
    });
}

// Setup scope hierarchy
function setupScopeHierarchy() {
    const nodes = document.querySelectorAll('.scope-hierarchy-viz .node-content');
    
    nodes.forEach(node => {
        node.addEventListener('click', function() {
            // Toggle active class
            this.classList.toggle('active');
            
            // Additional visualization could be added here
        });
    });
}