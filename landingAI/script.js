function initializeApp() {
    // Navigation Buttons
    const navGenerate = document.getElementById('nav-generate');
    const navTest = document.getElementById('nav-test');

    // Forms
    const generateForm = document.getElementById('generate-form');
    const helloForm = document.getElementById('hello-form');
    const openaiForm = document.getElementById('openai-form');

    // Result Sections
    const generateResultContainer = document.getElementById('generate-result-container');
    const generateResult = document.getElementById('generate-result');
    const helloResultContainer = document.getElementById('hello-result-container');
    const helloResult = document.getElementById('hello-result');
    const openaiResultContainer = document.getElementById('openai-result-container');
    const openaiResult = document.getElementById('openai-result');

    // Loading Spinner
    const loadingSpinner = document.getElementById('loading-spinner');

    // Navigation Event Listeners
    navGenerate.addEventListener('click', () => setActiveForm('generate'));
    navTest.addEventListener('click', () => setActiveForm('test'));

    function setActiveForm(formName) {
        [navGenerate, navTest].forEach(btn => btn.classList.remove('active'));
        [generateForm, helloForm, openaiForm].forEach(form => form.classList.remove('active'));

        // Hide result sections
        generateResultContainer.style.display = 'none';
        helloResultContainer.style.display = 'none';
        openaiResultContainer.style.display = 'none';

        // Hide loading spinner
        loadingSpinner.style.display = 'none';

        if (formName === 'generate') {
            navGenerate.classList.add('active');
            generateForm.classList.add('active');
        } else if (formName === 'test') {
            navTest.classList.add('active');
            helloForm.classList.add('active');
            openaiForm.classList.add('active');
        }
    }

    // Enhanced placeholder functionality
    const inputs = [
        document.getElementById('product-name'),
        document.getElementById('product-description'),
        document.getElementById('custom-copy')
    ];

    inputs.forEach(input => {
        const placeholder = input.placeholder;
        
        input.addEventListener('focus', function() {
            if (this.value === placeholder) {
                this.value = '';
                this.style.color = 'black';
            }
        });

        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.value = placeholder;
                this.style.color = 'gray';
            }
        });

        // Initialize with placeholder text
        input.value = placeholder;
        input.style.color = 'gray';
    });

    // Generate Landing Page Form Submission
    generateForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading spinner
        loadingSpinner.style.display = 'block';

        // Hide previous results
        generateResultContainer.style.display = 'none';

        // Get form values
        const productName = document.getElementById('product-name').value;
        const productDescription = document.getElementById('product-description').value;
        const customCopy = document.getElementById('custom-copy').value;
        const numVariations = parseInt(document.getElementById('num-variations').value);

        // Clear placeholder text if it hasn't been changed
        inputs.forEach(input => {
            if (input.value === input.placeholder) {
                input.value = '';
            }
        });

        try {
            const response = await fetch('https://landingai.fly.dev/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productName,
                    productDescription,
                    customCopy,
                    numVariations
                })
            });

            if (!response.ok) throw new Error('Generate API response was not ok');

            const result = await response.json();
            console.log('API Response:', result); // Log the API response

            window.generatedVariations = result;

            loadingSpinner.style.display = 'none';
            generateResultContainer.style.display = 'block';
            generateResult.innerHTML = formatGeneratedLandingPages(result);
        } catch (error) {
            console.error('Error:', error); // Log any errors
            loadingSpinner.style.display = 'none';
            alert('An error occurred: ' + error.message);
        }
    });

    // Hello Form Submission
    helloForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Hello form submitted');
        // Show loading spinner
        loadingSpinner.style.display = 'block';

        // Hide previous results
        helloResultContainer.style.display = 'none';

        // Get form value
        const name = document.getElementById('hello-name').value;

        try {
            // Call Hello API
            const response = await fetch('https://landingai.fly.dev/hello', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });

            if (!response.ok) throw new Error('Hello API response was not ok');

            const result = await response.text();

            // Hide loading spinner
            loadingSpinner.style.display = 'none';

            // Display the result
            helloResultContainer.style.display = 'block';
            helloResult.textContent = result;
        } catch (error) {
            // Hide loading spinner
            loadingSpinner.style.display = 'none';

            alert('An error occurred: ' + error.message);
        }
    });

    // OpenAI Form Submission
    openaiForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('OpenAI form submitted');
        // Show loading spinner
        loadingSpinner.style.display = 'block';

        // Hide previous results
        openaiResultContainer.style.display = 'none';

        // Get form value
        const prompt = document.getElementById('openai-prompt').value;

        try {
            // Call OpenAI API
            const response = await fetch('https://landingai.fly.dev/test_open_api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) throw new Error('OpenAI API response was not ok');

            const result = await response.json();

            // Hide loading spinner
            loadingSpinner.style.display = 'none';

            // Display the result
            openaiResultContainer.style.display = 'block';
            openaiResult.textContent = result.response;
        } catch (error) {
            // Hide loading spinner
            loadingSpinner.style.display = 'none';

            alert('An error occurred: ' + error.message);
        }
    });

    function formatGeneratedLandingPages(variations) {
        let html = '';
        for (const [index, variation] of Object.entries(variations)) {
            console.log(`Variation ${index}:`, variation); // Log each variation
            const fullHtml = createFullHtml(variation);
            console.log(`Full HTML for variation ${index}:`, fullHtml); // Log the full HTML

            html += `
                <div class="variation">
                    <h4>Variation ${parseInt(index) + 1}</h4>
                    <iframe srcdoc="${escapeHtml(fullHtml)}" 
                            sandbox="allow-scripts"
                            style="width: 100%; height: 500px; border: 1px solid #ccc;"></iframe>
                    <button onclick="downloadVariation(${index})">Download</button>
                </div>
            `;
        }
        return html;
    }

    function createFullHtml(variation) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                    ${variation.css || ''}
                </style>
            </head>
            <body>
                <h1>Landing Page Preview</h1>
                ${variation.html || '<p>No HTML content available.</p>'}
                <script>${variation.javascript || ''}</script>
            </body>
            </html>
        `;
    }

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    window.downloadVariation = function(index) {
        const variation = window.generatedVariations[index];
        const fullHtml = createFullHtml(variation);
        const blob = new Blob([fullHtml], {type: 'text/html'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `variation_${index + 1}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Set the initial active form
    setActiveForm('generate');
}

// Expose initializeApp globally
window.initializeApp = initializeApp;
