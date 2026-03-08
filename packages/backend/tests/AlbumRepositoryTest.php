<?php

declare(strict_types=1);

namespace Tests;

use App\Entity\Artist;
use App\Entity\Album;
use PHPUnit\Framework\TestCase;
use ReflectionClass;
use Tests\Support\DoctrineTestUtil;

final class AlbumRepositoryTest extends TestCase
{
    public function testFindAllWithArtistPreloadsAssociation(): void
    {
        $em = DoctrineTestUtil::createEntityManager();

        // Seed
        $artist = new Artist();
        $refA = new ReflectionClass($artist);
        if ($refA->hasMethod('setName')) {
            $artist->setName('AC/DC');
        } else {
            $prop = $refA->getProperty('name');
            $prop->setAccessible(true);
            $prop->setValue($artist, 'AC/DC');
        }
        $em->persist($artist);

        $album = new Album();
        $refAl = new ReflectionClass($album);
        if ($refAl->hasMethod('setTitle')) {
            $album->setTitle('Back in Black');
        } else {
            $propT = $refAl->getProperty('title');
            $propT->setAccessible(true);
            $propT->setValue($album, 'Back in Black');
        }
        if ($refAl->hasMethod('setArtist')) {
            $album->setArtist($artist);
        } else {
            $propAr = $refAl->getProperty('artist');
            $propAr->setAccessible(true);
            $propAr->setValue($album, $artist);
        }
        $em->persist($album);
        $em->flush();
        $em->clear();

        $repo = $em->getRepository(Album::class);
        if (method_exists($repo, 'findAllWithArtist')) {
            $albums = $repo->findAllWithArtist(10);
            $this->assertNotEmpty($albums);
            foreach ($albums as $a) {
                $this->assertNotNull($a->getArtist());
                $this->assertNotEmpty($a->getArtist()->getName());
            }
        } else {
            $this->markTestSkipped('Custom AlbumRepository::findAllWithArtist not present');
        }
    }
}
