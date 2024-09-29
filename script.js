document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('status');
  // reCAPTCHA v3のトークンを取得して送信する関数
  function getRecaptchaTokenAndSubmit() {
    grecaptcha.ready(function () {
      grecaptcha.execute('6LddAksqAAAAAJDHltDC77ZvJIVMprhYdpT4jI2A', { action: 'contact_form' })
        .then(function (token) {
          const formData = new FormData(form);
          formData.append('recaptcha_response', token);

          fetch('https://54oovip4eognqrctbibjwgud5a0codri.lambda-url.ap-northeast-1.on.aws/', {
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
              resetSubmitButton();
            })
            .catch(error => {
              console.error('送信中にエラーが発生しました:', error);
              createPopup('error', 'メッセージの送信中にエラーが発生しました。\nもう一度お試しください。');
              resetSubmitButton();
            });
        });
    });
  }

  // 送信ボタンをリセットする関数
  function resetSubmitButton() {
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.innerHTML = '送信';
    submitButton.style.backgroundColor = '';
  }

  // フォーム送信時のイベントリスナー
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitButton.style.backgroundColor = 'gray';

    getRecaptchaTokenAndSubmit();
  });
});
