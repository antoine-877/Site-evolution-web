<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nom = htmlspecialchars($_POST['nom']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $to = "votre-email@exemple.com"; // mets ton email ici
    $subject = "Nouveau message depuis le site Evolution du Web";
    $body = "Nom: $nom\nEmail: $email\nMessage:\n$message";

    if (mail($to, $subject, $body)) {
        echo "Merci $nom, votre message a été envoyé avec succès.";
    } else {
        echo "Une erreur est survenue, veuillez réessayer.";
    }
}
?>
