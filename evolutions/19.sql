INSERT INTO ratingQuestions(id, _type, _question, _hint) VALUES('Q1', 'value', 'Оцените, пожалуйста, насколько быстро вы получили ответ эксперта?', 'Подсказка к вопросу: 1 - очень долго, 10 - очень быстро');

INSERT INTO ratingQuestions(id, _type, _question, _hint) VALUES('Q2', 'value', 'Насколько понятен был ответ?', 'Подсказка к вопросу: 1 - абсолютно непонятно, 10 - полностью понятно');

INSERT INTO ratingQuestions(id, _type, _question, _hint) VALUES('Q3', 'value', 'Насколько полным был ответ?', 'Подсказка к вопросу: 1 - неполный, 10 - полный');

INSERT INTO ratingQuestions(id, _type, _question, _hint) VALUES('Q4', 'value', 'Насколько удобно было пользоваться сервисом (заполнять анкету, читать ответ, прикреплять файлы)?', 'Подсказка к вопросу: 1 - очень неудобно, 10 - очень удобно');

INSERT INTO ratingQuestions(id, _type, _question, _hint) VALUES('Q5', 'value', 'Насколько полезным был ответ?', 'Подсказка к вопросу: 1 - абсолютно бесполезен, 10 - очень полезен');

#DOWN
DELETE FROM ratingQuestions WHERE id='Q1';
DELETE FROM ratingQuestions WHERE id='Q2';
DELETE FROM ratingQuestions WHERE id='Q3';
DELETE FROM ratingQuestions WHERE id='Q4';
DELETE FROM ratingQuestions WHERE id='Q5';
