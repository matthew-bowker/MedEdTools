document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

// Global state object to store user selections
const researchPlan = {
    question: {
        interest: '',
        aim: '',
        context: '',
        gap: '',
        researchQuestion: ''
    },
    philosophy: {
        ontology: '',
        epistemology: '',
        paradigm: ''
    },
    methodology: {
        approach: '',
        description: '',
        example: ''
    },
    methods: {
        dataCollection: [],
        sampling: '',
        analysis: ''
    },
    practical: {
        ethics: [],
        rigour: [],
        timeline: '',
        resources: {}
    }
};

function initApp() {
    // Set up section navigation
    setupNavigation();
    
    // Set up option selection
    setupOptionSelection();
    
    // Set up research question builder
    setupResearchQuestionBuilder();
    
    // Set up paradigm detection
    setupParadigmDetection();
    
    // Set up methodology selection
    setupMethodologySection();
    
    // Set up methods selection
    setupMethodsSection();
    
    // Set up practical planning
    setupPracticalPlanning();
    
    // Set up final plan generation
    setupFinalPlan();
    
    // Set up modal functionality
    setupModal();
    
    // Set current date in the plan
    document.getElementById('plan-date').textContent = `Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
}

// NAVIGATION FUNCTIONS
function setupNavigation() {
    // Start button
    document.getElementById('start-button').addEventListener('click', function() {
        navigateToSection('section-1');
    });
    
    // Make progress steps clickable
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = parseInt(this.dataset.step);
            
            // Don't allow skipping to final plan before completing previous sections
            if (stepNumber === 6 && !validateSection(5)) {
                alert('Please complete previous sections before viewing your final plan.');
                return;
            }
            
            // If trying to access a section beyond current progress
            const currentSection = document.querySelector('.content-section.active');
            const currentId = currentSection.id;
            
            // Check if we're on the welcome screen
            if (currentId === 'welcome-screen') {
                if (stepNumber === 1) {
                    navigateToSection('section-1');
                } else {
                    alert('Please start from the beginning.');
                }
                return;
            }
            
            const currentStep = parseInt(currentId.split('-')[1]);
            
            // Allow moving to any previously completed section
            if (stepNumber <= currentStep) {
                navigateToSection(`section-${stepNumber}`);
            }
            // Allow moving to the next section if current section is valid
            else if (stepNumber === currentStep + 1 && validateSection(currentStep)) {
                navigateToSection(`section-${stepNumber}`);
            }
            // Don't allow skipping sections
            else if (stepNumber > currentStep + 1) {
                alert('Please complete the current section before skipping ahead.');
            }
        });
    });
    
    // Prev/next buttons
    const prevButtons = document.querySelectorAll('.prev-button');
    const nextButtons = document.querySelectorAll('.next-button');
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentSection = document.querySelector('.content-section.active');
            const currentId = currentSection.id;
            const currentStep = parseInt(currentId.split('-')[1]);
            
            if (currentStep > 1) {
                navigateToSection(`section-${currentStep - 1}`);
            } else {
                navigateToSection('welcome-screen');
            }
        });
    });
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentSection = document.querySelector('.content-section.active');
            const currentId = currentSection.id;
            
            // Skip for welcome screen
            if (currentId === 'welcome-screen') {
                navigateToSection('section-1');
                return;
            }
            
            const currentStep = parseInt(currentId.split('-')[1]);
            
            // Validate section before proceeding
            if (validateSection(currentStep)) {
                navigateToSection(`section-${currentStep + 1}`);
            }
        });
    });
    
    // Restart button
    document.getElementById('restart-button').addEventListener('click', function() {
        if (confirm('Are you sure you want to start a new research plan? All current progress will be lost.')) {
            resetApp();
            navigateToSection('welcome-screen');
        }
    });
}

function navigateToSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the target section
    document.getElementById(sectionId).classList.add('active');
    
    // Update progress
    updateProgress(sectionId);
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Special handling for section transitions
    const step = parseInt(sectionId.split('-')[1]);
    
    if (sectionId === 'section-3') {
        // Update the current paradigm display
        document.getElementById('current-paradigm').textContent = researchPlan.philosophy.paradigm;
        
        // Show the appropriate methodology group
        showMethodologyGroup();
    }
    
    if (sectionId === 'section-4') {
        // Update the current methodology display
        document.getElementById('current-methodology').textContent = researchPlan.methodology.approach;
        
        // Show appropriate methods groups
        showMethodsGroups();
    }
    
    if (sectionId === 'section-6') {
        // Generate the final research plan
        generateFinalPlan();
    }
}

function updateProgress(sectionId) {
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressFill = document.getElementById('progress-fill');
    
    // Reset all steps
    progressSteps.forEach(step => {
        step.classList.remove('active', 'completed');
    });
    
    let progressPercentage = 0;
    
    if (sectionId === 'welcome-screen') {
        // Set first step as active
        progressSteps[0].classList.add('active');
    } else {
        const step = parseInt(sectionId.split('-')[1]);
        
        // Mark previous steps as completed
        for (let i = 0; i < step; i++) {
            progressSteps[i].classList.add('completed');
        }
        
        // Mark current step as active
        progressSteps[step - 1].classList.add('active');
        
        // Calculate progress percentage
        progressPercentage = ((step - 1) / (progressSteps.length - 1)) * 100;
    }
    
    // Update progress bar
    progressFill.style.width = `${progressPercentage}%`;
}

function validateSection(currentStep) {
    // Different validation logic based on the section
    switch(currentStep) {
        case 1: // Research Question section
            if (!researchPlan.question.interest || !researchPlan.question.aim || 
                !researchPlan.question.context || !researchPlan.question.gap) {
                alert('Please complete all questions in this section before proceeding.');
                return false;
            }
            
            const researchQuestion = document.getElementById('research-question').value.trim();
            if (!researchQuestion) {
                alert('Please draft your research question before proceeding.');
                return false;
            }
            researchPlan.question.researchQuestion = researchQuestion;
            return true;
            
        case 2: // Philosophical Foundations section
            if (!researchPlan.philosophy.ontology || !researchPlan.philosophy.epistemology) {
                alert('Please select your ontological and epistemological positions before proceeding.');
                return false;
            }
            return true;
            
        case 3: // Methodology section
            if (!researchPlan.methodology.approach) {
                alert('Please select a methodology before proceeding.');
                return false;
            }
            return true;
            
        case 4: // Methods section
            if (researchPlan.methods.dataCollection.length === 0) {
                alert('Please select at least one data collection method before proceeding.');
                return false;
            }
            if (!researchPlan.methods.sampling || !researchPlan.methods.analysis) {
                alert('Please select a sampling strategy and analysis approach before proceeding.');
                return false;
            }
            return true;
            
        case 5: // Practical Planning section
            // This section is optional, so always return true
            return true;
            
        default:
            return true;
    }
}

// OPTION SELECTION FUNCTIONS
function setupOptionSelection() {
    // Single-select option cards (standard)
    document.querySelectorAll('.options-container:not(.multi-select):not(.radio-select)').forEach(container => {
        const options = container.querySelectorAll('.option-card');
        
        options.forEach(option => {
            option.addEventListener('click', function(e) {
                // Don't select if clicking on an input field
                if (e.target.tagName === 'INPUT') {
                    return;
                }
                
                // Remove selected class from all options in this container
                container.querySelectorAll('.option-card').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Add selected class to this option
                this.classList.add('selected');
                
                // Store the selection in the research plan
                const value = this.dataset.value;
                const containerId = container.parentElement.id;
                
                storeSelection(containerId, value);
                
                // If the option has an input field, focus it
                const input = this.querySelector('input');
                if (input) {
                    input.focus();
                }
            });
        });
    });
    
    // Checkbox option cards
    document.querySelectorAll('.options-container.multi-select').forEach(container => {
        const options = container.querySelectorAll('.option-card');
        
        options.forEach(option => {
            option.addEventListener('click', function(e) {
                // Don't toggle if clicking on an input field
                if (e.target.tagName === 'INPUT') {
                    return;
                }
                
                // Toggle selected class
                this.classList.toggle('selected');
                
                // Store the selection in the research plan
                const containerId = container.parentElement.id;
                updateMultiSelection(containerId);
            });
        });
    });
    
    // Radio option cards
    document.querySelectorAll('.options-container.radio-select').forEach(container => {
        const options = container.querySelectorAll('.option-card');
        
        options.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options in this container
                container.querySelectorAll('.option-card').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Add selected class to this option
                this.classList.add('selected');
                
                // Store the selection in the research plan
                const value = this.dataset.value;
                const containerId = container.parentElement.id;
                
                storeRadioSelection(containerId, value);
            });
        });
    });
    
    // Setup checklist items
    document.querySelectorAll('.checklist-item').forEach(item => {
        item.addEventListener('click', function() {
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            
            // Update stored values
            const checklistGroup = this.querySelector('input').name;
            updateChecklist(checklistGroup);
        });
    });
}

function storeSelection(containerId, value) {
    switch(containerId) {
        case 'initial-interest':
            researchPlan.question.interest = value;
            break;
        case 'question-refinement':
            researchPlan.question.aim = value;
            break;
        case 'context-question':
            if (value === 'other-context') {
                // Get the value from the input field
                const otherInput = document.querySelector(`.option-card[data-value="other-context"] input`).value.trim();
                if (otherInput) {
                    researchPlan.question.context = 'other:' + otherInput;
                } else {
                    researchPlan.question.context = 'other';
                }
            } else {
                researchPlan.question.context = value;
            }
            break;
        case 'knowledge-gap':
            researchPlan.question.gap = value;
            // Update example questions when gap is selected
            updateExampleQuestions();
            break;
        case 'ontology-question':
            researchPlan.philosophy.ontology = value;
            document.getElementById('ontology-result').textContent = getOntologyLabel(value);
            updateParadigm();
            break;
        case 'epistemology-question':
            researchPlan.philosophy.epistemology = value;
            document.getElementById('epistemology-result').textContent = getEpistemologyLabel(value);
            updateParadigm();
            break;
    }
}

function storeRadioSelection(containerId, value) {
    switch(containerId) {
        case 'qualitative-sampling':
        case 'quantitative-sampling':
            researchPlan.methods.sampling = value;
            updateSamplingSummary(value);
            break;
        case 'qualitative-analysis':
        case 'quantitative-analysis':
            researchPlan.methods.analysis = value;
            updateAnalysisSummary(value);
            break;
        case 'post-positivist-methodologies':
        case 'constructivist-methodologies':
        case 'critical-methodologies':
            researchPlan.methodology.approach = value;
            updateMethodologyResult(value);
            break;
    }
}

function updateMultiSelection(containerId) {
    if (containerId === 'qualitative-methods' || containerId === 'quantitative-methods') {
        // Get all selected data collection methods
        const methods = [];
        document.querySelectorAll('#qualitative-methods .option-card.selected, #quantitative-methods .option-card.selected').forEach(option => {
            methods.push(option.dataset.value);
        });
        
        researchPlan.methods.dataCollection = methods;
        updateDataCollectionSummary(methods);
    }
}

function updateChecklist(checklistGroup) {
    const selected = [];
    document.querySelectorAll(`input[name="${checklistGroup}"]:checked`).forEach(checkbox => {
        selected.push(checkbox.value);
    });
    
    if (checklistGroup === 'ethics') {
        researchPlan.practical.ethics = selected;
    } else if (checklistGroup === 'qual-rigour' || checklistGroup === 'quant-rigour') {
        researchPlan.practical.rigour = selected;
    }
}

// RESEARCH QUESTION BUILDER
function setupResearchQuestionBuilder() {
    // Set up example question click handlers
    document.getElementById('example-questions').addEventListener('click', function(e) {
        if (e.target.classList.contains('example-question')) {
            document.getElementById('research-question').value = e.target.textContent;
            researchPlan.question.researchQuestion = e.target.textContent;
        }
    });
}

function updateExampleQuestions() {
    const interest = researchPlan.question.interest;
    const aim = researchPlan.question.aim;
    const context = researchPlan.question.context;
    
    if (!interest || !aim || !context) {
        return;
    }
    
    const exampleQuestionsContainer = document.getElementById('example-questions');
    exampleQuestionsContainer.innerHTML = '';
    
    // Generate example questions based on selections
    const questions = generateExampleQuestions(interest, aim, context);
    
    questions.forEach(question => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('example-question');
        questionElement.textContent = question;
        exampleQuestionsContainer.appendChild(questionElement);
    });
}

function generateExampleQuestions(interest, aim, context) {
    const contextLabel = getContextLabel(context);
    const questions = [];
    
    // Examples based on interest and aim
    if (interest === 'experiences') {
        if (aim === 'describing') {
            questions.push(`How do ${contextLabel} students experience the transition to clinical training?`);
            questions.push(`What are the experiences of ${contextLabel} educators when implementing feedback practices?`);
        } else if (aim === 'explaining') {
            questions.push(`Why do ${contextLabel} students respond differently to high-stakes assessment experiences?`);
            questions.push(`How do ${contextLabel} learners make sense of challenging patient encounters?`);
        }
    } else if (interest === 'processes') {
        if (aim === 'explaining') {
            questions.push(`How do social dynamics influence team functioning in ${contextLabel} settings?`);
            questions.push(`What factors shape professional identity formation among ${contextLabel} trainees?`);
        } else if (aim === 'predicting') {
            questions.push(`How do early clinical experiences influence subsequent learning trajectories in ${contextLabel} education?`);
        }
    } else if (interest === 'effectiveness') {
        if (aim === 'evaluating') {
            questions.push(`How effective is simulation-based training compared to traditional methods for teaching procedural skills in ${contextLabel} settings?`);
            questions.push(`What is the impact of peer teaching on knowledge retention and satisfaction in ${contextLabel} education?`);
        } else if (aim === 'predicting') {
            questions.push(`What factors predict successful implementation of flipped classroom approaches in ${contextLabel} contexts?`);
        }
    } else if (interest === 'assessment') {
        if (aim === 'evaluating') {
            questions.push(`What is the reliability and validity of this OSCE scoring tool for assessing clinical competence in ${contextLabel} settings?`);
        } else if (aim === 'developing') {
            questions.push(`How can workplace-based assessment tools be improved to better capture competency development in ${contextLabel} training?`);
        }
    } else if (interest === 'patterns') {
        if (aim === 'describing') {
            questions.push(`What patterns of engagement are observed in online learning environments in ${contextLabel} education?`);
        } else if (aim === 'explaining') {
            questions.push(`How do duty hour reforms affect resident wellbeing and patient outcomes in ${contextLabel} settings?`);
        }
    }
    
    // If we don't have at least 2 questions, add some generic ones
    if (questions.length < 2) {
        questions.push(`How can ${aim} approaches be used to understand ${interest} in ${contextLabel} education?`);
        questions.push(`What are the most effective methods for ${aim} ${interest} in ${contextLabel} education?`);
    }
    
    return questions;
}

function getContextLabel(context) {
    switch(context) {
        case 'undergraduate':
            return 'undergraduate medical';
        case 'postgraduate':
            return 'postgraduate medical';
        case 'cpd':
            return 'continuing professional development';
        case 'interprofessional':
            return 'interprofessional';
        case 'clinical':
            return 'clinical';
        default:
            if (context && context.startsWith('other:')) {
                return context.substring(6);
            }
            return 'medical';
    }
}

// PARADIGM DETECTION
function setupParadigmDetection() {
    // Initial paradigm status
    updateParadigm();
}

function updateParadigm() {
    const ontology = researchPlan.philosophy.ontology;
    const epistemology = researchPlan.philosophy.epistemology;
    
    if (!ontology || !epistemology) {
        return;
    }
    
    let paradigm = '';
    let paradigmDescription = '';
    let paradigmExample = '';
    
    // Determine paradigm based on ontology and epistemology
    if ((ontology === 'realism' || ontology === 'critical-realism') && 
        (epistemology === 'objectivism' || epistemology === 'post-positivism')) {
        paradigm = 'Post-positivism';
        paradigmDescription = 'Post-positivism assumes an objective reality exists but acknowledges that it can only be understood imperfectly. This approach emphasizes systematic observation, measurement, and the testing of theoretical frameworks while recognizing that all observation is fallible and theories are revisable.';
        paradigmExample = 'O\'Cathain, A., et al. (2002). Use of evidence-based leaflets to promote informed choice in maternity care: randomised controlled trial in everyday practice. BMJ, 324(7338), 643-646.';
    } else if (ontology === 'relativism' && epistemology === 'constructivism') {
        paradigm = 'Constructivism';
        paradigmDescription = 'Constructivism assumes that reality is constructed through human interactions and varies across individuals and contexts. Knowledge is co-created between researcher and participants, with an emphasis on understanding multiple perspectives and subjective meanings.';
        paradigmExample = 'Lingard, L., et al. (2002). Forming professional identities on the health care team: discursive constructions of the \'other\' in the operating room. Medical Education, 36(8), 728-734.';
    } else if (ontology === 'historical-realism' && epistemology === 'critical') {
        paradigm = 'Critical Inquiry';
        paradigmDescription = 'Critical Inquiry assumes that reality is shaped by social, political, and cultural forces that create power structures. Knowledge is transactional and value-mediated, with research aimed at challenging existing structures and promoting change.';
        paradigmExample = 'Albert, M. (2004). Understanding the debate on medical education research: A sociological perspective. Academic Medicine, 79(10), 948-954.';
    } else {
        // Mixed or unclear paradigm
        if (ontology === 'relativism' || epistemology === 'constructivism') {
            paradigm = 'Constructivist-leaning';
            paradigmDescription = 'Your selections suggest a constructivist-leaning approach that recognizes multiple realities constructed through human experience and interaction.';
            paradigmExample = 'Bearman, M. (2003). Is virtual the same as real? Medical students\' experiences of a virtual patient. Academic Medicine, 78(5), 538-545.';
        } else if (ontology === 'historical-realism' || epistemology === 'critical') {
            paradigm = 'Critical-leaning';
            paradigmDescription = 'Your selections suggest a critical-leaning approach focused on examining power relations and social structures.';
            paradigmExample = 'Mowat, H., & Mowat, D. (2001). The value of marginality in a medical school: general practice and curriculum change. Medical Education, 35(2), 175-177.';
        } else {
            paradigm = 'Post-positivist-leaning';
            paradigmDescription = 'Your selections suggest a post-positivist-leaning approach that emphasizes systematic observation while acknowledging some researcher influence.';
            paradigmExample = 'Levinson, A.J., et al. (2007). Virtual reality and brain anatomy: a randomised trial of e-learning instructional designs. Medical Education, 41(5), 495-501.';
        }
    }
    
    // Update the UI
    document.getElementById('paradigm-name').textContent = paradigm;
    document.getElementById('paradigm-description').textContent = paradigmDescription;
    document.getElementById('paradigm-example').textContent = paradigmExample;
    
    // Store in research plan
    researchPlan.philosophy.paradigm = paradigm;
}

function getOntologyLabel(ontology) {
    switch(ontology) {
        case 'realism':
            return 'Realism - A single objective reality exists';
        case 'critical-realism':
            return 'Critical Realism - Reality exists but can only be imperfectly understood';
        case 'relativism':
            return 'Relativism - Reality is constructed through human interactions';
        case 'historical-realism':
            return 'Historical Realism - Reality is shaped by social, political, and cultural forces';
        default:
            return ontology;
    }
}

function getEpistemologyLabel(epistemology) {
    switch(epistemology) {
        case 'objectivism':
            return 'Objectivism - Knowledge is gained through objective measurement';
        case 'post-positivism':
            return 'Post-positivism - Knowledge is gained through systematic observation';
        case 'constructivism':
            return 'Constructivism - Knowledge is co-constructed between researcher and participants';
        case 'critical':
            return 'Critical/Transformative - Knowledge is gained through examining power structures';
        default:
            return epistemology;
    }
}

// METHODOLOGY SECTION
function setupMethodologySection() {
    // Initial setup
    hideAllMethodologyGroups();
}

function showMethodologyGroup() {
    // Hide all methodology groups first
    hideAllMethodologyGroups();
    
    // Show the appropriate methodology group based on the paradigm
    const paradigm = researchPlan.philosophy.paradigm;
    
    if (paradigm.includes('Post-positivist')) {
        document.getElementById('post-positivist-methodologies').classList.add('active');
    } else if (paradigm.includes('Constructivist')) {
        document.getElementById('constructivist-methodologies').classList.add('active');
    } else if (paradigm.includes('Critical')) {
        document.getElementById('critical-methodologies').classList.add('active');
    } else {
        // If paradigm is unclear, show all methodology groups
        document.getElementById('post-positivist-methodologies').classList.add('active');
        document.getElementById('constructivist-methodologies').classList.add('active');
        document.getElementById('critical-methodologies').classList.add('active');
    }
}

function hideAllMethodologyGroups() {
    document.querySelectorAll('.methodology-group').forEach(group => {
        group.classList.remove('active');
    });
}

function updateMethodologyResult(methodology) {
    const methodologyName = getMethodologyName(methodology);
    const methodologyDescription = getMethodologyDescription(methodology);
    const methodologyExample = getMethodologyExample(methodology);
    const methodologyIcon = getMethodologyIcon(methodology);
    
    document.getElementById('methodology-name').textContent = methodologyName;
    document.getElementById('methodology-description').textContent = methodologyDescription;
    document.getElementById('methodology-example').textContent = methodologyExample;
    document.getElementById('methodology-icon').innerHTML = `<i class="fas ${methodologyIcon}"></i>`;
    
    // Store in research plan
    researchPlan.methodology.approach = methodologyName;
    researchPlan.methodology.description = methodologyDescription;
    researchPlan.methodology.example = methodologyExample;
}

function getMethodologyName(methodology) {
    switch(methodology) {
        // Post-positivist methodologies
        case 'experimental':
            return 'Experimental';
        case 'correlational':
            return 'Correlational';
        case 'psychometric':
            return 'Psychometric';
        case 'epidemiological':
            return 'Epidemiological';
            
        // Constructivist methodologies
        case 'ethnography':
            return 'Ethnography';
        case 'grounded-theory':
            return 'Grounded Theory';
        case 'case-study':
            return 'Case Study';
        case 'phenomenology':
            return 'Phenomenology';
        case 'narrative':
            return 'Narrative Inquiry';
        case 'discourse':
            return 'Discourse Analysis';
            
        // Critical methodologies
        case 'action':
            return 'Action Research';
        case 'critical-discourse':
            return 'Critical Discourse Analysis';
        case 'institutional':
            return 'Institutional Ethnography';
        case 'participatory':
            return 'Participatory Research';
            
        default:
            return methodology;
    }
}

function getMethodologyDescription(methodology) {
    switch(methodology) {
        // Post-positivist methodologies
        case 'experimental':
            return 'Tests causal relationships through manipulation of variables, comparison groups, and controlled conditions. Appropriate for testing effectiveness or comparing educational approaches.';
        case 'correlational':
            return 'Examines relationships between variables without manipulation. Useful for identifying associations between educational factors and outcomes.';
        case 'psychometric':
            return 'Focuses on development and validation of measurement tools, assessment of reliability and validity. Ideal for developing or validating assessment instruments.';
        case 'epidemiological':
            return 'Examines patterns, associations, and risk factors in populations, often using existing data. Useful for understanding trends and factors in educational outcomes.';
            
        // Constructivist methodologies
        case 'ethnography':
            return 'Immersive field study of cultural groups, using participant observation and cultural interpretation. Appropriate for understanding educational cultures and contexts.';
        case 'grounded-theory':
            return 'Theory development from data through an iterative process, theoretical sampling, and constant comparison. Useful for developing explanatory frameworks for social processes.';
        case 'case-study':
            return 'In-depth exploration of a bounded system (person, program, event) using multiple data sources. Appropriate for detailed study of specific educational contexts or interventions.';
        case 'phenomenology':
            return 'Explores lived experiences of a phenomenon to understand the essence of shared experience. Useful for understanding how participants experience educational events or processes.';
        case 'narrative':
            return 'Collection and analysis of stories with focus on meaning-making and temporal dimension. Appropriate for understanding individual experiences and identity formation.';
        case 'discourse':
            return 'Analysis of language use and effects, focusing on how language constructs social realities. Useful for examining communication patterns in educational settings.';
            
        // Critical methodologies
        case 'action':
            return 'Cycles of planning, action, observation and reflection aimed at changing practice. Appropriate for collaborative improvement of educational practices.';
        case 'critical-discourse':
            return 'Examination of how language reinforces power structures and ideologies. Useful for analyzing how educational discourses perpetuate or challenge inequality.';
        case 'institutional':
            return "Mapping of institutional processes and their effects on people's experiences. Appropriate for understanding how organizational structures shape educational experiences.";
        case 'participatory':
            return 'Collaborative research involving participants as co-researchers in addressing issues. Useful for empowering communities to address educational challenges.';
            
        default:
            return 'A systematic approach to investigating your research question.';
    }
}

function getMethodologyExample(methodology) {
    switch(methodology) {
        // Post-positivist methodologies
        case 'experimental':
            return 'Levinson, A.J., et al. (2007). Virtual reality and brain anatomy: a randomised trial of e-learning instructional designs. Medical Education, 41(5), 495-501.';
        case 'correlational':
            return 'Hojat, M., et al. (2007). Components of postgraduate competence: analyses of thirty years of longitudinal data. Medical Education, 41(10), 982-989.';
        case 'psychometric':
            return 'Eva, K.W., et al. (2004). An admissions OSCE: the multiple mini-interview. Medical Education, 38(3), 314-326.';
        case 'epidemiological':
            return 'Papadakis, M.A., et al. (2005). Disciplinary action by medical boards and prior behavior in medical school. New England Journal of Medicine, 353(25), 2673-2682.';
            
        // Constructivist methodologies
        case 'ethnography':
            return 'Becker, H.S., et al. (1961). Boys in White: Student Culture in Medical School. University of Chicago Press.';
        case 'grounded-theory':
            return 'Watling, C., et al. (2012). Learning from clinical work: the roles of learning cues and credibility judgements. Medical Education, 46(2), 192-200.';
        case 'case-study':
            return 'Perley, C.M. (2006). Physician use of the curbside consultation to address information needs: report on a collective case study. Journal of the Medical Library Association, 94(2), 137-144.';
        case 'phenomenology':
            return 'Bearman, M. (2003). Is virtual the same as real? Medical students\' experiences of a virtual patient. Academic Medicine, 78(5), 538-545.';
        case 'narrative':
            return 'Bennett, D., et al. (2017). Possibility and agency in Figured Worlds: becoming a \'good doctor\'. Medical Education, 51(3), 248-257.';
        case 'discourse':
            return 'Hekelman, F.P., et al. (1996). Discourse analysis of peer coaching in medical education: a case study. Teaching and Learning in Medicine, 8(1), 41-47.';
            
        // Critical methodologies
        case 'action':
            return 'Mowat, H., & Mowat, D. (2001). The value of marginality in a medical school: general practice and curriculum change. Medical Education, 35(2), 175-177.';
        case 'critical-discourse':
            return 'Whitehead, C. (2013). Scientist or science-stuffed? Discourses of science in North American medical education. Medical Education, 47(1), 26-32.';
        case 'institutional':
            return 'Kitto, S., et al. (2009). Quality and safety in medical education: a case of "do as I say, not as I do". Teaching and Learning in Medicine, 21(4), 314-319.';
        case 'participatory':
            return 'Wallerstein, N., & Duran, B. (2010). Community-based participatory research contributions to intervention research: the intersection of science and practice to improve health equity. American Journal of Public Health, 100(S1), S40-S46.';
            
        default:
            return 'Example paper to be selected based on your specific research interests.';
    }
}

function getMethodologyIcon(methodology) {
    switch(methodology) {
        // Post-positivist methodologies
        case 'experimental':
            return 'fa-flask';
        case 'correlational':
            return 'fa-chart-line';
        case 'psychometric':
            return 'fa-clipboard-check';
        case 'epidemiological':
            return 'fa-chart-pie';
            
        // Constructivist methodologies
        case 'ethnography':
            return 'fa-glasses';
        case 'grounded-theory':
            return 'fa-sitemap';
        case 'case-study':
            return 'fa-search-plus';
        case 'phenomenology':
            return 'fa-brain';
        case 'narrative':
            return 'fa-book-open';
        case 'discourse':
            return 'fa-comments';
            
        // Critical methodologies
        case 'action':
            return 'fa-sync-alt';
        case 'critical-discourse':
            return 'fa-bullhorn';
        case 'institutional':
            return 'fa-university';
        case 'participatory':
            return 'fa-hands-helping';
            
        default:
            return 'fa-compass';
    }
}

// METHODS SECTION
function setupMethodsSection() {
    // Initial setup
    hideAllMethodsGroups();
}

function showMethodsGroups() {
    // Hide all methods groups first
    hideAllMethodsGroups();
    
    // Show appropriate methods groups based on the methodology
    const paradigm = researchPlan.philosophy.paradigm;
    
    if (paradigm.includes('Post-positivist')) {
        document.getElementById('quantitative-methods').style.display = 'block';
        document.getElementById('quantitative-sampling').style.display = 'block';
        document.getElementById('quantitative-analysis').style.display = 'block';
    } else {
        document.getElementById('qualitative-methods').style.display = 'block';
        document.getElementById('qualitative-sampling').style.display = 'block';
        document.getElementById('qualitative-analysis').style.display = 'block';
    }
    
    // If it's mixed or unclear, show both
    if (!paradigm.includes('Post-positivist') && !paradigm.includes('Constructivist') && !paradigm.includes('Critical')) {
        document.getElementById('quantitative-methods').style.display = 'block';
        document.getElementById('quantitative-sampling').style.display = 'block';
        document.getElementById('quantitative-analysis').style.display = 'block';
        document.getElementById('qualitative-methods').style.display = 'block';
        document.getElementById('qualitative-sampling').style.display = 'block';
        document.getElementById('qualitative-analysis').style.display = 'block';
    }

    // Setup rigour sections
    if (paradigm.includes('Post-positivist')) {
        document.getElementById('quantitative-rigour').style.display = 'block';
        document.getElementById('qualitative-rigour').style.display = 'none';
    } else {
        document.getElementById('qualitative-rigour').style.display = 'block';
        document.getElementById('quantitative-rigour').style.display = 'none';
    }
    
    // If it's mixed or unclear, show both
    if (!paradigm.includes('Post-positivist') && !paradigm.includes('Constructivist') && !paradigm.includes('Critical')) {
        document.getElementById('quantitative-rigour').style.display = 'block';
        document.getElementById('qualitative-rigour').style.display = 'block';
    }
}

function hideAllMethodsGroups() {
    document.getElementById('qualitative-methods').style.display = 'none';
    document.getElementById('quantitative-methods').style.display = 'none';
    document.getElementById('qualitative-sampling').style.display = 'none';
    document.getElementById('quantitative-sampling').style.display = 'none';
    document.getElementById('qualitative-analysis').style.display = 'none';
    document.getElementById('quantitative-analysis').style.display = 'none';
}

function updateDataCollectionSummary(methods) {
    const summaryContainer = document.getElementById('data-collection-summary');
    summaryContainer.innerHTML = '';
    
    if (methods.length === 0) {
        summaryContainer.innerHTML = '<li>No methods selected</li>';
        return;
    }
    
    methods.forEach(method => {
        const methodName = getMethodName(method);
        const li = document.createElement('li');
        li.textContent = methodName;
        summaryContainer.appendChild(li);
    });
}

function updateSamplingSummary(sampling) {
    const summaryElement = document.getElementById('sampling-summary');
    summaryElement.textContent = getSamplingName(sampling);
}

function updateAnalysisSummary(analysis) {
    const summaryElement = document.getElementById('analysis-summary');
    summaryElement.textContent = getAnalysisName(analysis);
}

function getMethodName(method) {
    switch(method) {
        // Qualitative methods
        case 'interviews':
            return 'Interviews';
        case 'focus-groups':
            return 'Focus Groups';
        case 'observations':
            return 'Observations';
        case 'documents':
            return 'Document Analysis';
        case 'visual':
            return 'Visual Methods';
            
        // Quantitative methods
        case 'surveys':
            return 'Surveys/Questionnaires';
        case 'structured-observations':
            return 'Structured Observations';
        case 'secondary-data':
            return 'Secondary Data Analysis';
        case 'experimental':
            return 'Experimental Measurements';
            
        default:
            return method;
    }
}

function getSamplingName(sampling) {
    switch(sampling) {
        // Qualitative sampling
        case 'purposive':
            return 'Purposive Sampling - Selecting cases that will provide rich information';
        case 'theoretical':
            return 'Theoretical Sampling - Selecting cases based on emerging theory';
        case 'maximum-variation':
            return 'Maximum Variation Sampling - Deliberately selecting diverse cases';
        case 'snowball':
            return 'Snowball Sampling - Participants refer other participants';
        case 'convenience':
            return 'Convenience Sampling - Selecting easily accessible cases';
            
        // Quantitative sampling
        case 'random':
            return 'Random Sampling - Every member of population has equal chance of selection';
        case 'stratified':
            return 'Stratified Sampling - Random selection within defined groups';
        case 'cluster':
            return 'Cluster Sampling - Randomly selecting groups rather than individuals';
        case 'consecutive':
            return 'Consecutive Sampling - Including all accessible subjects over a time period';
        case 'total':
            return 'Total Population - Studying the entire available population';
            
        default:
            return 'Not yet selected';
    }
}

function getAnalysisName(analysis) {
    switch(analysis) {
        // Qualitative analysis
        case 'thematic':
            return 'Thematic Analysis - Identifying patterns and themes across the dataset';
        case 'constant-comparative':
            return 'Constant Comparative Analysis - Iterative coding for theory development';
        case 'phenomenological':
            return 'Phenomenological Analysis - Understanding the lived experience and its meaning';
        case 'discourse-analysis':
            return 'Discourse Analysis - Examining language use, context, and power relations';
        case 'narrative-analysis':
            return 'Narrative Analysis - Analyzing stories and how they construct meaning';
            
        // Quantitative analysis
        case 'descriptive':
            return 'Descriptive Statistics - Summarizing and describing data characteristics';
        case 'inferential':
            return 'Inferential Statistics - Testing hypotheses and making inferences about populations';
        case 'correlational':
            return 'Correlation and Regression - Examining relationships between variables';
        case 'factor':
            return 'Factor Analysis - Identifying underlying dimensions in the data';
        case 'meta-analysis':
            return 'Meta-analysis - Statistical combination of results from multiple studies';
            
        default:
            return 'Not yet selected';
    }
}

// PRACTICAL PLANNING
function setupPracticalPlanning() {
    // Set up timeline calculation
    document.querySelectorAll('.phase-duration select').forEach(select => {
        select.addEventListener('change', updateTotalDuration);
    });
    
    // Initial total duration calculation
    updateTotalDuration();
}

function updateTotalDuration() {
    const ethicsDuration = parseInt(document.getElementById('ethics-duration').value);
    const recruitmentDuration = parseInt(document.getElementById('recruitment-duration').value);
    const collectionDuration = parseInt(document.getElementById('collection-duration').value);
    const analysisDuration = parseInt(document.getElementById('analysis-duration').value);
    const writingDuration = parseInt(document.getElementById('writing-duration').value);
    
    // Simplified calculation (not accounting for overlap)
    const totalDuration = ethicsDuration + recruitmentDuration + collectionDuration + analysisDuration + writingDuration;
    
    document.getElementById('total-duration').textContent = `${totalDuration} months`;
    
    // Store in research plan
    researchPlan.practical.timeline = `Approximately ${totalDuration} months (Ethics: ${ethicsDuration}m, Recruitment: ${recruitmentDuration}m, Data Collection: ${collectionDuration}m, Analysis: ${analysisDuration}m, Writing: ${writingDuration}m)`;
}

// FINAL PLAN
function setupFinalPlan() {
    // Set up download button
    document.getElementById('download-pdf').addEventListener('click', function() {
        const element = document.getElementById('research-plan');
        const opt = {
            margin: 10,
            filename: 'Medical_Education_Research_Plan.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Generate PDF
        html2pdf().set(opt).from(element).save();
    });
    
    // Set up print button
    document.getElementById('print-plan').addEventListener('click', function() {
        window.print();
    });
}

function generateFinalPlan() {
    // Populate final research plan with stored data
    
    // Research Question section
    document.getElementById('final-question').textContent = researchPlan.question.researchQuestion;
    document.getElementById('final-interest').textContent = getInterestLabel(researchPlan.question.interest);
    document.getElementById('final-aim').textContent = getAimLabel(researchPlan.question.aim);
    document.getElementById('final-context').textContent = getFullContextLabel(researchPlan.question.context);
    document.getElementById('final-gap').textContent = getGapLabel(researchPlan.question.gap);
    
    // Philosophical Foundations section
    document.getElementById('final-paradigm').textContent = researchPlan.philosophy.paradigm;
    document.getElementById('final-ontology').textContent = getOntologyLabel(researchPlan.philosophy.ontology);
    document.getElementById('final-epistemology').textContent = getEpistemologyLabel(researchPlan.philosophy.epistemology);
    
    // Methodology section
    document.getElementById('final-methodology').textContent = researchPlan.methodology.approach;
    document.getElementById('final-methodology-description').textContent = researchPlan.methodology.description;
    document.getElementById('final-methodology-example').textContent = researchPlan.methodology.example;
    
    // Methods section
    const dataCollectionList = document.getElementById('final-data-collection');
    dataCollectionList.innerHTML = '';
    researchPlan.methods.dataCollection.forEach(method => {
        const li = document.createElement('li');
        li.textContent = getMethodName(method);
        dataCollectionList.appendChild(li);
    });
    
    document.getElementById('final-sampling').textContent = getSamplingName(researchPlan.methods.sampling);
    document.getElementById('final-analysis').textContent = getAnalysisName(researchPlan.methods.analysis);
    
    // Practical Considerations section
    const ethicsList = document.getElementById('final-ethics');
    ethicsList.innerHTML = '';
    researchPlan.practical.ethics.forEach(ethic => {
        const li = document.createElement('li');
        li.textContent = getEthicsLabel(ethic);
        ethicsList.appendChild(li);
    });
    
    const rigourList = document.getElementById('final-rigour');
    rigourList.innerHTML = '';
    researchPlan.practical.rigour.forEach(rigour => {
        const li = document.createElement('li');
        li.textContent = getRigourLabel(rigour);
        rigourList.appendChild(li);
    });
    
    document.getElementById('final-timeline').textContent = researchPlan.practical.timeline;
    
    // Generate visual flowchart
    generateVisualFlowchart();
    
    // Generate recommended readings
    generateRecommendedReadings();
}

function getInterestLabel(interest) {
    switch(interest) {
        case 'experiences':
            return 'Understanding experiences or perspectives';
        case 'processes':
            return 'Exploring social processes or relationships';
        case 'effectiveness':
            return 'Testing effectiveness or comparing approaches';
        case 'assessment':
            return 'Developing or validating assessment tools';
        case 'patterns':
            return 'Examining patterns or associations';
        default:
            return interest;
    }
}

function getAimLabel(aim) {
    switch(aim) {
        case 'describing':
            return 'Describing what is happening';
        case 'explaining':
            return 'Explaining why or how it happens';
        case 'evaluating':
            return 'Evaluating how well something works';
        case 'predicting':
            return 'Predicting what might happen if';
        case 'changing':
            return 'Changing how to improve something';
        default:
            return aim;
    }
}

function getFullContextLabel(context) {
    switch(context) {
        case 'undergraduate':
            return 'Undergraduate medical education';
        case 'postgraduate':
            return 'Postgraduate medical education/residency';
        case 'cpd':
            return 'Continuing professional development';
        case 'interprofessional':
            return 'Interprofessional education';
        case 'clinical':
            return 'Clinical teaching environments';
        default:
            if (context && context.startsWith('other:')) {
                return context.substring(6) + ' (other context)';
            }
            return context || 'Not specified';
    }
}

function getGapLabel(gap) {
    switch(gap) {
        case 'limited':
            return 'Limited research exists on this topic';
        case 'theoretical':
            return 'Existing research lacks theoretical framework';
        case 'contradictory':
            return 'Contradictory findings exist';
        case 'contextual':
            return 'Existing research lacks contextual relevance';
        case 'poorly-understood':
            return 'The phenomenon is recognized but poorly understood';
        default:
            return gap;
    }
}

function getEthicsLabel(ethic) {
    switch(ethic) {
        case 'informed-consent':
            return 'Informed consent procedures';
        case 'confidentiality':
            return 'Confidentiality and anonymity measures';
        case 'power-dynamics':
            return 'Power dynamics and relationships with participants';
        case 'benefits-harms':
            return 'Potential benefits and harms assessment';
        case 'review':
            return 'Institutional review board/ethics approval';
        default:
            return ethic;
    }
}

function getRigourLabel(rigour) {
    switch(rigour) {
        // Qualitative rigour
        case 'reflexivity':
            return 'Reflexivity (researcher positioning)';
        case 'triangulation':
            return 'Triangulation (multiple data sources)';
        case 'member-checking':
            return 'Member checking (participant verification)';
        case 'audit-trail':
            return 'Audit trail (documentation of decisions)';
        case 'thick-description':
            return 'Thick description (rich contextual detail)';
            
        // Quantitative rigour
        case 'internal-validity':
            return 'Internal validity (accurate causal inferences)';
        case 'external-validity':
            return 'External validity (generalizability)';
        case 'reliability':
            return 'Reliability (consistency and reproducibility)';
        case 'objectivity':
            return 'Objectivity (minimizing bias)';
        case 'power-analysis':
            return 'Statistical power (adequate sample size)';
            
        default:
            return rigour;
    }
}

function generateVisualFlowchart() {
    const flowchartContainer = document.getElementById('visual-flowchart');
    
    // Create SVG flowchart
    const svg = `
    <svg width="100%" height="300" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
        <!-- Question Node -->
        <rect x="50" y="120" width="120" height="60" rx="10" fill="#2a70b8" stroke="#1a5ba0" stroke-width="2"/>
        <text x="110" y="155" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Research Question</text>
        
        <!-- Arrow to Paradigm -->
        <path d="M170 150 L270 150" stroke="#666" stroke-width="2" stroke-dasharray="5,5"/>
        <polygon points="270,150 260,145 260,155" fill="#666"/>
        
        <!-- Paradigm Node -->
        <rect x="270" y="120" width="120" height="60" rx="10" fill="#4FA673" stroke="#3D8A5F" stroke-width="2"/>
        <text x="330" y="155" font-family="Arial" font-size="14" fill="white" text-anchor="middle">${researchPlan.philosophy.paradigm}</text>
        
        <!-- Arrow to Methodology -->
        <path d="M390 150 L490 150" stroke="#666" stroke-width="2" stroke-dasharray="5,5"/>
        <polygon points="490,150 480,145 480,155" fill="#666"/>
        
        <!-- Methodology Node -->
        <rect x="490" y="120" width="120" height="60" rx="10" fill="#E09456" stroke="#C67D48" stroke-width="2"/>
        <text x="550" y="155" font-family="Arial" font-size="14" fill="white" text-anchor="middle">${researchPlan.methodology.approach}</text>
        
        <!-- Methods Nodes -->
        <rect x="340" y="220" width="120" height="60" rx="10" fill="#B56DB4" stroke="#964B95" stroke-width="2"/>
        <text x="400" y="245" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Data Collection</text>
        <text x="400" y="265" font-family="Arial" font-size="10" fill="white" text-anchor="middle">Multiple Methods</text>
        
        <!-- Arrows from Methodology to Methods -->
        <path d="M550 180 L400 220" stroke="#666" stroke-width="2"/>
        <polygon points="400,220 408,215 405,225" fill="#666"/>
    </svg>
    `;
    
    flowchartContainer.innerHTML = svg;
}

function generateRecommendedReadings() {
    const readingsContainer = document.getElementById('recommended-readings');
    readingsContainer.innerHTML = '';
    
    // Generate recommended readings based on selected methodology
    const methodology = researchPlan.methodology.approach;
    const paradigm = researchPlan.philosophy.paradigm;
    
    // General methodology readings
    const methodologyReading = {
        title: `${methodology} in Medical Education Research`,
        citation: researchPlan.methodology.example
    };
    
    // Paradigm readings
    const paradigmReading = {
        title: `Understanding ${paradigm} Research`,
        citation: document.getElementById('paradigm-example').textContent
    };
    
    // Method-specific readings
    const methodReadings = generateMethodReadings();
    
    // Add readings to container
    const readingsList = document.createElement('ul');
    
    // Add methodology reading
    const methodologyItem = document.createElement('li');
    methodologyItem.innerHTML = `<strong>${methodologyReading.title}:</strong> ${methodologyReading.citation}`;
    readingsList.appendChild(methodologyItem);
    
    // Add paradigm reading
    const paradigmItem = document.createElement('li');
    paradigmItem.innerHTML = `<strong>${paradigmReading.title}:</strong> ${paradigmReading.citation}`;
    readingsList.appendChild(paradigmItem);
    
    // Add method readings
    methodReadings.forEach(reading => {
        const methodItem = document.createElement('li');
        methodItem.innerHTML = `<strong>${reading.title}:</strong> ${reading.citation}`;
        readingsList.appendChild(methodItem);
    });
    
    readingsContainer.appendChild(readingsList);
}

function generateMethodReadings() {
    const readings = [];
    const methods = researchPlan.methods.dataCollection;
    
    // Add readings based on selected methods
    if (methods.includes('interviews')) {
        readings.push({
            title: 'Qualitative Interviewing in Medical Education',
            citation: 'DiCicco-Bloom, B., & Crabtree, B. F. (2006). The qualitative research interview. Medical Education, 40(4), 314-321.'
        });
    }
    
    if (methods.includes('focus-groups')) {
        readings.push({
            title: 'Focus Groups in Medical Education Research',
            citation: 'Stalmeijer, R. E., McNaughton, N., & Van Mook, W. N. (2014). Using focus groups in medical education research: AMEE Guide No. 91. Medical Teacher, 36(11), 923-939.'
        });
    }
    
    if (methods.includes('surveys')) {
        readings.push({
            title: 'Survey Design for Medical Education',
            citation: 'Artino Jr, A. R., La Rochelle, J. S., Dezee, K. J., & Gehlbach, H. (2014). Developing questionnaires for educational research: AMEE Guide No. 87. Medical Teacher, 36(6), 463-474.'
        });
    }
    
    // Add general medical education research methods book
    readings.push({
        title: 'General Research Methods in Medical Education',
        citation: 'Cleland, J., & Durning, S. J. (2015). Researching Medical Education. John Wiley & Sons.'
    });
    
    return readings;
}

// MODAL FUNCTIONALITY
function setupModal() {
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close-modal');
    const aboutLink = document.getElementById('about-link');
    const contactLink = document.getElementById('contact-link');
    const modalBody = document.getElementById('modal-body');
    
    // Show About modal
    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        modalBody.innerHTML = `
            <h2>About Medical Education Research Planner</h2>
            <p>This interactive tool was developed to guide medical education researchers through the process of planning research projects. It helps align research questions with appropriate philosophical frameworks, methodologies, and methods.</p>
            <p>The tool draws on established frameworks in medical education research and aims to support researchers at all levels, from students to experienced faculty.</p>
            <h3>How to Use This Tool</h3>
            <p>Progress through each section, making selections that best align with your research interests and approach. At the end, you'll receive a comprehensive research plan that you can download and use as a foundation for your project.</p>
            <p>While this tool provides guidance, we recommend discussing your plan with colleagues and methodological experts to refine it further.</p>
            <h3>Acknowledgements</h3>
            <p>This tool was developed based on the work of numerous medical education research scholars and methodologists.</p>
        `;
        modal.classList.add('active');
    });
    
    // Show Contact modal
    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        modalBody.innerHTML = `
            <h2>Contact Us</h2>
            <p>For questions, feedback, or support regarding the Medical Education Research Planner, please contact:</p>
            <p><strong>Email:</strong> research-planner@mededresearch.org</p>
            <p><strong>Phone:</strong> (555) 123-4567</p>
            <p>We welcome suggestions for improving this tool and are interested in hearing about how it has supported your research planning process.</p>
        `;
        modal.classList.add('active');
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    // Close modal when clicking outside content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// RESET APP
function resetApp() {
    // Reset research plan object
    Object.keys(researchPlan).forEach(key => {
        if (typeof researchPlan[key] === 'object') {
            if (Array.isArray(researchPlan[key])) {
                researchPlan[key] = [];
            } else {
                Object.keys(researchPlan[key]).forEach(subKey => {
                    researchPlan[key][subKey] = '';
                });
            }
        } else {
            researchPlan[key] = '';
        }
    });
    
    // Reset all form inputs
    document.querySelectorAll('textarea, input[type="text"]').forEach(input => {
        input.value = '';
    });
    
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Remove selected class from all option cards
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Reset select elements to defaults
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });
    
    // Reset progress
    updateProgress('welcome-screen');
}