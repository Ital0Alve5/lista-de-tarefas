<?php
require "./Db.php";

interface iDeletar
{
    public function deletar(string $idLembrete): void;
}

class Deletar implements iDeletar
{
    private iDb $db;

    public function __construct(iDB $db)
    {
        $this->db = $db;
    }

    public function deletar(string $idLembrete): void
    {
        $lembreteDeletado = $this->db->deletar($idLembrete);
        if ($lembreteDeletado) {
            echo "deletado";
        }
    }
}

$deleção = new Deletar($db);

$json = file_get_contents('php://input');
$data = json_decode($json);

$deleção->deletar($data->idParaDeletar);
