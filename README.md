# MVP «Сервис проверки юридических документов DocsCheck»

MVP находится в ветке «fix». Ниже инструкция по использованию.

[ССЫЛКА НА СЕРВИС](https://docscheck.keeq0.site)

Установка и запуск (локально):
```
npm install
npm run serve
```
**DocsCheck** — сервис для проверки документов на предмет мошенничества и выявления рисков.

1. **Загрузка документа:**
   - Нажмите кнопку "Загрузить документ" или перетащите файл ***PDF*** в выделенную область
   - Убедитесь, что ***PDF-файл*** содержит информацию в виде текста (а не изображения)

2. **Предварительный просмотр:**
   - После загрузки документ автоматически отобразится в режиме предварительного просмотра

3. **Анализ документа:**
   - Сервис извлекает текст из загруженного документа
   - Текст отправляется на анализ для выявления мошеннических элементов и потенциальных рисков
   - Дождитесь завершения анализа — время ожидания может зависеть от размера документа

4. **Получение отчёта:**
   - По завершении анализа ИИ-помощник предоставит структурированный отчёт с оценкой рисков и рекомендациями
   - Отчёт включает информацию о выявленных проблемных моментах и предложения по их устранению
