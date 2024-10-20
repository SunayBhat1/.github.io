document.addEventListener('DOMContentLoaded', function() {
    // Navigation Buttons
    const navHello = document.getElementById('nav-hello');
    const navOpenAI = document.getElementById('nav-openai');

    // Forms
    const helloForm = document.getElementById('hello-form');
    const openaiForm = document.getElementById('openai-form');

    // Result Sections
    const helloResult = document.getElementById('hello-result');
    const openaiResult = document.getElementById('openai-result');

    // Loading Spinner
    const loadingSpinner = document.getElementById('loading-spinner');

    // Navigation Event Listeners
    navHello.addEventListener('click', () => {
        setActiveForm('hello');
    });
    navOpenAI.addEventListener('click', () => {
        setActiveForm('openai');
    });

    function setActiveForm(formName) {
        // Remove 'active' class from all nav buttons and forms
        [navHello, navOpenAI].forEach(btn => btn.classList.remove('active'));
        [helloForm, openaiForm].forEach(form => form.classList.remove('active'));

        // Hide result sections
        helloResult.style.display = 'none';
        openaiResult.style.display = 'none';

        // Hide loading spinner
        loadingSpinner.style.display = 'none';

        // Add 'active' class to the selected nav button and form
        if (formName === 'hello') {
            navHello.classList.add('active');
            helloForm.classList.add('active');
        } else if (formName === 'openai') {
            navOpenAI.classList.add('active');
            openaiForm.classList.add('active');
        }
    }

    // Hello Form Submission
    helloForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show loading spinner
        loadingSpinner.style.display = 'block';

        // Hide previous results
        helloResult.style.display = 'none';

        // Get form values
        const name = document.getElementById('hello-name').value;

        // Prepare data for the backend
        const data = { name };

        // Call the backend API
        try {
            const response = await fetch('https://landingai.fly.dev/hello', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const result = await response.text();

            // Hide loading spinner
            loadingSpinner.style.display = 'none';

            // Display the result
            helloResult.style.display = 'block';
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

        // Show loading spinner
        loadingSpinner.style.display = 'block';

        // Hide previous results
        openaiResult.style.display = 'none';

        // Get form values
        const prompt = document.getElementById('openai-prompt').value;

        // Prepare data for the backend
        const data = { prompt };

        // Call the backend API
        try {
            const response = await fetch('https://landingai.fly.dev/test_openai_api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const result = await response.json();

            // Hide loading spinner
            loadingSpinner.style.display = 'none';

            // Display the result
            openaiResult.style.display = 'block';
            openaiResult.textContent = result.response;
        } catch (error) {
            // Hide loading spinner
            loadingSpinner.style.display = 'none';

            alert('An error occurred: ' + error.message);
        }
    });
});