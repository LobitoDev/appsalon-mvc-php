<?php

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email
{

    public $email;
    public $nombre;
    public $token;


    public function __construct($email, $nombre, $token)
    {
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }

    public function enviarConfirmacion()
    {
        // Crear el onjeto de email
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = $_ENV['EMAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Port = $_ENV['EMAIL_PORT'];
        $mail->Username = $_ENV['EMAIL_USER'];
        $mail->Password = $_ENV['EMAIL_PASS'];

        $mail->setFrom('cuentas@appsalon.com');
        $mail->addAddress($this->email);
        $mail->Subject = 'Confirma tu cuenta';

        //Set html
        $mail->isHTML(true);
        $mail->CharSet='UTF-8';

        $contenido = "<html>";
        $contenido .= "<p><strong>Hola " . $this->nombre . "</strong> Has creado tu cuenta en App Salon, solo debes confirmarla precionando el siguiente enlace</p>";
        $contenido .= "<p>Preciona aqui: <a href='" . $_ENV['APP_URL'] . "/confirmar-cuenta?token=" . $this->token . "'>Confirmar Cuenta</a>  </p>";    
        $contenido .="<p>Si tu no creaste esta cuenta puedes ignorar el mensaje</p>";
        $contenido .="</html>";
        $mail->Body = $contenido;

        //Enviar el email
        $mail->send();

    }

    public function enviarInstrucciones(){
         // Crear el onjeto de email
         $mail = new PHPMailer();
         $mail->isSMTP();
         $mail->Host = $_ENV['EMAIL_HOST'];
         $mail->SMTPAuth = true;
         $mail->Port = $_ENV['EMAIL_PORT'];
         $mail->Username = $_ENV['EMAIL_USER'];
         $mail->Password = $_ENV['EMAIL_PASS'];

         $mail->setFrom('cuentas@appsalon.com');
         $mail->addAddress($this->email);
         $mail->Subject = 'Reestablece tu password';
 
         //Set html
         $mail->isHTML(true);
         $mail->CharSet='UTF-8';
 
         $contenido = "<html>";
         $contenido .= "<p><strong>Hola " . $this->nombre . "</strong> Has solicitado reestablecer tu password, sigue el siguiente enlace para hacerlo:</p>";
         $contenido .= "<p>Preciona aqui: <a href='" . $_ENV['APP_URL'] . "/recuperar?token=" . $this->token . "'>Reestablecer password</a>  </p>";    
         $contenido .="<p>Si tu no creaste esta cuenta puedes ignorar el mensaje</p>";
         $contenido .="</html>";
         $mail->Body = $contenido;
 
         //Enviar el email
         $mail->send();
    }




}//fin clase
