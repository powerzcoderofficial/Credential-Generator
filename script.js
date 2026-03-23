// Global Variables
let CREDENTIAL_DB = {};
let currentPhotoBase64 = "";

// =========================================================================
// AUTO GENERATOR ENGINE (Generates data based on JSON mockTypes)
// =========================================================================
function generateMockValue(mockType, fieldName = "") {
    const type = mockType || fieldName.toLowerCase();
    
    // Dates & Biological
    if (type.includes("date")) {
        const year = 2026 + Math.floor(Math.random() * 5);
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }
    if (type.includes("blood")) return["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"][Math.floor(Math.random() * 8)];
    if (type.includes("gender")) return["Male", "Female", "Non-Binary"][Math.floor(Math.random() * 3)];
    
    // Status, Tiers, & Scores
    if (type.includes("tier")) return["Gold", "Premium", "Active", "Verified", "Level 4", "Sector A", "Classified", "Clearance 5"][Math.floor(Math.random() * 8)];
    if (type.includes("score")) return (Math.random() * 2 + 3).toFixed(1) + " / 5.0";
    if (type.includes("grade")) return["A+", "A", "A-", "B+", "B", "O", "Distinction"][Math.floor(Math.random() * 7)];
    if (type.includes("money")) return "$" + (Math.random() * 5000 + 100).toFixed(2);
    
    // Transport & Vehicles
    if (type.includes("vehicle")) return["LMV (Car)", "MCWG (Bike)", "HMV (Truck)"][Math.floor(Math.random() * 3)];
    if (type.includes("cc")) return["1197 CC", "1498 CC", "998 CC", "1998 CC"][Math.floor(Math.random() * 4)];
    if (type.includes("plate")) return "MH" + Math.floor(Math.random() * 90 + 10) + "AB" + Math.floor(Math.random() * 9000 + 1000);
    
    // Travel & Geo
    if (type.includes("nation")) return["United States", "United Kingdom", "India", "Canada", "Germany", "Japan", "Australia", "Singapore"][Math.floor(Math.random() * 8)];
    if (type.includes("airport")) return["JFK", "LHR", "DEL", "HND", "DXB", "CDG", "SIN", "SYD"][Math.floor(Math.random() * 8)];
    if (type.includes("flight")) return["AI", "EK", "BA", "UA", "JL", "SQ"][Math.floor(Math.random() * 6)] + Math.floor(100 + Math.random() * 900);
    if (type.includes("seat")) return Math.floor(1 + Math.random() * 60) +["A", "B", "C", "D", "E", "F"][Math.floor(Math.random() * 6)];
    if (type.includes("pnr")) return Math.random().toString(36).substring(2, 8).toUpperCase();
    if (type.includes("passport")) return "A" + Math.floor(1000000 + Math.random() * 9000000);
    if (type.includes("visa")) return "V-" + Math.floor(10000000 + Math.random() * 90000000);
    
    // Tech & Cyber
    if (type.includes("network")) return["Ethereum Mainnet", "Polygon (Matic)", "Solana", "Bitcoin Core", "Private Subnet"][Math.floor(Math.random() * 5)];
    if (type.includes("ip")) return `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
    if (type.includes("device")) return "DEV-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    if (type.includes("biometric")) return "SHA-" + Math.random().toString(16).substring(2, 14).toUpperCase();
    
    // Academic
    if (type.includes("university")) return["MIT", "Stanford", "Oxford", "Harvard", "Global Tech", "National University", "Cambridge"][Math.floor(Math.random() * 7)];
    if (type.includes("course")) return["Computer Science", "Business Admin", "Medicine", "Law", "Engineering", "Cyber Security", "Data Science"][Math.floor(Math.random() * 7)];
    
    // Specific Formats
    if (type.includes("pan")) { 
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let str = "";
        for(let i=0;i<5;i++) str += letters.charAt(Math.floor(Math.random() * letters.length));
        str += Math.floor(Math.random() * 9000 + 1000);
        str += letters.charAt(Math.floor(Math.random() * letters.length));
        return str;
    }
    if (type.includes("card")) return Math.random().toString().slice(2,6) + " " + Math.random().toString().slice(2,6) + " " + Math.random().toString().slice(2,6) + " " + Math.random().toString().slice(2,6);
    if (type.includes("cvv")) return Math.floor(Math.random() * 900 + 100);
    if (type.includes("hash")) return Math.random().toString(36).substring(2, 18).toUpperCase();
    if (type.includes("area")) return Math.floor(Math.random() * 5000 + 500) + " Sq. Ft.";

    // Generic Fallback ID
    return Math.random().toString(36).substring(2, 12).toUpperCase();
}

function generateAutoAvatar(nameText, hexColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 150; canvas.height = 150;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = hexColor || "#6366f1";
    ctx.fillRect(0, 0, 150, 150);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 60px Inter";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const initials = nameText && nameText.trim() !== "" && nameText !== "---" ? nameText.substring(0, 2).toUpperCase() : "XX";
    ctx.fillText(initials, 75, 75);
    return canvas.toDataURL();
}

// =========================================================================
// APP INITIALIZATION (Fetches JSON, Ignores Keys starting with "_")
// =========================================================================
document.addEventListener('DOMContentLoaded', async () => {
    const credSelect = document.getElementById('credType');
    if (!credSelect) return;

    try {
        const response = await fetch('credentials.json');
        if (!response.ok) throw new Error("Network response was not ok");
        CREDENTIAL_DB = await response.json();

        credSelect.innerHTML = '';
        
        Object.keys(CREDENTIAL_DB).forEach(key => {
            if (!key.startsWith('_')) { 
                const opt = document.createElement('option');
                opt.value = key; opt.innerText = key;
                credSelect.appendChild(opt);
            }
        });

        credSelect.addEventListener('change', () => switchCredentialType(false));
        switchCredentialType(false); 

    } catch (error) {
        console.error("Failed to load credentials.json:", error);
        document.getElementById('dynamicInputs').innerHTML = `<p style="color:#ef4444; padding:1rem; border:1px solid #ef4444; border-radius:8px;">Failed to load credentials.json. Ensure you are running via Live Server.</p>`;
    }
});

window.generateAutoData = function(forceReroll) { switchCredentialType(forceReroll); }

function switchCredentialType(forceReroll = false) {
    const type = document.getElementById('credType').value;
    const config = CREDENTIAL_DB[type];
    if(!config) return;
    
    document.documentElement.style.setProperty('--primary', config.color);
    const hex = config.color.replace('#', '');
    document.documentElement.style.setProperty('--primary-glow', `rgba(${parseInt(hex.substring(0,2), 16)}, ${parseInt(hex.substring(2,4), 16)}, ${parseInt(hex.substring(4,6), 16)}, 0.5)`);

    const formContainer = document.getElementById('dynamicInputs');
    formContainer.innerHTML = '';
    
    let storedData = JSON.parse(localStorage.getItem('credStorage')) || {};
    if (!storedData[type]) storedData[type] = {};

    config.fields.forEach((field) => {
        if (field.mode === "user") {
            formContainer.innerHTML += `
                <div class="input-group">
                    <label>${field.name} <span style="font-size: 0.65rem; color: #4ade80; float: right;">USER</span></label>
                    <input type="text" class="card-input" data-label="${field.name}" data-mode="user" placeholder="Enter ${field.name}..." oninput="updatePreview()">
                </div>
            `;
        } else if (field.mode === "auto") {
            if (!storedData[type][field.name] || forceReroll) { 
                storedData[type][field.name] = generateMockValue(field.mockType, field.name); 
            }
            formContainer.innerHTML += `
                <div class="input-group">
                    <label>${field.name} <span style="font-size: 0.6rem; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; float: right;">AUTO</span></label>
                    <input type="text" class="card-input" data-label="${field.name}" data-mode="auto" value="${storedData[type][field.name]}" readonly style="background: rgba(0, 0, 0, 0.4); border: 1px dashed rgba(255,255,255,0.2); color: #a1a1aa;">
                </div>
            `;
        }
    });

    localStorage.setItem('credStorage', JSON.stringify(storedData));
    updatePreview(); 
}

// =========================================================================
// CARD RENDERER (Now supports 6 dynamic layout designs)
// =========================================================================
function updatePreview() {
    const type = document.getElementById('credType').value;
    const config = CREDENTIAL_DB[type];
    const card = document.getElementById('credentialCard');
    
    let qrDataObj = { type: type };
    let firstUserInput = "---";
    let allInfoHTML = '';

    const inputs = document.querySelectorAll('.card-input');
    inputs.forEach((input) => {
        const label = input.getAttribute('data-label');
        const val = input.value || "---";
        if (input.getAttribute('data-mode') === "user" && firstUserInput === "---") firstUserInput = val; 
        qrDataObj[label] = val;
        allInfoHTML += `<div class="info-item"><label>${label}</label><div>${val}</div></div>`;
    });

    let photoSrc = currentPhotoBase64 ? currentPhotoBase64 : generateAutoAvatar(firstUserInput, config.color);
    let footerId = "#" + btoa((firstUserInput !== "---" ? firstUserInput : "XXX") + type).substring(0, 8).toUpperCase();

    card.className = "card glass";
    
    // -------------------------------------------------------------
    // LAYOUT 1: BANK (Credit Cards / Crypto Wallets)
    // -------------------------------------------------------------
    if (config.layout === 'bank') {
        card.style.width = '480px'; card.style.height = '280px'; card.style.flexDirection = 'column';
        let hugeNumber = "XXXX XXXX XXXX XXXX";
        for (let key in qrDataObj) {
            if (key.toLowerCase().includes("number") || key.toLowerCase().includes("hash") || key.toLowerCase().includes("id")) { hugeNumber = qrDataObj[key]; break; }
        }
        
        card.innerHTML = `
            <div class="hologram-overlay"></div>
            <div style="display:flex; justify-content:space-between; width:100%; align-items:flex-start; position: relative; z-index:2;">
                <div style="font-weight: 800; font-size: 1.4rem; font-style: italic; opacity: 0.9;">${type.toUpperCase()}</div>
                <div id="qrcode" style="transform: scale(0.8); transform-origin: top right;"></div>
            </div>
            <div class="emv-chip" style="position: relative; z-index:2;"></div>
            <div style="font-family: 'Courier New', monospace; font-size: 1.6rem; font-weight: bold; letter-spacing: 3px; margin: 10px 0; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); width: 100%; text-align: center; position: relative; z-index:2; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                ${hugeNumber}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:flex-end; width:100%; margin-top: auto; position: relative; z-index:2;">
                <div>
                    <div style="font-size: 0.6rem; opacity: 0.6; text-transform:uppercase;">Primary Name</div>
                    <div style="font-size: 1.2rem; font-weight:600; text-transform:uppercase; letter-spacing:1px; max-width: 250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${firstUserInput}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size: 0.65rem; opacity: 0.6; text-transform:uppercase;">System Ref</div>
                    <div style="font-size: 0.9rem; font-weight:600; color:var(--primary);">${footerId}</div>
                </div>
            </div>
        `;
    } 
    // -------------------------------------------------------------
    // LAYOUT 2: VERTICAL (Student IDs, Event Badges, Access Cards)
    // -------------------------------------------------------------
    else if (config.layout === 'vertical') {
        card.style.width = '320px'; card.style.height = '500px'; card.style.flexDirection = 'column';
        card.innerHTML = `
            <div class="hologram-overlay"></div>
            <div style="width:100%; display:flex; justify-content:space-between; align-items:center; position: relative; z-index:2;">
                <div class="type-badge" style="background:${config.color}">${type}</div>
                <div class="status-dot pulse"></div>
            </div>
            <div style="width: 130px; height: 130px; border-radius: 50%; margin: 15px auto; border: 4px solid ${config.color}; box-shadow: 0 0 20px var(--primary-glow); overflow: hidden; position: relative; z-index:2; flex-shrink: 0;">
                <img src="${photoSrc}" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div style="display: grid; grid-template-columns: 1fr; text-align: center; gap: 8px; width: 100%; position: relative; z-index:2; overflow-y:auto; padding-bottom: 10px;">
                ${allInfoHTML}
            </div>
            <div style="width:100%; display:flex; flex-direction:column; align-items:center; gap: 10px; margin-top: auto; position: relative; z-index:2; padding-top: 10px; border-top: 1px dashed rgba(255,255,255,0.2);">
                <div id="qrcode"></div>
                <strong style="font-family:monospace; color:${config.color}; font-size: 1rem;">${footerId}</strong>
            </div>
        `;
    } 
    // -------------------------------------------------------------
    // LAYOUT 3: SECURE (Law Enforcement, Cyber Identity)
    // -------------------------------------------------------------
    else if (config.layout === 'secure') {
        card.style.width = '480px'; card.style.height = 'auto'; card.style.minHeight = '300px'; card.style.flexDirection = 'column';
        // Give it a dossier/cyberpunk feel with monospace font and a grid overlay
        card.innerHTML = `
            <div class="hologram-overlay"></div>
            <div style="position:absolute; top:0; left:0; width:100%; height:100%; background-image: radial-gradient(${config.color} 1px, transparent 1px); background-size: 20px 20px; opacity: 0.1; pointer-events: none; z-index:1;"></div>
            
            <div style="display:flex; justify-content:space-between; align-items:flex-start; width: 100%; position: relative; z-index:2;">
                <div style="font-family: monospace; font-weight: bold; font-size: 1.2rem; color: ${config.color}; border-bottom: 2px solid ${config.color}; padding-bottom: 5px; text-transform: uppercase;">[ ${type} ]</div>
                <div class="status-dot pulse" style="border-radius: 0; width: 15px; height: 15px; background: ${config.color}; box-shadow: 0 0 10px ${config.color};"></div>
            </div>
            
            <div style="display:flex; gap: 1.5rem; margin-top: 1rem; align-items: center; position: relative; z-index:2;">
                <div style="width: 110px; height: 130px; border: 1px solid ${config.color}; position: relative; flex-shrink: 0;">
                    <div style="position:absolute; top:-2px; left:-2px; width:10px; height:10px; border-top:2px solid ${config.color}; border-left:2px solid ${config.color}; z-index:5;"></div>
                    <div style="position:absolute; bottom:-2px; right:-2px; width:10px; height:10px; border-bottom:2px solid ${config.color}; border-right:2px solid ${config.color}; z-index:5;"></div>
                    <img src="${photoSrc}" style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%) contrast(1.2);">
                </div>
                <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 14px; font-family: monospace;">
                    ${allInfoHTML.replace(/<label>/g, `<label style="font-family: monospace; color: ${config.color};">`)}
                </div>
            </div>
            
            <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top: 1.5rem; width:100%; position: relative; z-index:2; padding-top: 10px; border-top: 1px dashed ${config.color};">
                <div id="qrcode"></div>
                <div style="text-align: right;">
                    <small style="display:block; font-size:0.6rem; opacity:0.8; letter-spacing:2px; margin-bottom:4px; font-family: monospace;">// CLASSIFIED RECORD // </small>
                    <strong style="font-size:1.1rem; font-family:monospace; letter-spacing:1px; color:${config.color};">${footerId}</strong>
                </div>
            </div>
        `;
    }
    // -------------------------------------------------------------
    // LAYOUT 4: PASSPORT (Travel Docs, Visas)
    // -------------------------------------------------------------
    else if (config.layout === 'passport') {
        card.style.width = '480px'; card.style.height = 'auto'; card.style.minHeight = '320px'; card.style.flexDirection = 'column';
        let mrzString = `P<XXX${firstUserInput.toUpperCase().replace(/\s/g, '<')}<<<<<<<<<<<<<<<<<<`;
        card.innerHTML = `
            <div class="hologram-overlay"></div>
            <div style="text-align: center; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 10px; margin-bottom: 15px; position: relative; z-index:2;">
                <h3 style="letter-spacing: 5px; text-transform: uppercase; font-weight: 800; color: ${config.color};">${type}</h3>
            </div>
            <div style="display:flex; gap: 1.5rem; align-items: flex-start; position: relative; z-index:2;">
                <div class="photo-slot" style="width: 100px; height: 130px; border: 1px solid rgba(255,255,255,0.3); flex-shrink: 0;">
                    <img src="${photoSrc}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px;">
                    ${allInfoHTML}
                </div>
            </div>
            <div style="margin-top: 20px; font-family: 'Courier New', monospace; font-size: 0.9rem; letter-spacing: 2px; line-height: 1.5; background: rgba(255,255,255,0.8); color: black; padding: 10px; border-radius: 4px; position: relative; z-index:2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${mrzString}<br>
                ${Math.floor(Math.random() * 90000000)}<3XXX8908123M2608123<<<<<<<<<<<<<<02
            </div>
            <div style="position: absolute; right: 15px; top: 70px; z-index:2;" id="qrcode"></div>
        `;
    }
    // -------------------------------------------------------------
    // LAYOUT 5: MINIMAL (Modern, clean, lots of whitespace)
    // -------------------------------------------------------------
    else if (config.layout === 'minimal') {
        card.style.width = '480px'; card.style.height = 'auto'; card.style.minHeight = '260px'; card.style.flexDirection = 'column'; card.style.background = 'rgba(255,255,255,0.03)'; card.style.border = 'none';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; width: 100%; position: relative; z-index:2; margin-bottom: 1.5rem;">
                <div style="font-weight: 300; letter-spacing: 1px; font-size: 1.2rem; opacity: 0.8;">${type}</div>
                <div class="status-dot pulse" style="background: ${config.color}; box-shadow: 0 0 15px ${config.color};"></div>
            </div>
            <div style="display:flex; gap: 2rem; align-items: center; position: relative; z-index:2;">
                <img src="${photoSrc}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%; box-shadow: 0 10px 20px rgba(0,0,0,0.5);">
                <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    ${allInfoHTML.replace(/<label>/g, '<label style="font-weight: 300; opacity: 0.5;">')}
                </div>
            </div>
            <div style="position: absolute; bottom: 20px; right: 20px; z-index:2;" id="qrcode"></div>
        `;
    }
    // -------------------------------------------------------------
    // LAYOUT 6: STANDARD (Default for IDs, Driver Licenses)
    // -------------------------------------------------------------
    else {
        card.style.width = '480px'; card.style.height = 'auto'; card.style.minHeight = '300px'; card.style.flexDirection = 'column';
        card.innerHTML = `
            <div class="hologram-overlay"></div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; width: 100%; position: relative; z-index:2;">
                <div class="type-badge" style="background:${config.color}">${type}</div>
                <div class="status-dot pulse"></div>
            </div>
            <div style="display:flex; gap: 1.5rem; margin-top: 1rem; align-items: center; position: relative; z-index:2;">
                <div class="photo-slot" style="width: 110px; height: 130px; border-radius: 12px; border: 2px solid rgba(255,255,255,0.1); flex-shrink: 0; overflow:hidden;">
                    <img src="${photoSrc}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 14px; align-items: start;">
                    ${allInfoHTML}
                </div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top: 1.5rem; width:100%; position: relative; z-index:2; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
                <div id="qrcode"></div>
                <div style="text-align: right;">
                    <small style="display:block; font-size:0.6rem; opacity:0.6; letter-spacing:2px; margin-bottom:4px;">VERIFIED DOC</small>
                    <strong style="font-size:1.1rem; font-family:monospace; letter-spacing:1px; color:${config.color};">${footerId}</strong>
                </div>
            </div>
        `;
    }

    updateQR(qrDataObj, config.color);
}

function handlePhoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) { currentPhotoBase64 = e.target.result; updatePreview(); };
        reader.readAsDataURL(input.files[0]);
    }
}

function updateQR(dataObj, hexColor) {
    const qrDiv = document.getElementById('qrcode');
    if(!qrDiv) return;
    qrDiv.innerHTML = ''; 
    const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify({ t: dataObj.type, v: Object.values(dataObj).slice(1) }))));
    let baseUrl = window.location.href.split('?')[0].replace('generator.html', '').replace('#', '');
    if(!baseUrl.endsWith('/')) baseUrl += '/';
    const verifyUrl = `${baseUrl}view.html?q=${encodedData}`;

    new QRCode(qrDiv, { text: verifyUrl, width: 100, height: 100, colorDark : "#000", colorLight : "#fff", correctLevel : QRCode.CorrectLevel.L });
}

function toggleBW() { document.getElementById('credentialCard').classList.toggle('bw-mode'); }
function downloadCard() {
    const card = document.getElementById('credentialCard');
    card.style.transform = "none"; card.style.boxShadow = "none";
    html2canvas(card, { backgroundColor: null, scale: 3, useCORS: true, logging: false }).then(canvas => {
        const link = document.createElement('a'); link.download = `${document.getElementById('credType').value.replace(' ', '_')}.png`; link.href = canvas.toDataURL("image/png"); link.click();
        card.style.transform = ""; card.style.boxShadow = "";
    });
}
function downloadQR() {
    const qrCanvas = document.querySelector('#qrcode canvas');
    if (qrCanvas) { const link = document.createElement('a'); link.download = 'credential-qr.png'; link.href = qrCanvas.toDataURL(); link.click(); }
}