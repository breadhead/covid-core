INSERT INTO ratingQuestions
  (id, _type, _order, _question, _hint)
VALUES('Q1', 'value', 1, 'Оцените, пожалуйста, насколько быстро вы получили ответ эксперта?', '1 - очень долго, 10 - очень быстро');

INSERT INTO ratingQuestions
  (id, _type, _order, _question, _hint)
VALUES('Q2', 'value', 2, 'Насколько полным был ответ?', '1 - неполный, 10 - полный');

INSERT INTO ratingQuestions
  (id, _type, _order, _question, _hint)
VALUES('Q3', 'value', 3, 'Был ли ответ понятен?', '1 - совсем непонятно, 10 - полностью понятно');

INSERT INTO ratingQuestions
  (id, _type, _order, _question, _hint)
VALUES('Q4', 'comment', 4, 'Что вам особенно понравилось/не понравилось?', 'Вы очень нам поможете, если поделитесь своим опытом');


#DOWN
DELETE FROM ratingQuestions WHERE id='Q1';
DELETE FROM ratingQuestions WHERE id='Q2';
DELETE FROM ratingQuestions WHERE id='Q3';
DELETE FROM ratingQuestions WHERE id='Q4';


