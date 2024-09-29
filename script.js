document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  const submitButton = form.querySelector('.submit-btn');
  const status = document.getElementById('status');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    disableSubmitButton();
    getRecaptchaTokenAndSubmit();
  });

  function disableSubmitButton() {
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  }

  function enableSubmitButton() {
    submitButton.disabled = false;
    submitButton.classList.remove('loading');
    submitButton.innerHTML = '送信する';
  }

  function createPopup(type, message) {
    const popup = document.createElement('div');
    popup.className = `popup ${type}`;
    popup.innerHTML = `
      <div class="popup-content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <p>${message}</p>
      </div>
    `;
    document.body.appendChild(popup);

    setTimeout(() => {
      popup.classList.add('show');
    }, 10);

    setTimeout(() => {
      popup.classList.add('hide');
      popup.addEventListener('animationend', () => {
        popup.remove();
      });
    }, 10000);
  }

  // reCAPTCHA v3のトークンを取得して送信する関数
  function getRecaptchaTokenAndSubmit() {
    grecaptcha.ready(function () {
      grecaptcha.execute('6LddAksqAAAAAJVUSV4Nsgf4LFRHfqZb1UXyCRds', { action: 'contact_form' })
        .then(function (token) {
          const formData = new FormData(form);
          formData.append('recaptcha_response', token);

          fetch('https://54oovip4eognqrctbibjwgud5a0codri.lambda-url.ap-northeast-1.on.aws', {
            method: 'POST',
            body: formData
          })
            .then(response => {
              console.log('サーバーからのレスポンス:', response);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              console.log('reCAPTCHAとフォームデータが送信されました:', data);
              form.reset();
              createPopup('success', 'メッセージが正常に送信されました。\n確認次第、返信いたします。');
              enableSubmitButton();
            })
            .catch(error => {
              console.error('送信中にエラーが発生しました:', error);
              createPopup('error', 'メッセージの送信中にエラーが発生しました。\nもう一度お試しください。');
              enableSubmitButton();
            });
        });
    });
  }
});
