// ontology-script.js

document.addEventListener('DOMContentLoaded', function() {
    initQuiz();
});

const quizState = {
    history: [],
    currentKey: 'q1'
};

const quizData = {
    questions: {
        "q1": {
            title: "Question 1",
            text: "When you think about \"reality\" and \"truth,\" which statement feels closest to your view?",
            explanation: "This question explores your basic ontological position - your beliefs about the nature of reality. Option A aligns with positivism (reality as fixed and knowable), B with post-positivism (reality exists but is imperfectly understood), C with interpretivism/constructionism (reality as socially constructed), and D with critical theory (reality as mediated by power relations).",
            options: [
                { letter: "A", text: "There is a single, objective reality that exists independently of our perceptions.", next: "q2A" },
                { letter: "B", text: "Reality exists, but our understanding of it is always incomplete and shaped by our perspectives.", next: "q2B" },
                { letter: "C", text: "Reality is largely constructed through our interpretations and social interactions.", next: "q3C" },
                { letter: "D", text: "Reality may exist objectively, but what we accept as \"truth\" is influenced by power dynamics and social structures.", next: "q3D" }
            ]
        },
        "q2A": {
            title: "Question 2A",
            text: "How do you believe we gain knowledge about the world?",
            explanation: "This question addresses your epistemological stance - how you believe knowledge is acquired. Option A reflects positivism's faith in objective scientific methods, while B acknowledges the limitations recognised in post-positivism.",
            options: [
                { letter: "A", text: "Through careful observation, measurement, and the scientific method.", next: "q3A" },
                { letter: "B", text: "Through systematic investigation, but recognising that our methods always have limitations.", next: "q3B" }
            ]
        },
        "q2B": {
            title: "Question 2B",
            text: "Which statement best reflects your view on scientific knowledge?",
            explanation: "This question explores the status you give to scientific knowledge. Option A reflects post-positivism's qualified confidence in science, while B suggests a more interpretivist view that values multiple ways of knowing.",
            options: [
                { letter: "A", text: "Scientific knowledge is our best approximation of truth, though it's always provisional and subject to revision.", next: "q3B" },
                { letter: "B", text: "Scientific knowledge is one way of understanding the world, but other forms of knowledge (intuitive, traditional, experiential) are equally valid.", next: "q3C" }
            ]
        },
        "q3A": {
            title: "Question 3A",
            text: "When conducting research, what would be your primary aim?",
            explanation: "This question examines your research goals. Option A represents classic positivism's search for universal laws, while B shows some post-positivist recognition that knowledge claims are probabilistic rather than absolute.",
            options: [
                { letter: "A", text: "To discover general laws and patterns that explain and predict phenomena.", result: "strong-positivist" },
                { letter: "B", text: "To establish probable truths through careful testing of hypotheses.", result: "positivist-post" }
            ]
        },
        "q3B": {
            title: "Question 3B",
            text: "How do you view the relationship between facts and values in research?",
            explanation: "This question explores the fact-value distinction. Option A reflects post-positivism's attempt to maintain objectivity, while B shows recognition of the subjective element in all knowledge claims.",
            options: [
                { letter: "A", text: "Good research separates facts from values; researchers should strive for neutrality.", result: "post-positivist" },
                { letter: "B", text: "Facts and values are inevitably intertwined; researchers should acknowledge their perspectives.", result: "post-interpretivist" }
            ]
        },
        "q3C": {
            title: "Question 3C",
            text: "How do you understand meaning in social life?",
            explanation: "This question examines your view on meaning-making. Option A reflects interpretivism's focus on understanding diverse meanings, while B introduces critical theory's concern with how meanings can perpetuate inequality.",
            options: [
                { letter: "A", text: "Meaning emerges through social interaction and varies across different contexts and cultures.", result: "interpretivist" },
                { letter: "B", text: "Meaning is negotiated, but some meanings serve to maintain inequalities that should be challenged.", result: "interpretivist-critical" }
            ]
        },
        "q3D": {
            title: "Question 3D",
            text: "What do you see as the purpose of social research?",
            explanation: "This question explores your view on research aims. Both options reflect critical theory's emancipatory goals, with B more explicitly focused on critiquing power relations that influence knowledge production.",
            options: [
                { letter: "A", text: "To understand diverse perspectives while working toward social change and emancipation.", result: "critical-theory" },
                { letter: "B", text: "To reveal and challenge power dynamics that shape what we accept as knowledge.", result: "strong-critical" }
            ]
        }
    },
    results: {
        "strong-positivist": {
            title: "Strong Positivist orientation",
            description: "You tend to see reality as objective and fixed, with universal laws that can be discovered through scientific methods. Knowledge, in your view, can be neutral and value-free. You likely value quantitative methods and looking for causal relationships. This aligns with traditional scientific approaches that seek to discover \"what is\" through empirical observation and measurement.",
            position: "12.5%"
        },
        "positivist-post": {
            title: "Positivist with Post-positivist leanings",
            description: "While you believe in an objective reality that can be studied scientifically, you recognise some limitations in our ability to know it completely. You value rigorous methods but acknowledge that our knowledge remains provisional. This balanced approach accepts that while we can strive for objectivity, our understanding is always incomplete.",
            position: "25%"
        },
        "post-positivist": {
            title: "Post-positivist orientation",
            description: "You believe reality exists independently, but our knowledge of it is always imperfect and probabilistic. You value systematic inquiry and empirical testing, but recognise that theories are always subject to revision. This perspective maintains faith in scientific methods while acknowledging their limitations.",
            position: "37.5%"
        },
        "post-interpretivist": {
            title: "Post-positivist with Interpretivist leanings",
            description: "You believe in seeking objective knowledge while recognising that our perspectives inevitably shape what we find. You likely value both quantitative and qualitative approaches, seeing each as offering different insights. This balanced view appreciates both the pursuit of patterns and the importance of understanding meaning.",
            position: "50%"
        },
        "interpretivist": {
            title: "Interpretivist/Constructionist orientation",
            description: "You see reality as largely constructed through human interpretation and social interaction. You believe there are multiple valid ways of understanding the world, shaped by context and culture. You likely value qualitative approaches that capture diverse perspectives. This approach focuses on understanding meaning rather than establishing universal laws.",
            position: "62.5%"
        },
        "interpretivist-critical": {
            title: "Interpretivist with Critical Theory leanings",
            description: "While you emphasise the constructed nature of social reality, you're also attentive to how power shapes these constructions. You value understanding diverse perspectives but also question whose interests they serve. This stance combines appreciation for multiple meanings with awareness of inequality.",
            position: "75%"
        },
        "critical-theory": {
            title: "Critical Theory orientation",
            description: "You see knowledge as shaped by power relations and social structures. While you don't reject objectivity entirely, you believe truth claims must be examined in their social and historical context. You likely value research that gives voice to marginalised perspectives and promotes social change. This approach combines understanding with a commitment to emancipation.",
            position: "87.5%"
        },
        "strong-critical": {
            title: "Strong Critical Theory orientation",
            description: "You strongly emphasise how power shapes what counts as knowledge and truth. You see research as inherently political and value approaches that challenge dominant perspectives and work toward social justice. This stance represents a deep commitment to using research as a tool for emancipation and social transformation.",
            position: "100%"
        }
    }
};

