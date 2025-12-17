document.getElementById('assunto').addEventListener('change',
    function () {
        const assunto = this.value;
        const subtopicoContainer = document.getElementById('subtopicoContainer');
        const subtopicoSelect = document.getElementById('subtopico');

        // Limpar opções anteriores
        subtopicoSelect.innerHTML = '';

        if (assunto && subtopicos[assunto]) {
            // Adicionar opção padrão
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Selecione um subtópico';
            subtopicoSelect.appendChild(defaultOption);

            // Adicionar opções dinâmicas
            subtopicos[assunto].forEach(sub => {
                const option = document.createElement('option');
                option.value = sub.value;
                option.textContent = sub.text;
                subtopicoSelect.appendChild(option);
            });

            // Mostrar container e tornar obrigatório
            subtopicoContainer.style.display = 'block';
            subtopicoSelect.required = true;

            // Animação suave
            subtopicoContainer.style.opacity = '0';
            setTimeout(() => {
                subtopicoContainer.style.opacity = '1';
                subtopicoContainer.style.transition = 'opacity 0.3s ease';
            }, 10);
        } else {
            // Ocultar se não houver subtópicos
            subtopicoContainer.style.display = 'none';
            subtopicoSelect.required = false;
            subtopicoSelect.value = '';
        }
    });

// Atualizar contador de caracteres
document.getElementById('mensagem').addEventListener('input',
    function () {
        const charCount = document.getElementById('charCount');
        const currentLength = this.value.length;
        const maxLength = parseInt(this.getAttribute('maxlength'));

        charCount.textContent = currentLength;

        // Mudar cor conforme se aproxima do limite
        if (currentLength > maxLength * 0.9) {
            charCount.classList.add('text-danger');
            charCount.classList.remove('text-muted');
        } else if (currentLength > maxLength * 0.7) {
            charCount.classList.add('text-warning');
            charCount.classList.remove('text-muted', 'text-danger');
        } else {
            charCount.classList.remove('text-warning', 'text-danger');
            charCount.classList.add('text-muted');
        }
    });

// Validação em tempo real para todos os campos
const form = document.getElementById('contactForm');
const inputs = form.querySelectorAll('input, select, textarea');

inputs.forEach(input => {
    input.addEventListener('blur', function () {
        validateField(this);
    });

    input.addEventListener('input', function () {
        if (this.classList.contains('is-invalid')) {
            validateField(this);
        }
    });
});

function validateField(field) {
    // Remover classes anteriores
    field.classList.remove('is-valid', 'is-invalid');

    if (field.checkValidity()) {
        field.classList.add('is-valid');
    } else {
        field.classList.add('is-invalid');
    }
}

const MAILERSEND_API_URL = 'MS_hPN9QH@test-p7kx4xwq1d8g9yjr.mlsender.net';
const MAILERSEND_API_KEY = 'mlsn.7b777ee0e59a0702547a4502a4777a381ff4883e1076b63fc3e92b7f76e7b140'; // Substituir pela chave real

async function sendEmail(formData) {
    try {
        // Preparar dados para MailerSend
        const emailData = {
            from: {
                email: 'MS_hPN9QH@test-p7kx4xwq1d8g9yjr.mlsender.net', // Email verificado
                name: 'Portfólio - Curriculo ' + formData.nome
            },
            to: [
                {
                    email: 'arthuzao26@gmail.com', // Seu email
                    name: 'Arthur Ferreira '
                }
            ],
            subject: `Contato do Portfólio: ${formData.assunto}`,
            html: `
                <h2>Nova mensagem do portfólio</h2>
                <p><strong>Nome:</strong> ${formData.nome}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Assunto:</strong> ${formData.assunto}</p>
                ${formData.subtopico ? `<p><strong>Subtópico:</strong> ${formData.subtopico}</p>` : ''}
                <p><strong>Mensagem:</strong></p>
                <p>${formData.mensagem.replace(/\n/g, '<br>')}</p>
            `,
            text: `
Nova mensagem do portfólio

Nome: ${formData.nome}
Email: ${formData.email}
Assunto: ${formData.assunto}
${formData.subtopico ? `Subtópico: ${formData.subtopico}` : ''}

Mensagem:
${formData.mensagem}
            `
        };

        // Fazer requisição para MailerSend
        const response = await fetch(MAILERSEND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAILERSEND_API_KEY}`
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao enviar e-mail');
        }

        return {
            success: true,
            message: 'E-mail enviado com sucesso!'
        };

    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return {
            success: false,
            message: error.message || 'Erro ao enviar e-mail. Tente novamente.'
        };
    }
}

document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validar formulário
    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
    }

    // Desabilitar botão e mostrar loading
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('loadingSpinner');
    submitBtn.disabled = true;
    spinner.classList.remove('d-none');

    // Coletar dados do formulário
    const formData = {
        nome: document.getElementById('nome').value.trim(),
        email: document.getElementById('email').value.trim(),
        assunto: document.getElementById('assunto').value,
        subtopico: document.getElementById('subtopico').value || null,
        mensagem: document.getElementById('mensagem').value.trim()
    };

    try {
        // Enviar e-mail via API
        const result = await sendEmail(formData);

        if (result.success) {
            // Mostrar mensagem de sucesso
            showAlert('success', result.message);

            // Limpar formulário
            this.reset();
            this.classList.remove('was-validated');

            // Ocultar subtópico
            document.getElementById('subtopicoContainer').style.display = 'none';
        } else {
            // Mostrar mensagem de erro
            showAlert('danger', result.message);
        }
    } catch (error) {
        showAlert('danger', 'Erro inesperado. Tente novamente mais tarde.');
    } finally {
        // Reabilitar botão e ocultar loading
        submitBtn.disabled = false;
        spinner.classList.add('d-none');
    }
});

function showAlert(type, message) {
    // Criar e exibir alerta Bootstrap
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(alert, form);

    // Auto-remover após 5 segundos
    setTimeout(() => {
        alert.remove();
    }, 5000);
}