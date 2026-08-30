   <script>
    /**
     * Gerenciador do Estado da Aplicação (Configurações e Estado Global)
     */
    const AppState = {
        themeKey: 'delivery_theme',
        tokenKey: 'auth_token',
        sessionKey: 'user_session',

        init() {
            this.initTheme();
            this.initIcons();
            this.setupEventListeners();
        },

        // Inicializa o tema baseado no cache ou na preferência do sistema
        initTheme() {
            const savedTheme = localStorage.getItem(this.themeKey);
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const activeTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
            
            document.documentElement.setAttribute('data-theme', activeTheme);
            this.updateThemeIcon(activeTheme);
        },

        // Garante que o ícone de ocultar senha inicialize correto
        initIcons() {
            const toggleIcon = document.querySelector('.toggle-password');
            if (toggleIcon) toggleIcon.textContent = '';
        },

        // Atualiza o botão exibindo os emojis exatos solicitados
        updateThemeIcon(theme) {
            const themeIcon = document.getElementById('theme-icon');
            if (themeIcon) {
                // Se o tema for claro (light), mostra a Lua 🌙 para permitir mudar para o escuro
                // Se o tema for escuro (dark), mostra o Sol ☀️ para permitir mudar para o claro
                themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
            }
        },

        setupEventListeners() {
            const loginForm = document.getElementById('loginForm');
            const emailInput = document.getElementById('emailInput');
            const passwordInput = document.getElementById('password');

            if (loginForm) loginForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
            if (emailInput) emailInput.addEventListener('input', (e) => this.handlePhoneMask(e));
            if (passwordInput) passwordInput.addEventListener('input', (e) => this.clearInputError(e.target));
        },

        // Altera o tema alternando o atributo data-theme do HTML
        toggleTheme() {
            const html = document.documentElement;
            const nextTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', nextTheme);
            localStorage.setItem(this.themeKey, nextTheme);
            this.updateThemeIcon(nextTheme);
        },

        // Mostra/Esconde a senha do input
        togglePasswordVisibility() {
            const passwordInput = document.getElementById('password');
            const toggleIcon = document.querySelector('.toggle-password');
            if (!passwordInput || !toggleIcon) return;

            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            toggleIcon.textContent = isPassword ? 'visibility' : 'visibility_off';
        },

        // Máscara de Celular Brasileiro: (XX) XXXXX-XXXX
        handlePhoneMask(e) {
            let value = e.target.value;
            this.clearInputError(e.target);

            if (/^\d|^\(/.test(value) || (value.replace(/\D/g, '').length > 0 && !value.includes('@'))) {
                let digits = value.replace(/\D/g, '').slice(0, 11);
                
                if (digits.length > 6) {
                    e.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
                } else if (digits.length > 2) {
                    e.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                } else if (digits.length > 0) {
                    e.target.value = `(${digits}`;
                }
            }
        },

        clearInputError(inputElement) {
            if (!inputElement) return;
            inputElement.classList.remove('input-error');
            const errorDiv = document.getElementById(`${inputElement.id}Error`);
            if (errorDiv) errorDiv.textContent = '';
        },

        setInputError(inputElement, message) {
            if (!inputElement) return;
            inputElement.classList.add('input-error');
            const errorId = inputElement.id === 'emailInput' ? 'emailError' : 'passwordError';
            const errorDiv = document.getElementById(errorId);
            if (errorDiv) errorDiv.textContent = message;
        },

        validators: {
            emailOrPhone(value) {
                const cleanValue = value.replace(/\D/g, '');
                if (!value.trim()) return 'Este campo não pode ficar vazio.';
                
                if (!value.includes('@') && cleanValue.length > 0) {
                    return (cleanValue.length === 10 || cleanValue.length === 11) 
                        ? '' 
                        : 'Insira um número de celular válido com DDD.';
                }
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) ? '' : 'Insira um e-mail válido ou número de celular.';
            },
            password(value) {
                if (!value.trim()) return 'A senha não pode ficar vazia.';
                return value.length >= 6 ? '' : 'A senha deve conter pelo menos 6 caracteres.';
            }
        },

        setLoadingState(isLoading) {
            const submitBtn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            const btnSpinner = document.getElementById('btnSpinner');
            if (!submitBtn || !btnText || !btnSpinner) return;

            submitBtn.disabled = isLoading;
            btnText.style.display = isLoading ? 'none' : 'block';
            btnSpinner.style.display = isLoading ? 'block' : 'none';
        },

        async handleFormSubmit(event) {
            event.preventDefault();
            
            const emailInput = document.getElementById('emailInput');
            const passwordInput = document.getElementById('password');
            
            if (!emailInput || !passwordInput) return;

            const emailErrMessage = this.validators.emailOrPhone(emailInput.value);
            const passwordErrMessage = this.validators.password(passwordInput.value);

            if (emailErrMessage) this.setInputError(emailInput, emailErrMessage);
            if (passwordErrMessage) this.setInputError(passwordInput, passwordErrMessage);

            if (emailErrMessage || passwordErrMessage) return; 

            this.setLoadingState(true);

            try {
                const response = await this.mockAuthAPI(emailInput.value, passwordInput.value);
                
                sessionStorage.setItem(this.tokenKey, response.token);
                sessionStorage.setItem(this.sessionKey, JSON.stringify(response.user));

                alert('Login realizado com sucesso!');
                
            } catch (error) {
                this.setInputError(emailInput, 'Falha na autenticação. Verifique suas credenciais.');
            } finally {
                this.setLoadingState(false);
            }
        },

        mockAuthAPI(login, password) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        token: 'JWT_bW9ja0F1dGhUb2tlbjEyMzQ1Nl9kZWxpdmVyeUFwcA==',
                        user: { uid: 'usr_9821', identity: login, role: 'client' }
                    });
                }, 1500);
            });
        }
    };

    // Atalhos globais mapeados com os atributos onclick do seu HTML
    const toggleTheme = () => AppState.toggleTheme();
    const togglePasswordVisibility = () => AppState.togglePasswordVisibility();

    document.addEventListener('DOMContentLoaded', () => AppState.init());
</script>
