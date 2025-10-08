<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Honeypot anti-spam (champ caché invisible pour l'utilisateur)
    if (!empty($_POST['website'])) {
        echo json_encode([
            "success" => false,
            "message" => "Formulaire suspect détecté."
        ]);
        exit;
    }

    // Nettoyage et validation des champs
    $nom = htmlspecialchars(trim($_POST['nom'] ?? ''));
    $email = trim($_POST['email'] ?? '');
    $jour = intval($_POST['jour'] ?? 0);
    $mois = intval($_POST['mois'] ?? 0);
    $annee = intval($_POST['annee'] ?? 0);
    $sexe = htmlspecialchars($_POST['sexe'] ?? '');
    $motif = htmlspecialchars($_POST['motif'] ?? '');
    $motif_autre = htmlspecialchars($_POST['motif_autre'] ?? '');
    $message = htmlspecialchars(trim($_POST['message'] ?? ''));
    $note = intval($_POST['note'] ?? 0);
    $newsletter = isset($_POST['newsletter']) ? "Oui" : "Non";

    // Validation email + protection header injection
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match("/[\r\n]/", $email)) {
        echo json_encode([
            "success" => false,
            "message" => "Adresse email invalide."
        ]);
        exit;
    }

    // Validation date de naissance
    if ($jour < 1 || $jour > 31 || $mois < 1 || $mois > 12 || $annee < 1925 || $annee > 2025) {
        echo json_encode([
            "success" => false,
            "message" => "Date de naissance invalide."
        ]);
        exit;
    }

    // Validation message et nom
    if (empty($nom) || empty($message) || strlen($message) < 5) {
        echo json_encode([
            "success" => false,
            "message" => "Nom ou message trop court."
        ]);
        exit;
    }

    // Déterminer le motif réel
    $motif_complet = ($motif === "Autre" && !empty($motif_autre)) ? $motif_autre : $motif;

    // Préparer le corps de l'email
    $to = "votre-email@exemple.com"; // Remplacer par votre email
    $subject = "Nouveau message depuis le site Evolution du Web";
    $body = "Nom: $nom\n";
    $body .= "Email: $email\n";
    $body .= "Date de naissance: $jour/$mois/$annee\n";
    $body .= "Sexe: $sexe\n";
    $body .= "Motif: $motif_complet\n";
    $body .= "Note: $note/5\n";
    $body .= "Newsletter: $newsletter\n";
    $body .= "Message:\n$message\n";

    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Envoi de l'email
    if (mail($to, $subject, $body, $headers)) {
        echo json_encode([
            "success" => true,
            "message" => "Merci $nom, votre message a été envoyé avec succès."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Une erreur est survenue, veuillez réessayer."
        ]);
    }
}
?>