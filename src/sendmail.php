<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';


$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'phpmailer/language/');
$mail->IsHTML(true);


// $domain_mail = 'info@voxel.kz'; //Доменный адрес почты
$domain_mail = 'info@wemake.voxel.kz'; //Доменный адрес почты
$domain_name = $_SERVER['SERVER_NAME']; // Имя домена
$mail->setFrom($domain_mail, "Сообщение с сайта ${domain_name}"); // От кого письмо
$mail->addAddress('208909@inbox.ru'); // Куда отправить
$mail->Subject = "Сообщение с сайта ${domain_name}"; // Тема письма



// Тело письма

$body = "<h1>Вы получили новое сообщение с сайта ${domain_name}</h1>";


if (trim(!empty($_POST['user-name']))) {
    $name = $_POST['user-name'];
    $body .= "<p><strong>Имя: </strong> ${name} </p>";
}

if (trim(!empty($_POST['user-phone']))) {
    $phone = $_POST['user-phone'];
    $body .= "<p><strong>Телефон пользователя: </strong> ${phone} </p>";
}

if (trim(!empty($_POST['user-message']))) {
    $message = $_POST['user-message'];
    $body .= "<p><strong>Сообщение: </strong> ${message} </p>";
}

if (trim(!empty($_POST['user-site']))) {
    $userSite = $_POST['user-site'];
    $body .= "<p><strong>Сайт пользователя: </strong> ${userSite} </p>";
}



$mail->Body = $body;

// Отправляем
if (!$mail->send()) {
    $message = 'Ошибка';
} else {
    $mail->Body = "Сообщение с сайта  ${domain_name}";
    $message = 'Данные отправлены';
}

$response = ['message' => $message];
header('Content-type: application/json');
echo json_encode($response);
