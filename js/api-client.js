const TARGET_URL = 'https://api.mailersend.com/v1/email';
const MAILERSEND_API_URL = 'https://corsproxy.io/?url=' + encodeURIComponent(TARGET_URL);
const MAILERSEND_API_KEY = 'mlsn.9f6c795a2ec164a3480f6d8b1104f28afc8af4a7b47e74d5a52ff920ba7ed0fe'; 
const SENDER_EMAIL = 'MS_hPN9QH@test-p7kx4xwq1d8g9yjr.mlsender.net'; 

async function sendEmail(formData) {
    const emailData = {
        from: { email: SENDER_EMAIL, name: 'Portfólio - ' + formData.nome },
        to: [{ email: 'arthuzao26@gmail.com', name: 'Arthur Ferreira' }],
        subject: `Contato: ${formData.assunto}`,
        html: `<p><strong>Nome:</strong> ${formData.nome}</p>
               <p><strong>Email:</strong> ${formData.email}</p>
               <p><strong>Mensagem:</strong><br>${formData.mensagem}</p>`,
        text: `Nome: ${formData.nome}\nEmail: ${formData.email}\nMensagem: ${formData.mensagem}`
    };

    try {
        const response = await fetch(MAILERSEND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${MAILERSEND_API_KEY}`
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) throw new Error();

        return { success: true, message: 'Mensagem enviada com sucesso!' };
    } catch (error) {
        return { success: false, message: 'Não foi possível enviar a mensagem. Tente novamente.' };
    }
}

// Evento de submissão
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('loadingSpinner');
    
    submitBtn.disabled = true;
    spinner.classList.remove('d-none');

    const formData = {
        nome: document.getElementById('nome').value.trim(),
        email: document.getElementById('email').value.trim(),
        assunto: document.getElementById('assunto').value,
        mensagem: document.getElementById('mensagem').value.trim()
    };

    const result = await sendEmail(formData);
    
    showAlert(result.success ? 'success' : 'danger', result.message);

    if (result.success) {
        this.reset();
        this.classList.remove('was-validated');
        document.getElementById('subtopicoContainer').style.display = 'none';
        document.getElementById('charCount').textContent = '0';
    }

    submitBtn.disabled = false;
    spinner.classList.add('d-none');
});

function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    form.parentNode.insertBefore(alert, form);
    setTimeout(() => alert.remove(), 5000);
}