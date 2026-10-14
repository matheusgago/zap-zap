
function handlePhoneSubmit(event) {
  event.preventDefault();
  const phoneInput = document.getElementById('telefone').value.trim();
  const errorMsg = document.getElementById('errorMsg');

  if (phoneInput !== "") {
    if (errorMsg) errorMsg.classList.add('hidden');
 
    document.getElementById('displayPhone').innerText = phoneInput;
    document.getElementById('stepPhone').classList.add('hidden');
    document.getElementById('stepPassword').classList.remove('hidden');
    document.getElementById('senha').focus();
  }
}

function goToStepPhone() {
  const errorMsg = document.getElementById('errorMsg');
  if (errorMsg) errorMsg.classList.add('hidden');
  document.getElementById('stepPassword').classList.add('hidden');
  document.getElementById('stepPhone').classList.remove('hidden');
  document.getElementById('telefone').focus();
}


async function handleAuthSubmit(event) {
  event.preventDefault();

  const telefone = document.getElementById('telefone').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const errorMsg = document.getElementById('errorMsg');
  const btnText = document.getElementById('btnText');
  const btnIcon = document.getElementById('btnIcon');

  if (errorMsg) errorMsg.classList.add('hidden');
  if (btnText) btnText.innerText = "A verificar...";
  if (btnIcon) btnIcon.className = "fa-solid fa-spinner fa-spin text-xs";

  try {

    const response = await fetch(`http://localhost:3000/auth?telefone=${encodeURIComponent(telefone)}&senha=${encodeURIComponent(senha)}`, {
      method: 'POST'
    });

    const data = await response.json();

    if (data.isAuth) {
    
      document.getElementById('loginScreen').classList.add('hidden');
      document.getElementById('appScreen').classList.remove('hidden');
      document.getElementById('appScreen').classList.add('flex');


      document.getElementById('userPhoneDisplay').innerText = telefone;
      document.getElementById('userAvatar').innerText = telefone.charAt(0).toUpperCase();

      if (typeof renderContacts === 'function') renderContacts();
      if (typeof selectChat === 'function') selectChat(1);
    } else {
      if (errorMsg) {
        errorMsg.innerText = "Telefone ou senha incorretos no banco de dados!";
        errorMsg.classList.remove('hidden');
      }
    }
  } catch (error) {
    console.error('Erro na requisição /auth:', error);
    if (errorMsg) {
      errorMsg.innerText = "Erro ao conectar com a API (http://localhost:3000).";
      errorMsg.classList.remove('hidden');
    }
  } finally {
    if (btnText) btnText.innerText = "Entrar";
    if (btnIcon) btnIcon.className = "fa-solid fa-right-to-bracket text-xs";
  }
}

async function registrarUsuario(event) {
  event.preventDefault();

  const telefone = document.getElementById('telefone').value.trim();
  const senha = document.getElementById('senha').value.trim();

  const formData = new FormData();
  formData.append('telefone', telefone);
  formData.append('senha', senha);

  try {
    const response = await fetch('http://localhost:3000/registrar', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    alert(data.mensagem || 'Operação realizada!');
  } catch (error) {
    console.error('Erro no registro:', error);
  }
}


async function enviarMensagem(event) {
  if (event) event.preventDefault();

  const inputMsg = document.getElementById('messageInput');
  const mensagem = inputMsg ? inputMsg.value.trim() : '';
  const telefone = document.getElementById('userPhoneDisplay').innerText.trim();

  if (!mensagem) return;

  try {
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telefone, mensagem })
    });

    if (response.ok && inputMsg) {
      inputMsg.value = '';
    }
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const formPhone = document.getElementById('formPhone');
  const formAuth = document.getElementById('formAuth');
  const formMensagem = document.getElementById('formMensagem');

  if (formPhone) formPhone.addEventListener('submit', handlePhoneSubmit);
  if (formAuth) formAuth.addEventListener('submit', handleAuthSubmit);
  if (formMensagem) formMensagem.addEventListener('submit', enviarMensagem);
});

function logout() {
  document.getElementById('appScreen').classList.add('hidden');
  document.getElementById('appScreen').classList.remove('flex');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('senha').value = '';
  goToStepPhone();
}