<?php
require_once 'phpmailer/PHPMailerAutoload.php';

if (isset($_POST['inputName']) && isset($_POST['inputEmail']) && isset($_POST['inputSubject']) && isset($_POST['inputMessage'])) {

    //check if any of the inputs are empty
    if (empty($_POST['inputName']) || empty($_POST['inputEmail']) || empty($_POST['inputSubject']) || empty($_POST['inputMessage'])) {
        $data = array('success' => false, 'message' => 'Please fill out the form completely.');
        echo json_encode($data);
        exit;
    }

    //create an instance of PHPMailer
  $mail             = new PHPMailer();
                  
  $mail->IsSMTP();
  $mail->SMTPAuth   = true;
  $mail->Host       = "smtp.gmail.com";
  $mail->Port       = 587;
  $mail->Username   = "altranteste@gmail.com";
  $mail->Password   = "moahlindo";
  $mail->SMTPSecure = 'tls';
  $mail->SetFrom("altranteste@gmail.com", "Altran No-Reply");
  $mail->Subject = $_POST['inputSubject'];
  $mail->Body = "\r\n\r\nMessage: " . stripslashes($_POST['inputMessage']);
  $mail->AddAddress($_POST['inputEmail'], $_POST['inputName']);
  $mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);

    if(!$mail->send()) {
        $data = array('success' => false, 'message' => 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo);
        echo json_encode($data);
        exit;
    }

    $data = array('success' => true, 'message' => 'Thanks! We have received your message.');
    echo json_encode($data);

} else {

    $data = array('success' => false, 'message' => 'Please fill out the form completely.');
    echo json_encode($data);

}