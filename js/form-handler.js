// Definição dos subtópicos
const subtopicos = {
    proposta: [
        { value: 'frontend', text: 'Desenvolvimento Frontend' },
        { value: 'backend', text: 'Desenvolvimento Backend' },
        { value: 'fullstack', text: 'Full-Stack' },
    ],
    colaboracao: [
        { value: 'projeto_pessoal', text: 'Projeto Pessoal' },
        { value: 'open_source', text: 'Projeto Open Source' },
    ],
    duvida: [
        { value: 'linguagem_especifica', text: 'Linguagem Específica' },
        { value: 'carreira', text: 'Carreira' },
    ],
};

// Gerenciamento de subtópicos dinâmicos
document.getElementById('assunto').addEventListener('change', function () {
    const assunto = this.value;
    const subtopicoContainer = document.getElementById('subtopicoContainer');
    const subtopicoSelect = document.getElementById('subtopico');

    subtopicoSelect.innerHTML = '';

    if (assunto && subtopicos[assunto]) {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecione um subtópico';
        subtopicoSelect.appendChild(defaultOption);

        subtopicos[assunto].forEach(sub => {
            const option = document.createElement('option');
            option.value = sub.value;
            option.textContent = sub.text;
            subtopicoSelect.appendChild(option);
        });

        subtopicoContainer.style.display = 'block';
        subtopicoSelect.required = true;
        subtopicoContainer.style.opacity = '1';
    } else {
        subtopicoContainer.style.display = 'none';
        subtopicoSelect.required = false;
        subtopicoSelect.value = '';
    }
});

// Contador de caracteres
document.getElementById('mensagem').addEventListener('input', function () {
    const charCount = document.getElementById('charCount');
    charCount.textContent = this.value.length;
});

// Validação visual simples
const form = document.getElementById('contactForm');
form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('blur', function () {
        this.classList.toggle('is-valid', this.checkValidity());
        this.classList.toggle('is-invalid', !this.checkValidity());
    });
});