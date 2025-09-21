Sleep Calc — статический сайт «Калькулятор сна»

1. Замените плейсхолдеры:
   - В файлах `sleep-calc/docs/index.html` и страницах: замените `YOUR_USERNAME` и `YOUR_REPO_NAME` на ваши.
   - В `sleep-calc/generator.py` замените HOST на реальный URL, например: https://yourname.github.io/sleep-calc
   - В `index.html` замените `G-XXXXXXXXXX` на ваш GA4 Measurement ID.
   - В `index.html` замените OG_IMAGE_URL на ссылку на ваше og-изображение (можно загрузить в docs/static/).

2. Загрузка:
   - Через Git: `git add .` `git commit -m "initial site"` `git push origin main`
   - Через GitHub UI: загрузите папку `sleep-calc` (включая `.github/`).

3. Deploy:
   - Перейдите в Actions → запустите workflow (если он не запустился) → дождитесь успешного выполнения.
   - Перейдите в Settings → Pages → укажите Branch = gh-pages, Folder = / (root) (если требуется).
   - Сайт будет по адресу: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/

4. Google Analytics и Search Console — подключаемы.
