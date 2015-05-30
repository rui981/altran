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
  $mail->AddEmbeddedImage("", "my-attach", "Logo_White.png");
  
  $mail->IsHTML(true);
    $mail->AddEmbeddedImage('../img/logos/Logo_Mail.png', 'logoimg', 'Login_Logo.png'); 

    //footer
    $footer = "Regards<br/><br/>";
    $footer .= '<table style="width: 95%">';
    $footer .= '<tr>';
    $footer .= '<td>';
    $footer .= "<strong><span style='font-size: 15px'>Your Customer</span></strong><br/>
                    " . stripslashes($_POST['inputName']). "<br/>
                    Please reply to this e-mail<br/>
                    Email: " . stripslashes($_POST['inputEmail']) . "<br/>";
    $footer .= '</td></tr>';
    
    $footer .= '<tr><td style="text-align:left"><br/>';
    $footer .= '<img src="cid:logoimg" width="100" height="100"/>';
    $footer .= '</td><td>altran Innovation Makers</td>';
    $footer .= '</tr>';
    $footer .= '</table>';
    $body = $_POST['inputMessage'] . "<br/><br/><br/>";
    $mail->Body =  $body . $footer;
  $mail->AddAddress($_POST['Email'], $_POST['Representative']);
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