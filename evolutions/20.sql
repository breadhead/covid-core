INSERT INTO ratingQuestions(id, _type, _question, _hint) VALUES('Q1', 'value', 'Оцените, пожалуйста, насколько быстро вы получили ответ эксперта?', '1 - очень долго, 10 - очень быстро');

INSERT INTO ratingQuestions(id, _type, _question, _hint) VALUES('Q2', 'value', 'Насколько полным был ответ?', '1 - неполный, 10 - полный');

INSERT INTO ratingQuestions(id, _type, _question, _hint) VALUES('Q3', 'value', 'Был ли ответ понятен?', '1 - совсем непонятно, 10 - полностью понятно');

INSERT INTO ratingQuestions(id, _type, _question, _hint) VALUES('Q4', 'value', 'Насколько полезным был ответ?', '1 - абсолютно бесполезен, 10 - очень полезен');

INSERT INTO ratingQuestions(id, _type, _question, _hint) VALUES('Q5', 'comment', 'Что вам особенно понравилось/не понравилось?', 'Вы очень нам поможете, если поделитесь своим опытом');

#DOWN
DELETE FROM ratingQuestions WHERE id='Q1';
DELETE FROM ratingQuestions WHERE id='Q2';
DELETE FROM ratingQuestions WHERE id='Q3';
DELETE FROM ratingQuestions WHERE id='Q4';
DELETE FROM ratingQuestions WHERE id='Q5';

