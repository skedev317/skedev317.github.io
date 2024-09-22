document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('status');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    status.textContent = '送信中...';

    try {
      // reCAPTCHA トークンを取得
      const recaptchaToken = await grecaptcha.execute('YOUR_RECAPTCHA_SITE_KEY', {action: 'contact_form'});

      // トークンを隠しフィールドに設定
      document.getElementById('recaptchaToken').value = recaptchaToken;

      const formData = new FormData(form);

      const response = await fetch('YOUR_API_GATEWAY_ENDPOINT', { // 実際のサーバーエンドポイントに置き換えてください
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        status.textContent = '送信完了しました。';
        form.reset();
      } else {
        status.textContent = '送信に失敗しました。もう一度お試しください。';
      }
    } catch (error) {
      console.error('Error:', error);
      status.textContent = 'エラーが発生しました。もう一度お試しください。';
    }
  });
});

