<?php
require "./Db.php";

interface iCadastro
{
    public function cadastrar(string $nomeLembrete): void;
}

class Cadastro implements iCadastro
{
    private iDb $db;

    public function __construct(iDB $db)
    {
        $this->db = $db;
    }

    public function cadastrar(string $nomeLembrete): void
    {
        if ($this->db->verificarLembreteExistente($nomeLembrete)) {
            if (strlen($nomeLembrete) > 100) {
                echo "O Lembrete deve ter até 100 caracteres!";
                return;
            }
            $lembreteCadastrado = $this->db->cadastrar($nomeLembrete);
            if ($lembreteCadastrado) {
                echo "Lembrete cadastrado com sucesso!";
            }
        } else {
            echo "Lembrete já consta em cadastro!";
        }
    }
}

$cadastro = new Cadastro($db);

$json = file_get_contents('php://input');
$data = json_decode($json);

$cadastro->cadastrar($data->nomeLembrete);
