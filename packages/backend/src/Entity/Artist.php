<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "artists")]
class Artist
{
    #[ORM\Id]
    #[ORM\Column(name: "ArtistId", type: "integer")]
    #[ORM\GeneratedValue(strategy: "AUTO")]
    private ?int $id = null;

    #[ORM\Column(name: "Name", type: "string", length: 120, nullable: true)]
    private ?string $name = null;

    public function getId(): int
    {
        if ($this->id === null) {
            throw new \RuntimeException('Artist ID is not initialized yet.');
        }
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): void
    {
        $this->name = $name;
    }
}
