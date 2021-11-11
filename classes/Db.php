<?php

interface iDb
{
    public function atualizar(string $idLembrete, string $lembreteAtualizado): bool;
    public function cadastrar(string $nomeLembrete): bool;
    public function verificarLembreteExistente(string $nomeLembrete): bool;
    public function deletar(string $idLembrete): bool;
    public function listar();
}

class Mysql implements iDb
{
    private string $nomeBanco;
    private string $host;
    private string $usuario;
    private string $senha;
    private PDO $pdo;

    public function __construct(string $nomeBanco, string $host, string $usuario, string $senha)
    {
        $this->nomeBanco = $nomeBanco;
        $this->host = $host;
        $this->usuario = $usuario;
        $this->senha = $senha;
        $this->pdo = new PDO("mysql:dbname=$this->nomeBanco;host=$this->host", $this->usuario, $this->senha);
    }

    public function atualizar(string $idLembrete, string $lembreteAtualizado): bool
    {
        $sql = $this->pdo->prepare("SELECT * FROM lembretes WHERE id = :id");
        $sql->bindValue(':id', $idLembrete);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $sql = $this->pdo->prepare("UPDATE lembretes SET lembrete = :lembrete WHERE id = :id");
            $sql->bindValue(':lembrete', $lembreteAtualizado);
            $sql->bindValue(':id', $idLembrete);
            $sql->execute();
            return true;
        } else {
            return false;
        }
    }

    public function cadastrar(string $nomeLembrete): bool
    {
        $sql = $this->pdo->prepare("INSERT INTO lembretes (lembrete) VALUES (:lembrete)");
        $sql->bindValue(':lembrete', $nomeLembrete);
        $sql->execute();
        return true;
    }

    public function verificarLembreteExistente(string $nomeLembrete): bool
    {
        $sql = $this->pdo->prepare("SELECT * FROM lembretes WHERE lembrete = :lembrete");
        $sql->bindValue(':lembrete', $nomeLembrete);
        $sql->execute();

        if ($sql->rowCount() === 0) {
            return true;
        } else {
            return false;
        }
    }

    public function deletar(string $idLembrete): bool
    {
        $sql = $this->pdo->prepare("DELETE FROM lembretes WHERE id = :id");
        $sql->bindValue(':id', $idLembrete);
        $sql->execute();
        return true;
    }

    public function listar()
    {
        $sql = $this->pdo->query(("SELECT * FROM lembretes"));
        if ($sql->rowCount() > 0) {
            $lembretesLista = $sql->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($lembretesLista);
        } else {
            return json_encode(false);
        }
    }
}

$db = new Mysql("lembretes", "localhost", "italo", "#Misterlane30");
