<?php
require "./Db.php";

interface iListagem
{
    public function listar(): void;
}

class Listagem implements iListagem
{
    private iDb $db;
    public function __construct(iDB $db)
    {
        $this->db = $db;
    }
    public function listar(): void
    {
        $lembreteListou = $this->db->listar();
        echo $lembreteListou;
    }
}

$listagem = new Listagem($db);

$listagem->listar();
