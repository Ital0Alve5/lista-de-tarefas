<?php
require "./Db.php";

interface iAtualizar
{
    public function atualizarBanco(string $idLembrete, string $lembreteAtualizado): void;
}

class Atualizar implements iAtualizar
{
    private iDb $db;

    public function __construct(iDB $db)
    {
        $this->db = $db;
    }

    public function atualizarBanco(string $idLembrete, string $lembreteAtualizado): void
    {

        $lembreteAtualizou = $this->db->atualizar($idLembrete, $lembreteAtualizado);
        if ($lembreteAtualizou) {
            echo "atualizado";
        } else {
            echo "erro";
        }
    }
}

$atualização = new Atualizar($db);

$json = file_get_contents('php://input');
$data = json_decode($json);

$atualização->atualizarBanco($data->id, $data->atualizar);