// DOM references
const introScreen     = document.getElementById('intro-screen');
const questionScreen  = document.getElementById('question-screen');
const resultsScreen   = document.getElementById('results-screen');
const resourcesScreen = document.getElementById('resources-screen');
const startButton     = document.getElementById('start-button');
const prevButton      = document.getElementById('prev-button');
const retakeButton    = document.getElementById('retake-button');
const resourcesButton = document.getElementById('resources-button');
const backToResults   = document.getElementById('back-to-results-button');
const qTitle          = document.getElementById('question-title');
const qText           = document.getElementById('question-text');
const qExplain        = document.getElementById('question-explanation');
const optsContainer   = document.querySelector('.options-container');
const resultTitle     = document.getElementById('result-title');
const resultDesc      = document.getElementById('result-description');
const userMarker      = document.getElementById('user-position');

// Progress steps
const stepIntro       = document.getElementById('progress-intro');
const stepQuestion    = document.getElementById('progress-question');
const stepResults     = document.getElementById('progress-results');

function initQuiz() {
    // Show intro only
    showSection('intro');
    startButton.addEventListener('click', () => {
        quizState.history = [];
        quizState.currentKey = 'q1';
        renderQuestion('q1');
    });
    prevButton.addEventListener('click', goBack);
    retakeButton.addEventListener('click', () => location.reload());
    resourcesButton.addEventListener('click', () => showSection('resources'));
    backToResults.addEventListener('click', () => showSection('results'));
    initAccordion();
}
function initAccordion() {
    // find all headers in the accordion
    const headers = document.querySelectorAll('#philosophy-accordion .accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            // toggle active on the parent .accordion-item
            const item = header.parentElement;
            item.classList.toggle('active');
        });
    });
}

function showSection(section) {
    // 1. Hide all screens
    [introScreen, questionScreen, resultsScreen, resourcesScreen].forEach(sec => 
        sec.classList.remove('active')
    );

    // 2. Reset all progress‐step highlights
    [stepIntro, stepQuestion, stepResults].forEach(step => 
        step.classList.remove('active')
    );

    // 3. Grab the fill element
    const progressFill = document.getElementById('progress-fill');

    // 4. Show the right screen + step, and update fill %
    if (section === 'intro') {
        introScreen.classList.add('active');
        stepIntro.classList.add('active');
        progressFill.style.width = '0%';

    } else if (section === 'question') {
        questionScreen.classList.add('active');
        stepQuestion.classList.add('active');
        progressFill.style.width = '50%';

    } else if (section === 'results') {
        resultsScreen.classList.add('active');
        stepResults.classList.add('active');
        progressFill.style.width = '100%';

    } else if (section === 'resources') {
        resourcesScreen.classList.add('active');
        // keep the progress at 100% when viewing resources
        progressFill.style.width = '100%';
    }
}


function renderQuestion(key) {
    const q = quizData.questions[key];
    quizState.currentKey = key;
    showSection('question');
    qTitle.textContent = q.title;
    qText.textContent = q.text;
    qExplain.textContent = q.explanation;
    optsContainer.innerHTML = '';

    q.options.forEach(opt => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.innerHTML = `
            <div class="option-marker"></div>
            <div class="option-text"><span class="option-letter">${opt.letter}</span>${opt.text}</div>
        `;
        card.addEventListener('click', () => selectOption(card, opt));
        optsContainer.appendChild(card);
    });
}

function selectOption(card, opt) {
    // highlight chosen
    document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    // advance after brief delay
    setTimeout(() => {
        quizState.history.push(quizState.currentKey);
        if (opt.next) {
            renderQuestion(opt.next);
        } else if (opt.result) {
            showResult(opt.result);
        }
    }, 300);
}

function goBack() {
    if (quizState.history.length === 0) return;
    const prevKey = quizState.history.pop();
    renderQuestion(prevKey);
}

function showResult(key) {
    const res = quizData.results[key];
    resultTitle.textContent = res.title;
    resultDesc.textContent = res.description;
    userMarker.style.left = res.position;
    showSection('results');
}
