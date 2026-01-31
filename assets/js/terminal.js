/**
 * Full-Screen Linux Terminal Portfolio
 * Author: Arman Keyoumarsi
 */

(function() {
  'use strict';

  // ASCII Art Logo - ARMAN KEYOUMARSI (subtle green gradient)
  const ASCII_LINES = [
    '    _    ____  __  __    _    _   _ ',
    '   / \\  |  _ \\|  \\/  |  / \\  | \\ | |',
    '  / _ \\ | |_) | |\\/| | / _ \\ |  \\| |',
    ' / ___ \\|  _ <| |  | |/ ___ \\| |\\  |',
    '/_/   \\_\\_| \\_\\_|  |_/_/   \\_\\_| \\_|',
    ' _  _________   _____  _   _ __  __    _    ____  ____ ___ ',
    '| |/ / ____\\ \\ / / _ \\| | | |  \\/  |  / \\  |  _ \\/ ___|_ _|',
    '| \' /|  _|  \\ V / | | | | | | |\\/| | / _ \\ | |_) \\___ \\| | ',
    '| . \\| |___  | || |_| | |_| | |  | |/ ___ \\|  _ < ___) | | ',
    '|_|\\_\\_____| |_| \\___/ \\___/|_|  |_/_/   \\_\\_| \\_\\____/___|'
  ];

  function getColorfulLogo() {
    const colors = [
      'ascii-line-1', 'ascii-line-2', 'ascii-line-3', 'ascii-line-4', 'ascii-line-5',
      'ascii-line-6', 'ascii-line-7', 'ascii-line-8', 'ascii-line-9', 'ascii-line-10'
    ];
    return ASCII_LINES.map((line, i) =>
      `<span class="${colors[i]}">${line}</span>`
    ).join('\n');
  }

  // Terminal State
  const state = {
    history: [],
    historyIndex: -1
  };

  // DOM Elements
  let terminalOutput, terminalInput, terminalBody, cursor;

  // Site Data
  const data = window.terminalData || { links: {} };

  // Quick link mappings
  const quickLinks = {
    '1': 'about',
    '2': 'resume',
    '3': 'linkedin',
    '4': 'github',
    '5': 'contact',
    '6': 'photos',
    '7': 'strava'
  };

  // Initialize Terminal
  function init() {
    terminalOutput = document.getElementById('terminal-output');
    terminalInput = document.getElementById('terminal-input');
    terminalBody = document.getElementById('terminal-body');
    cursor = document.getElementById('cursor');

    if (!terminalInput || !terminalOutput) return;

    // Event Listeners
    terminalInput.addEventListener('keydown', handleKeyDown);
    terminalInput.addEventListener('input', handleInput);
    terminalBody.addEventListener('click', focusInput);

    // Load history
    loadHistory();

    // Show welcome screen
    showWelcome();

    // Initialize input width
    handleInput();

    // Focus input
    setTimeout(focusInput, 100);
  }

  // Focus the input field
  function focusInput() {
    terminalInput.focus();
  }

  // Handle input changes - auto-resize input and toggle cursor
  function handleInput() {
    // Auto-resize input to fit content
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'pre';
    tempSpan.style.font = window.getComputedStyle(terminalInput).font;
    tempSpan.textContent = terminalInput.value || '';
    document.body.appendChild(tempSpan);
    terminalInput.style.width = Math.max(1, tempSpan.offsetWidth + 2) + 'px';
    document.body.removeChild(tempSpan);

    // Show/hide cursor
    cursor.style.display = terminalInput.value ? 'none' : 'inline-block';
  }

  // Handle keyboard events
  function handleKeyDown(e) {
    switch(e.key) {
      case 'Enter':
        e.preventDefault();
        const cmd = terminalInput.value.trim();
        if (cmd) {
          executeCommand(cmd);
        } else {
          // Empty enter creates new prompt line
          printCommand('');
          scrollToBottom();
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        navigateHistory(-1);
        break;

      case 'ArrowDown':
        e.preventDefault();
        navigateHistory(1);
        break;

      case 'Tab':
        e.preventDefault();
        autocomplete();
        break;

      case 'c':
        // 'c' shortcut for clear (clean terminal only)
        if (!terminalInput.value) {
          e.preventDefault();
          clearTerminal();
        }
        break;

      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          clearTerminal();
          showWelcome();
        }
        break;
    }
  }

  // Navigate command history
  function navigateHistory(direction) {
    if (state.history.length === 0) return;

    state.historyIndex += direction;

    if (state.historyIndex < 0) {
      state.historyIndex = 0;
    } else if (state.historyIndex >= state.history.length) {
      state.historyIndex = state.history.length;
      terminalInput.value = '';
      handleInput();
      return;
    }

    terminalInput.value = state.history[state.historyIndex];
    handleInput();
  }

  // Autocomplete commands
  function autocomplete() {
    const input = terminalInput.value.toLowerCase();
    if (!input) return;

    const commands = ['help', 'about', 'resume', 'linkedin', 'github',
                      'contact', 'photos', 'strava', 'skills', 'clear',
                      'whoami', 'email'];

    const match = commands.find(cmd => cmd.startsWith(input));
    if (match) {
      terminalInput.value = match;
      handleInput();
    }
  }

  // Execute a command
  function executeCommand(cmd) {
    // Add to history
    if (cmd !== state.history[state.history.length - 1]) {
      state.history.push(cmd);
    }
    state.historyIndex = state.history.length;
    saveHistory();

    // Show command in output
    printCommand(cmd);

    // Clear input
    terminalInput.value = '';
    cursor.style.display = 'inline-block';

    // Check for quick link numbers
    if (quickLinks[cmd]) {
      cmd = quickLinks[cmd];
    }

    // Parse and execute
    const command = cmd.toLowerCase().trim();
    const response = processCommand(command);

    if (response) {
      printOutput(response);
    }

    scrollToBottom();
  }

  // Process command and return response
  function processCommand(command) {
    const commands = {
      help: cmdHelp,
      about: cmdAbout,
      resume: cmdResume,
      cv: cmdResume,
      linkedin: cmdLinkedIn,
      github: cmdGitHub,
      contact: cmdContact,
      photos: cmdPhotos,
      strava: cmdStrava,
      skills: cmdSkills,
      clear: cmdClear,
      whoami: cmdWhoami,
      email: cmdEmail,
      // Easter eggs
      sudo: () => "Nice try! No root access here.",
      rm: () => "I'm not falling for that one!",
      exit: () => "There's no escape! Try 'about' instead.",
      hello: () => "Hello! Type 'help' for commands.",
      hi: () => "Hi there! Type 'help' to explore.",
      ls: () => "about/  resume.pdf  linkedin/  github/  photos/  strava/  contact/",
      pwd: () => "/home/arman/portfolio",
      cat: () => "Usage: Try 'about', 'skills', or 'contact' to view content.",
      neofetch: cmdNeofetch,
      matrix: () => "Wake up, Neo... The Matrix has you... (try 'help' instead)",
      coffee: () => "Here's your coffee: [_]D"
    };

    if (commands[command]) {
      return commands[command]();
    }

    return `<span class="error">Command not found: ${escapeHtml(command)}</span>\nType 'help' for available commands.`;
  }

  // Command implementations
  function cmdHelp() {
    return `
<div class="info-box">
<span class="info-title">Available Commands</span>

<div class="help-grid">
  <span class="cmd">about</span><span class="desc">Learn about me</span>
  <span class="cmd">resume</span><span class="desc">Download my CV</span>
  <span class="cmd">skills</span><span class="desc">View technical skills</span>
  <span class="cmd">linkedin</span><span class="desc">LinkedIn profile</span>
  <span class="cmd">github</span><span class="desc">GitHub profile</span>
  <span class="cmd">photos</span><span class="desc">Photo album</span>
  <span class="cmd">strava</span><span class="desc">Strava profile</span>
  <span class="cmd">contact</span><span class="desc">Contact information</span>
  <span class="cmd">email</span><span class="desc">Send me an email</span>
  <span class="cmd">clear</span><span class="desc">Clear terminal</span>
  <span class="cmd">help</span><span class="desc">Show this help</span>
</div>

<span class="dim">Tip: Use numbers 1-7 as shortcuts, Tab for autocomplete, Up/Down for history</span>
</div>`;
  }

  // About bio paragraphs for typewriter effect
  const aboutParagraphs = [
    { text: "Arman Keyoumarsi is an Enterprise Architect and AI Consultant with over twenty years of experience transforming technology organizations across three continents.", highlight: "Arman Keyoumarsi" },
    { text: "He holds a Master's degree in Telecommunication Engineering and multiple industry certifications, including TOGAF." },
    { text: "Throughout his career, Arman has championed automation as the foundation of operational excellence. He's modernized legacy systems, delivered global applications, and eliminated inefficiencies that held organizations back. The result? Millions saved annually, faster time-to-market, and technology investments that actually align with business goals." },
    { text: "Leading multinational projects across diverse teams and cultures, he's built a reputation for turning complexity into clarity—and ideas into real business value. Colleagues know him for his persistence, his teamwork, and his ability to bridge the gap between what's technically possible and what the business actually needs." },
    { text: "Today, Arman helps companies scale smarter and build for the future. His philosophy is simple: design for clarity, build for scale, and deliver measurable impact—without unnecessary complexity." },
    { text: "\"Every element is a crack waiting for scale to find it. Wisdom builds foundations that hold; impatience stacks floors that fall.\"", isQuote: true },
    { text: "Outside of work, he's part runner, part outdoor enthusiast, and always a technology geek. You'll find him chasing trails, going off-grid to reconnect with nature, or diving deep into the latest tech breakthroughs. Curious by default. Happiest when solving real problems—whether that's optimizing a system or finding the best route up a mountain." }
  ];

  // Narrator state
  let narratorState = {
    isTyping: false,
    isPaused: false,
    isSpeaking: false,
    currentParagraph: 0,
    currentChar: 0,
    typingSpeed: 20,
    audio: null
  };

  function cmdAbout() {
    // Create about section with paper document
    const aboutHtml = `
<div class="about-section" id="about-section">
<div class="about-header">
<span>Loading document...</span>
<div class="narrator-controls">
<button id="narrator-toggle" onclick="toggleNarrator()">▶ Start Narration</button>
<button id="narrator-skip" onclick="skipNarration()">⏭ Skip</button>
</div>
</div>
<div class="paper-document" id="paper-document">
<div class="paper-title">About Arman Keyoumarsi</div>
<div class="bio-content" id="bio-content"></div>
</div>
</div>`;

    // Reset narrator state
    narratorState = {
      isTyping: false,
      isPaused: false,
      isSpeaking: false,
      currentParagraph: 0,
      currentChar: 0,
      typingSpeed: 20,
      audio: new Audio(data.baseUrl + '/assets/download/About_Me.mp3')
    };

    // Setup audio end handler
    narratorState.audio.onended = function() {
      narratorState.isSpeaking = false;
      updateNarratorButton();
    };

    // Start typewriter after a brief delay
    setTimeout(() => {
      startTypewriter();
    }, 100);

    return aboutHtml;
  }

  function startTypewriter() {
    narratorState.isTyping = true;
    narratorState.isPaused = false;
    typeNextCharacter();
  }

  function typeNextCharacter() {
    if (!narratorState.isTyping || narratorState.isPaused) return;

    const bioContent = document.getElementById('bio-content');
    if (!bioContent) return;

    const para = aboutParagraphs[narratorState.currentParagraph];
    if (!para) {
      // Done typing
      narratorState.isTyping = false;
      updateNarratorButton();
      return;
    }

    // Create paragraph element if needed
    let paraEl = document.getElementById(`bio-para-${narratorState.currentParagraph}`);
    if (!paraEl) {
      paraEl = document.createElement(para.isQuote ? 'div' : 'p');
      paraEl.id = `bio-para-${narratorState.currentParagraph}`;
      if (para.isQuote) {
        paraEl.className = 'paper-quote';
      }
      bioContent.appendChild(paraEl);
    }

    if (narratorState.currentChar < para.text.length) {
      // Type next character
      let displayText = para.text.substring(0, narratorState.currentChar + 1);

      // Highlight name if needed
      if (para.highlight) {
        displayText = displayText.replace(para.highlight, `<strong>${para.highlight}</strong>`);
      }

      paraEl.innerHTML = displayText + '<span class="typing-cursor">&nbsp;</span>';
      narratorState.currentChar++;

      scrollToBottom();
      setTimeout(typeNextCharacter, narratorState.typingSpeed);
    } else {
      // Finished this paragraph, move to next
      paraEl.innerHTML = para.highlight
        ? para.text.replace(para.highlight, `<strong>${para.highlight}</strong>`)
        : para.text;

      narratorState.currentParagraph++;
      narratorState.currentChar = 0;

      // Check if done, add download link
      if (narratorState.currentParagraph >= aboutParagraphs.length) {
        addPaperFooter();
      }

      // Brief pause between paragraphs
      setTimeout(typeNextCharacter, 300);
    }
  }

  function toggleNarrator() {
    const btn = document.getElementById('narrator-toggle');
    if (!btn || !narratorState.audio) return;

    if (!narratorState.isSpeaking) {
      // Start/resume narration
      narratorState.isSpeaking = true;
      narratorState.audio.play();
      btn.textContent = '⏸ Pause';
      btn.classList.add('active');
    } else {
      // Pause narration
      narratorState.isSpeaking = false;
      narratorState.audio.pause();
      btn.textContent = '▶ Resume';
      btn.classList.remove('active');
    }
  }

  function skipNarration() {
    // Stop audio
    if (narratorState.audio) {
      narratorState.audio.pause();
      narratorState.audio.currentTime = 0;
    }
    narratorState.isSpeaking = false;
    narratorState.isTyping = false;

    // Show all content immediately
    const bioContent = document.getElementById('bio-content');
    if (bioContent) {
      bioContent.innerHTML = aboutParagraphs.map((para, i) => {
        let text = para.text;
        if (para.highlight) {
          text = text.replace(para.highlight, `<strong>${para.highlight}</strong>`);
        }
        return para.isQuote
          ? `<div class="paper-quote">${text}</div>`
          : `<p>${text}</p>`;
      }).join('');
    }

    addPaperFooter();
    updateNarratorButton();
    scrollToBottom();
  }

  function addPaperFooter() {
    const paperDoc = document.getElementById('paper-document');
    if (!paperDoc || document.getElementById('paper-footer')) return;

    const footer = document.createElement('div');
    footer.id = 'paper-footer';
    footer.className = 'paper-footer';
    footer.innerHTML = `<a href="${data.links.resume}" target="_blank" class="download-link">⬇ DOWNLOAD CV (PDF)</a>`;
    paperDoc.appendChild(footer);
  }

  function updateNarratorButton() {
    const btn = document.getElementById('narrator-toggle');
    if (btn) {
      btn.textContent = '▶ Start Narration';
      btn.classList.remove('active');
    }
  }

  // Make functions globally accessible
  window.toggleNarrator = toggleNarrator;
  window.skipNarration = skipNarration;

  function cmdResume() {
    window.open(data.links.resume, '_blank');
    return `<span class="success">Downloading resume...</span>\n<a href="${data.links.resume}" target="_blank">Click here if download didn't start</a>`;
  }

  function cmdLinkedIn() {
    window.open(data.links.linkedin, '_blank');
    return `<span class="success">Opening LinkedIn...</span>\n<a href="${data.links.linkedin}" target="_blank">${data.links.linkedin}</a>`;
  }

  function cmdGitHub() {
    window.open(data.links.github, '_blank');
    return `<span class="success">Opening GitHub...</span>\n<a href="${data.links.github}" target="_blank">${data.links.github}</a>`;
  }

  function cmdPhotos() {
    window.open(data.links.photos, '_blank');
    return `<span class="success">Opening photo album...</span>\n<a href="${data.links.photos}" target="_blank">photos.app.goo.gl</a>`;
  }

  function cmdStrava() {
    window.open(data.links.strava, '_blank');
    return `<span class="success">Opening Strava...</span>\n<a href="${data.links.strava}" target="_blank">${data.links.strava}</a>`;
  }

  function cmdContact() {
    return `
<div class="info-box">
<span class="info-title">Contact Information</span>

<div class="contact-grid">
  <span class="label">Email</span><a href="mailto:${data.links.email}">${data.links.email}</a>
  <span class="label">LinkedIn</span><a href="${data.links.linkedin}" target="_blank">arman-keyoumarsi</a>
  <span class="label">GitHub</span><a href="${data.links.github}" target="_blank">arman-keyoumarsi</a>
  <span class="label">Twitter</span><a href="${data.links.twitter}" target="_blank">@Akeyoumarsi</a>
  <span class="label">Instagram</span><a href="${data.links.instagram}" target="_blank">@armankeyoumarsi</a>
</div>

Type 'email' to send me a message directly.
</div>`;
  }

  function cmdEmail() {
    const subject = encodeURIComponent('Hello from your portfolio terminal');
    window.location.href = `mailto:${data.links.email}?subject=${subject}`;
    return `<span class="success">Opening email client...</span>`;
  }

  function cmdSkills() {
    return `
<div class="info-box">
<span class="info-title">Technical Skills</span>

<div class="skills-section">
  <div class="skill-category">Certifications</div>
  <div class="skill-list">MCSE, CCNA, VCP</div>

  <div class="skill-category">Cloud Platforms</div>
  <div class="skill-list">AWS, Microsoft Azure, Google Cloud Platform</div>

  <div class="skill-category">Virtualization</div>
  <div class="skill-list">VMware vSphere, Microsoft Hyper-V, KVM</div>

  <div class="skill-category">Networking</div>
  <div class="skill-list">Cisco, Juniper, Palo Alto, F5</div>

  <div class="skill-category">Automation & IaC</div>
  <div class="skill-list">Ansible, Terraform, PowerShell, Python</div>

  <div class="skill-category">Containers</div>
  <div class="skill-list">Docker, Kubernetes, OpenShift</div>
</div>
</div>`;
  }

  function cmdWhoami() {
    return `Arman Keyoumarsi - IT Infrastructure Architect\nType 'about' for more or 'help' for commands.`;
  }

  function cmdNeofetch() {
    return `
<pre class="ascii-art">${getColorfulLogo()}</pre>
<span class="highlight">arman@keyoumarsi</span>
------------------
<span class="dim">OS:</span> Portfolio Linux
<span class="dim">Host:</span> arman.keyoumarsi.com
<span class="dim">Kernel:</span> Jekyll 4.x
<span class="dim">Shell:</span> terminal.js
<span class="dim">Role:</span> IT Infrastructure Architect
<span class="dim">Certs:</span> MCSE, CCNA, VCP`;
  }

  function cmdClear() {
    clearTerminal();
    showWelcome();
    return null;
  }

  // Utility functions
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function printCommand(cmd) {
    const line = document.createElement('div');
    line.className = 'command-echo';
    line.innerHTML = `<span class="prompt">arman@keyoumarsi:~$ </span>${escapeHtml(cmd)}`;
    terminalOutput.appendChild(line);
  }

  function printOutput(html) {
    if (!html) return;
    const line = document.createElement('div');
    line.className = 'output-line';
    line.innerHTML = html;
    terminalOutput.appendChild(line);
  }

  function clearTerminal() {
    terminalOutput.innerHTML = '';
  }

  function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function showWelcome() {
    const welcome = `<pre class="ascii-art">${getColorfulLogo()}</pre><div class="welcome-box"><div class="welcome-title">Welcome to Arman Keyoumarsi's Hub</div>
<div class="welcome-bio">Enterprise Architect with 20+ years designing and managing systems for top-tier organizations. Skilled in hybrid cloud design, architecture, and project management. Certified in TOGAF, AI, DevOps, and cloud architecture (Azure, AWS, GCP). Passionate about delivering innovative, client-focused solutions. When I'm not building IT systems, I'm exploring trails, enjoying the outdoors, and always up for a good conversation over some craft beer.</div>
<div class="quick-links"><div class="links-title">Quick Links:</div><div class="links-grid"><div class="link-item"><span class="link-num">[1]</span> <a href="#" onclick="runCmd('about');return false;">About</a></div><div class="link-item"><span class="link-num">[2]</span> <a href="#" onclick="runCmd('resume');return false;">Resume</a></div><div class="link-item"><span class="link-num">[3]</span> <a href="#" onclick="runCmd('linkedin');return false;">LinkedIn</a></div><div class="link-item"><span class="link-num">[4]</span> <a href="#" onclick="runCmd('github');return false;">GitHub</a></div><div class="link-item"><span class="link-num">[5]</span> <a href="#" onclick="runCmd('contact');return false;">Contact</a></div><div class="link-item"><span class="link-num">[6]</span> <a href="#" onclick="runCmd('photos');return false;">Photos</a></div><div class="link-item"><span class="link-num">[7]</span> <a href="#" onclick="runCmd('strava');return false;">Strava</a></div></div></div>
<div class="help-hint">Type 'help' for all commands</div></div>`;

    printOutput(welcome);
  }

  // Global function for clickable links
  window.runCmd = function(cmd) {
    terminalInput.value = cmd;
    executeCommand(cmd);
  };

  // Load/save history from localStorage
  function loadHistory() {
    try {
      const saved = localStorage.getItem('terminalHistory');
      if (saved) {
        state.history = JSON.parse(saved);
        state.historyIndex = state.history.length;
      }
    } catch(e) {}
  }

  function saveHistory() {
    try {
      localStorage.setItem('terminalHistory', JSON.stringify(state.history.slice(-50)));
    } catch(e) {}
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
