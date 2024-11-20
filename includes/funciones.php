<?php

function debuguear($variable): string {
    echo "Entrando en la función debuguear()...<br>"; // Esto te ayuda a verificar que la función está siendo llamada
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit; // Esto detiene la ejecución del script después de mostrar los datos
}

// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

//funcion que revisa que el usuario este autenticado

function isAuth() : void {
    if(!isset($_SESSION['login'])){
        header('Location: /');
    }
}

function esUltimo(string $actual, string $proximo): bool{

    if($actual !== $proximo ){
        return true;
    }else{
        return false;
    }
    
}

function isAdmin(): void{
        if(!isset($_SESSION['admin']))
        header('Location: /');
}

    
   